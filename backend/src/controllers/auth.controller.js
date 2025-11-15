// ====================================================================
// CONTROLLER: AUTENTIKASI
// ====================================================================

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

class AuthController {
  // Login
  static async login(req, res) {
    try {
      const { username, password } = req.body;

      // Validasi input
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username dan password harus diisi'
        });
      }

      // Cari user berdasarkan username
      const user = await UserModel.findByUsername(username);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Username atau password salah'
        });
      }

      // Verifikasi password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Username atau password salah'
        });
      }

      // Buat JWT token
      const token = jwt.sign(
        {
          id: user.id_user,
          username: user.username,
          role: user.role
        },
        process.env.JWT_SECRET || 'secret_key_edutrendid',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Login berhasil',
        data: {
          token,
          user: {
            id: user.id_user,
            username: user.username,
            role: user.role
          }
        }
      });

    } catch (error) {
      console.error('Error login:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error.message
      });
    }
  }

  // Get user info (profil)
  static async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const user = await UserModel.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan'
        });
      }

      res.json({
        success: true,
        data: user
      });

    } catch (error) {
      console.error('Error getProfile:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error.message
      });
    }
  }

  // Register (opsional, untuk menambah admin baru)
  static async register(req, res) {
    try {
      const { username, password } = req.body;

      // Validasi input
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username dan password harus diisi'
        });
      }

      // Cek apakah username sudah ada
      const existingUser = await UserModel.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username sudah digunakan'
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Buat user baru
      const newUser = await UserModel.create(username, passwordHash);

      res.status(201).json({
        success: true,
        message: 'User berhasil dibuat',
        data: newUser
      });

    } catch (error) {
      console.error('Error register:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error.message
      });
    }
  }
}

module.exports = AuthController;
