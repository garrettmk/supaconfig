INSERT INTO public.events (event_type, aggregate_type, event_data)
VALUES ('create', 'location', '{"name": "San Francisco"}');

INSERT INTO public.events (event_type, aggregate_type, event_data)
VALUES ('create', 'location', '{"name": "Denver"}');

INSERT INTO public.events (event_type, aggregate_id, aggregate_type, event_data)
VALUES ('create', 'c144687a-061f-470a-8f95-e44db683b213', 'location', '{"name": "Seattle"}');

INSERT INTO public.events (aggregate_type, aggregate_id, event_type, event_data)
VALUES ('location', 'c144687a-061f-470a-8f95-e44db683b213', 'delete', '{}');


SELECT public.location_create('City of New York', '9dffd0aa-e52f-4f44-85dc-33102a1fdd6c');
SELECT public.location_set_default_hours('9dffd0aa-e52f-4f44-85dc-33102a1fdd6c', '{
  "monday": { "isOpen": true, "open": "08:00", "close": "17:00", "break": "12:00", "breakDuration": 60 },
  "tuesday": { "isOpen": true, "open": "08:00", "close": "17:00", "break": "12:00", "breakDuration": 60 },
  "wednesday": { "isOpen": true, "open": "08:00", "close": "17:00", "break": "12:00", "breakDuration": 60 },
  "thursday": { "isOpen": true, "open": "08:00", "close": "17:00", "break": "12:00", "breakDuration": 60 },
  "friday": { "isOpen": true, "open": "08:00", "close": "17:00", "break": "12:00", "breakDuration": 60 },
  "saturday": { "isOpen": true, "open": "09:00", "close": "15:00", "break": "12:00", "breakDuration": 30 },
  "sunday": { "isOpen": false, "open": "09:00", "close": "15:00", "break": "12:00", "breakDuration": 30 }
}');

SELECT public.location_set_specialty_hours('9dffd0aa-e52f-4f44-85dc-33102a1fdd6c', '2024-02-20', '{
  "isOpen": true, "open": "12:00", "close": "15:00", "break": "12:00", "breakDuration": 0
}');  
