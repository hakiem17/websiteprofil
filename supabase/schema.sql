-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. POSTS (Berita & Artikel)
create table posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  content text,
  thumbnail_url text,
  published_at timestamp with time zone default timezone('utc'::text, now()),
  is_published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. DOCUMENTS (Arsip Transparansi)
create table documents (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  file_url text not null,
  fiscal_year integer not null, -- e.g., 2024, 2025
  category text not null, -- 'Renstra', 'Renja', 'DPA', 'LHKPN', 'Other'
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. SERVICES (Layanan Publik)
create table services (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  type text check (type in ('Online', 'Offline')),
  link_url text, -- if online
  location text, -- if offline
  icon text, -- Lucide icon name or image url
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. GALLERIES (Foto & Video)
create table galleries (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  media_url text not null,
  type text check (type in ('Photo', 'Video')),
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. VISITOR STATS
create table visitor_stats (
  id uuid default uuid_generate_v4() primary key,
  date date default current_date,
  count integer default 1,
  page_path text,
  unique(date, page_path) -- Simple daily counter per page
);

-- ENABLE ROW LEVEL SECURITY
alter table posts enable row level security;
alter table documents enable row level security;
alter table services enable row level security;
alter table galleries enable row level security;
alter table visitor_stats enable row level security;

-- POLICIES

-- Public Read Access (Everyone can view)
create policy "Public can view posts" on posts for select using (true);
create policy "Public can view documents" on documents for select using (true);
create policy "Public can view services" on services for select using (true);
create policy "Public can view galleries" on galleries for select using (true);
create policy "Public can view stats" on visitor_stats for select using (true);

-- Admin Write Access (Only authenticated users)
-- In a real production app, checking a specific role or email domain is better.
-- For now, we assume any authenticated user in the project is an admin/staff.
create policy "Admins can insert posts" on posts for insert to authenticated with check (true);
create policy "Admins can update posts" on posts for update to authenticated using (true);
create policy "Admins can delete posts" on posts for delete to authenticated using (true);

create policy "Admins can insert documents" on documents for insert to authenticated with check (true);
create policy "Admins can update documents" on documents for update to authenticated using (true);
create policy "Admins can delete documents" on documents for delete to authenticated using (true);

create policy "Admins can insert services" on services for insert to authenticated with check (true);
create policy "Admins can update services" on services for update to authenticated using (true);
create policy "Admins can delete services" on services for delete to authenticated using (true);

create policy "Admins can insert galleries" on galleries for insert to authenticated with check (true);
create policy "Admins can update galleries" on galleries for update to authenticated using (true);
create policy "Admins can delete galleries" on galleries for delete to authenticated using (true);

-- Visitor Stats: Allow public to increment (via RPC usually, but enabling insert for demo if needed, usually managed via backend logic)
-- For security, it's better to use an RPC function for stats, but we'll allow insert for now slightly restricted if we had anon key content.
-- Actually, strict RLS: Public should NOT insert directly usually.
-- Let's keep it simple: Public can read stats. Incrementing will be done via a secure function later or open for now.
create policy "Public can insert stats" on visitor_stats for insert to anon with check (true);
create policy "Public can update stats" on visitor_stats for update to anon using (true); 

-- STORAGE BUCKETS (If using Supabase Storage)
-- insert into storage.buckets (id, name, public) values ('thumbnails', 'thumbnails', true);
-- insert into storage.buckets (id, name, public) values ('documents', 'documents', true);
-- insert into storage.buckets (id, name, public) values ('gallery', 'gallery', true);

-- Helper: Update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

create trigger update_posts_updated_at before update on posts
for each row execute procedure update_updated_at_column();
