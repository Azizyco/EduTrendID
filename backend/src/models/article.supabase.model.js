// ====================================================================
// MODEL: ARTIKEL (VERSI SUPABASE)
// ====================================================================
// Contoh adaptasi model artikel menggunakan '@supabase/supabase-js'.
// Ini ALTERNATIF dari article.model.js yang memakai 'pg'.
// Anda dapat memilih salah satu pendekatan:
// 1. Tetap gunakan article.model.js (raw SQL) -> fleksibel & performa
// 2. Gunakan file ini untuk operasi CRUD dasar jika nyaman dengan supabase-js
//
// Catatan:
// - Relasi table dapat di-select jika foreign key sudah terdaftar di Supabase.
//   Misal: select('*, sumber_berita(nama_sumber)')
// - Filtering, pagination manual dengan range(offset, end)
// - Untuk query kompleks (JOIN multi kondisi, agregasi berat) lebih baik tetap raw SQL.
// ====================================================================

const { supabase } = require('../config/supabaseClient');

class ArticleSupabaseModel {
  static async findAll(options = {}) {
    const { page = 1, limit = 10, search = '', source = null, topic = null } = options;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('artikel')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (search) {
      // Supabase: ilike = case-insensitive pattern
      query = query.ilike('judul', `%${search}%`);
    }
    if (source) {
      query = query.eq('id_sumber', source);
    }
    if (topic) {
      query = query.ilike('topik', topic);
    }

    const { data, error, count } = await query;
    if (error) throw new Error(error.message);
    return { rows: data, total: count };
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('artikel')
      .select('*')
      .eq('id_artikel', id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  static async findByUrl(url) {
    const { data, error } = await supabase
      .from('artikel')
      .select('*')
      .eq('url_asli', url)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data || null;
  }

  static async create(data) {
    const insertData = {
      id_sumber: data.idSumber,
      judul: data.judul,
      tanggal: data.tanggal,
      isi: data.isi,
      url_asli: data.urlAsli,
      topik: data.topik
    };
    const { data: rows, error } = await supabase
      .from('artikel')
      .insert(insertData)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return rows;
  }

  static async update(id, data) {
    const updateData = {
      judul: data.judul,
      tanggal: data.tanggal,
      isi: data.isi,
      topik: data.topik
    };
    const { data: rows, error } = await supabase
      .from('artikel')
      .update(updateData)
      .eq('id_artikel', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return rows;
  }

  static async delete(id) {
    const { data: rows, error } = await supabase
      .from('artikel')
      .delete()
      .eq('id_artikel', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return rows;
  }

  static async findUnprocessed() {
    // Untuk query LEFT JOIN seperti versi pg, Supabase perlu view atau raw SQL (RPC)
    // Contoh fallback: Ambil semua artikel lalu filter manual jika belum diproses.
    const { data: all, error } = await supabase
      .from('artikel')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw new Error(error.message);

    // Ambil id yang sudah dipreprocess
    const { data: processed, error: err2 } = await supabase
      .from('preprocessing')
      .select('id_artikel');
    if (err2) throw new Error(err2.message);

    const processedIds = new Set(processed.map(p => p.id_artikel));
    return all.filter(a => !processedIds.has(a.id_artikel));
  }

  static async getStats() {
    // Agregasi sederhana dapat dilakukan dengan RPC atau gunakan dua query terpisah
    const { data: totalRows, error: err1 } = await supabase
      .from('artikel')
      .select('id_artikel', { count: 'exact' });
    if (err1) throw new Error(err1.message);

    // Group by manual (ambil semua + reduce) - untuk dataset besar disarankan gunakan SQL view/RPC
    const { data: joined, error: err2 } = await supabase
      .from('artikel')
      .select('id_artikel,id_sumber');
    if (err2) throw new Error(err2.message);

    const { data: sumberRows, error: err3 } = await supabase
      .from('sumber_berita')
      .select('id_sumber,nama_sumber');
    if (err3) throw new Error(err3.message);

    const mapNama = new Map(sumberRows.map(s => [s.id_sumber, s.nama_sumber]));
    const countMap = new Map();
    joined.forEach(r => {
      const name = mapNama.get(r.id_sumber) || 'Tidak diketahui';
      countMap.set(name, (countMap.get(name) || 0) + 1);
    });

    const bySumber = Array.from(countMap.entries())
      .map(([nama_sumber, jumlah]) => ({ nama_sumber, jumlah }))
      .sort((a, b) => b.jumlah - a.jumlah);

    return {
      total: totalRows.length,
      bySumber
    };
  }
}

module.exports = ArticleSupabaseModel;
