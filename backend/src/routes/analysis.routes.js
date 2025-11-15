// ====================================================================
// ROUTES: ANALYSIS (TF-IDF)
// ====================================================================

const express = require('express');
const router = express.Router();
const AnalysisController = require('../controllers/analysis.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Semua route ini butuh autentikasi admin
router.use(authenticateToken);
router.use(requireAdmin);

// POST /api/analysis/analyze - Analisis TF-IDF
router.post('/analyze', AnalysisController.analyze);

// GET /api/analysis/tfidf-top - Ambil top-N kata TF-IDF
router.get('/tfidf-top', AnalysisController.getTopWords);

// GET /api/analysis/periods - Ambil daftar periode analisis
router.get('/periods', AnalysisController.getPeriods);

// GET /api/analysis/stats - Ambil statistik analisis
router.get('/stats', AnalysisController.getStats);

module.exports = router;
