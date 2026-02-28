-- Tambah kolom attachment untuk file PDF
alter table announcements add column if not exists attachment_url text;

-- Buat bucket storage untuk dokumen (jalankan di Supabase Dashboard jika belum ada)
-- insert into storage.buckets (id, name, public) values ('documents', 'documents', true);
-- create policy "Public can read documents" on storage.objects for select using (bucket_id = 'documents');
-- create policy "Auth users can upload documents" on storage.objects for insert to authenticated with check (bucket_id = 'documents');
-- create policy "Auth users can delete documents" on storage.objects for delete to authenticated using (bucket_id = 'documents');
