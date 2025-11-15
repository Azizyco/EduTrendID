// ====================================================================
// MODEL: ARTIKEL
// ====================================================================
// Model untuk operasi CRUD pada tabel artikel

const { query } = require('../config/database');

class ArticleModel {
  // Mengambil semua artikel dengan pagination, search, dan filter
  static async findAll(options = {}) {
    const { page = 1, limit = 10, search = '', source = null, topic = null } = options;
    const offset = (page - 1) * limit;

    let queryText = `
      SELECT a.*, s.nama_sumber 
      FROM artikel a
      LEFT JOIN sumber_berita s ON a.id_sumber = s.id_sumber
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    // Filter berdasarkan search (judul)
    if (search) {
      queryText += ` AND LOWER(a.judul) LIKE LOWER($${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Filter berdasarkan sumber
    if (source) {
      queryText += ` AND a.id_sumber = $${paramIndex}`;
      params.push(source);
      paramIndex++;
    }

    // Filter berdasarkan topik
    if (topic) {
      queryText += ` AND LOWER(a.topik) = LOWER($${paramIndex})`;
      params.push(topic);
      paramIndex++;
    }

    // Order by created_at DESC
    queryText += ` ORDER BY a.created_at DESC`;

    // Pagination
    queryText += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await query(queryText, params);
    return result.rows;
  }

  // Menghitung total artikel (untuk pagination)
  static async count(options = {}) {
    const { search = '', source = null, topic = null } = options;

    let queryText = 'SELECT COUNT(*) as total FROM artikel WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (search) {
      queryText += ` AND LOWER(judul) LIKE LOWER($${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (source) {
      queryText += ` AND id_sumber = $${paramIndex}`;
      params.push(source);
      paramIndex++;
    }

    if (topic) {
      queryText += ` AND LOWER(topik) = LOWER($${paramIndex})`;
      params.push(topic);
      paramIndex++;
    }

    const result = await query(queryText, params);
    return parseInt(result.rows[0].total);
  }

  // Mencari artikel berdasarkan ID
  static async findById(id) {
    const result = await query(
      `SELECT a.*, s.nama_sumber 
       FROM artikel a
       LEFT JOIN sumber_berita s ON a.id_sumber = s.id_sumber
       WHERE a.id_artikel = $1`,
      [id]
    );
    return result.rows[0];
  }

  // Mencari artikel berdasarkan URL (untuk cek duplikasi)
  static async findByUrl(url) {
    const result = await query(
      'SELECT * FROM artikel WHERE url_asli = $1',
      [url]
    );
    return result.rows[0];
  }

  // Membuat artikel baru
  static async create(data) {
    const { idSumber, judul, tanggal, isi, urlAsli, topik } = data;
    const result = await query(
      `INSERT INTO artikel (id_sumber, judul, tanggal, isi, url_asli, topik) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [idSumber, judul, tanggal, isi, urlAsli, topik]
    );
    return result.rows[0];
  }

  // Update artikel
  static async update(id, data) {
    const { judul, tanggal, isi, topik } = data;
    const result = await query(
      `UPDATE artikel 
       SET judul = $1, tanggal = $2, isi = $3, topik = $4
       WHERE id_artikel = $5 
       RETURNING *`,
      [judul, tanggal, isi, topik, id]
    );
    return result.rows[0];
  }

  // Hapus artikel
  static async delete(id) {
    const result = await query(
      'DELETE FROM artikel WHERE id_artikel = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  // Mengambil artikel yang belum dipreprocess
  static async findUnprocessed() {
    const result = await query(
      `SELECT a.* 
       FROM artikel a
       LEFT JOIN preprocessing p ON a.id_artikel = p.id_artikel
       WHERE p.id_artikel IS NULL
       ORDER BY a.created_at ASC`
    );
    return result.rows;
  }

  // Mengambil semua artikel yang sudah dipreprocess
  static async findProcessed() {
    const result = await query(
      `SELECT a.*, p.teks_bersih, p.token 
       FROM artikel a
       INNER JOIN preprocessing p ON a.id_artikel = p.id_artikel
       ORDER BY a.created_at DESC`
    );
    return result.rows;
  }

  // Statistik artikel
  static async getStats() {
    const totalResult = await query('SELECT COUNT(*) as total FROM artikel');
    const bySourceResult = await query(
      `SELECT s.nama_sumber, COUNT(a.id_artikel) as jumlah
       FROM artikel a
       LEFT JOIN sumber_berita s ON a.id_sumber = s.id_sumber
       GROUP BY s.nama_sumber
       ORDER BY jumlah DESC`
    );
    
    return {
      total: parseInt(totalResult.rows[0].total),
      bySumber: bySourceResult.rows
    };
  }
}

module.exports = ArticleModel;
