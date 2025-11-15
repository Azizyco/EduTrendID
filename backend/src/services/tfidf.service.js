// ====================================================================
// SERVICE: TF-IDF ANALYSIS
// ====================================================================
// Service untuk menghitung TF-IDF dari artikel yang sudah dipreprocess

const ArticleModel = require('../models/article.model');
const TfidfModel = require('../models/tfidf.model');
const LogModel = require('../models/log.model');

class TfidfService {
  // Fungsi utama untuk analisis TF-IDF
  static async analyzeTfidf(topN = 20) {
    try {
      console.log('📊 Memulai analisis TF-IDF...');
      
      // Ambil semua artikel yang sudah dipreprocess
      const articles = await ArticleModel.findProcessed();
      
      if (articles.length === 0) {
        await LogModel.create('analyze', 'gagal', 'Tidak ada artikel yang sudah dipreprocess');
        return {
          success: false,
          message: 'Tidak ada artikel yang sudah dipreprocess',
          data: []
        };
      }

      console.log(`📄 Total artikel: ${articles.length}`);

      // Buat dokumen (array of tokens)
      const documents = articles.map(article => {
        return article.token.split(' ').filter(token => token.length > 0);
      });

      // Hitung TF-IDF
      const tfidfResults = this.calculateTfidf(documents);

      // Ambil top-N kata
      const topWords = tfidfResults.slice(0, topN);

      // Periode analisis (format: YYYY-MM)
      const periode = new Date().toISOString().slice(0, 7);

      // Simpan ke database
      await TfidfModel.createBatch(topWords, periode);

      // Catat log
      const keterangan = `Analisis TF-IDF selesai. Total dokumen: ${articles.length}, Top-${topN} kata disimpan, Periode: ${periode}`;
      await LogModel.create('analyze', 'berhasil', keterangan);

      console.log(`✅ Top-${topN} kata berhasil disimpan`);

      return {
        success: true,
        message: 'Analisis TF-IDF selesai',
        data: {
          totalDokumen: articles.length,
          topN: topN,
          periode: periode,
          topWords: topWords
        }
      };

    } catch (error) {
      console.error('Error dalam analyzeTfidf:', error);
      await LogModel.create('analyze', 'gagal', error.message);
      throw error;
    }
  }

  // Fungsi untuk menghitung TF-IDF
  static calculateTfidf(documents) {
    // 1. Hitung frekuensi kata per dokumen (TF)
    const totalDocuments = documents.length;
    const wordFrequency = {}; // {kata: {df: count, tf: {docIndex: count}}}

    // Hitung TF dan DF
    documents.forEach((doc, docIndex) => {
      const wordCount = {}; // Hitung kemunculan kata dalam dokumen ini

      doc.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
      });

      // Update frequency map
      Object.keys(wordCount).forEach(word => {
        if (!wordFrequency[word]) {
          wordFrequency[word] = { df: 0, tf: {}, totalOccurrences: 0 };
        }
        wordFrequency[word].df += 1; // Document Frequency
        wordFrequency[word].tf[docIndex] = wordCount[word]; // Term Frequency per dokumen
        wordFrequency[word].totalOccurrences += wordCount[word];
      });
    });

    // 2. Hitung TF-IDF untuk setiap kata
    const tfidfScores = [];

    Object.keys(wordFrequency).forEach(word => {
      const df = wordFrequency[word].df;
      const idf = Math.log(totalDocuments / df); // IDF = log(N / df)

      // Hitung rata-rata TF * IDF
      let totalTfidf = 0;
      Object.keys(wordFrequency[word].tf).forEach(docIndex => {
        const tf = wordFrequency[word].tf[docIndex];
        const tfidf = tf * idf;
        totalTfidf += tfidf;
      });

      // Rata-rata TF-IDF
      const avgTfidf = totalTfidf / df;

      tfidfScores.push({
        kata: word,
        nilaiTfidf: parseFloat(avgTfidf.toFixed(6)),
        frekuensi: wordFrequency[word].totalOccurrences,
        df: df, // Document Frequency (dalam berapa dokumen kata ini muncul)
        idf: parseFloat(idf.toFixed(6))
      });
    });

    // 3. Sort berdasarkan nilai TF-IDF (descending)
    tfidfScores.sort((a, b) => b.nilaiTfidf - a.nilaiTfidf);

    return tfidfScores;
  }

  // Fungsi alternatif: menghitung TF-IDF dengan library 'natural'
  // CATATAN: Uncomment jika ingin menggunakan library 'natural'
  /*
  static calculateTfidfWithLibrary(documents) {
    const natural = require('natural');
    const TfIdf = natural.TfIdf;
    const tfidf = new TfIdf();

    // Tambahkan semua dokumen
    documents.forEach(doc => {
      tfidf.addDocument(doc.join(' '));
    });

    // Ekstrak semua kata unik dan nilai TF-IDF-nya
    const allWords = new Set();
    documents.forEach(doc => {
      doc.forEach(word => allWords.add(word));
    });

    const tfidfScores = [];

    allWords.forEach(word => {
      let totalTfidf = 0;
      let count = 0;

      tfidf.tfidfs(word, (docIndex, measure) => {
        if (measure > 0) {
          totalTfidf += measure;
          count++;
        }
      });

      if (count > 0) {
        tfidfScores.push({
          kata: word,
          nilaiTfidf: parseFloat((totalTfidf / count).toFixed(6)),
          frekuensi: count
        });
      }
    });

    // Sort berdasarkan nilai TF-IDF
    tfidfScores.sort((a, b) => b.nilaiTfidf - a.nilaiTfidf);

    return tfidfScores;
  }
  */

  // Fungsi untuk mendapatkan statistik analisis
  static async getStats() {
    try {
      const periods = await TfidfModel.getPeriods();
      const latestPeriod = periods[0] || null;
      
      let topWords = [];
      if (latestPeriod) {
        topWords = await TfidfModel.getTopWords(10, latestPeriod);
      }

      return {
        totalPeriods: periods.length,
        periods: periods,
        latestPeriod: latestPeriod,
        topWords: topWords
      };
    } catch (error) {
      console.error('Error dalam getStats:', error);
      throw error;
    }
  }
}

module.exports = TfidfService;
