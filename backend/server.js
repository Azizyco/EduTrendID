// ====================================================================
// SERVER UTAMA - EXPRESS.JS
// ====================================================================
// File utama untuk menjalankan server backend EduTrendID

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import konfigurasi database
const { testConnection } = require('./src/config/database');

// Import routes
const authRoutes = require('./src/routes/auth.routes');
const sourcesRoutes = require('./src/routes/sources.routes');
const articlesRoutes = require('./src/routes/articles.routes');
const processingRoutes = require('./src/routes/processing.routes');
const analysisRoutes = require('./src/routes/analysis.routes');

// Inisialisasi Express
const app = express();
const PORT = process.env.PORT || 3000;

// ====================================================================
// MIDDLEWARE
// ====================================================================

// CORS - mengizinkan request dari frontend
app.use(cors());

// Body parser - untuk membaca request body dalam format JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware sederhana
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Static files - melayani file frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// ====================================================================
// ROUTES / ENDPOINT API
// ====================================================================

// Route utama
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Selamat datang di EduTrendID API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      sources: '/api/sources',
      articles: '/api/articles',
      processing: '/api/processing',
      analysis: '/api/analysis'
    }
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/sources', sourcesRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/processing', processingRoutes);
app.use('/api/analysis', analysisRoutes);

// ====================================================================
// ERROR HANDLING
// ====================================================================

// Handler untuk route yang tidak ditemukan (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan pada server',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// ====================================================================
// START SERVER
// ====================================================================

const startServer = async () => {
  try {
    // Tes koneksi database terlebih dahulu
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ Gagal menghubungkan ke database. Server tidak dijalankan.');
      process.exit(1);
    }

    // Jalankan server
    app.listen(PORT, () => {
      console.log('====================================');
      console.log('🚀 EduTrendID Server Running');
      console.log(`📡 Port: ${PORT}`);
      console.log(`🌍 URL: http://localhost:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('====================================');
    });
  } catch (error) {
    console.error('❌ Error saat memulai server:', error);
    process.exit(1);
  }
};

// Jalankan server
startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal diterima: menutup server...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal diterima: menutup server...');
  process.exit(0);
});

module.exports = app;
