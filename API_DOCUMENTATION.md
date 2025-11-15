# 📡 DOKUMENTASI API ENDPOINT - EDUTRENDID

Base URL: `http://localhost:3000/api`

## 🔐 Autentikasi

Semua endpoint (kecuali login) membutuhkan JWT token dalam header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 1️⃣ AUTENTIKASI

### POST /auth/login
Login admin dan dapatkan JWT token

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "role": "admin"
    }
  }
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Username atau password salah"
}
```

---

### POST /auth/register
Register admin baru (opsional)

**Request Body:**
```json
{
  "username": "newadmin",
  "password": "password123"
}
```

---

### GET /auth/profile
Get profile user yang sedang login (butuh token)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id_user": 1,
    "username": "admin",
    "role": "admin",
    "created_at": "2025-11-15T10:00:00.000Z"
  }
}
```

---

## 2️⃣ SUMBER BERITA

### GET /sources
Ambil semua sumber berita

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id_sumber": 1,
      "nama_sumber": "Portal Berita A",
      "url": "https://example.com/pendidikan",
      "status_aktif": true,
      "created_at": "2025-11-15T10:00:00.000Z"
    }
  ]
}
```

---

### GET /sources/:id
Ambil sumber berita berdasarkan ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id_sumber": 1,
    "nama_sumber": "Portal Berita A",
    "url": "https://example.com/pendidikan",
    "status_aktif": true
  }
}
```

---

### POST /sources
Tambah sumber berita baru

**Request Body:**
```json
{
  "nama_sumber": "Portal Berita B",
  "url": "https://example2.com/education",
  "status_aktif": true
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Sumber berita berhasil ditambahkan",
  "data": {
    "id_sumber": 2,
    "nama_sumber": "Portal Berita B",
    "url": "https://example2.com/education",
    "status_aktif": true
  }
}
```

---

### PUT /sources/:id
Update sumber berita

**Request Body:**
```json
{
  "nama_sumber": "Portal Berita B Updated",
  "url": "https://example2.com/education",
  "status_aktif": false
}
```

---

### DELETE /sources/:id
Hapus sumber berita

**Response (200):**
```json
{
  "success": true,
  "message": "Sumber berita berhasil dihapus"
}
```

---

## 3️⃣ ARTIKEL

### GET /articles
Ambil semua artikel dengan pagination, search, dan filter

**Query Parameters:**
- `page` (default: 1) - Halaman
- `limit` (default: 10) - Jumlah item per halaman
- `search` (optional) - Cari di judul
- `source` (optional) - Filter by id_sumber
- `topic` (optional) - Filter by topik

**Example:**
```
GET /articles?page=1&limit=10&search=yogyakarta&source=1
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "id_artikel": 1,
        "judul": "UGM Membuka Beasiswa...",
        "tanggal": "15 November 2025",
        "isi": "Universitas Gadjah Mada...",
        "url_asli": "https://...",
        "topik": "Beasiswa",
        "nama_sumber": "Portal Berita A",
        "created_at": "2025-11-15T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10
    }
  }
}
```

---

### GET /articles/stats
Ambil statistik artikel

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalArtikel": 150,
    "totalSumber": 3,
    "artikelPerSumber": [
      {
        "nama_sumber": "Portal Berita A",
        "jumlah": "80"
      },
      {
        "nama_sumber": "Portal Berita B",
        "jumlah": "70"
      }
    ],
    "scrapingTerakhir": "2025-11-15T12:30:00.000Z"
  }
}
```

---

### GET /articles/:id
Ambil detail artikel berdasarkan ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id_artikel": 1,
    "judul": "UGM Membuka Beasiswa...",
    "tanggal": "15 November 2025",
    "isi": "Full content here...",
    "url_asli": "https://...",
    "topik": "Beasiswa",
    "nama_sumber": "Portal Berita A"
  }
}
```

---

### PUT /articles/:id
Update artikel (untuk edit manual)

**Request Body:**
```json
{
  "judul": "Updated title",
  "tanggal": "15 November 2025",
  "isi": "Updated content",
  "topik": "Updated topic"
}
```

---

### DELETE /articles/:id
Hapus artikel

---

## 4️⃣ PROCESSING

