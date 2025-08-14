-- Remove user_id column from expenses table and disable RLS
ALTER TABLE public.expenses DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.expenses DISABLE ROW LEVEL SECURITY;

-- Drop all existing RLS policies
DROP POLICY IF EXISTS "Users can create their own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can delete their own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can update their own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can view their own expenses" ON public.expenses;

-- Drop profiles table if exists
DROP TABLE IF EXISTS public.profiles;

-- Drop trigger and function for user management
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create simple auth table for password storage
CREATE TABLE IF NOT EXISTS public.app_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Insert default password
INSERT INTO public.app_config (key, value) 
VALUES ('app_password', 'gabrielly123')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Disable RLS on app_config (it's just for storing the password)
ALTER TABLE public.app_config DISABLE ROW LEVEL SECURITY;