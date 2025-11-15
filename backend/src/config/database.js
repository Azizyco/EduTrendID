// ====================================================================
// KONFIGURASI DATABASE POSTGRESQL
// ====================================================================
// File ini berisi konfigurasi koneksi ke database PostgreSQL
// menggunakan library 'pg' (node-postgres)

const { Pool } = require('pg');
require('dotenv').config();

// Membuat connection pool untuk PostgreSQL
// Pool lebih efisien daripada client biasa karena dapat menggunakan kembali koneksi
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'edutrendid',
  max: 20,  // Maksimum 20 koneksi dalam pool
  idleTimeoutMillis: 30000,  // Timeout koneksi idle 30 detik
  connectionTimeoutMillis: 2000,  // Timeout koneksi 2 detik
});

// Event listener untuk mendeteksi error pada pool
pool.on('error', (err, client) => {
  console.error('Error tidak terduga pada client PostgreSQL:', err);
});

// Fungsi helper untuk menjalankan query dengan error handling
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Query executed:', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error executing query:', { text, error: error.message });
    throw error;
  }
};

// Fungsi untuk mengetes koneksi database
const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Koneksi database berhasil:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Koneksi database gagal:', error.message);
    return false;
  }
};

module.exports = {
  pool,
  query,
  testConnection
};
