-- Create informasi_pages table (mirrors profile_pages pattern)
CREATE TABLE IF NOT EXISTS public.informasi_pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.informasi_pages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable read access for all users" ON public.informasi_pages
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.informasi_pages
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON public.informasi_pages
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON public.informasi_pages
    FOR DELETE USING (auth.role() = 'authenticated');

-- Trigger to auto-update updated_at
CREATE TRIGGER update_informasi_pages_updated_at
    BEFORE UPDATE ON public.informasi_pages
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
