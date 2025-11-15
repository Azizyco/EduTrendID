// ====================================================================
// SERVICE: SCRAPING BERITA
// ====================================================================
// Service untuk melakukan scraping berita dari berbagai sumber

const axios = require('axios');
const cheerio = require('cheerio');
const ArticleModel = require('../models/article.model');
const SourceModel = require('../models/source.model');
const LogModel = require('../models/log.model');

class ScrapingService {
  // Kata kunci lokasi untuk filter artikel
  static lokasiKeywords = [
    'yogyakarta', 'jogja', 'diy', 'd.i.y', 'istimewa yogyakarta',
    'sleman', 'bantul', 'gunungkidul', 'kulon progo', 'kulonprogo'
  ];

  // Fungsi untuk mengecek apakah teks mengandung kata kunci lokasi
  static containsLokasiKeyword(text) {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    return this.lokasiKeywords.some(keyword => lowerText.includes(keyword));
  }

  // Fungsi utama untuk scraping semua sumber aktif
  static async scrapeAllSources() {
    try {
      console.log('🔍 Memulai proses scraping...');
      
      // Ambil semua sumber yang aktif
      const sources = await SourceModel.findActive();
      
      if (sources.length === 0) {
        await LogModel.create('scrape', 'gagal', 'Tidak ada sumber berita aktif');
        return {
          success: false,
          message: 'Tidak ada sumber berita aktif',
          data: { totalBaru: 0, totalGagal: 0, details: [] }
        };
      }

      let totalBaru = 0;
      let totalGagal = 0;
      const details = [];

      // Scrape setiap sumber
      for (const source of sources) {
        try {
          console.log(`📰 Scraping: ${source.nama_sumber}`);
          const result = await this.scrapeSource(source);
          
          totalBaru += result.artikelBaru;
          details.push({
            sumber: source.nama_sumber,
            status: 'berhasil',
            artikelBaru: result.artikelBaru,
            artikelDuplikat: result.artikelDuplikat
          });

          console.log(`✅ ${source.nama_sumber}: ${result.artikelBaru} artikel baru`);
        } catch (error) {
          totalGagal++;
          details.push({
            sumber: source.nama_sumber,
            status: 'gagal',
            error: error.message
          });
          console.error(`❌ ${source.nama_sumber}: ${error.message}`);
        }
      }

      // Catat log
      const keterangan = `Total artikel baru: ${totalBaru}, Sumber berhasil: ${sources.length - totalGagal}, Sumber gagal: ${totalGagal}`;
      await LogModel.create('scrape', 'berhasil', keterangan);

      return {
        success: true,
        message: 'Scraping selesai',
        data: {
          totalBaru,
          totalGagal,
          details
        }
      };

    } catch (error) {
      console.error('Error dalam scrapeAllSources:', error);
      await LogModel.create('scrape', 'gagal', error.message);
      throw error;
    }
  }

  // Fungsi untuk scraping satu sumber berita
  static async scrapeSource(source) {
    try {
      // Request ke URL sumber
      const response = await axios.get(source.url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const html = response.data;
      const $ = cheerio.load(html);

      // ====================================================================
      // CATATAN PENTING:
      // Selector di bawah ini adalah CONTOH untuk struktur HTML umum.
      // Setiap portal berita memiliki struktur HTML yang berbeda.
      // Anda perlu menyesuaikan selector dengan portal berita yang sebenarnya.
      // ====================================================================

      const articles = [];
      let artikelBaru = 0;
      let artikelDuplikat = 0;

      // Contoh selector umum (sesuaikan dengan portal berita nyata)
      // Misal: <div class="article-card"> atau <article class="post">
      $('.article-card, .post-item, article').each((index, element) => {
        try {
          // Ekstrak data dari HTML (sesuaikan selector)
          const judul = $(element).find('.article-title, h2, h3').first().text().trim();
          const url = $(element).find('a').first().attr('href');
          const tanggal = $(element).find('.article-date, .post-date, time').first().text().trim();
          const isi = $(element).find('.article-excerpt, .post-excerpt, p').first().text().trim();

          // Validasi data
          if (!judul || !url) return;

          // Buat URL lengkap jika relative
          let fullUrl = url;
          if (url && !url.startsWith('http')) {
            const baseUrl = new URL(source.url).origin;
            fullUrl = baseUrl + (url.startsWith('/') ? url : '/' + url);
          }

          // Filter: hanya artikel yang mengandung kata kunci lokasi
          if (this.containsLokasiKeyword(judul) || this.containsLokasiKeyword(isi)) {
            articles.push({
              idSumber: source.id_sumber,
              judul,
              tanggal: tanggal || 'Tidak diketahui',
              isi: isi || judul, // Jika tidak ada excerpt, gunakan judul
              urlAsli: fullUrl,
              topik: 'Pendidikan' // Default topik
            });
          }
        } catch (err) {
          console.error('Error parsing artikel:', err.message);
        }
      });

      // Simpan artikel ke database
      for (const article of articles) {
        try {
          // Cek apakah artikel sudah ada (berdasarkan URL)
          const existing = await ArticleModel.findByUrl(article.urlAsli);
          
          if (!existing) {
            await ArticleModel.create(article);
            artikelBaru++;
          } else {
            artikelDuplikat++;
          }
        } catch (err) {
          console.error('Error menyimpan artikel:', err.message);
        }
      }

      return { artikelBaru, artikelDuplikat };

    } catch (error) {
      console.error(`Error scraping ${source.nama_sumber}:`, error.message);
      throw error;
    }
  }

  // Fungsi untuk scraping manual dengan URL custom (untuk testing)
  static async scrapeCustomUrl(url, namaSumber = 'Custom Source') {
    try {
      const tempSource = {
        id_sumber: null,
        nama_sumber: namaSumber,
        url: url
      };

      const result = await this.scrapeSource(tempSource);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ScrapingService;
