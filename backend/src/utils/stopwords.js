// ====================================================================
// UTILITY: STOPWORDS BAHASA INDONESIA
// ====================================================================
// Daftar stopwords untuk preprocessing teks Bahasa Indonesia

const stopwords = [
  // Kata penghubung
  'dan', 'atau', 'tetapi', 'namun', 'serta', 'lalu', 'kemudian', 'maka',
  
  // Kata depan
  'di', 'ke', 'dari', 'pada', 'dalam', 'untuk', 'dengan', 'oleh', 'tentang',
  'terhadap', 'atas', 'bagi', 'seperti', 'antara',
  
  // Kata ganti
  'yang', 'ini', 'itu', 'ia', 'dia', 'mereka', 'kami', 'kita', 'kamu', 'anda',
  'saya', 'aku', 'nya', 'mu', 'ku',
  
  // Kata kerja bantu
  'adalah', 'ada', 'akan', 'telah', 'sudah', 'dapat', 'bisa', 'harus', 'menjadi',
  'sedang', 'pernah', 'belum', 'tidak', 'bukan',
  
  // Artikel
  'se', 'sebuah', 'suatu', 'para', 'sang',
  
  // Kata keterangan
  'sangat', 'lebih', 'paling', 'sekali', 'selalu', 'sering', 'kadang', 'juga',
  'hanya', 'saja', 'bahkan', 'malah', 'masih', 'lagi',
  
  // Kata bilangan
  'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan',
  'sepuluh', 'ratus', 'ribu', 'juta', 'miliar',
  
  // Kata tanya
  'apa', 'siapa', 'kapan', 'dimana', 'mengapa', 'bagaimana', 'berapa',
  
  // Lain-lain
  'hal', 'karena', 'jika', 'kalau', 'bila', 'apabila', 'ketika', 'saat', 'waktu',
  'setelah', 'sebelum', 'sambil', 'hingga', 'sampai', 'supaya', 'agar',
  'meski', 'walaupun', 'meskipun', 'walau', 'biarpun',
  
  // Kata umum lainnya
  'kali', 'semua', 'setiap', 'tiap', 'beberapa', 'banyak', 'sedikit',
  'seluruh', 'sebagian', 'lain', 'lainnya', 'sendiri', 'bersama',
  
  // Kata tambahan untuk konteks berita
  'berita', 'news', 'com', 'www', 'http', 'https', 'html', 'php',
  'tersebut', 'terkait', 'kata', 'ucap', 'ucapnya', 'katanya',
  
  // Kata umum Yogyakarta (opsional, bisa dihapus jika ingin muncul di TF-IDF)
  // 'yogyakarta', 'jogja', 'diy', 'sleman', 'bantul', 'gunungkidul', 'kulon', 'progo'
];

// Set untuk pencarian lebih cepat
const stopwordsSet = new Set(stopwords);

module.exports = {
  stopwords,
  stopwordsSet
};
