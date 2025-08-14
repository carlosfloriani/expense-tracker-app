-- Update the password to 1105
UPDATE app_config 
SET value = '1105' 
WHERE key = 'app_password';

-- Enable RLS on both tables for security
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create public read policy for app_config (needed for password check)
CREATE POLICY "Allow public read access to app_config" 
ON app_config FOR SELECT 
TO public 
USING (true);

-- Create public access policies for expenses (since no user auth)
CREATE POLICY "Allow public read access to expenses" 
ON expenses FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow public insert access to expenses" 
ON expenses FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow public update access to expenses" 
ON expenses FOR UPDATE 
TO public 
USING (true);

CREATE POLICY "Allow public delete access to expenses" 
ON expenses FOR DELETE 
TO public 
USING (true);