# 🎓 EduTrendID - Analisis Tren Isu Pendidikan Yogyakarta

Aplikasi web untuk scraping dan analisis berita pendidikan yang terkait dengan Yogyakarta/DIY menggunakan teknik **TF-IDF** untuk menampilkan kata-kata penting dari berita pendidikan.

## 📋 Deskripsi Proyek

EduTrendID adalah aplikasi berbasis web yang dirancang untuk:
- **Scraping** berita pendidikan dari berbagai portal berita online
- **Filtering** berita yang berkaitan dengan Yogyakarta/DIY
- **Preprocessing** teks menggunakan teknik NLP (case folding, cleaning, tokenizing, stopword removal, stemming)
- **Analisis TF-IDF** untuk mengidentifikasi kata-kata penting
- **Visualisasi** hasil analisis dalam bentuk tabel dan grafik

## 🛠️ Teknologi yang Digunakan

### Backend
- **Node.js** + **Express.js** - Server backend
- **PostgreSQL** - Database
- **pg** - PostgreSQL client untuk Node.js
- **Axios** + **Cheerio** - Web scraping
- **bcrypt** - Password hashing
- **jsonwebtoken** - Autentikasi JWT

### Frontend
- **HTML5** + **CSS3** + **JavaScript**
- **Bootstrap 5** - UI Framework
- **Chart.js** - Visualisasi grafik
- **Bootstrap Icons** - Icon library

## 📁 Struktur Folder

```
EduTrendID/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── source.model.js
│   │   │   ├── article.model.js
│   │   │   ├── preprocessing.model.js
│   │   │   ├── tfidf.model.js
│   │   │   └── log.model.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── source.controller.js
│   │   │   ├── article.controller.js
│   │   │   ├── processing.controller.js
│   │   │   └── analysis.controller.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── sources.routes.js
│   │   │   ├── articles.routes.js
│   │   │   ├── processing.routes.js
│   │   │   └── analysis.routes.js
│   │   ├── services/
│   │   │   ├── scraping.service.js
│   │   │   ├── preprocessing.service.js
│   │   │   └── tfidf.service.js
│   │   └── utils/
│   │       └── stopwords.js
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
├── frontend/
│   ├── public/
│   │   ├── index.html (login)
│   │   ├── dashboard.html
│   │   ├── articles.html
│   │   ├── analysis.html
│   │   └── sources.html
│   └── assets/
│       ├── css/
│       │   └── style.css
│       └── js/
│           └── utils.js
├── database/
│   └── schema.sql
└── README.md
```

## 🚀 Cara Instalasi dan Menjalankan

### 1. Prerequisites

Pastikan Anda sudah menginstall:
- **Node.js** (versi 16 atau lebih baru)
- **PostgreSQL** (versi 12 atau lebih baru)
- **npm** atau **yarn**

### 2. Setup Database

1. Buat database baru di PostgreSQL:
```sql
CREATE DATABASE edutrendid;
```

2. Jalankan skrip DDL untuk membuat tabel:
```bash
psql -U postgres -d edutrendid -f database/schema.sql
```

Atau bisa juga copy-paste isi file `database/schema.sql` ke pgAdmin atau DBeaver.

### 3. Setup Backend

1. Masuk ke folder backend:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Buat file `.env` dari `.env.example`:
```bash
copy .env.example .env
```

4. Edit file `.env` dan sesuaikan konfigurasi database:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=edutrendid
JWT_SECRET=your_secret_key
```

5. Jalankan server:
```bash
npm start
```

Atau untuk development mode (auto-reload):
```bash
npm run dev
```

Server akan berjalan di: `http://localhost:3000`

### 4. Setup Frontend

Frontend bisa langsung dibuka di browser dengan cara:

1. Buka file `frontend/public/index.html` di browser
2. Atau gunakan Live Server extension di VS Code
3. Atau akses melalui server backend (sudah ada static file serving)

Login default:
- **Username**: `admin`
- **Password**: `admin123`

## 📚 API Endpoints

### Autentikasi
- `POST /api/auth/login` - Login admin
- `POST /api/auth/register` - Register admin baru (opsional)
- `GET /api/auth/profile` - Get profile (butuh token)

### Sumber Berita
- `GET /api/sources` - Get semua sumber berita
- `GET /api/sources/:id` - Get sumber berita by ID
- `POST /api/sources` - Tambah sumber berita baru
- `PUT /api/sources/:id` - Update sumber berita
- `DELETE /api/sources/:id` - Hapus sumber berita

### Artikel
- `GET /api/articles` - Get semua artikel (dengan pagination & filter)
- `GET /api/articles/stats` - Get statistik artikel
- `GET /api/articles/:id` - Get artikel by ID
- `PUT /api/articles/:id` - Update artikel
- `DELETE /api/articles/:id` - Hapus artikel

