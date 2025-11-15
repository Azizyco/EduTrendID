// ====================================================================
// SUPABASE REST CLIENT - VANILLA JAVASCRIPT
// ====================================================================
// File ini menunjukkan cara mengakses database Supabase langsung dari
// frontend (tanpa library @supabase/supabase-js) menggunakan Fetch API.
// Menggunakan endpoint PostgREST bawaan Supabase: /rest/v1/<nama_tabel>
//
// PERINGATAN:
// 1. Jangan pernah menaruh SERVICE ROLE KEY di frontend (hanya ANON KEY).
// 2. Pastikan Row Level Security (RLS) dan policy sudah diatur agar data
//    yang boleh diakses sesuai kebutuhan (default: jika RLS aktif tanpa policy -> blok).
// 3. Operasi sensitif (misal analisis berat, TF-IDF kalkulasi batch) tetap
//    sebaiknya dilakukan di backend server Anda (Node.js) untuk keamanan.
// 4. Direct fetch ini cocok untuk demo atau kebutuhan read-only sederhana.
//
// Dokumentasi PostgREST parameter:
// - Filtering: kolom=eq.value, kolom=like.*pattern*
// - Ordering: ?order=kolom.asc / kolom.desc
// - Range (pagination): gunakan header Range: rows=start-end
// - Prefer: return=representation agar POST/PUT mengembalikan data.
// ====================================================================

// GANTI dengan URL dan ANON KEY milik Anda
const SUPABASE_REST_URL = 'https://iwgbpotbpdxdtqtorvfm.supabase.co/rest/v1';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3Z2Jwb3RicGR4ZHRxdG9ydmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMTM4NTEsImV4cCI6MjA3ODc4OTg1MX0.7vWMzmwxjiVmhBTdm6OE8GuZ4QXn1F9G5G4VVh7ZuPc'; // JANGAN COMMIT KEY ASLI

// Header dasar untuk semua request
function baseHeaders() {
  return {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
    'Content-Type': 'application/json'
  };
}

// Utility fungsi umum fetch ke Supabase REST
async function supabaseRequest(path, { method = 'GET', params = null, body = null, range = null } = {}) {
  const url = new URL(SUPABASE_REST_URL + '/' + path);

  // Tambahkan query params jika ada (object -> URLSearchParams)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        url.searchParams.append(k, v);
      }
    });
  }

  const headers = baseHeaders();

  // Jika butuh pengembalian data setelah INSERT/UPDATE/DELETE
  if (method !== 'GET') {
    headers['Prefer'] = 'return=representation';
  }

  // Pagination manual dengan Range header (contoh: 0-9 untuk limit 10)
  if (range) {
    headers['Range'] = `rows=${range.start}-${range.end}`;
  }

  const response = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Supabase error ${response.status}: ${errText}`);
  }

  // Untuk GET bisa jadi ada header Content-Range
  const data = await response.json();
  return { data, response };
}

// ====================================================================
// OPERASI KHUSUS TABEL 'artikel'
// ====================================================================

// List artikel dengan optional filter dan pagination
// options: { page, limit, search, source, topic }
async function listArticles(options = {}) {
  const { page = 1, limit = 10, search = '', source = null, topic = null } = options;
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const params = {};
  if (search) {
    // ilike untuk case-insensitive LIKE
    params['judul'] = `ilike.*${search}*`;
  }
  if (source) {
    params['id_sumber'] = `eq.${source}`;
  }
  if (topic) {
    params['topik'] = `ilike.${topic}`;
  }

  const { data, response } = await supabaseRequest('artikel', {
    method: 'GET',
    params,
    range: { start, end }
  });

  // Ambil total dari header Content-Range jika tersedia
  const contentRange = response.headers.get('Content-Range');
  let total = null;
  if (contentRange) {
    // Format: rows 0-9/100
    const parts = contentRange.split('/');
    if (parts.length === 2) total = parseInt(parts[1], 10);
  }

  return { rows: data, total };
}

async function getArticleById(id) {
  const { data } = await supabaseRequest('artikel', {
    method: 'GET',
    params: { id_artikel: `eq.${id}` }
  });
  return data[0] || null;
}

async function createArticle({ idSumber, judul, tanggal, isi, urlAsli, topik }) {
  const body = {
    id_sumber: idSumber,
    judul,
    tanggal,
    isi,
    url_asli: urlAsli,
    topik
  };
  const { data } = await supabaseRequest('artikel', { method: 'POST', body });
  return data[0];
}

async function updateArticle(id, { judul, tanggal, isi, topik }) {
  const body = { judul, tanggal, isi, topik };
  const { data } = await supabaseRequest('artikel?id_artikel=eq.' + id, { method: 'PATCH', body });
  return data[0];
}

async function deleteArticle(id) {
  const { data } = await supabaseRequest('artikel?id_artikel=eq.' + id, { method: 'DELETE' });
  return data[0];
}

// ====================================================================
// CONTOH PEMAKAIAN (bisa dicoba di browser console setelah file ini dimuat)
// ====================================================================
/*
(async () => {
  try {
    const list = await listArticles({ page: 1, limit: 5, search: 'Yogyakarta' });
    console.log('List artikel:', list);

    const created = await createArticle({
      idSumber: 1,
      judul: 'Contoh Judul Baru',
      tanggal: '15 November 2025',
      isi: 'Isi artikel contoh',
      urlAsli: 'https://contoh.com/artikel-baru',
      topik: 'Demo'
    });
    console.log('Artikel dibuat:', created);

    const updated = await updateArticle(created.id_artikel, {
      judul: 'Judul Setelah Update',
      tanggal: '16 November 2025',
      isi: 'Isi diperbarui',
      topik: 'Demo-Update'
    });
    console.log('Artikel diupdate:', updated);

    const deleted = await deleteArticle(created.id_artikel);
    console.log('Artikel dihapus:', deleted);
  } catch (e) {
    console.error(e);
  }
})();
*/

// ====================================================================
// EXPORT (opsional jika ingin di-import modul bundler)
// ====================================================================
// window.SupabaseDirect = { listArticles, getArticleById, createArticle, updateArticle, deleteArticle };

// Jika tidak pakai bundler, Anda bisa panggil fungsi langsung di script lain
// setelah <script src="assets/js/supabaseDirect.js"></script> disertakan.

// ====================================================================
// CATATAN LANJUTAN:
// - Untuk tabel lain (sumber_berita, preprocessing, tfidf_kata, dll) duplikasi pola di atas.
// - Operasi JOIN kompleks tidak langsung didukung di PostgREST; buat VIEW atau fungsi RPC.
// - Pastikan policy RLS (jika aktif) mengizinkan SELECT/INSERT/UPDATE/DELETE sesuai kebutuhan.
// ====================================================================
