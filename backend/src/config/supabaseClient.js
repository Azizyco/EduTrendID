// ====================================================================
// SUPABASE CLIENT (OPSIONAL)
// ====================================================================
// File ini hanya dipakai jika Anda memilih pendekatan menggunakan
// library '@supabase/supabase-js'. Untuk migrasi minimal (tanpa refactor
// besar), Anda tidak perlu file ini dan cukup gunakan 'pg' dengan
// connection string Supabase (sudah di-handle di database.js).
//
// Kapan memakai supabase-js?
// - Ingin manfaatkan fitur Storage, Auth, Realtime
// - Ingin query builder yang lebih sederhana untuk operasi CRUD dasar
// - Ingin memanggil fungsi (RPC) yang dibuat di database
//
// Pastikan menambahkan SUPABASE_ANON_KEY atau SERVICE_ROLE_KEY pada .env
// SERVICE ROLE KEY hanya untuk server (privileged), JANGAN expose ke frontend.
// ====================================================================

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || '';
// Gunakan SERVICE_ROLE_KEY agar bisa melakukan operasi penuh pada server side.
// Jika hanya butuh operasi publik sesuai RLS, bisa pakai ANON KEY.
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('⚠️ Supabase client belum dikonfigurasi: SUPABASE_URL / KEY kosong.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

module.exports = { supabase };
