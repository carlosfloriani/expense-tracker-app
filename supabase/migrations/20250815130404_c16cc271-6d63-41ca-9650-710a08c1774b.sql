-- Remove the public read policy that exposes the password
DROP POLICY IF EXISTS "Allow public read access to app_config" ON public.app_config;

-- Create a secure policy that only allows authenticated access (but we won't use this directly)
CREATE POLICY "Restrict app_config access" ON public.app_config
FOR SELECT USING (false); -- No direct access allowed