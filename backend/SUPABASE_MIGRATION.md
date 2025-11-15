# Migrasi ke Supabase

Dokumen ini menjelaskan cara mengganti backend PostgreSQL lokal menjadi Supabase tanpa mengubah skema dan data dummy yang sudah ada.

## 1. Pendekatan Migrasi

Ada dua cara:

| Pendekatan | Library | Perubahan Kode | Cocok Untuk |
|------------|---------|----------------|-------------|
| Minimal | pg | Hanya ganti kredensial / SSL | Semua query SQL kompleks tetap berjalan |
| Query Builder | @supabase/supabase-js | Refactor model ke style Supabase | CRUD sederhana, fitur tambahan |

Untuk performa dan fleksibilitas lanjutan (TF-IDF manual, join, agregasi), pendekatan minimal sudah cukup.

## 2. Menyiapkan Supabase

1. Buat project di dashboard Supabase.
2. Catat: `Project URL` dan `Anon Key` dari menu Project Settings → API.
3. Catat juga `Connection string (URI)` PostgreSQL dari menu Database.
4. Jika perlu operasi penuh terlepas dari RLS, ambil `Service Role Key` (JANGAN taruh di frontend).

## 3. Mengisi .env

Contoh isi (anon key hanya untuk client / operasi publik):
```
SUPABASE_URL=https://iwgbpotbpdxdtqtorvfm.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....(dipotong)
SUPABASE_DB_URL=postgres://postgres:<PASSWORD>@db.iwgbpotbpdxdtqtorvfm.supabase.co:5432/postgres
```

Jika tidak punya connection string lengkap, isi granular:
```
SUPABASE_DB_HOST=db.iwgbpotbpdxdtqtorvfm.supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=<PASSWORD>
SUPABASE_DB_NAME=postgres
```

## 4. Konfigurasi Koneksi

File `src/config/database.js` sudah mendukung:
- Jika `SUPABASE_DB_URL` terisi → gunakan connection string + SSL.
- Jika tidak → fallback ke DB lokal.

## 5. Import Skema & Dummy Data

### Opsi A: SQL Editor Supabase
1. Buka SQL Editor.
2. Copy isi `database/schema.sql` → Run.
3. Pastikan tabel muncul di Table Editor.
4. Tambahkan sumber_berita jika belum ada (jika dummy tergantung foreign key).
5. Copy isi `database/dummy_data.sql` → Run.

### Opsi B: psql Remote
```
psql "postgres://postgres:<PASSWORD>@db.iwgbpotbpdxdtqtorvfm.supabase.co:5432/postgres" -c "SELECT NOW();"
psql "postgres://postgres:<PASSWORD>@db.iwgbpotbpdxdtqtorvfm.supabase.co:5432/postgres" -f database/schema.sql
psql "postgres://postgres:<PASSWORD>@db.iwgbpotbpdxdtqtorvfm.supabase.co:5432/postgres" -f database/dummy_data.sql
```

Jika error foreign key: pastikan urutan insert benar (sumber_berita dulu). Tambah manual misal:
```
INSERT INTO sumber_berita(nama_sumber, url_situs) VALUES ('Contoh Portal','https://contoh.com');
```

## 6. Menggunakan supabase-js (Opsional)

File tambahan:
- `src/config/supabaseClient.js`
- `src/models/article.supabase.model.js`

Ganti import di controller jika mau pakai versi Supabase:
```js
// const ArticleModel = require('../models/article.model');
const ArticleModel = require('../models/article.supabase.model');
```
Sesuaikan handler karena `findAll` versi Supabase mengembalikan `{ rows, total }`.

## 7. Row Level Security (RLS)

Secara default Supabase menyalakan RLS jika Anda mengaktifkannya. Jika RLS aktif:
- Buat policy: contoh mengizinkan semua operasi server (service role key).
- Untuk public read tanpa auth:
```
CREATE POLICY "Public read artikel" ON public.artikel FOR SELECT USING (true);
```
- Untuk insert hanya via service role jangan pakai anon key untuk operasi sensitif.

## 8. Keamanan

- Jangan commit `SUPABASE_SERVICE_ROLE_KEY` ke repository publik.
- Pisahkan antara frontend (anon key) dan backend (service role key).
- Gunakan `.env` + `.gitignore` (sudah disiapkan) agar aman.
- Rotate password database di dashboard secara berkala.
- Hindari mencetak key ke log.

## 9. Testing Setelah Migrasi

1. Jalankan server:
```
npm install
npm run dev
```
2. Panggil endpoint health (misal `/api/articles`).
3. Lakukan insert artikel baru → cek di dashboard Supabase.
4. Jalankan proses preprocessing & TF-IDF untuk memastikan query tetap valid.

## 10. Troubleshooting

| Masalah | Penyebab | Solusi |
|---------|----------|--------|
| SSL error | SSL tidak diaktifkan | Pastikan config ada `ssl: { rejectUnauthorized: false }` |
| Auth error insert | Memakai anon key + RLS ketat | Gunakan service role key di backend |
| Foreign key gagal | Urutan import salah | Insert sumber_berita sebelum artikel |
| Timeout | Jaringan lambat / pool setting | Tingkatkan `connectionTimeoutMillis` |

## 11. Kapan Perlu RPC / View?

- Query JOIN kompleks sering → buat VIEW atau fungsi SQL.
- Perlu agregasi statistik berat (COUNT besar) → fungsi RPC bisa lebih efisien.
- Ingin batasi kolom yang terlihat → buat VIEW dengan subset kolom.

## 12. Contoh Fungsi RPC (Opsional)

Misal hitung total artikel per sumber:
```sql
CREATE OR REPLACE FUNCTION public.total_artikel_per_sumber()
RETURNS TABLE(nama_sumber text, jumlah bigint)
LANGUAGE sql AS $$
  SELECT s.nama_sumber, COUNT(a.id_artikel) AS jumlah
  FROM artikel a
  LEFT JOIN sumber_berita s ON a.id_sumber = s.id_sumber
  GROUP BY s.nama_sumber
  ORDER BY jumlah DESC;
$$;
```
Pemanggilan di Node:
```js
const { data, error } = await supabase.rpc('total_artikel_per_sumber');
```

## 13. Langkah Cepat Ringkas

1. Isi `SUPABASE_DB_URL` + `SUPABASE_URL` + kunci.
2. Import `schema.sql` & `dummy_data.sql`.
3. Jalankan server (pg minimal) → test endpoint.
4. (Opsional) Ganti model ke versi Supabase.
5. (Opsional) Aktifkan RLS + tulis policy.
6. Jalankan scraping + preprocessing + analisis.

---
Selesai. Anda sekarang siap menjalankan proyek dengan Supabase.
