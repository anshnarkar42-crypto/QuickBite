-- Add points column to user_profiles if it doesn't exist
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 500;

-- Update existing profiles to have 500 points if they don't have any
UPDATE public.user_profiles
SET points = 500
WHERE points IS NULL OR points = 0;
