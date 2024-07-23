CREATE VIEW public.locations AS
  SELECT
    agg.id AS id,
    agg.version_number AS version,
    agg.data->>'name' AS name,
    agg.data->'defaultHours' AS default_hours,
    agg.data->'specialtyHours' AS specialty_hours,
    agg.created_at AS created_at,
    agg.updated_at AS updated_at,
    agg.created_by AS created_by,
    agg.updated_by AS updated_by,
    public.user_json(agg.created_by) AS created_by_user,
    public.user_json(agg.updated_by) AS updated_by_user
  FROM 
    public.aggregates agg
  WHERE 
    agg.type = 'location';


/*
  Create a new location aggregate
  */
CREATE FUNCTION public.location_create(name TEXT, id UUID DEFAULT NULL, data JSONB DEFAULT '{}'::JSONB)
RETURNS UUID AS $$
DECLARE
  location_id UUID := COALESCE(id, uuid_generate_v4());
BEGIN
  INSERT INTO public.events (event_type, aggregate_type, aggregate_id, event_data)
  VALUES ('create', 'location', location_id, data || jsonb_build_object('name', name));
  RETURN location_id;
END; $$ LANGUAGE plpgsql;


/*
  Delete a location aggregate
*/
CREATE OR REPLACE FUNCTION public.location_delete(location_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.events (aggregate_type, aggregate_id, event_type, event_data)
  VALUES ('location', location_id, 'delete', '{}');
END; $$ LANGUAGE plpgsql;

/*
  Validate a JSONB object representing daily hours
*/
CREATE OR REPLACE FUNCTION public.location_validate_daily_hours(hours JSONB)
RETURNS VOID AS $$
DECLARE
  valid_time TIME;
BEGIN
  IF NOT (hours ? 'isOpen' AND jsonb_typeof(hours->'isOpen') = 'boolean') THEN
    RAISE EXCEPTION 'isOpen must be a boolean';
  END IF;

  BEGIN
    valid_time := (hours->>'open')::TIME;
    if (valid_time IS NULL) THEN
      RAISE EXCEPTION '';
    END IF;
  EXCEPTION WHEN others THEN
    RAISE EXCEPTION 'open must be a valid time';
  END;

  BEGIN
    valid_time := (hours->>'close')::TIME;
    if (valid_time IS NULL) THEN
      RAISE EXCEPTION '';
    END IF;
  EXCEPTION WHEN others THEN
    RAISE EXCEPTION 'close must be a valid time';
  END;

  BEGIN
    valid_time := (hours->>'break')::TIME;
    if (valid_time IS NULL) THEN
      RAISE EXCEPTION '';
    END IF;
  EXCEPTION WHEN others THEN
    RAISE EXCEPTION 'break must be a valid time';
  END;

  IF NOT (hours ? 'breakDuration' AND jsonb_typeof(hours->'breakDuration') = 'number') THEN
    RAISE EXCEPTION 'breakDuration must be a number';
  END IF;
END; $$ LANGUAGE plpgsql;

/*
  Validate a JSONB object representing weekly hours
*/
CREATE OR REPLACE FUNCTION public.location_validate_weekly_hours(hours JSONB)
RETURNS VOID AS $$
DECLARE
  valid_days TEXT[] := ARRAY['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  key TEXT;
  value JSONB;
BEGIN
  FOR key, value IN SELECT * FROM jsonb_each(hours) LOOP
    IF key NOT IN (SELECT unnest(valid_days)) THEN
      RAISE EXCEPTION '% is not a valid weekday', key;
    END IF;
    PERFORM public.location_validate_daily_hours(value);
  END LOOP;
END; $$ LANGUAGE plpgsql;


/*
  Set the default hours for a location
*/
CREATE OR REPLACE FUNCTION public.location_set_default_hours(location_id UUID, hours JSONB)
RETURNS VOID AS $$
DECLARE
  location public.locations;
  current_default_hours JSONB;
BEGIN
  PERFORM public.location_validate_weekly_hours(hours);

  SELECT * FROM public.locations INTO location WHERE id = location_id LIMIT 1;
  current_default_hours := COALESCE(location.default_hours, '{}'::JSONB);

  INSERT INTO public.events (aggregate_type, aggregate_id, event_type, event_data)
  VALUES ('location', location_id, 'update', jsonb_build_object('defaultHours', current_default_hours || hours));
END; $$ LANGUAGE plpgsql;

/*
  Set the specialty hours for a location
*/
CREATE OR REPLACE FUNCTION public.location_set_specialty_hours(location_id UUID, date DATE, hours JSONB)
RETURNS VOID AS $$
DECLARE
  location public.locations;
  current_specialty_hours JSONB;
BEGIN
  PERFORM public.location_validate_daily_hours(hours);

  SELECT * FROM public.locations INTO location WHERE id = location_id LIMIT 1;
  current_specialty_hours := COALESCE(location.specialty_hours, '{}'::JSONB);

  INSERT INTO public.events (aggregate_type, aggregate_id, event_type, event_data)
  VALUES ('location', location_id, 'update', jsonb_build_object('specialtyHours', current_specialty_hours || jsonb_build_object(date::TEXT, hours)));
END; $$ LANGUAGE plpgsql;


/*
  Resolves the business hours for a location within a given date range
*/
CREATE OR REPLACE FUNCTION public.location_get_hours(location_id UUID, start_date DATE, end_date DATE)
RETURNS TABLE (
  date DATE,
  weekday TEXT,
  is_default BOOLEAN,
  is_open BOOLEAN,
  open_time TIME,
  close_time TIME,
  break_time TIME,
  break_duration INTEGER,
  total_hours INTERVAL
) AS $$
DECLARE
  location locations;
BEGIN
  SELECT * FROM public.locations INTO location WHERE id = location_id LIMIT 1;
  RETURN QUERY
    WITH cte AS (
      SELECT
        series_date::DATE AS series_date,
        series_weekday,
        location.default_hours->series_weekday AS default_hours,
        location.specialty_hours->((series_date::DATE)::TEXT) AS specialty_hours
      FROM
        generate_series(start_date, end_date, '1 day') AS series_date,
        to_char(series_date, 'FMday') AS series_weekday
    )
    SELECT 
      series_date,
      series_weekday,
      cte.specialty_hours IS NULL,
      COALESCE((cte.specialty_hours->'isOpen')::BOOLEAN, (cte.default_hours->'isOpen')::BOOLEAN, FALSE),
      COALESCE((cte.specialty_hours->>'open')::TIME, (cte.default_hours->>'open')::TIME) as open_time,
      COALESCE((cte.specialty_hours->>'close')::TIME, (cte.default_hours->>'close')::TIME) as close_time,
      COALESCE((cte.specialty_hours->>'break')::TIME, (cte.default_hours->>'break')::TIME),
      COALESCE((cte.specialty_hours->>'breakDuration')::INTEGER, (cte.default_hours->>'breakDuration')::INTEGER),
      CASE COALESCE((cte.specialty_hours->'isOpen')::BOOLEAN, (cte.default_hours->'isOpen')::BOOLEAN, FALSE)
        WHEN TRUE THEN (
          COALESCE((cte.specialty_hours->>'close')::TIME, (cte.default_hours->>'close')::TIME) -
          COALESCE((cte.specialty_hours->>'open')::TIME, (cte.default_hours->>'open')::TIME) -
          MAKE_INTERVAL(mins := COALESCE((cte.specialty_hours->'breakDuration')::INTEGER, (cte.default_hours->'breakDuration')::INTEGER))
        )
        ELSE NULL
      END AS total_hours
    FROM
      cte;
END;
$$ LANGUAGE plpgsql;