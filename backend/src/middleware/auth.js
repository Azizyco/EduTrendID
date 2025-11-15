// ====================================================================
// MIDDLEWARE AUTENTIKASI
// ====================================================================
// Middleware untuk melindungi route yang membutuhkan autentikasi admin

const jwt = require('jsonwebtoken');

// Middleware untuk verifikasi token JWT
const authenticateToken = (req, res, next) => {
  // Ambil token dari header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  // Jika tidak ada token, kembalikan error 401 (Unauthorized)
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token tidak ditemukan. Silakan login terlebih dahulu.' 
    });
  }

  // Verifikasi token
  jwt.verify(token, process.env.JWT_SECRET || 'secret_key_edutrendid', (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Token tidak valid atau sudah kadaluarsa.' 
      });
    }

    // Jika token valid, simpan data user ke request untuk digunakan di controller
    req.user = user;
    next();
  });
};

// Middleware untuk verifikasi role admin
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Akses ditolak. Hanya admin yang dapat mengakses.' 
    });
  }
};

module.exports = {
  authenticateToken,
  requireAdmin
};
