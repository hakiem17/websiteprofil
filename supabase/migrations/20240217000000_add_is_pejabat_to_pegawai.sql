-- Add is_pejabat column to pegawai table
ALTER TABLE public.pegawai 
ADD COLUMN IF NOT EXISTS is_pejabat BOOLEAN DEFAULT false;

-- Update existing structural officials based on keywords (optional, for convenience)
UPDATE public.pegawai
SET is_pejabat = true
WHERE jabatan_dinas ILIKE '%Kepala%' 
   OR jabatan_dinas ILIKE '%Sekretaris%'
   OR jabatan_dinas ILIKE '%Kabid%'
   OR jabatan_dinas ILIKE '%Camat%'
   OR jabatan_dinas ILIKE '%Lurah%';
