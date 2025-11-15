// ====================================================================
// CONTROLLER: PROCESSING (Scraping & Preprocessing)
// ====================================================================

const ScrapingService = require('../services/scraping.service');
const PreprocessingService = require('../services/preprocessing.service');
const LogModel = require('../models/log.model');

class ProcessingController {
  // POST /api/processing/scrape - Scraping berita
  static async scrape(req, res) {
    try {
      console.log('🚀 Memulai scraping dari controller...');
      
      const result = await ScrapingService.scrapeAllSources();

      res.json(result);

    } catch (error) {
      console.error('Error scrape:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat scraping',
        error: error.message
      });
    }
  }

  // POST /api/processing/preprocess - Preprocessing teks
  static async preprocess(req, res) {
    try {
      console.log('🚀 Memulai preprocessing dari controller...');
      
      const result = await PreprocessingService.preprocessAllArticles();

      res.json(result);

    } catch (error) {
      console.error('Error preprocess:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat preprocessing',
        error: error.message
      });
    }
  }

  // GET /api/processing/logs - Ambil log proses
  static async getLogs(req, res) {
    try {
      const { page = 1, limit = 50, type = null } = req.query;

      let logs;
      if (type) {
        logs = await LogModel.findByType(type, parseInt(limit));
      } else {
        logs = await LogModel.findAll(parseInt(page), parseInt(limit));
      }

      const total = await LogModel.count();

      res.json({
        success: true,
        data: {
          logs,
          total
        }
      });

    } catch (error) {
      console.error('Error getLogs:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error.message
      });
    }
  }

  // GET /api/processing/logs/latest - Ambil log terbaru
  static async getLatestLogs(req, res) {
    try {
      const { limit = 10 } = req.query;
      
      const logs = await LogModel.getLatest(parseInt(limit));

      res.json({
        success: true,
        data: logs
      });

    } catch (error) {
      console.error('Error getLatestLogs:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error.message
      });
    }
  }
}

module.exports = ProcessingController;
