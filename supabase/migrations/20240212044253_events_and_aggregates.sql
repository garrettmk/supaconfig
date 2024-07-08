/*
  Declare some types
*/

CREATE type AGG_TYPE as ENUM (
  'location'
);


/*
  Create the events table
*/
CREATE TABLE public.events (
  event_id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  aggregate_id UUID NOT NULL,
  aggregate_type AGG_TYPE NOT NULL,
  version_number INTEGER NOT NULL,
  event_type VARCHAR(64) NOT NULL,
  event_data JSONB NOT NULL,
  -- created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  -- created_by UUID REFERENCES auth.users(id) NOT NULL,
  CONSTRAINT id_sequence_number UNIQUE (aggregate_id, version_number)
);

COMMENT ON TABLE public.events IS 'Event stream for all aggregates';

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "create" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "read" ON public.events FOR SELECT USING (true);
CREATE POLICY "update" ON public.events FOR UPDATE USING (false);
CREATE POLICY "delete" ON public.events FOR DELETE USING (false);


/*
  Create the aggregates table
*/
CREATE TABLE public.aggregates (
  id UUID PRIMARY KEY,
  type AGG_TYPE NOT NULL,
  version_number INTEGER NOT NULL,
  data JSONB NOT NULL
  -- created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  -- updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.aggregates IS 'Event stream aggregates';

ALTER TABLE public.aggregates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "create" ON public.aggregates FOR INSERT WITH CHECK (false);
CREATE POLICY "read" ON public.aggregates FOR SELECT USING (true);
CREATE POLICY "update" ON public.aggregates FOR UPDATE USING (false);
CREATE POLICY "delete" ON public.aggregates FOR DELETE USING (false);


/*
  Returns the next version number for an aggregate
*/
CREATE OR REPLACE FUNCTION public.next_version_number(agg_id UUID)
RETURNS INTEGER AS $$
DECLARE
  next_version INTEGER;
BEGIN
  SELECT COALESCE(MAX(version_number), 0) + 1
  INTO next_version
  FROM public.events
  WHERE aggregate_id = agg_id;
  RETURN next_version;
END; $$ LANGUAGE plpgsql;

/*
  Returns true if an aggregate exists
*/
CREATE OR REPLACE FUNCTION public.aggregate_exists(agg_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM public.aggregates
    WHERE id = agg_id
  )
  INTO exists;
  RETURN exists;
END; $$ LANGUAGE plpgsql;

/*
  Returns all events for an aggregate
*/
CREATE OR REPLACE FUNCTION public.get_aggregate_events(agg_id UUID, max_version INTEGER DEFAULT NULL)
RETURNS SETOF public.events
AS $$ BEGIN
  RETURN QUERY
  SELECT *
  FROM public.events
  WHERE aggregate_id = agg_id AND (max_version IS NULL OR version_number <= max_version)
  ORDER BY version_number ASC;
END $$ LANGUAGE plpgsql;

/*
  Applies updates to a JSONB object
*/

CREATE OR REPLACE FUNCTION public.apply_jsonb_updates(original JSONB, updates JSONB)
RETURNS JSONB AS $$
DECLARE
  result JSONB := original;
  key TEXT;
  value JSONB;
BEGIN
  FOR key, value IN SELECT * FROM jsonb_each(updates) LOOP
    result := jsonb_set(
      result,
      string_to_array(key, '.'),
      value
    );
  END LOOP;
  RETURN result;
END; $$ LANGUAGE plpgsql;

/*
  Applies an event to an aggregate and returns the result
*/
CREATE OR REPLACE FUNCTION public.apply_event(aggregate aggregates, event events)
RETURNS aggregates AS $$ 
DECLARE
  new_aggregate aggregates;
BEGIN
  new_aggregate := aggregate;
  IF event.event_type = 'create' THEN
    SELECT 
      event.aggregate_id as id, 
      event.aggregate_type as type,
      event.version_number, 
      event.event_data as data
    INTO 
      new_aggregate;
  ELSEIF event.event_type = 'update' THEN
    new_aggregate.version_number := event.version_number;
    new_aggregate.data := public.apply_jsonb_updates(new_aggregate.data, event.event_data);
  ELSEIF event.event_type = 'delete' THEN
    new_aggregate := NULL;
  ELSE
    RAISE EXCEPTION 'Unknown event type: %', event.event_type;
  END IF;

  RETURN new_aggregate;
END; $$ LANGUAGE plpgsql;

/*
  Builds an aggregate from its events
*/
CREATE OR REPLACE FUNCTION public.build_aggregate(agg_id UUID, max_version INTEGER DEFAULT NULL)
RETURNS aggregates AS $$
DECLARE
  event events;
  aggregate aggregates;
BEGIN
  FOR event IN
    SELECT * FROM public.get_aggregate_events(agg_id, max_version)
  LOOP
    aggregate := public.apply_event(aggregate, event);
  END LOOP;

  RETURN aggregate;
END; $$ LANGUAGE plpgsql;

/*
  Before an event is inserted, make sure the id, version and aggregate type are set
*/
CREATE OR REPLACE FUNCTION public.handle_before_insert_event()
RETURNS TRIGGER SECURITY DEFINER AS $$
DECLARE
  aggregate_exists BOOLEAN;
BEGIN
  aggregate_exists := public.aggregate_exists(NEW.aggregate_id);

  IF NEW.event_type = 'create' THEN
    IF aggregate_exists THEN
      RAISE EXCEPTION 'Aggregate already exists';
    ELSE
      NEW.aggregate_id := COALESCE(NEW.aggregate_id, uuid_generate_v4());
      NEW.version_number := 0;
    END IF;

  ELSEIF NEW.event_type = 'update' THEN
    IF aggregate_exists THEN
      NEW.aggregate_type := (SELECT type FROM public.aggregates WHERE id = NEW.aggregate_id LIMIT 1);
      NEW.version_number := public.next_version_number(NEW.aggregate_id);
    ELSE
      RAISE EXCEPTION 'Aggregate does not exist';
    END IF;

  ELSEIF NEW.event_type = 'delete' THEN
    IF aggregate_exists THEN
      NEW.aggregate_type := (SELECT type FROM public.aggregates WHERE id = NEW.aggregate_id LIMIT 1);
      NEW.version_number := public.next_version_number(NEW.aggregate_id);
      NEW.event_data := COALESCE(NEW.event_data, '{}');
    ELSE
      RAISE EXCEPTION 'Aggregate does not exist';
    END IF;

  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER before_insert_event
BEFORE INSERT ON events
FOR EACH ROW EXECUTE FUNCTION public.handle_before_insert_event();

/*
  After an event is inserted, create or update the aggregate
*/
CREATE OR REPLACE FUNCTION public.handle_after_insert_event()
RETURNS TRIGGER SECURITY DEFINER AS $$
DECLARE
  aggregate_exists BOOLEAN;
BEGIN
  aggregate_exists := public.aggregate_exists(NEW.aggregate_id);
  
  IF NEW.event_type = 'create' THEN
    IF aggregate_exists THEN
      RAISE EXCEPTION 'Aggregate already exists';
    ELSE
      INSERT INTO public.aggregates (id, type, version_number, data)
      SELECT * FROM public.build_aggregate(NEW.aggregate_id);      
    END IF;
  
  ELSEIF NEW.event_type = 'delete' THEN
    IF NOT aggregate_exists THEN
      RAISE EXCEPTION 'Aggregate does not exist';
    ELSE
      DELETE FROM public.aggregates WHERE id = NEW.aggregate_id;
    END IF;

  ELSE
    IF aggregate_exists THEN
      UPDATE 
        public.aggregates
      SET 
        version_number = result.version_number,
        data = result.data
      FROM
        (SELECT (public.apply_event(agg.*, NEW)).*
        FROM public.aggregates agg
        WHERE agg.id = NEW.aggregate_id
        ) AS result
      WHERE 
        public.aggregates.id = NEW.aggregate_id;
    ELSE
      RAISE EXCEPTION 'Aggregate does not exist';
    END IF;
  
  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;


CREATE TRIGGER after_insert_event
AFTER INSERT ON events
FOR EACH ROW EXECUTE FUNCTION public.handle_after_insert_event();
