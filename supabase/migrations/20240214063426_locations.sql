CREATE VIEW public.locations AS
  SELECT
    aggregates.id AS id,
    aggregates.version_number AS version,
    aggregates.data->>'name' AS name
  FROM 
    public.aggregates
  WHERE 
    public.aggregates.type = 'location';