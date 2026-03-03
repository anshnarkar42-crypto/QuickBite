-- Insert missing user profiles for existing auth users
-- This handles users who signed up before the trigger was created

INSERT INTO public.user_profiles (id, role)
SELECT id, 'student' FROM auth.users
WHERE id NOT IN (SELECT id FROM public.user_profiles)
ON CONFLICT (id) DO NOTHING;
