// ====================================================================
// MODEL: LOG PROSES
// ====================================================================
// Model untuk operasi pada tabel log_proses

const { query } = require('../config/database');

class LogModel {
  // Membuat log baru
  static async create(jenisProses, status, keterangan = '') {
    const result = await query(
      `INSERT INTO log_proses (jenis_proses, status, keterangan) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [jenisProses, status, keterangan]
    );
    return result.rows[0];
  }

  // Mengambil semua log dengan pagination
  static async findAll(page = 1, limit = 50) {
    const offset = (page - 1) * limit;
    const result = await query(
      `SELECT * FROM log_proses 
       ORDER BY waktu DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  }

  // Mengambil log berdasarkan jenis proses
  static async findByType(jenisProses, limit = 20) {
    const result = await query(
      `SELECT * FROM log_proses 
       WHERE jenis_proses = $1 
       ORDER BY waktu DESC 
       LIMIT $2`,
      [jenisProses, limit]
    );
    return result.rows;
  }

  // Mengambil log terbaru
  static async getLatest(limit = 10) {
    const result = await query(
      `SELECT * FROM log_proses 
       ORDER BY waktu DESC 
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  }

  // Mengambil log terakhir dari jenis proses tertentu
  static async getLastByType(jenisProses) {
    const result = await query(
      `SELECT * FROM log_proses 
       WHERE jenis_proses = $1 
       ORDER BY waktu DESC 
       LIMIT 1`,
      [jenisProses]
    );
    return result.rows[0];
  }

  // Menghitung total log
  static async count() {
    const result = await query(
      'SELECT COUNT(*) as total FROM log_proses'
    );
    return parseInt(result.rows[0].total);
  }

  // Hapus log lama (untuk maintenance)
  static async deleteOlderThan(days = 30) {
    const result = await query(
      `DELETE FROM log_proses 
       WHERE waktu < NOW() - INTERVAL '${days} days' 
       RETURNING *`
    );
    return result.rows;
  }
}

module.exports = LogModel;
