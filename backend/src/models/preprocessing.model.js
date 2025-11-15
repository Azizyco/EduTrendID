// ====================================================================
// MODEL: PREPROCESSING
// ====================================================================
// Model untuk operasi pada tabel preprocessing

const { query } = require('../config/database');

class PreprocessingModel {
  // Menyimpan hasil preprocessing
  static async create(idArtikel, teksBersih, token) {
    const result = await query(
      `INSERT INTO preprocessing (id_artikel, teks_bersih, token) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (id_artikel) DO UPDATE 
       SET teks_bersih = $2, token = $3, created_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [idArtikel, teksBersih, token]
    );
    return result.rows[0];
  }

  // Mengambil preprocessing berdasarkan ID artikel
  static async findByArticleId(idArtikel) {
    const result = await query(
      'SELECT * FROM preprocessing WHERE id_artikel = $1',
      [idArtikel]
    );
    return result.rows[0];
  }

  // Mengambil semua preprocessing
  static async findAll() {
    const result = await query(
      `SELECT p.*, a.judul, a.tanggal
       FROM preprocessing p
       INNER JOIN artikel a ON p.id_artikel = a.id_artikel
       ORDER BY p.created_at DESC`
    );
    return result.rows;
  }

  // Menghitung total preprocessing
  static async count() {
    const result = await query(
      'SELECT COUNT(*) as total FROM preprocessing'
    );
    return parseInt(result.rows[0].total);
  }

  // Hapus preprocessing berdasarkan ID artikel
  static async deleteByArticleId(idArtikel) {
    const result = await query(
      'DELETE FROM preprocessing WHERE id_artikel = $1 RETURNING *',
      [idArtikel]
    );
    return result.rows[0];
  }
}

module.exports = PreprocessingModel;
