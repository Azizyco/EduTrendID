// ====================================================================
// ROUTES: PROCESSING (Scraping & Preprocessing)
// ====================================================================

const express = require('express');
const router = express.Router();
const ProcessingController = require('../controllers/processing.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Semua route ini butuh autentikasi admin
router.use(authenticateToken);
router.use(requireAdmin);

// POST /api/processing/scrape - Scraping berita
router.post('/scrape', ProcessingController.scrape);

// POST /api/processing/preprocess - Preprocessing teks
router.post('/preprocess', ProcessingController.preprocess);

// GET /api/processing/logs - Ambil log proses
router.get('/logs', ProcessingController.getLogs);

// GET /api/processing/logs/latest - Ambil log terbaru
router.get('/logs/latest', ProcessingController.getLatestLogs);

module.exports = router;
