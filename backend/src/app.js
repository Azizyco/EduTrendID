import express from "express";
import cors from "cors";
import { scrapeArticles } from "./scraper.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


app.post("/scrape", async (req, res) => {
  const { urls } = req.body;
  if (!Array.isArray(urls)) {
    return res.status(400).json({ error: "urls must be an array" });
  }
  try {
    const results = await scrapeArticles(urls);
    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint analisis NLP dan TF-IDF
import { preprocess } from "./preprocess.js";
import { computeTFIDF } from "./tfidf.js";

// Kategori sederhana berdasarkan kata kunci
function categorize(text) {
  const categories = [
    { name: "pendidikan dasar", keywords: ["sd", "smp", "dasar", "guru", "murid"] },
    { name: "pendidikan tinggi", keywords: ["universitas", "kampus", "mahasiswa", "dosen", "perguruan"] },
    { name: "pendidikan vokasi", keywords: ["vokasi", "smk", "kejuruan", "praktik"] }
  ];
  const tokens = preprocess(text);
  let result = "lainnya";
  for (const cat of categories) {
    if (cat.keywords.some(k => tokens.includes(k))) {
      result = cat.name;
      break;
    }
  }
  return result;
}

app.post("/analyze", async (req, res) => {
  const { articles } = req.body; // array of {title, date, content, url}
  if (!Array.isArray(articles)) {
    return res.status(400).json({ error: "articles must be an array" });
  }
  try {
    // Gabungkan semua konten
    const contents = articles.map(a => a.content);
    // Preprocessing dan TF-IDF
    const tfidf = computeTFIDF(contents);
    // Ambil 10-20 kata dengan bobot tertinggi
    const sorted = Object.entries(tfidf).sort((a, b) => b[1] - a[1]);
    const topWords = sorted.slice(0, 20).map(([word, score]) => ({ word, score }));
    // Kategori tiap artikel
    const categories = articles.map(a => ({ url: a.url, kategori: categorize(a.content) }));
    // Frekuensi kata
    const freq = {};
    contents.forEach(text => {
      preprocess(text).forEach(token => {
        freq[token] = (freq[token] || 0) + 1;
      });
    });
    // Penjelasan pola sederhana
    let explanation = "Kata-kata dengan bobot tinggi menunjukkan topik utama yang sering dibahas dalam kumpulan artikel. Pola kata dapat mengindikasikan tren atau fokus berita pendidikan.";
    res.json({ topWords, categories, freq, explanation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
