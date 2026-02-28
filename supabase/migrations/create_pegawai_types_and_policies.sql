-- Create the table if it doesn't exist (match user's schema)
CREATE TABLE IF NOT EXISTS public.pegawai (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nama_pegawai TEXT NOT NULL,
    jenis_pegawai TEXT NOT NULL DEFAULT 'PNS',
    nip TEXT,
    pangkat_golongan TEXT,
    jabatan_dinas TEXT,
    jabatan_keuangan TEXT,
    bidang TEXT,
    jenis_kelamin TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.pegawai ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON public.pegawai
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.pegawai
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON public.pegawai
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON public.pegawai
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_pegawai_updated_at ON public.pegawai;
CREATE TRIGGER update_pegawai_updated_at
    BEFORE UPDATE ON public.pegawai
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