### Processing
- `POST /api/processing/scrape` - Jalankan scraping
- `POST /api/processing/preprocess` - Jalankan preprocessing
- `GET /api/processing/logs` - Get log proses
- `GET /api/processing/logs/latest` - Get log terbaru

### Analysis
- `POST /api/analysis/analyze` - Jalankan analisis TF-IDF
- `GET /api/analysis/tfidf-top` - Get top-N kata TF-IDF
- `GET /api/analysis/periods` - Get daftar periode analisis
- `GET /api/analysis/stats` - Get statistik analisis

## 🔍 Cara Menggunakan Aplikasi

### 1. Login
- Buka `index.html` di browser
- Login dengan username: `admin`, password: `admin123`

### 2. Mengelola Sumber Berita
- Masuk ke menu **Sumber Berita**
- Tambah sumber berita baru dengan nama dan URL
- Aktifkan/nonaktifkan sumber sesuai kebutuhan

### 3. Scraping Berita
- Kembali ke **Dashboard**
- Klik tombol **"Scrape Sekarang"**
- Tunggu proses selesai
- Cek log proses untuk melihat hasil

### 4. Preprocessing Data
- Setelah scraping selesai
- Klik tombol **"Preprocess Data"**
- Proses ini akan membersihkan dan memproses teks artikel

### 5. Analisis TF-IDF
- Setelah preprocessing selesai
- Klik tombol **"Analisis TF-IDF"**
- Sistem akan menghitung nilai TF-IDF dan menyimpan top-N kata

### 6. Melihat Hasil Analisis
- Masuk ke menu **Analisis**
- Lihat tabel dan grafik kata-kata penting
- Filter berdasarkan periode jika diperlukan

### 7. Melihat Artikel
- Masuk ke menu **Artikel**
- Cari artikel berdasarkan judul
- Filter berdasarkan sumber
- Klik "Detail" untuk melihat isi lengkap artikel

## ⚠️ Catatan Penting

### 1. Web Scraping
- **Selector HTML** di file `scraping.service.js` adalah **CONTOH** dan perlu disesuaikan dengan struktur HTML portal berita yang sebenarnya
- Setiap portal berita memiliki struktur HTML yang berbeda-beda
- Pastikan mematuhi **Terms of Service** dari portal berita yang di-scrape
- Gunakan **user-agent** yang sesuai dan jangan terlalu sering scraping (rate limiting)

### 2. Preprocessing & TF-IDF
- **Stopwords** di file `stopwords.js` adalah daftar dasar dan bisa ditambahkan sesuai kebutuhan
- **Stemming** yang diimplementasikan adalah stemming sederhana, bukan Sastrawi
- Untuk hasil lebih baik, pertimbangkan menggunakan library seperti `sastrawi` atau `nlp-id-stemmer`
- Perhitungan TF-IDF adalah implementasi manual sederhana, bisa juga menggunakan library `natural`

### 3. Password Default
- Password default admin (`admin123`) di file `schema.sql` perlu **di-hash ulang** dengan bcrypt
- Untuk production, gunakan password yang lebih kuat dan aman

### 4. Security
- JWT Secret di `.env` harus diganti dengan string random yang aman
- Jangan commit file `.env` ke Git
- Untuk production, gunakan HTTPS dan environment variables yang lebih aman

## 🐛 Troubleshooting

### Server tidak bisa connect ke database
- Pastikan PostgreSQL sudah berjalan
- Cek kredensial database di file `.env`
- Cek apakah database `edutrendid` sudah dibuat

### Error saat scraping
- Cek koneksi internet
- Cek apakah URL sumber berita masih valid
- Sesuaikan selector HTML dengan struktur portal berita yang di-scrape

### Frontend tidak bisa akses API
- Pastikan backend server sudah berjalan
- Cek URL di `assets/js/utils.js` (default: `http://localhost:3000/api`)
- Pastikan CORS sudah diaktifkan di backend

## 📝 TODO / Pengembangan Selanjutnya

- [ ] Implementasi word cloud visualization
- [ ] Export hasil analisis ke CSV/Excel
- [ ] Scheduled scraping (cron job)
- [ ] Notifikasi email untuk hasil analisis
- [ ] Filter tanggal untuk artikel
- [ ] Kategorisasi otomatis artikel (topik)
- [ ] Dashboard statistik yang lebih detail
- [ ] Multi-user management
- [ ] API rate limiting
- [ ] Unit testing & integration testing

## 👨‍💻 Author

**Nama Anda**  
Proyek Akhir - Natural Language Processing  
[Nama Universitas/Institusi]  
Tahun 2025

## 📄 Lisensi

Proyek ini dibuat untuk keperluan akademik/tugas akhir.

---

Semoga proyek ini bermanfaat! Jika ada pertanyaan, silakan hubungi melalui email atau buat issue di repository ini.
