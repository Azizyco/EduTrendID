// ====================================================================
// MODEL: SUMBER BERITA
// ====================================================================
// Model untuk operasi CRUD pada tabel sumber_berita

const { query } = require('../config/database');

class SourceModel {
  // Mengambil semua sumber berita
  static async findAll() {
    const result = await query(
      'SELECT * FROM sumber_berita ORDER BY created_at DESC'
    );
    return result.rows;
  }

  // Mengambil sumber berita yang aktif saja
  static async findActive() {
    const result = await query(
      'SELECT * FROM sumber_berita WHERE status_aktif = true ORDER BY created_at DESC'
    );
    return result.rows;
  }

  // Mencari sumber berita berdasarkan ID
  static async findById(id) {
    const result = await query(
      'SELECT * FROM sumber_berita WHERE id_sumber = $1',
      [id]
    );
    return result.rows[0];
  }

  // Membuat sumber berita baru
  static async create(namaSumber, url, statusAktif = true) {
    const result = await query(
      'INSERT INTO sumber_berita (nama_sumber, url, status_aktif) VALUES ($1, $2, $3) RETURNING *',
      [namaSumber, url, statusAktif]
    );
    return result.rows[0];
  }

  // Update sumber berita
  static async update(id, namaSumber, url, statusAktif) {
    const result = await query(
      'UPDATE sumber_berita SET nama_sumber = $1, url = $2, status_aktif = $3 WHERE id_sumber = $4 RETURNING *',
      [namaSumber, url, statusAktif, id]
    );
    return result.rows[0];
  }

  // Hapus sumber berita
  static async delete(id) {
    const result = await query(
      'DELETE FROM sumber_berita WHERE id_sumber = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  // Menghitung total sumber berita
  static async count() {
    const result = await query(
      'SELECT COUNT(*) as total FROM sumber_berita'
    );
    return parseInt(result.rows[0].total);
  }
}

module.exports = SourceModel;
