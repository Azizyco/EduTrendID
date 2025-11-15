// ====================================================================
// SERVICE: TEXT PREPROCESSING
// ====================================================================
// Service untuk melakukan preprocessing teks (cleaning, tokenizing, stopword removal)

const ArticleModel = require('../models/article.model');
const PreprocessingModel = require('../models/preprocessing.model');
const LogModel = require('../models/log.model');
const { stopwordsSet } = require('../utils/stopwords');

class PreprocessingService {
  // Fungsi utama untuk preprocessing semua artikel yang belum diproses
  static async preprocessAllArticles() {
    try {
      console.log('🔧 Memulai preprocessing...');
      
      // Ambil artikel yang belum dipreprocess
      const articles = await ArticleModel.findUnprocessed();
      
      if (articles.length === 0) {
        await LogModel.create('preprocess', 'berhasil', 'Tidak ada artikel baru untuk diproses');
        return {
          success: true,
          message: 'Tidak ada artikel baru yang perlu diproses',
          data: { totalProcessed: 0 }
        };
      }

      let totalProcessed = 0;
      let totalFailed = 0;

      // Proses setiap artikel
      for (const article of articles) {
        try {
          const preprocessed = await this.preprocessText(article.isi);
          
          // Simpan hasil preprocessing
          await PreprocessingModel.create(
            article.id_artikel,
            preprocessed.teksBersih,
            preprocessed.token
          );

          totalProcessed++;
          console.log(`✅ Artikel diproses: ${article.judul.substring(0, 50)}...`);
        } catch (error) {
          totalFailed++;
          console.error(`❌ Error preprocessing artikel ${article.id_artikel}:`, error.message);
        }
      }

      // Catat log
      const keterangan = `Total artikel diproses: ${totalProcessed}, Gagal: ${totalFailed}`;
      await LogModel.create('preprocess', 'berhasil', keterangan);

      return {
        success: true,
        message: 'Preprocessing selesai',
        data: {
          totalProcessed,
          totalFailed
        }
      };

    } catch (error) {
      console.error('Error dalam preprocessAllArticles:', error);
      await LogModel.create('preprocess', 'gagal', error.message);
      throw error;
    }
  }

  // Fungsi untuk preprocessing satu teks
  static async preprocessText(text) {
    try {
      // 1. Case Folding (lowercase)
      let processedText = text.toLowerCase();

      // 2. Cleaning (hapus angka, tanda baca, simbol)
      // Hapus URL
      processedText = processedText.replace(/https?:\/\/[^\s]+/g, '');
      
      // Hapus email
      processedText = processedText.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '');
      
      // Hapus angka
      processedText = processedText.replace(/\d+/g, '');
      
      // Hapus tanda baca dan simbol (kecuali spasi)
      processedText = processedText.replace(/[^\w\s]/g, ' ');
      
      // Hapus whitespace berlebih
      processedText = processedText.replace(/\s+/g, ' ').trim();

      // 3. Tokenizing (split berdasarkan spasi)
      let tokens = processedText.split(' ').filter(token => token.length > 0);

      // 4. Stopword Removal
      tokens = tokens.filter(token => !stopwordsSet.has(token));

      // 5. Stemming Sederhana (opsional)
      // Ini adalah stemming SANGAT sederhana, bukan Sastrawi
      // Hanya menghapus beberapa akhiran umum
      tokens = tokens.map(token => this.simpleStemming(token));

      // Filter token yang terlalu pendek (< 3 karakter)
      tokens = tokens.filter(token => token.length >= 3);

      // Gabungkan token menjadi string (dipisah spasi)
      const tokenString = tokens.join(' ');

      return {
        teksBersih: processedText,
        token: tokenString,
        tokenArray: tokens
      };

    } catch (error) {
      console.error('Error dalam preprocessText:', error);
      throw error;
    }
  }

  // Fungsi stemming sederhana (bukan Sastrawi)
  // CATATAN: Ini hanya contoh stemming sangat sederhana
  // Untuk hasil lebih baik, gunakan library seperti "sastrawi" atau "nlp-id-stemmer"
  static simpleStemming(word) {
    // Daftar akhiran yang akan dihapus (urutan penting)
    const suffixes = [
      'nya', 'ku', 'mu', 'lah', 'kah', 'tah', 'pun',
      'an', 'kan', 'i',
      'el', 'em', 'er',
      'men', 'mem', 'me',
      'di', 'ke', 'ter', 'pe', 'ber', 'per', 'se'
    ];

    let stemmed = word;

    // Coba hapus akhiran
    for (const suffix of suffixes) {
      if (stemmed.endsWith(suffix) && stemmed.length > suffix.length + 2) {
        stemmed = stemmed.slice(0, -suffix.length);
        break; // Hanya hapus satu akhiran
      }
    }

    // Coba hapus awalan
    const prefixes = ['di', 'ke', 'me', 'ter', 'ber', 'per', 'pe', 'se'];
    for (const prefix of prefixes) {
      if (stemmed.startsWith(prefix) && stemmed.length > prefix.length + 2) {
        stemmed = stemmed.slice(prefix.length);
        break; // Hanya hapus satu awalan
      }
    }

    return stemmed;
  }

  // Fungsi untuk reprocess artikel tertentu
  static async reprocessArticle(idArtikel) {
    try {
      const article = await ArticleModel.findById(idArtikel);
      
      if (!article) {
        throw new Error('Artikel tidak ditemukan');
      }

      const preprocessed = await this.preprocessText(article.isi);
      
      await PreprocessingModel.create(
        article.id_artikel,
        preprocessed.teksBersih,
        preprocessed.token
      );

      return {
        success: true,
        message: 'Artikel berhasil diproses ulang',
        data: preprocessed
      };

    } catch (error) {
      console.error('Error dalam reprocessArticle:', error);
      throw error;
    }
  }
}

module.exports = PreprocessingService;
