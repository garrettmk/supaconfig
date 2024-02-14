INSERT INTO public.events (event_type, aggregate_type, event_data)
VALUES ('create', 'location', '{"name": "San Francisco"}');

INSERT INTO public.events (event_type, aggregate_type, event_data)
VALUES ('create', 'location', '{"name": "Denver"}');

INSERT INTO public.events (event_type, aggregate_id, aggregate_type, event_data)
VALUES ('create', 'c144687a-061f-470a-8f95-e44db683b213', 'location', '{"name": "Seattle"}');

INSERT INTO public.events (aggregate_id, event_type, aggregate_type, event_data)
VALUES ('9dffd0aa-e52f-4f44-85dc-33102a1fdd6c', 'create', 'location', '{"name": "New York"}');

INSERT INTO public.events (aggregate_id, event_type, aggregate_type, event_data)
VALUES ('9dffd0aa-e52f-4f44-85dc-33102a1fdd6c', 'update', 'location', '{"name": "City of New York"}');

INSERT INTO public.events (aggregate_type, aggregate_id, event_type, event_data)
VALUES ('location', 'c144687a-061f-470a-8f95-e44db683b213', 'delete', '{}');