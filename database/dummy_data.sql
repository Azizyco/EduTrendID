-- ====================================================================
-- DATA DUMMY UNTUK TESTING
-- ====================================================================
-- File ini berisi data contoh untuk testing aplikasi
-- Jalankan setelah schema.sql berhasil dijalankan

-- ====================================================================
-- INSERT ARTIKEL DUMMY
-- ====================================================================
-- Data artikel contoh tentang pendidikan di Yogyakarta

INSERT INTO artikel (id_sumber, judul, tanggal, isi, url_asli, topik) VALUES
(1, 'UGM Membuka Program Beasiswa untuk Mahasiswa Berprestasi di Yogyakarta', '15 November 2025', 
'Universitas Gadjah Mada (UGM) mengumumkan pembukaan program beasiswa penuh untuk mahasiswa berprestasi yang berasal dari Yogyakarta dan sekitarnya. Program ini bertujuan untuk mendukung pendidikan tinggi di wilayah Daerah Istimewa Yogyakarta. Beasiswa mencakup biaya kuliah, biaya hidup, dan fasilitas pendukung lainnya. Pendaftaran dibuka mulai bulan ini hingga akhir Desember 2025.',
'https://example.com/berita/ugm-beasiswa-yogyakarta', 'Beasiswa'),

(1, 'Pemerintah DIY Tingkatkan Anggaran Pendidikan di Sleman dan Bantul', '14 November 2025',
'Pemerintah Daerah Istimewa Yogyakarta mengalokasikan anggaran tambahan untuk peningkatan kualitas pendidikan di Kabupaten Sleman dan Bantul. Dana akan digunakan untuk renovasi sekolah, pelatihan guru, dan pengadaan fasilitas pembelajaran modern. Gubernur DIY menekankan pentingnya investasi di sektor pendidikan untuk memajukan daerah.',
'https://example.com/berita/anggaran-pendidikan-diy', 'Kebijakan'),

(2, 'SMK di Kulon Progo Raih Penghargaan Sekolah Vokasi Terbaik se-Jogja', '13 November 2025',
'Sebuah SMK di Kulon Progo berhasil meraih penghargaan sebagai sekolah vokasi terbaik di wilayah Yogyakarta. Prestasi ini diraih berkat inovasi kurikulum yang menggabungkan teori dan praktik industri. Sekolah ini juga menjalin kerjasama dengan berbagai perusahaan untuk program magang siswa.',
'https://example.com/berita/smk-kulon-progo-terbaik', 'Prestasi'),

(2, 'Universitas di Bantul Luncurkan Program Pertukaran Pelajar Internasional', '12 November 2025',
'Salah satu universitas swasta di Bantul meluncurkan program pertukaran pelajar dengan universitas di luar negeri. Program ini membuka kesempatan bagi mahasiswa Yogyakarta untuk belajar di universitas terkemuka di Asia dan Eropa. Pendaftaran gelombang pertama akan dibuka bulan depan.',
'https://example.com/berita/pertukaran-pelajar-bantul', 'Internasional'),

(1, 'Sekolah Dasar di Gunungkidul Implementasikan Kurikulum Berbasis Digital', '11 November 2025',
'Beberapa sekolah dasar di Kabupaten Gunungkidul mulai mengimplementasikan kurikulum berbasis digital. Setiap siswa mendapat akses tablet untuk pembelajaran interaktif. Dinas Pendidikan DIY memberikan dukungan penuh untuk transformasi digital pendidikan di daerah.',
'https://example.com/berita/sd-gunungkidul-digital', 'Teknologi'),

(2, 'Mahasiswa UNY Yogyakarta Ciptakan Aplikasi Belajar untuk Siswa SD', '10 November 2025',
'Mahasiswa Universitas Negeri Yogyakarta (UNY) berhasil mengembangkan aplikasi mobile untuk membantu siswa SD belajar matematika dan bahasa Indonesia. Aplikasi ini mendapat apresiasi dari Dinas Pendidikan Kota Yogyakarta dan akan diujicobakan di beberapa sekolah.',
'https://example.com/berita/mahasiswa-uny-aplikasi-belajar', 'Inovasi'),

(1, 'Pelatihan Guru di Sleman Fokus pada Metode Pembelajaran Modern', '09 November 2025',
'Dinas Pendidikan Kabupaten Sleman mengadakan pelatihan intensif untuk guru-guru SD dan SMP. Pelatihan fokus pada penerapan metode pembelajaran modern seperti project-based learning dan flipped classroom. Lebih dari 500 guru berpartisipasi dalam program ini.',
'https://example.com/berita/pelatihan-guru-sleman', 'Pelatihan'),

(2, 'Perpustakaan Digital Diluncurkan untuk Pelajar di Seluruh DIY', '08 November 2025',
'Pemerintah DIY meluncurkan perpustakaan digital yang bisa diakses oleh seluruh pelajar di Yogyakarta, Sleman, Bantul, Gunungkidul, dan Kulon Progo. Perpustakaan ini menyediakan ribuan buku pelajaran, jurnal, dan materi pembelajaran gratis. Akses diberikan melalui website dan aplikasi mobile.',
'https://example.com/berita/perpustakaan-digital-diy', 'Fasilitas'),

(1, 'SMA di Jogja Jalin Kerjasama dengan Industri untuk Program Magang', '07 November 2025',
'Beberapa SMA di Kota Yogyakarta menjalin kerjasama dengan perusahaan teknologi untuk program magang siswa kelas 12. Program ini bertujuan memberikan pengalaman langsung dunia kerja kepada siswa sebelum lulus. Industri sambut baik inisiatif sekolah-sekolah di Jogja.',
'https://example.com/berita/sma-jogja-magang-industri', 'Kerjasama'),

(2, 'Lomba Karya Ilmiah Pelajar se-Yogyakarta Digelar Bulan Depan', '06 November 2025',
'Dinas Pendidikan DIY akan menggelar lomba karya ilmiah untuk pelajar SMA/SMK se-Yogyakarta bulan depan. Tema lomba tahun ini adalah "Inovasi Pendidikan di Era Digital". Pemenang akan mendapatkan beasiswa dan kesempatan mempresentasikan karya di tingkat nasional.',
'https://example.com/berita/lomba-karya-ilmiah-yogyakarta', 'Kompetisi');

-- ====================================================================
-- CATATAN
-- ====================================================================
-- 1. Data di atas adalah CONTOH untuk testing
-- 2. Dalam implementasi nyata, data akan diisi melalui proses scraping
-- 3. URL adalah placeholder, sesuaikan dengan sumber berita sebenarnya
-- 4. id_sumber merujuk ke data di tabel sumber_berita (1 atau 2)
