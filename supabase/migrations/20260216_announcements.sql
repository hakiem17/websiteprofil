-- Tabel Pengumuman
create table announcements (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text,
  priority text default 'Biasa' check (priority in ('Biasa', 'Penting', 'Urgent')),
  is_active boolean default true,
  start_date timestamp with time zone default timezone('utc'::text, now()),
  end_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table announcements enable row level security;

-- Public read
create policy "Public can view announcements" on announcements for select using (true);

-- Admin write
create policy "Admins can insert announcements" on announcements for insert to authenticated with check (true);
create policy "Admins can update announcements" on announcements for update to authenticated using (true);
create policy "Admins can delete announcements" on announcements for delete to authenticated using (true);
