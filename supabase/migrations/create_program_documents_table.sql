-- Create program_documents table
CREATE TABLE IF NOT EXISTS public.program_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    year TEXT NOT NULL,
    file_url TEXT NOT NULL,
    download_count INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.program_documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON public.program_documents
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.program_documents
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON public.program_documents
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON public.program_documents
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create storage bucket 'documents' if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies (handle existing policies gracefully)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Give public access to documents'
    ) THEN
        CREATE POLICY "Give public access to documents" ON storage.objects
            FOR SELECT USING (bucket_id = 'documents');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Enable upload for authenticated users'
    ) THEN
        CREATE POLICY "Enable upload for authenticated users" ON storage.objects
            FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Enable update for authenticated users'
    ) THEN
        CREATE POLICY "Enable update for authenticated users" ON storage.objects
            FOR UPDATE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Enable delete for authenticated users'
    ) THEN
        CREATE POLICY "Enable delete for authenticated users" ON storage.objects
            FOR DELETE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');
    END IF;
END
$$;
