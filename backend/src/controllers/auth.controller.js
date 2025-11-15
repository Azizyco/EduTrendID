// ====================================================================
// CONTROLLER: AUTENTIKASI
// ====================================================================

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const UserModel = require('../models/user.model');

// ====================================================================
// OPSI TIDAK DIREKOMENDASIKAN: PASSWORD PLAIN TEXT
// --------------------------------------------------------------------
// Jika USE_PLAIN_PASSWORD=true di .env maka register akan menyimpan
// password apa adanya (TIDAK DI-HASH) dan login akan melakukan
// perbandingan langsung dengan timingSafeEqual.
// Peringatan: Menyimpan password tanpa hash sangat berbahaya.
// Hanya gunakan untuk demo lokal yang benar-benar sementara.
// ====================================================================

function safeEqual(a, b) {
  // Bandingkan string secara timing-safe untuk meminimalkan side-channel
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  try {
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

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
      let isValidPassword = false;
      if (user.password_hash && user.password_hash.startsWith('$2')) {
        // Format bcrypt normal
        isValidPassword = await bcrypt.compare(password, user.password_hash);
      } else {
        // Fallback (plain text) - TIDAK DIREKOMENDASIKAN
        isValidPassword = safeEqual(password, user.password_hash);
      }

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
      const { username, password } = req.body; // masih gunakan 'username' sebagai field pengenal

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

      // Pilih mode hashing atau plain sesuai env
      const usePlain = process.env.USE_PLAIN_PASSWORD === 'true';
      const passwordHash = usePlain ? password : await bcrypt.hash(password, 10);
      if (usePlain) {
        console.warn('⚠️ USE_PLAIN_PASSWORD=true -> password disimpan TANPA hash. Ini tidak aman.');
      }

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
