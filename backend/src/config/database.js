// ====================================================================
// KONFIGURASI DATABASE POSTGRESQL
// ====================================================================
// File ini berisi konfigurasi koneksi ke database PostgreSQL
// menggunakan library 'pg' (node-postgres)

const { Pool } = require('pg');
require('dotenv').config();

// ====================================================================
// MIGRASI KE SUPABASE (OPSIONAL)
// ====================================================================
// Supabase menyediakan database PostgreSQL terkelola. Ada dua pendekatan:
// 1. PENDekatan MINIMAL: Tetap gunakan library 'pg' dan cukup ganti kredensial
//    dengan yang diberikan Supabase (host, password, database, port, ssl).
// 2. PENDekatan ALTERNATIF: Menggunakan '@supabase/supabase-js' untuk query builder
//    dan fitur tambahan (auth, storage, dll). Untuk operasi SQL kompleks tetap
//    lebih fleksibel memakai 'pg'.
// File ini mengimplementasikan pendekatan minimal agar perubahan kode lain
// tetap sedikit. Jika variabel SUPABASE_DB_URL ada, maka akan memakai itu.

// Catatan penting Supabase:
// - Selalu aktifkan SSL saat koneksi (rejectUnauthorized: false)
// - Jangan expose SERVICE ROLE KEY ke frontend (hanya di server)
// - Dummy data dapat di-import via SQL Editor Supabase atau psql remote.

// Membuat connection pool untuk PostgreSQL
// Pool lebih efisien daripada client biasa karena dapat menggunakan kembali koneksi
// Jika disediakan connection string langsung dari Supabase (format: postgres://...)
// maka gunakan itu. Jika tidak, fallback ke variabel DB_* lokal.
const useSupabaseUrl = !!process.env.SUPABASE_DB_URL;

const poolConfig = useSupabaseUrl
  ? {
      connectionString: process.env.SUPABASE_DB_URL,
      ssl: { rejectUnauthorized: false }, // Supabase mewajibkan SSL
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'edutrendid',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000
    };

const pool = new Pool(poolConfig);

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
    console.log('✅ Koneksi database berhasil:', result.rows[0].now, useSupabaseUrl ? '(Supabase)' : '(Local/Postgres)');
    return true;
  } catch (error) {
    // Logging debug tambahan agar mudah diagnosa saat gagal koneksi
    console.error('❌ Koneksi database gagal:', error.message);
    // Tampilkan ringkas config (tanpa password / key sensitif)
    try {
      const safeConfig = useSupabaseUrl
        ? { using: 'SUPABASE_DB_URL', length: process.env.SUPABASE_DB_URL ? process.env.SUPABASE_DB_URL.length : 0 }
        : {
            host: poolConfig.host,
            port: poolConfig.port,
            database: poolConfig.database,
            user: poolConfig.user
          };
      console.error('🔍 Konfigurasi yang dipakai (sanitized):', safeConfig);
    } catch (e) {
      console.error('Gagal menampilkan konfigurasi aman:', e.message);
    }
    console.error('🔁 Tips perbaikan cepat:');
    console.error('- Pastikan file .env ada di direktori backend dan memuat variabel yang benar');
    console.error('- Jika pakai PostgreSQL lokal: service harus berjalan & kredensial benar');
    console.error('- Jika pakai Supabase: isi SUPABASE_DB_URL lengkap (postgres://...) dan aktifkan SSL');
    console.error('- Cek firewall/antivirus yang memblokir koneksi');
    return false;
  }
};

module.exports = {
  pool,
  query,
  testConnection
};
