// ====================================================================
// ROUTES: ARTIKEL
// ====================================================================

const express = require('express');
const router = express.Router();
const ArticleController = require('../controllers/article.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Semua route ini butuh autentikasi admin
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/articles - Ambil semua artikel (dengan pagination & filter)
router.get('/', ArticleController.getAllArticles);

// GET /api/articles/stats - Ambil statistik artikel
router.get('/stats', ArticleController.getStats);

// GET /api/articles/:id - Ambil artikel berdasarkan ID
router.get('/:id', ArticleController.getArticleById);

// PUT /api/articles/:id - Update artikel
router.put('/:id', ArticleController.updateArticle);

// DELETE /api/articles/:id - Hapus artikel
router.delete('/:id', ArticleController.deleteArticle);

module.exports = router;
