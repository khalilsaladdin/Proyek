-- ============================================================
-- (مشكاة) MISYKAH — Skema Database Supabase PostgreSQL
-- ============================================================
-- Jalankan skrip ini di SQL Editor di dashboard Supabase Anda:
-- Dashboard -> SQL Editor -> New Query -> Paste -> Run (Ctrl+Enter)

-- 1. TABEL FAIDAH ILMIAH
CREATE TABLE IF NOT EXISTS public.faidah (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    author_name TEXT NOT NULL,
    judul TEXT NOT NULL,
    kategori TEXT NOT NULL,
    arabic_text TEXT,
    isi TEXT NOT NULL,
    sumber TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABEL GRUP KELAS SANTRI
CREATE TABLE IF NOT EXISTS public.classes (
    id TEXT PRIMARY KEY,
    nama TEXT NOT NULL,
    pemateri TEXT NOT NULL,
    kode TEXT NOT NULL UNIQUE,
    link TEXT,
    creator_name TEXT NOT NULL,
    creator_id TEXT,
    anggota JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABEL RUANG HALAQAH MUROJAAH
CREATE TABLE IF NOT EXISTS public.halaqah (
    id TEXT PRIMARY KEY,
    judul TEXT NOT NULL,
    materi TEXT NOT NULL,
    waktu TEXT NOT NULL,
    max_participants INTEGER DEFAULT 8,
    link TEXT,
    status TEXT DEFAULT 'upcoming',
    deskripsi TEXT,
    creator_name TEXT NOT NULL,
    participants JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABEL PARTNER TASMI' (SIMA'AN HAFALAN)
CREATE TABLE IF NOT EXISTS public.tasmi_requests (
    id TEXT PRIMARY KEY,
    materi TEXT NOT NULL,
    waktu TEXT NOT NULL,
    catatan TEXT,
    requester_name TEXT NOT NULL,
    requester_id TEXT,
    partner_name TEXT,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABEL FORUM ILMIAH SANTRI (PERTANYAAN)
CREATE TABLE IF NOT EXISTS public.forum_questions (
    id TEXT PRIMARY KEY,
    topik TEXT NOT NULL,
    pertanyaan TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABEL TANGGAPAN / JAWABAN FORUM
CREATE TABLE IF NOT EXISTS public.forum_answers (
    id TEXT PRIMARY KEY,
    question_id TEXT REFERENCES public.forum_questions(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- KEBIJAKAN AKSES PUBLIK (ROW LEVEL SECURITY)
-- Mengizinkan pembacaan & pengiriman data oleh sesama santri
-- ============================================================

ALTER TABLE public.faidah ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.halaqah ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasmi_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_answers ENABLE ROW LEVEL SECURITY;

-- Policy untuk Faidah
CREATE POLICY "Izinkan baca publik faidah" ON public.faidah FOR SELECT USING (true);
CREATE POLICY "Izinkan simpan faidah" ON public.faidah FOR INSERT WITH CHECK (true);
CREATE POLICY "Izinkan perbarui faidah" ON public.faidah FOR UPDATE USING (true);
CREATE POLICY "Izinkan hapus faidah" ON public.faidah FOR DELETE USING (true);

-- Policy untuk Classes
CREATE POLICY "Izinkan baca publik classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Izinkan simpan classes" ON public.classes FOR INSERT WITH CHECK (true);
CREATE POLICY "Izinkan perbarui classes" ON public.classes FOR UPDATE USING (true);
CREATE POLICY "Izinkan hapus classes" ON public.classes FOR DELETE USING (true);

-- Policy untuk Halaqah
CREATE POLICY "Izinkan baca publik halaqah" ON public.halaqah FOR SELECT USING (true);
CREATE POLICY "Izinkan simpan halaqah" ON public.halaqah FOR INSERT WITH CHECK (true);
CREATE POLICY "Izinkan perbarui halaqah" ON public.halaqah FOR UPDATE USING (true);
CREATE POLICY "Izinkan hapus halaqah" ON public.halaqah FOR DELETE USING (true);

-- Policy untuk Tasmi
CREATE POLICY "Izinkan baca publik tasmi" ON public.tasmi_requests FOR SELECT USING (true);
CREATE POLICY "Izinkan simpan tasmi" ON public.tasmi_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Izinkan perbarui tasmi" ON public.tasmi_requests FOR UPDATE USING (true);
CREATE POLICY "Izinkan hapus tasmi" ON public.tasmi_requests FOR DELETE USING (true);

-- Policy untuk Forum
CREATE POLICY "Izinkan baca publik forum_q" ON public.forum_questions FOR SELECT USING (true);
CREATE POLICY "Izinkan simpan forum_q" ON public.forum_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Izinkan hapus forum_q" ON public.forum_questions FOR DELETE USING (true);

CREATE POLICY "Izinkan baca publik forum_a" ON public.forum_answers FOR SELECT USING (true);
CREATE POLICY "Izinkan simpan forum_a" ON public.forum_answers FOR INSERT WITH CHECK (true);
CREATE POLICY "Izinkan hapus forum_a" ON public.forum_answers FOR DELETE USING (true);

-- Aktifkan Realtime Replication untuk tabel-tabel interaktif
ALTER PUBLICATION supabase_realtime ADD TABLE public.faidah;
ALTER PUBLICATION supabase_realtime ADD TABLE public.classes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.halaqah;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasmi_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_questions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_answers;
