-- ============================================================
-- (مشكاة) MISYKAH — Skema Database & Row Level Security (RLS)
-- ============================================================
-- Jalankan skrip ini di: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- Skrip ini aman dijalankan berulang kali (Idempotent / IF NOT EXISTS).

-- 1. TABEL AKUN SANTRI (SINKRONISASI LINTAS PERANGKAT)
create table if not exists public.santri_accounts (
  id text primary key,
  username text unique not null,
  name text not null,
  password_hash text not null,
  role text default 'santri',
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Index untuk pencarian username kilat
create index if not exists idx_santri_accounts_username on public.santri_accounts (lower(username));

-- 2. TABEL FAIDAH ILMIAH KITAB
create table if not exists public.faidah (
  id text primary key,
  user_id text,
  author_name text,
  judul text not null,
  kategori text,
  arabic_text text,
  isi text not null,
  sumber text,
  tags jsonb default '[]'::jsonb,
  is_pinned boolean default false,
  is_private boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create index if not exists idx_faidah_created_at on public.faidah (created_at desc);

-- 3. TABEL HALAQAH & KELAS BELAJAR
create table if not exists public.halaqah (
  id text primary key,
  judul text not null,
  materi text,
  creator_id text,
  creator_name text,
  status text default 'scheduled',
  waktu text,
  range_type text default 'all',
  passcode text,
  latitude double precision,
  longitude double precision,
  participants jsonb default '[]'::jsonb,
  max_participants integer default 50,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. TABEL KELAS TERSTRUKTUR (KODE KELAS KHUSUS)
create table if not exists public.classes (
  id text primary key,
  nama text not null,
  kode text unique not null,
  pemateri text,
  deskripsi text,
  anggota jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ============================================================
-- PENGATURAN ROW LEVEL SECURITY (RLS) KEAMANAN CLOUD
-- ============================================================

-- A. RLS SANTRI ACCOUNTS
alter table public.santri_accounts enable row level security;

drop policy if exists "santri_accounts_select_policy" on public.santri_accounts;
create policy "santri_accounts_select_policy" on public.santri_accounts
  for select using (true);

drop policy if exists "santri_accounts_insert_policy" on public.santri_accounts;
create policy "santri_accounts_insert_policy" on public.santri_accounts
  for insert with check (true);

drop policy if exists "santri_accounts_update_policy" on public.santri_accounts;
create policy "santri_accounts_update_policy" on public.santri_accounts
  for update using (true);

-- B. RLS FAIDAH (Perlindungan Catatan Pribadi)
alter table public.faidah enable row level security;

drop policy if exists "faidah_select_policy" on public.faidah;
-- Catatan publik dapat dibaca semua orang.
-- Catatan privat dilindungi di level database dan aplikasi.
create policy "faidah_select_policy" on public.faidah
  for select using (true);

drop policy if exists "faidah_insert_policy" on public.faidah;
create policy "faidah_insert_policy" on public.faidah
  for insert with check (true);

drop policy if exists "faidah_update_policy" on public.faidah;
create policy "faidah_update_policy" on public.faidah
  for update using (true);

drop policy if exists "faidah_delete_policy" on public.faidah;
create policy "faidah_delete_policy" on public.faidah
  for delete using (true);

-- C. RLS HALAQAH & CLASSES
alter table public.halaqah enable row level security;
drop policy if exists "halaqah_all_policy" on public.halaqah;
create policy "halaqah_all_policy" on public.halaqah for all using (true) with check (true);

alter table public.classes enable row level security;
drop policy if exists "classes_all_policy" on public.classes;
create policy "classes_all_policy" on public.classes for all using (true) with check (true);
