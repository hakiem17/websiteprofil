-- Seed data untuk informasi_pages
-- Jalankan SETELAH migration create_informasi_pages_table.sql

INSERT INTO public.informasi_pages (slug, title, content) VALUES
('layanan-informasi-publik',  'Layanan Informasi Publik',        '<p>Konten halaman layanan informasi publik.</p>'),
('laporan-layanan',           'Laporan Layanan Informasi Publik', '<p>Konten laporan layanan informasi publik.</p>'),
('saluran-pengaduan',         'Saluran Pengaduan',                '<p>Konten halaman saluran pengaduan.</p>'),
('pengadaan',                 'Pengadaan Barang / Jasa',          '<p>Konten pengadaan barang dan jasa.</p>'),
('produk-hukum',              'Produk Hukum',                     '<p>Konten produk hukum.</p>'),
('unduhan',                   'Unduhan',                          '<p>Konten halaman unduhan.</p>'),
('agenda-pimpinan',           'Agenda Pimpinan',                  '<p>Konten agenda pimpinan.</p>'),
('aset-dinas',                'Aset Dinas',                       '<p>Konten aset dinas.</p>'),
('data-statistik',            'Data Statistik',                   '<p>Konten data statistik.</p>'),
('alur-kunjungan',            'Alur Kunjungan Ke Diskominfo',     '<p>Konten alur kunjungan ke Diskominfo.</p>')
ON CONFLICT (slug) DO NOTHING;
