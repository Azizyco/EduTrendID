# 📖 PANDUAN LENGKAP SETUP DAN MENJALANKAN EDUTRENDID

## 🎯 Langkah-Langkah Setup

### LANGKAH 1: Install Prerequisites

1. **Install Node.js**
   - Download dari: https://nodejs.org/
   - Pilih versi LTS (Long Term Support)
   - Install dan restart komputer jika diminta
   - Verifikasi instalasi dengan buka PowerShell/CMD:
     ```bash
     node --version
     npm --version
     ```

2. **Install PostgreSQL**
   - Download dari: https://www.postgresql.org/download/windows/
   - Install dengan default settings
   - Catat password yang Anda buat untuk user `postgres`
   - Verifikasi instalasi:
     ```bash
     psql --version
     ```

3. **Install Git (opsional, untuk version control)**
   - Download dari: https://git-scm.com/

### LANGKAH 2: Setup Database PostgreSQL

1. **Buka pgAdmin** (biasanya sudah terinstall bersama PostgreSQL)
   
2. **Connect ke PostgreSQL server**
   - Masukkan password postgres yang Anda buat saat instalasi

3. **Buat Database Baru**
   - Klik kanan pada "Databases" → Create → Database
   - Nama: `edutrendid`
   - Klik Save

4. **Jalankan Script DDL**
   - Klik kanan pada database `edutrendid`
   - Pilih "Query Tool"
   - Buka file `database/schema.sql`
   - Copy seluruh isinya
   - Paste ke Query Tool
   - Klik tombol "Execute" (ikon play ▶)
   - Pastikan semua tabel berhasil dibuat

5. **Generate Password Hash untuk Admin**
   - Buka PowerShell/CMD
   - Masuk ke folder backend:
     ```bash
     cd "d:\VSCODE (Program)\NLP\Proyek Akhir\backend"
     ```
   - Jalankan:
     ```bash
     node generate-password.js
     ```
   - Copy hash yang dihasilkan

6. **Update Password Admin di Database**
   - Kembali ke pgAdmin Query Tool
   - Jalankan query:
     ```sql
     UPDATE users 
     SET password_hash = 'PASTE_HASH_DI_SINI'
     WHERE username = 'admin';
     ```
   - Replace `PASTE_HASH_DI_SINI` dengan hash dari langkah sebelumnya

### LANGKAH 3: Setup Backend

1. **Buka PowerShell/CMD**

2. **Masuk ke folder backend:**
   ```bash
   cd "d:\VSCODE (Program)\NLP\Proyek Akhir\backend"
   ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```
   Tunggu sampai proses instalasi selesai (bisa beberapa menit)

4. **Buat File .env:**
   ```bash
   copy .env.example .env
   ```

5. **Edit File .env:**
   - Buka file `.env` dengan text editor (Notepad, VS Code, dll)
   - Sesuaikan konfigurasi database:
     ```env
     PORT=3000
     NODE_ENV=development
     
     DB_HOST=localhost
     DB_PORT=5432
     DB_USER=postgres
     DB_PASSWORD=password_postgres_anda
     DB_NAME=edutrendid
     
     JWT_SECRET=edutrendid_secret_2025
     ```
   - Simpan file

6. **Jalankan Server Backend:**
   ```bash
   npm start
   ```
   
   Atau untuk development mode (auto-reload):
   ```bash
   npm run dev
   ```

7. **Verifikasi Server Berjalan:**
   - Anda akan melihat output seperti ini:
     ```
     ====================================
     🚀 EduTrendID Server Running
     📡 Port: 3000
     🌍 URL: http://localhost:3000
     ====================================
     ✅ Koneksi database berhasil
     ```
   - Jika ada error, cek konfigurasi database di `.env`

### LANGKAH 4: Setup Frontend

Frontend tidak perlu instalasi khusus karena hanya menggunakan HTML/CSS/JS murni.

**Cara 1: Buka Langsung di Browser**
1. Buka File Explorer
2. Navigasi ke: `d:\VSCODE (Program)\NLP\Proyek Akhir\frontend\public`
3. Double-click file `index.html`
4. Browser akan otomatis membuka halaman login

**Cara 2: Menggunakan VS Code Live Server (Recommended)**
1. Buka VS Code
2. Install extension "Live Server"
3. Buka folder `frontend`
4. Klik kanan pada `index.html`
5. Pilih "Open with Live Server"

**Cara 3: Akses Melalui Backend Server**
1. Backend sudah melayani static files
2. Buka browser
3. Akses: `http://localhost:3000/public/index.html`

### LANGKAH 5: Login dan Mulai Menggunakan

1. **Login**
   - Username: `admin`
   - Password: `admin123`
   - Klik "Masuk"

