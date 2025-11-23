# EduTrendID - Web Scraping & NLP Analisis

## Deskripsi Singkat
Aplikasi ini digunakan untuk mengambil data teks artikel berita pendidikan dari web Harian Jogja, melakukan preprocessing (case folding, filtering, tokenisasi, stemming), analisis TF-IDF, dan visualisasi hasil analisis (word cloud, grafik frekuensi kata, kategori artikel). Backend menggunakan Node.js, frontend menggunakan HTML/CSS/JS murni.

## Fitur Utama
- Scraping artikel berita pendidikan dari web
- Preprocessing teks: case folding, filtering, tokenisasi, stopword removal, stemming Bahasa Indonesia
- Analisis TF-IDF: menampilkan 10–20 kata dengan bobot tertinggi
- Visualisasi: word cloud, grafik frekuensi kata
- Kategori artikel: pendidikan dasar, tinggi, vokasi

## Panduan Penggunaan

### 1. Instalasi
- Pastikan Node.js dan npm sudah terinstall
- Buka terminal di folder `backend`, jalankan:
  ```
  npm install
  npm install stopword sastrawijs cors axios cheerio express
  ```

### 2. Menjalankan Backend
- Di folder `backend`, jalankan:
  ```
  npm start
  ```
- Server berjalan di `http://localhost:3000`

### 3. Menjalankan Frontend
- Buka file `frontend/index.html` di browser (disarankan pakai Live Server atau buka langsung)

### 4. Cara Menggunakan
- Masukkan satu atau lebih URL artikel berita pendidikan pada form
- Klik tombol **Scrape**
- Hasil scraping, analisis TF-IDF, word cloud, grafik frekuensi kata, dan kategori artikel akan muncul di halaman

### 5. Troubleshooting
- Jika frontend gagal fetch ke backend, pastikan backend sudah berjalan dan CORS sudah diaktifkan
- Pastikan URL yang dimasukkan valid dan sesuai format artikel Harian Jogja

---

**Tim Pengembang:**
- Azizyco

**Lisensi:**
- MIT
