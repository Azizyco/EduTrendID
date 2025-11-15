// ====================================================================
// CONTROLLER: ARTIKEL
// ====================================================================

const ArticleModel = require('../models/article.model');
const SourceModel = require('../models/source.model');
const LogModel = require('../models/log.model');

class ArticleController {
  // Get semua artikel dengan pagination, search, dan filter
  static async getAllArticles(req, res) {
    try {
      const { page = 1, limit = 10, search = '', source = null, topic = null } = req.query;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        source,
        topic
      };

      const articles = await ArticleModel.findAll(options);
      const total = await ArticleModel.count(options);
      const totalPages = Math.ceil(total / options.limit);

      res.json({
        success: true,
        data: {
          articles,
          pagination: {
            currentPage: options.page,
            totalPages,
            totalItems: total,
            itemsPerPage: options.limit
          }
        }
      });

    } catch (error) {
      console.error('Error getAllArticles:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error.message
      });
    }
  }

  // Get artikel berdasarkan ID
  static async getArticleById(req, res) {
    try {
      const { id } = req.params;
      const article = await ArticleModel.findById(id);

      if (!article) {
        return res.status(404).json({
          success: false,
          message: 'Artikel tidak ditemukan'
        });
      }

      res.json({
        success: true,
        data: article
      });

    } catch (error) {
      console.error('Error getArticleById:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error.message
      });
    }
  }

  // Get statistik artikel
  static async getStats(req, res) {
    try {
      const stats = await ArticleModel.getStats();
      const totalSources = await SourceModel.count();
      const lastLog = await LogModel.getLastByType('scrape');

      res.json({
        success: true,
        data: {
          totalArtikel: stats.total,
          totalSumber: totalSources,
          artikelPerSumber: stats.bySumber,
          scrapingTerakhir: lastLog ? lastLog.waktu : null
        }
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

  // Update artikel (untuk edit manual)
  static async updateArticle(req, res) {
    try {
      const { id } = req.params;
      const { judul, tanggal, isi, topik } = req.body;

      if (!judul || !isi) {
        return res.status(400).json({
          success: false,
          message: 'Judul dan isi harus diisi'
        });
      }

      const updatedArticle = await ArticleModel.update(id, {
        judul,
        tanggal,
        isi,
        topik
      });

      if (!updatedArticle) {
        return res.status(404).json({
          success: false,
          message: 'Artikel tidak ditemukan'
        });
      }

      res.json({
        success: true,
        message: 'Artikel berhasil diupdate',
        data: updatedArticle
      });

    } catch (error) {
      console.error('Error updateArticle:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error.message
      });
    }
  }

  // Hapus artikel
  static async deleteArticle(req, res) {
    try {
      const { id } = req.params;

      const deletedArticle = await ArticleModel.delete(id);

      if (!deletedArticle) {
        return res.status(404).json({
          success: false,
          message: 'Artikel tidak ditemukan'
        });
      }

      res.json({
        success: true,
        message: 'Artikel berhasil dihapus',
        data: deletedArticle
      });

    } catch (error) {
      console.error('Error deleteArticle:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error.message
      });
    }
  }
}

module.exports = ArticleController;