### POST /processing/scrape
Jalankan proses scraping berita

**Response (200):**
```json
{
  "success": true,
  "message": "Scraping selesai",
  "data": {
    "totalBaru": 15,
    "totalGagal": 0,
    "details": [
      {
        "sumber": "Portal Berita A",
        "status": "berhasil",
        "artikelBaru": 10,
        "artikelDuplikat": 5
      }
    ]
  }
}
```

---

### POST /processing/preprocess
Jalankan preprocessing teks

**Response (200):**
```json
{
  "success": true,
  "message": "Preprocessing selesai",
  "data": {
    "totalProcessed": 15,
    "totalFailed": 0
  }
}
```

---

### GET /processing/logs
Ambil log proses

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 50)
- `type` (optional) - Filter by jenis_proses: 'scrape', 'preprocess', 'analyze'

**Response (200):**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id_log": 1,
        "waktu": "2025-11-15T12:30:00.000Z",
        "jenis_proses": "scrape",
        "status": "berhasil",
        "keterangan": "Total artikel baru: 15"
      }
    ],
    "total": 100
  }
}
```

---

### GET /processing/logs/latest
Ambil log terbaru

**Query Parameters:**
- `limit` (default: 10)

---

## 5️⃣ ANALYSIS (TF-IDF)

### POST /analysis/analyze
Jalankan analisis TF-IDF

**Request Body:**
```json
{
  "topN": 20
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Analisis TF-IDF selesai",
  "data": {
    "totalDokumen": 50,
    "topN": 20,
    "periode": "2025-11",
    "topWords": [
      {
        "kata": "pendidikan",
        "nilaiTfidf": 0.567890,
        "frekuensi": 125
      }
    ]
  }
}
```

---

### GET /analysis/tfidf-top
Ambil top-N kata TF-IDF

**Query Parameters:**
- `limit` (default: 20) - Jumlah kata
- `periode` (optional) - Filter by periode (format: YYYY-MM)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "kata": "pendidikan",
      "nilai_tfidf": 0.567890,
      "frekuensi": 125,
      "periode": "2025-11",
      "created_at": "2025-11-15T13:00:00.000Z"
    },
    {
      "kata": "mahasiswa",
      "nilai_tfidf": 0.523456,
      "frekuensi": 98,
      "periode": "2025-11",
      "created_at": "2025-11-15T13:00:00.000Z"
    }
  ]
}
```

---

### GET /analysis/periods
Ambil daftar periode analisis yang tersedia

**Response (200):**
```json
{
  "success": true,
  "data": [
    "2025-11",
    "2025-10",
    "2025-09"
  ]
}
```

---

### GET /analysis/stats
Ambil statistik analisis

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalPeriods": 3,
    "periods": ["2025-11", "2025-10", "2025-09"],
    "latestPeriod": "2025-11",
    "topWords": [...]
  }
}
```

---

## 🔴 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Token tidak ditemukan. Silakan login terlebih dahulu."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Akses ditolak. Hanya admin yang dapat mengakses."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource tidak ditemukan"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Terjadi kesalahan pada server",
  "error": "Error details (only in development mode)"
}
```

---

## 📝 Notes

1. **Token Expiration**: JWT token berlaku selama 24 jam
2. **Rate Limiting**: Belum diimplementasikan (bisa ditambahkan untuk production)
3. **CORS**: Enabled untuk semua origin (development mode)
4. **Validation**: Input validation dilakukan di controller
5. **Transaction**: Database transaction digunakan untuk operasi batch

---

## 🧪 Testing dengan Postman

1. Import collection (bisa dibuat dari dokumentasi ini)
2. Set environment variable:
   - `base_url`: http://localhost:3000/api
   - `token`: [akan diisi setelah login]
3. Login dulu untuk dapatkan token
4. Copy token ke environment variable
5. Test endpoint lainnya

**Contoh Postman Request:**
```
POST http://localhost:3000/api/auth/login
Headers:
  Content-Type: application/json
Body (raw JSON):
{
  "username": "admin",
  "password": "admin123"
}
```

---

Dokumentasi ini mencakup semua endpoint yang tersedia di aplikasi EduTrendID. Untuk detail implementasi, lihat file controller di `backend/src/controllers/`.
