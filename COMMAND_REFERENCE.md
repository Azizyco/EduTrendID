# 💻 COMMAND REFERENCE - EDUTRENDID

Kumpulan command yang sering digunakan untuk menjalankan dan mengelola aplikasi EduTrendID.

---

## 📦 NPM Commands

### Backend Development

```bash
# Masuk ke folder backend
cd backend

# Install semua dependencies
npm install

# Install dependency tertentu
npm install express
npm install pg axios cheerio

# Jalankan server (production mode)
npm start

# Jalankan server (development mode dengan auto-reload)
npm run dev

# Uninstall dependency
npm uninstall package-name

# Update semua dependencies
npm update

# Cek outdated packages
npm outdated

# Generate password hash
node generate-password.js
```

---

## 🐘 PostgreSQL Commands

### Akses PostgreSQL CLI

```bash
# Login ke PostgreSQL (Windows)
psql -U postgres

# Login ke database tertentu
psql -U postgres -d edutrendid

# Keluar dari psql
\q
```

### Database Management

```sql
-- Lihat semua database
\l

-- Lihat semua tabel di database
\dt

-- Describe struktur tabel
\d nama_tabel

-- Buat database baru
CREATE DATABASE edutrendid;

-- Connect ke database
\c edutrendid

-- Drop database (HATI-HATI!)
DROP DATABASE edutrendid;

-- Jalankan file SQL
\i C:/path/to/schema.sql
```

### Query Utilities

```sql
-- Lihat semua users
SELECT * FROM users;

-- Lihat total artikel
SELECT COUNT(*) FROM artikel;

-- Lihat artikel terbaru
SELECT judul, tanggal FROM artikel ORDER BY created_at DESC LIMIT 10;

-- Lihat top kata TF-IDF
SELECT kata, nilai_tfidf FROM tfidf_kata ORDER BY nilai_tfidf DESC LIMIT 20;

-- Lihat log terbaru
SELECT * FROM log_proses ORDER BY waktu DESC LIMIT 10;

-- Backup query
SELECT * FROM artikel WHERE id_sumber = 1;

-- Clear tabel (HATI-HATI!)
TRUNCATE TABLE tfidf_kata;
DELETE FROM artikel WHERE id_artikel > 10;
```

---

## 🔧 VS Code Commands

### Terminal

```bash
# Buka terminal baru
Ctrl + Shift + `

# Split terminal
Ctrl + Shift + 5

# Tutup terminal
Ctrl + D
```

### Shortcuts

```
Ctrl + P        - Quick Open File
Ctrl + Shift + P - Command Palette
Ctrl + B        - Toggle Sidebar
Ctrl + `        - Toggle Terminal
F5              - Start Debugging
Ctrl + S        - Save File
Ctrl + F        - Find in File
Ctrl + H        - Replace in File
Ctrl + Shift + F - Find in Files
```

---

## 🌐 Browser Testing

### Open URLs

```bash
# Backend API Root
http://localhost:3000

# Frontend Login
http://localhost:3000/public/index.html

# Dashboard
http://localhost:3000/public/dashboard.html

# Test API (di browser)
http://localhost:3000/api
```

### Browser DevTools

```
F12             - Open DevTools
Ctrl + Shift + I - Open DevTools
Ctrl + Shift + J - Open Console
Ctrl + Shift + C - Inspect Element
```

---

## 🐛 Debugging Commands

### Check Process

```bash
# Windows PowerShell
# Cek proses Node.js yang berjalan
Get-Process node

# Kill process Node.js
Stop-Process -Name node -Force

# Cek port yang digunakan
netstat -ano | findstr :3000

# Kill process di port tertentu
taskkill /PID [PID_NUMBER] /F
```

### Check PostgreSQL Service

```bash
# Cek status service PostgreSQL (Windows)
Get-Service postgresql*

# Start service
Start-Service postgresql-x64-14

# Stop service
Stop-Service postgresql-x64-14

# Restart service
Restart-Service postgresql-x64-14
```

---

## 📊 Database Backup & Restore

### Backup Database

```bash
# Backup seluruh database
pg_dump -U postgres edutrendid > backup.sql

# Backup tabel tertentu
pg_dump -U postgres -t artikel edutrendid > backup_artikel.sql

# Backup dengan format custom
pg_dump -U postgres -Fc edutrendid > backup.dump
```

### Restore Database

```bash
# Restore dari SQL file
psql -U postgres edutrendid < backup.sql

# Restore dari custom format
pg_restore -U postgres -d edutrendid backup.dump
```

