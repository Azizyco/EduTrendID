# 📂 STRUKTUR LENGKAP PROYEK EDUTRENDID

```
d:\VSCODE (Program)\NLP\Proyek Akhir\
│
├── 📁 backend/                              # Backend Node.js + Express
│   ├── 📁 src/
│   │   ├── 📁 config/
│   │   │   └── 📄 database.js               # Konfigurasi koneksi PostgreSQL
│   │   │
│   │   ├── 📁 middleware/
│   │   │   └── 📄 auth.js                   # Middleware autentikasi JWT
│   │   │
│   │   ├── 📁 models/
│   │   │   ├── 📄 user.model.js             # Model tabel users
│   │   │   ├── 📄 source.model.js           # Model tabel sumber_berita
│   │   │   ├── 📄 article.model.js          # Model tabel artikel
│   │   │   ├── 📄 preprocessing.model.js    # Model tabel preprocessing
│   │   │   ├── 📄 tfidf.model.js            # Model tabel tfidf_kata
│   │   │   └── 📄 log.model.js              # Model tabel log_proses
│   │   │
│   │   ├── 📁 controllers/
│   │   │   ├── 📄 auth.controller.js        # Controller login/register
│   │   │   ├── 📄 source.controller.js      # Controller sumber berita
│   │   │   ├── 📄 article.controller.js     # Controller artikel
│   │   │   ├── 📄 processing.controller.js  # Controller scraping & preprocessing
│   │   │   └── 📄 analysis.controller.js    # Controller analisis TF-IDF
│   │   │
│   │   ├── 📁 routes/
│   │   │   ├── 📄 auth.routes.js            # Routes autentikasi
│   │   │   ├── 📄 sources.routes.js         # Routes sumber berita
│   │   │   ├── 📄 articles.routes.js        # Routes artikel
│   │   │   ├── 📄 processing.routes.js      # Routes processing
│   │   │   └── 📄 analysis.routes.js        # Routes analisis
│   │   │
│   │   ├── 📁 services/
│   │   │   ├── 📄 scraping.service.js       # Service web scraping
│   │   │   ├── 📄 preprocessing.service.js  # Service text preprocessing
│   │   │   └── 📄 tfidf.service.js          # Service TF-IDF calculation
│   │   │
│   │   └── 📁 utils/
│   │       └── 📄 stopwords.js              # Daftar stopwords Bahasa Indonesia
│   │
│   ├── 📄 server.js                         # Entry point server
│   ├── 📄 package.json                      # Dependencies & scripts
│   ├── 📄 .env.example                      # Contoh environment variables
│   ├── 📄 .gitignore                        # Git ignore file
│   └── 📄 generate-password.js              # Utility generate password hash
│
├── 📁 frontend/                             # Frontend HTML/CSS/JS
│   ├── 📁 public/
│   │   ├── 📄 index.html                    # Halaman login
│   │   ├── 📄 dashboard.html                # Halaman dashboard admin
│   │   ├── 📄 articles.html                 # Halaman daftar artikel
│   │   ├── 📄 analysis.html                 # Halaman analisis TF-IDF
│   │   └── 📄 sources.html                  # Halaman sumber berita
│   │
│   └── 📁 assets/
│       ├── 📁 css/
│       │   └── 📄 style.css                 # Custom CSS styling
│       └── 📁 js/
│           └── 📄 utils.js                  # Utility functions (API, auth, etc)
│
├── 📁 database/
│   └── 📄 schema.sql                        # DDL script untuk PostgreSQL
│
├── 📄 README.md                             # Dokumentasi lengkap proyek
└── 📄 PANDUAN_SETUP.md                      # Panduan step-by-step setup

```

## 📊 DATABASE SCHEMA

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────┐
│    users    │     │  sumber_berita  │     │   artikel    │
├─────────────┤     ├─────────────────┤     ├──────────────┤
│ id_user PK  │     │ id_sumber PK    │────<│ id_artikel PK│
│ username    │     │ nama_sumber     │     │ id_sumber FK │
│ password    │     │ url             │     │ judul        │
│ role        │     │ status_aktif    │     │ tanggal      │
└─────────────┘     └─────────────────┘     │ isi          │
                                             │ url_asli     │
                                             │ topik        │
                                             └──────────────┘
                                                    │
                                                    │
                                             ┌──────┴───────┐
                                             │              │
                                    ┌────────▼──────┐  ┌───▼──────────┐
                                    │ preprocessing │  │  tfidf_kata  │
                                    ├───────────────┤  ├──────────────┤
                                    │ id_preprocess │  │ id_tfidf PK  │
                                    │ id_artikel FK │  │ kata         │
                                    │ teks_bersih   │  │ nilai_tfidf  │
                                    │ token         │  │ frekuensi    │
                                    └───────────────┘  │ periode      │
                                                       └──────────────┘

                    ┌──────────────┐
                    │  log_proses  │
                    ├──────────────┤
                    │ id_log PK    │
                    │ waktu        │
                    │ jenis_proses │
                    │ status       │
                    │ keterangan   │
                    └──────────────┘
