-- Tabel Agenda Kegiatan
create table agenda (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  location text,
  organizer text,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone,
  is_published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table agenda enable row level security;

-- Public read
create policy "Public can view agenda" on agenda for select using (true);

-- Admin write
create policy "Admins can insert agenda" on agenda for insert to authenticated with check (true);
create policy "Admins can update agenda" on agenda for update to authenticated using (true);
create policy "Admins can delete agenda" on agenda for delete to authenticated using (true);
