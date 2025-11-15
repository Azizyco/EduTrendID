// ====================================================================
// CONTROLLER: SUMBER BERITA
// ====================================================================

const SourceModel = require('../models/source.model');

class SourceController {
  // Get semua sumber berita
  static async getAllSources(req, res) {
    try {
      const sources = await SourceModel.findAll();

      res.json({
        success: true,
        data: sources
      });

    } catch (error) {
      console.error('Error getAllSources:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error.message
      });
    }
  }

  // Get sumber berita berdasarkan ID
  static async getSourceById(req, res) {
    try {
      const { id } = req.params;
      const source = await SourceModel.findById(id);

      if (!source) {
        return res.status(404).json({
          success: false,
          message: 'Sumber berita tidak ditemukan'
        });
      }

      res.json({
        success: true,
        data: source
      });

    } catch (error) {
      console.error('Error getSourceById:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error.message
      });
    }
  }

  // Tambah sumber berita baru
  static async createSource(req, res) {
    try {
      const { nama_sumber, url, status_aktif } = req.body;

      // Validasi input
      if (!nama_sumber || !url) {
        return res.status(400).json({
          success: false,
          message: 'Nama sumber dan URL harus diisi'
        });
      }

      const newSource = await SourceModel.create(
        nama_sumber,
        url,
        status_aktif !== undefined ? status_aktif : true
      );

      res.status(201).json({
        success: true,
        message: 'Sumber berita berhasil ditambahkan',
        data: newSource
      });

    } catch (error) {
      console.error('Error createSource:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error.message
      });
    }
  }

  // Update sumber berita
  static async updateSource(req, res) {
    try {
      const { id } = req.params;
      const { nama_sumber, url, status_aktif } = req.body;

      // Validasi input
      if (!nama_sumber || !url) {
        return res.status(400).json({
          success: false,
          message: 'Nama sumber dan URL harus diisi'
        });
      }

      const updatedSource = await SourceModel.update(
        id,
        nama_sumber,
        url,
        status_aktif !== undefined ? status_aktif : true
      );

      if (!updatedSource) {
        return res.status(404).json({
          success: false,
          message: 'Sumber berita tidak ditemukan'
        });
      }

      res.json({
        success: true,
        message: 'Sumber berita berhasil diupdate',
        data: updatedSource
      });

    } catch (error) {
      console.error('Error updateSource:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error.message
      });
    }
  }

  // Hapus sumber berita
  static async deleteSource(req, res) {
    try {
      const { id } = req.params;

      const deletedSource = await SourceModel.delete(id);

      if (!deletedSource) {
        return res.status(404).json({
          success: false,
          message: 'Sumber berita tidak ditemukan'
        });
      }

      res.json({
        success: true,
        message: 'Sumber berita berhasil dihapus',
        data: deletedSource
      });

    } catch (error) {
      console.error('Error deleteSource:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error.message
      });
    }
  }
}

module.exports = SourceController;