```

## 🔄 FLOW SISTEM

```
1. LOGIN
   └─> Frontend (index.html) 
       └─> POST /api/auth/login 
           └─> auth.controller.js 
               └─> user.model.js 
                   └─> Database

2. SCRAPING
   └─> Frontend (dashboard.html) - Tombol "Scrape Sekarang"
       └─> POST /api/processing/scrape
           └─> processing.controller.js
               └─> scraping.service.js
                   ├─> source.model.js (ambil sumber aktif)
                   ├─> axios + cheerio (scraping HTML)
                   ├─> article.model.js (simpan artikel)
                   └─> log.model.js (catat log)

3. PREPROCESSING
   └─> Frontend (dashboard.html) - Tombol "Preprocess Data"
       └─> POST /api/processing/preprocess
           └─> processing.controller.js
               └─> preprocessing.service.js
                   ├─> article.model.js (ambil artikel belum diproses)
                   ├─> Proses: lowercase, cleaning, tokenizing, stopword removal
                   └─> preprocessing.model.js (simpan hasil)

4. ANALISIS TF-IDF
   └─> Frontend (dashboard.html) - Tombol "Analisis TF-IDF"
       └─> POST /api/analysis/analyze
           └─> analysis.controller.js
               └─> tfidf.service.js
                   ├─> article.model.js (ambil artikel yang sudah dipreprocess)
                   ├─> Hitung TF-IDF
                   └─> tfidf.model.js (simpan top-N kata)

5. VISUALISASI
   └─> Frontend (analysis.html)
       └─> GET /api/analysis/tfidf-top
           └─> analysis.controller.js
               └─> tfidf.model.js
                   └─> Return data JSON
                       └─> Chart.js (render grafik)
```

## 🎯 FITUR UTAMA

### 1. Autentikasi ✅
- Login dengan JWT
- Middleware protection untuk semua API
- Session management di localStorage

### 2. Scraping ✅
- Multi-source scraping
- Filter artikel berkaitan Yogyakarta/DIY
- Duplikasi check berdasarkan URL
- Logging semua proses

### 3. Preprocessing ✅
- Case folding (lowercase)
- Cleaning (hapus angka, simbol, URL)
- Tokenizing (split by space)
- Stopword removal (daftar stopwords Indonesia)
- Stemming sederhana

### 4. Analisis TF-IDF ✅
- Perhitungan TF-IDF manual
- Top-N kata dengan nilai tertinggi
- Multiple periode support
- Frekuensi kata tracking

### 5. Dashboard ✅
- Statistik real-time
- Quick action buttons
- Log proses terbaru
- Responsive design

### 6. Manajemen Artikel ✅
- List dengan pagination
- Search by judul
- Filter by sumber
- Detail modal view

### 7. Visualisasi ✅
- Tabel top kata TF-IDF
- Bar chart (Chart.js)
- Progress bar untuk nilai TF-IDF
- Word cloud placeholder

### 8. Manajemen Sumber ✅
- CRUD sumber berita
- Status aktif/non-aktif
- URL management

## 🛠️ TEKNOLOGI

### Backend
- **Runtime**: Node.js v16+
- **Framework**: Express.js v4.18
- **Database**: PostgreSQL v12+
- **ORM/Query**: pg (node-postgres)
- **Auth**: JWT + bcrypt
- **Scraping**: axios + cheerio
- **Environment**: dotenv

### Frontend
- **HTML5** - Structure
- **CSS3** + **Bootstrap 5** - Styling
- **Vanilla JavaScript** - Logic
- **Chart.js** - Visualization
- **Bootstrap Icons** - Icons
- **Fetch API** - HTTP requests

### Database
- **PostgreSQL** - Relational database
- **6 Tables** - users, sumber_berita, artikel, preprocessing, tfidf_kata, log_proses
- **Foreign Keys** - Relational integrity
- **Indexes** - Query optimization

## 📝 CATATAN IMPLEMENTASI

1. **Web Scraping**
   - Selector HTML di code adalah CONTOH
   - Harus disesuaikan dengan portal berita yang sebenarnya
   - Setiap portal memiliki struktur HTML berbeda

2. **NLP Processing**
   - Stopwords list adalah dasar, bisa ditambah
   - Stemming sederhana, bukan Sastrawi
   - Bisa upgrade dengan library nlp-id

3. **TF-IDF Calculation**
   - Implementasi manual (bukan library)
   - Mudah dipahami untuk pembelajaran
   - Bisa diganti dengan library 'natural' jika ingin

4. **Security**
   - JWT untuk autentikasi
   - bcrypt untuk password hashing
   - Input validation di controller
   - CORS enabled untuk development

5. **Scalability**
   - Connection pooling untuk database
   - Error handling di semua layer
   - Logging untuk debugging
   - Modular architecture (MVC pattern)

## 🎓 COCOK UNTUK

✅ Tugas Akhir S1/D3
✅ Proyek NLP Dasar
✅ Pembelajaran Web Scraping
✅ Pembelajaran Full-Stack JavaScript
✅ Portfolio Project

---

**Total File:** ~35 files
**Total Lines of Code:** ~5000+ LOC
**Development Time:** ~1-2 minggu
**Difficulty Level:** Intermediate

Semoga bermanfaat untuk proyek akhir Anda! 🚀