2. **Tambah Sumber Berita**
   - Klik menu "Sumber Berita"
   - Klik "Tambah Sumber Baru"
   - Masukkan nama dan URL portal berita
   - Klik "Simpan"

   **Contoh Sumber Berita:**
   - Nama: Detik Edu
   - URL: https://www.detik.com/edu (contoh)
   
   **PENTING:** URL dan selector HTML harus disesuaikan dengan portal berita yang sebenarnya!

3. **Scraping Berita**
   - Kembali ke Dashboard
   - Klik "Scrape Sekarang"
   - Tunggu proses selesai (bisa beberapa detik)
   - Cek log proses untuk melihat berapa artikel yang berhasil di-scrape

4. **Preprocessing Data**
   - Setelah scraping selesai
   - Klik "Preprocess Data"
   - Tunggu proses selesai

5. **Analisis TF-IDF**
   - Setelah preprocessing selesai
   - Klik "Analisis TF-IDF"
   - Tunggu proses selesai

6. **Lihat Hasil Analisis**
   - Klik menu "Analisis"
   - Lihat tabel dan grafik kata-kata penting

## 🔧 Troubleshooting

### Problem: Server tidak bisa connect ke database

**Solusi:**
1. Pastikan PostgreSQL service berjalan:
   - Buka "Services" di Windows (tekan Win+R, ketik `services.msc`)
   - Cari "postgresql-x64-xx" (xx = versi)
   - Pastikan Status = "Running"
   - Jika tidak, klik kanan → Start

2. Cek kredensial database di file `.env`
   - Password harus sesuai dengan password postgres Anda

3. Cek apakah database `edutrendid` sudah dibuat

### Problem: npm install gagal

**Solusi:**
1. Pastikan Anda punya koneksi internet
2. Coba hapus folder `node_modules` dan file `package-lock.json`
3. Jalankan lagi: `npm install`
4. Jika masih gagal, coba dengan:
   ```bash
   npm install --legacy-peer-deps
   ```

### Problem: Frontend tidak bisa akses API

**Solusi:**
1. Pastikan backend server sudah berjalan (cek terminal/PowerShell)
2. Buka browser console (F12) dan lihat error
3. Cek URL di `frontend/assets/js/utils.js`
   - Harus: `http://localhost:3000/api`
4. Cek CORS sudah diaktifkan di backend

### Problem: Login gagal

**Solusi:**
1. Pastikan password di database sudah di-hash dengan bcrypt
2. Coba generate password baru dengan `generate-password.js`
3. Update password di database
4. Coba login lagi

### Problem: Scraping tidak menghasilkan artikel

**Solusi:**
1. **Ini normal!** Selector HTML di code adalah contoh
2. Anda perlu menyesuaikan selector di `backend/src/services/scraping.service.js`
3. Langkah-langkah:
   - Buka portal berita yang akan di-scrape di browser
   - Klik kanan → Inspect Element
   - Lihat struktur HTML artikel
   - Catat class/id dari elemen judul, tanggal, isi, link
   - Update selector di code
   - Restart server

**Contoh:**
```javascript
// Jika struktur HTML portal berita:
// <div class="berita">
//   <h2 class="judul">Judul Berita</h2>
//   <span class="tanggal">2025-01-01</span>
//   <p class="isi">Isi berita...</p>
//   <a href="/artikel/123">Baca selengkapnya</a>
// </div>

// Maka selector-nya:
$('.berita').each((index, element) => {
  const judul = $(element).find('.judul').text().trim();
  const tanggal = $(element).find('.tanggal').text().trim();
  const isi = $(element).find('.isi').text().trim();
  const url = $(element).find('a').attr('href');
  // ...
});
```

## 📞 Bantuan Lebih Lanjut

Jika masih ada masalah:
1. Cek file `README.md` untuk informasi lebih detail
2. Cek console/terminal untuk error message
3. Google error message yang muncul
4. Tanya dosen/pembimbing Anda

## ✅ Checklist Sebelum Presentasi

- [ ] PostgreSQL berjalan dengan baik
- [ ] Database `edutrendid` sudah dibuat dan tabel sudah ada
- [ ] Backend server bisa dijalankan tanpa error
- [ ] Frontend bisa dibuka dan login berhasil
- [ ] Sudah ada minimal 1 sumber berita
- [ ] Selector HTML sudah disesuaikan dengan portal berita yang dipilih
- [ ] Scraping menghasilkan minimal beberapa artikel
- [ ] Preprocessing berhasil
- [ ] Analisis TF-IDF berhasil dan menghasilkan data
- [ ] Grafik bisa ditampilkan dengan baik
- [ ] Sudah paham cara kerja setiap fitur

Semoga berhasil dengan proyek akhir Anda! 🎉
