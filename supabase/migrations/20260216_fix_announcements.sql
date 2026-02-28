-- 1. Tambah kolom attachment_url (jika belum ada)
alter table announcements add column if not exists attachment_url text;

-- 2. Buat bucket storage 'documents' (jika belum ada)
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do nothing;

-- 3. Policy untuk membaca dokumen (Public)
do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Public can read documents' and tablename = 'objects' and schemaname = 'storage') then
    create policy "Public can read documents"
    on storage.objects for select
    using ( bucket_id = 'documents' );
  end if;
end $$;

-- 4. Policy untuk upload dokumen (Authenticated)
do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Auth users can upload documents' and tablename = 'objects' and schemaname = 'storage') then
    create policy "Auth users can upload documents"
    on storage.objects for insert
    to authenticated
    with check ( bucket_id = 'documents' );
  end if;
end $$;

-- 5. Policy untuk hapus dokumen (Authenticated)
do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Auth users can delete documents' and tablename = 'objects' and schemaname = 'storage') then
    create policy "Auth users can delete documents"
    on storage.objects for delete
    to authenticated
    using ( bucket_id = 'documents' );
  end if;
end $$;

-- 6. Tambahkan menu Pengumuman ke navbar (di bawah Informasi)
INSERT INTO navigation_menus (title, href, parent_id, "order", is_active)
SELECT 'Pengumuman', '/informasi/pengumuman', id, 10, true
FROM navigation_menus
WHERE title = 'Informasi'
AND NOT EXISTS (
    SELECT 1 FROM navigation_menus WHERE href = '/informasi/pengumuman'
);
