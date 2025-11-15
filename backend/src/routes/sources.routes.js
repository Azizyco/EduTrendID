// ====================================================================
// ROUTES: SUMBER BERITA
// ====================================================================

const express = require('express');
const router = express.Router();
const SourceController = require('../controllers/source.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Semua route ini butuh autentikasi admin
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/sources - Ambil semua sumber berita
router.get('/', SourceController.getAllSources);

// GET /api/sources/:id - Ambil sumber berita berdasarkan ID
router.get('/:id', SourceController.getSourceById);

// POST /api/sources - Tambah sumber berita baru
router.post('/', SourceController.createSource);

// PUT /api/sources/:id - Update sumber berita
router.put('/:id', SourceController.updateSource);

// DELETE /api/sources/:id - Hapus sumber berita
router.delete('/:id', SourceController.deleteSource);

module.exports = router;
