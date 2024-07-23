
/*
  Create a public users table
*/

CREATE TABLE public.users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL
);

COMMENT ON TABLE public.users IS 'Public user information';

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "create" ON public.users FOR INSERT WITH CHECK (false);
CREATE POLICY "read" ON public.users FOR SELECT USING (true);
CREATE POLICY "update" ON public.users FOR UPDATE USING (false);
CREATE POLICY "delete" ON public.users FOR DELETE USING (false);

/*
  Sync with the auth.users table
*/

CREATE OR REPLACE FUNCTION public.handle_after_insert_user()
RETURNS TRIGGER SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.users (id, name)
  VALUES (NEW.id, split_part(NEW.email, '@', 1));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_insert_user
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_after_insert_user();


CREATE OR REPLACE FUNCTION public.handle_after_update_user()
RETURNS TRIGGER SECURITY DEFINER AS $$
BEGIN
  UPDATE public.users
  SET name = split_part(NEW.email, '@', 1)
  WHERE id = OLD.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_update_user
AFTER UPDATE ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_after_update_user();


CREATE OR REPLACE FUNCTION public.handle_after_delete_user()
RETURNS TRIGGER SECURITY DEFINER AS $$
BEGIN
  DELETE FROM public.users
  WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_delete_user
AFTER DELETE ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_after_delete_user();


/*
  Create a JSON object from a user row
*/

CREATE OR REPLACE FUNCTION public.user_json(user_id UUID)
RETURNS JSON AS $$
BEGIN
  RETURN (
    SELECT jsonb_build_object(
      'id', id,
      'name', name
    )
    FROM public.users
    WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql;