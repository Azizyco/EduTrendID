// ====================================================================
// CONTROLLER: ANALYSIS (TF-IDF)
// ====================================================================

const TfidfService = require('../services/tfidf.service');
const TfidfModel = require('../models/tfidf.model');

class AnalysisController {
  // POST /api/analysis/analyze - Analisis TF-IDF
  static async analyze(req, res) {
    try {
      const { topN = 20 } = req.body;

      console.log('🚀 Memulai analisis TF-IDF dari controller...');
      
      const result = await TfidfService.analyzeTfidf(parseInt(topN));

      res.json(result);

    } catch (error) {
      console.error('Error analyze:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat analisis TF-IDF',
        error: error.message
      });
    }
  }

  // GET /api/analysis/tfidf-top - Ambil top-N kata TF-IDF
  static async getTopWords(req, res) {
    try {
      const { limit = 20, periode = null } = req.query;

      const topWords = await TfidfModel.getTopWords(parseInt(limit), periode);

      res.json({
        success: true,
        data: topWords
      });

    } catch (error) {
      console.error('Error getTopWords:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error.message
      });
    }
  }

  // GET /api/analysis/periods - Ambil daftar periode analisis
  static async getPeriods(req, res) {
    try {
      const periods = await TfidfModel.getPeriods();

      res.json({
        success: true,
        data: periods
      });

    } catch (error) {
      console.error('Error getPeriods:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error.message
      });
    }
  }

  // GET /api/analysis/stats - Ambil statistik analisis
  static async getStats(req, res) {
    try {
      const stats = await TfidfService.getStats();

      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Error getStats:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error.message
      });
    }
  }
}

module.exports = AnalysisController;