---

## 🧪 Testing API dengan cURL

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

### Get Articles (dengan token)

```bash
curl -X GET http://localhost:3000/api/articles ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Scrape

```bash
curl -X POST http://localhost:3000/api/processing/scrape ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -H "Content-Type: application/json"
```

---

## 📝 Git Commands (untuk version control)

```bash
# Init git repo
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Check status
git status

# View history
git log

# Create branch
git branch feature-name

# Switch branch
git checkout feature-name

# Merge branch
git merge feature-name

# Push to remote
git push origin main

# Pull from remote
git pull origin main

# Clone repository
git clone https://github.com/username/repo.git
```

---

## 🔍 Troubleshooting Commands

### Node.js

```bash
# Cek versi Node.js
node --version
node -v

# Cek versi npm
npm --version
npm -v

# Clear npm cache
npm cache clean --force

# Reinstall node_modules
rmdir /s node_modules
del package-lock.json
npm install
```

### PostgreSQL

```bash
# Cek versi PostgreSQL
psql --version

# Test koneksi
psql -U postgres -c "SELECT version();"

# Cek lokasi data directory
psql -U postgres -c "SHOW data_directory;"

# Restart PostgreSQL (Windows)
net stop postgresql-x64-14
net start postgresql-x64-14
```

### Logs

```bash
# View Node.js logs (jika ada)
type logs\error.log

# View PostgreSQL logs
# Location: C:\Program Files\PostgreSQL\14\data\log\
```

---

## 🚀 Production Deployment

### Build & Deploy

```bash
# Set environment to production
$env:NODE_ENV="production"

# Install production dependencies only
npm install --production

# Start with PM2 (jika diinstall)
pm2 start server.js --name edutrendid

# View PM2 logs
pm2 logs edutrendid

# Restart app
pm2 restart edutrendid

# Stop app
pm2 stop edutrendid
```

---

## 📦 Database Migration (untuk update schema)

```sql
-- Backup terlebih dahulu!
-- Kemudian jalankan ALTER TABLE commands

-- Contoh: Tambah kolom
ALTER TABLE artikel ADD COLUMN kategori VARCHAR(100);

-- Contoh: Hapus kolom
ALTER TABLE artikel DROP COLUMN kategori;

-- Contoh: Rename kolom
ALTER TABLE artikel RENAME COLUMN topik TO kategori;

-- Contoh: Modify kolom
ALTER TABLE artikel ALTER COLUMN judul TYPE VARCHAR(500);

-- Contoh: Add index
CREATE INDEX idx_artikel_kategori ON artikel(kategori);
```

---

## 🔐 Security Commands

### Generate Secret Key

```bash
# Generate random string untuk JWT_SECRET (PowerShell)
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

### Hash Password

```bash
# Gunakan script generate-password.js
node generate-password.js
```

---

## 📊 Performance Monitoring

### Check System Resources

```bash
# PowerShell
# CPU usage
Get-Process node | Select-Object CPU, PM, ProcessName

# Memory usage
Get-Process node | Select-Object WorkingSet, ProcessName

# Disk usage
Get-PSDrive C
```

### Database Performance

```sql
-- Cek ukuran database
SELECT pg_size_pretty(pg_database_size('edutrendid'));

-- Cek ukuran tabel
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Cek index yang tidak terpakai
SELECT * FROM pg_stat_user_indexes WHERE idx_scan = 0;
```

---

## 🎯 Quick Start Commands

### First Time Setup

```bash
# 1. Setup database
psql -U postgres -c "CREATE DATABASE edutrendid;"
psql -U postgres -d edutrendid -f database/schema.sql

# 2. Setup backend
cd backend
npm install
copy .env.example .env
# Edit .env dengan text editor

# 3. Generate password
node generate-password.js
# Copy hash dan update di database

# 4. Start server
npm run dev

# 5. Open frontend
# Buka browser: http://localhost:3000/public/index.html
```

### Daily Development

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Database monitoring
psql -U postgres -d edutrendid

# Terminal 3: Testing/debugging
# Run tests, cURL commands, etc
```

---

## 📚 Resources

- **Node.js Docs**: https://nodejs.org/docs
- **Express.js Docs**: https://expressjs.com
- **PostgreSQL Docs**: https://www.postgresql.org/docs
- **npm Docs**: https://docs.npmjs.com

---

Simpan file ini untuk referensi cepat saat development! 🚀
