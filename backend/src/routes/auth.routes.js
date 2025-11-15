// ====================================================================
// ROUTES: AUTENTIKASI
// ====================================================================

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth');

// POST /api/auth/login - Login
router.post('/login', AuthController.login);

// POST /api/auth/register - Register (opsional)
router.post('/register', AuthController.register);

// GET /api/auth/profile - Get profile (butuh token)
router.get('/profile', authenticateToken, AuthController.getProfile);

module.exports = router;
