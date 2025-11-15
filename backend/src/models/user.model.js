// ====================================================================
// MODEL: USER
// ====================================================================
// Model untuk operasi CRUD pada tabel users

const { query } = require('../config/database');

class UserModel {
  // Mencari user berdasarkan username
  static async findByUsername(username) {
    const result = await query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0];
  }

  // Mencari user berdasarkan ID
  static async findById(id) {
    const result = await query(
      'SELECT id_user, username, role, created_at FROM users WHERE id_user = $1',
      [id]
    );
    return result.rows[0];
  }

  // Membuat user baru (untuk registrasi admin)
  static async create(username, passwordHash, role = 'admin') {
    const result = await query(
      'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id_user, username, role',
      [username, passwordHash, role]
    );
    return result.rows[0];
  }

  // Mengambil semua user (tanpa password)
  static async findAll() {
    const result = await query(
      'SELECT id_user, username, role, created_at FROM users ORDER BY created_at DESC'
    );
    return result.rows;
  }
}

module.exports = UserModel;
