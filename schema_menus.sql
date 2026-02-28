-- Create navigation_menus table
CREATE TABLE navigation_menus (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  href TEXT NOT NULL,
  parent_id UUID REFERENCES navigation_menus(id) ON DELETE CASCADE,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE navigation_menus ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access for everyone (public)
CREATE POLICY "Public navigation items are viewable by everyone" 
ON navigation_menus FOR SELECT 
USING (true);

-- Create policy to allow all access for authenticated users (admins)
CREATE POLICY "Admins can manage navigation" 
ON navigation_menus FOR ALL 
USING (auth.role() = 'authenticated');

-- Initial Seed Data (Structure from Header.tsx)
DO $$
DECLARE
  profil_id UUID;
  program_id UUID;
  informasi_id UUID;
  lainnya_id UUID;
BEGIN
  -- Insert Main Categories
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Profil', '/profil', 1, NULL) RETURNING id INTO profil_id;
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Program', '/program', 2, NULL) RETURNING id INTO program_id;
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Informasi', '/informasi', 3, NULL) RETURNING id INTO informasi_id;
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Menu Lainnya', '#', 4, NULL) RETURNING id INTO lainnya_id;

  -- Profil Items
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Visi & Misi', '/profil/visi-misi', 1, profil_id);
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Tugas Dan Fungsi', '/profil/tugas-fungsi', 2, profil_id);
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Gambaran Umum Unit Kerja', '/profil/gambaran-umum', 3, profil_id);
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Struktur Organisasi', '/profil/struktur', 4, profil_id);
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Kedudukan, Domisili Dan Alamat', '/profil/kedudukan', 5, profil_id);
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Sejarah Dinas', '/profil/sejarah', 6, profil_id);
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Profil Pejabat', '/profil/pejabat', 7, profil_id);
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('LHKPN Pejabat', '/profil/lhkpn', 8, profil_id);
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Maklumat Pelayanan', '/profil/maklumat', 9, profil_id);

  -- Program Items
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Tahun Anggaran 2022', '/program/anggaran/2022', 1, program_id);
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Tahun Anggaran 2023', '/program/anggaran/2023', 2, program_id);
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Tahun Anggaran 2024', '/program/anggaran/2024', 3, program_id);
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Tahun Anggaran 2025', '/program/anggaran/2025', 4, program_id);
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Tahun Anggaran 2026', '/program/anggaran/2026', 5, program_id);
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Dokumen Renstra', '/program/renstra', 6, program_id);
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Laporan Keuangan', '/program/laporan-keuangan', 7, program_id);

  -- Informasi Items
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Informasi', '/informasi/berita', 1, informasi_id);
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Layanan Informasi Publik', '/informasi/layanan-informasi-publik', 2, informasi_id);
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Laporan Layanan Informasi Publik', '/informasi/laporan-layanan', 3, informasi_id);
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Saluran Pengaduan', '/informasi/saluran-pengaduan', 4, informasi_id);
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Pengadaan Barang / Jasa', '/informasi/pengadaan', 5, informasi_id);
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Produk Hukum', '/informasi/produk-hukum', 6, informasi_id);
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Unduhan', '/informasi/unduhan', 7, informasi_id);
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Agenda Pimpinan', '/informasi/agenda-pimpinan', 8, informasi_id);
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Aset Dinas', '/informasi/aset-dinas', 9, informasi_id);
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Data Statistik', '/informasi/data-statistik', 10, informasi_id);
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Alur Kunjungan Ke Diskominfo', '/informasi/alur-kunjungan', 11, informasi_id);

  -- Menu Lainnya Items
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Layanan', '/layanan', 1, lainnya_id);
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Berita', '/informasi/berita', 2, lainnya_id);
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Galeri', '/galeri', 3, lainnya_id);
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Kontak', '/kontak', 4, lainnya_id);
  INSERT INTO navigation_menus (title, href, "order", parent_id) VALUES ('Kebijakan', '/kebijakan', 5, lainnya_id);

END $$;
