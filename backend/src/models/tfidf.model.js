// ====================================================================
// MODEL: TF-IDF
// ====================================================================
// Model untuk operasi pada tabel tfidf_kata

const { query } = require('../config/database');

class TfidfModel {
  // Menyimpan hasil analisis TF-IDF (batch insert)
  static async createBatch(dataArray, periode) {
    // Hapus data TF-IDF periode sebelumnya (opsional, bisa disesuaikan)
    await query('DELETE FROM tfidf_kata WHERE periode = $1', [periode]);

    // Insert batch menggunakan transaction
    const values = dataArray.map((item, index) => {
      const offset = index * 4;
      return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`;
    }).join(', ');

    const params = [];
    dataArray.forEach(item => {
      params.push(item.kata, item.nilaiTfidf, item.frekuensi, periode);
    });

    const queryText = `
      INSERT INTO tfidf_kata (kata, nilai_tfidf, frekuensi, periode) 
      VALUES ${values}
      RETURNING *
    `;

    const result = await query(queryText, params);
    return result.rows;
  }

  // Mengambil top-N kata berdasarkan nilai TF-IDF
  static async getTopWords(limit = 20, periode = null) {
    let queryText = `
      SELECT kata, nilai_tfidf, frekuensi, periode, created_at
      FROM tfidf_kata
    `;

    const params = [];
    if (periode) {
      queryText += ' WHERE periode = $1';
      params.push(periode);
    }

    queryText += ` ORDER BY nilai_tfidf DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await query(queryText, params);
    return result.rows;
  }

  // Mengambil semua kata TF-IDF dengan filter periode
  static async findAll(periode = null) {
    let queryText = 'SELECT * FROM tfidf_kata';
    const params = [];

    if (periode) {
      queryText += ' WHERE periode = $1';
      params.push(periode);
    }

    queryText += ' ORDER BY nilai_tfidf DESC';

    const result = await query(queryText, params);
    return result.rows;
  }

  // Mengambil daftar periode yang tersedia
  static async getPeriods() {
    const result = await query(
      `SELECT DISTINCT periode 
       FROM tfidf_kata 
       ORDER BY periode DESC`
    );
    return result.rows.map(row => row.periode);
  }

  // Menghitung total kata TF-IDF
  static async count(periode = null) {
    let queryText = 'SELECT COUNT(*) as total FROM tfidf_kata';
    const params = [];

    if (periode) {
      queryText += ' WHERE periode = $1';
      params.push(periode);
    }

    const result = await query(queryText, params);
    return parseInt(result.rows[0].total);
  }

  // Hapus data TF-IDF berdasarkan periode
  static async deleteByPeriod(periode) {
    const result = await query(
      'DELETE FROM tfidf_kata WHERE periode = $1 RETURNING *',
      [periode]
    );
    return result.rows;
  }
}

module.exports = TfidfModel;
