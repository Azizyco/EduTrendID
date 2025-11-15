-- ====================================================================
-- SCHEMA DATABASE: EduTrendID
-- Aplikasi Analisis Tren Isu Pendidikan Yogyakarta
-- Database: PostgreSQL
-- ====================================================================

-- Tabel 1: users
-- Menyimpan data pengguna admin yang dapat mengakses sistem
CREATE TABLE users (
    id_user SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel 2: sumber_berita
-- Menyimpan daftar sumber berita yang akan di-scrape
CREATE TABLE sumber_berita (
    id_sumber SERIAL PRIMARY KEY,
    nama_sumber VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    status_aktif BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel 3: artikel
-- Menyimpan artikel hasil scraping dari berbagai sumber berita
CREATE TABLE artikel (
    id_artikel SERIAL PRIMARY KEY,
    id_sumber INTEGER REFERENCES sumber_berita(id_sumber) ON DELETE SET NULL,
    judul TEXT NOT NULL,
    tanggal VARCHAR(100),  -- Menggunakan VARCHAR karena format tanggal dari berbagai sumber bisa berbeda
    isi TEXT NOT NULL,
    url_asli TEXT UNIQUE,  -- URL unik untuk mencegah duplikasi artikel
    topik VARCHAR(100),    -- Kategori topik (nullable, bisa diisi manual atau otomatis)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk mempercepat pencarian artikel berdasarkan judul dan sumber
CREATE INDEX idx_artikel_judul ON artikel(judul);
CREATE INDEX idx_artikel_sumber ON artikel(id_sumber);
CREATE INDEX idx_artikel_tanggal ON artikel(tanggal);

-- Tabel 4: preprocessing
-- Menyimpan hasil preprocessing teks dari artikel
CREATE TABLE preprocessing (
    id_preprocess SERIAL PRIMARY KEY,
    id_artikel INTEGER REFERENCES artikel(id_artikel) ON DELETE CASCADE,
    teks_bersih TEXT NOT NULL,     -- Teks setelah cleaning (lowercase, tanpa angka/simbol)
    token TEXT NOT NULL,            -- Token (kata-kata) yang sudah dipisahkan spasi, setelah stopword removal
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_artikel)  -- Satu artikel hanya punya satu hasil preprocessing
);

-- Tabel 5: tfidf_kata
-- Menyimpan hasil analisis TF-IDF dari kata-kata penting
CREATE TABLE tfidf_kata (
    id_tfidf SERIAL PRIMARY KEY,
    kata VARCHAR(255) NOT NULL,
    nilai_tfidf NUMERIC(10, 6) NOT NULL,  -- Nilai TF-IDF dengan 6 digit desimal
    frekuensi INTEGER NOT NULL,            -- Berapa kali kata muncul di seluruh dokumen
    periode VARCHAR(50),                   -- Periode analisis, misal: "2025-11" atau "2025-11-15"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk mempercepat pengambilan top-N kata
CREATE INDEX idx_tfidf_nilai ON tfidf_kata(nilai_tfidf DESC);
CREATE INDEX idx_tfidf_periode ON tfidf_kata(periode);

-- Tabel 6: log_proses
-- Menyimpan log dari setiap proses yang dijalankan (scraping, preprocessing, analisis)
CREATE TABLE log_proses (
    id_log SERIAL PRIMARY KEY,
    waktu TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    jenis_proses VARCHAR(50) NOT NULL,  -- 'scrape', 'preprocess', 'analyze'
    status VARCHAR(50) NOT NULL,        -- 'berhasil', 'gagal'
    keterangan TEXT                     -- Detail proses: jumlah data, pesan error, dll
);

-- Index untuk mempercepat pengambilan log terbaru
CREATE INDEX idx_log_waktu ON log_proses(waktu DESC);
CREATE INDEX idx_log_jenis ON log_proses(jenis_proses);

-- ====================================================================
-- DATA AWAL (SEED DATA)
-- ====================================================================

-- Insert default admin user
-- Password: admin123 (sudah di-hash dengan bcrypt, rounds=10)
-- Untuk testing, password plain: admin123
INSERT INTO users (username, password_hash, role) VALUES 
('admin', '$2b$10$rZ3QKxVlWxH0LhHZKxqPnOJ4p9YXGfqKxqPnOJ4p9YXGfqKxqPnOJ', 'admin');

-- Contoh sumber berita (gunakan URL dummy atau contoh)
-- CATATAN: Di implementasi nyata, sesuaikan dengan portal berita yang akan di-scrape
INSERT INTO sumber_berita (nama_sumber, url, status_aktif) VALUES 
('Contoh Portal Pendidikan 1', 'https://example-news1.com/pendidikan', true),
('Contoh Portal Pendidikan 2', 'https://example-news2.com/category/education', true),
('Contoh Portal Pendidikan 3', 'https://example-news3.com/berita/pendidikan', false);

-- ====================================================================
-- CATATAN PENTING:
-- ====================================================================
-- 1. Password di tabel users sudah dalam bentuk hash (bcrypt).
--    Untuk membuat password baru, gunakan library bcrypt di Node.js.
--
-- 2. Tabel artikel menggunakan url_asli sebagai UNIQUE constraint
--    untuk mencegah artikel yang sama di-scrape berulang kali.
--
-- 3. Kolom tanggal di tabel artikel menggunakan VARCHAR karena
--    format tanggal dari berbagai portal berita bisa berbeda-beda.
--    Jika ingin parsing ke DATE, bisa dilakukan di aplikasi.
--
-- 4. Tabel preprocessing memiliki UNIQUE constraint pada id_artikel
--    sehingga satu artikel hanya diproses sekali.
--
-- 5. Tabel tfidf_kata bisa menyimpan hasil analisis dari berbagai periode.
--    Gunakan kolom 'periode' untuk membedakan hasil analisis per bulan/hari.
--
-- 6. Semua tabel menggunakan SERIAL untuk auto-increment ID.
--
-- 7. Foreign key menggunakan ON DELETE CASCADE/SET NULL untuk menjaga
--    integritas data ketika record induk dihapus.
-- ====================================================================
