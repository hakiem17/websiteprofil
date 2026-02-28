-- Create site_settings table
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT DEFAULT 'Pemerintah Daerah',
  logo_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view site settings" 
ON site_settings FOR SELECT 
USING (true);

CREATE POLICY "Admins can update site settings" 
ON site_settings FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert site settings" 
ON site_settings FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Insert default row if not exists
INSERT INTO site_settings (site_name, description)
SELECT 'Pemerintah Daerah', 'Website Resmi Pemerintah Daerah'
WHERE NOT EXISTS (SELECT 1 FROM site_settings);
