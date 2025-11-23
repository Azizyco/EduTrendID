import express from "express";
import cors from "cors";
import { scrapeArticles } from "./scraper.js";

const app = express();
const PORT = process.env.PORT || 3000;

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
    // Frekuensi kata berdasarkan preprocessing (tokens)
    const freq = {};
    const docsTokens = contents.map(text => preprocess(text));
    docsTokens.forEach(tokens => {
      tokens.forEach(token => {
        freq[token] = (freq[token] || 0) + 1;
      });
    });

    // Preprocessing dan TF-IDF (computeTFIDF expects raw documents)
    const tfidf = computeTFIDF(contents);

    // Gabungkan score dan count
    const combined = Object.entries(tfidf).map(([word, score]) => ({
      word,
      score: typeof score === 'number' ? score : Number(score) || 0,
      count: freq[word] || 0
    }));
    // Top 20 berdasarkan score (TF-IDF)
    const topByScore = [...combined].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.count - a.count;
    }).slice(0, 20);
    // Top 20 berdasarkan jumlah kemunculan (count)
    const topByCount = [...combined].sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return b.score - a.score;
    }).slice(0, 20);
    // Kategori tiap artikel
    const categories = articles.map(a => ({ url: a.url, kategori: categorize(a.content) }));
    // Penjelasan pola sederhana
    let explanation = "Kata-kata dengan bobot tinggi menunjukkan topik utama yang sering dibahas dalam kumpulan artikel. Pola kata dapat mengindikasikan tren atau fokus berita pendidikan.";
    res.json({ topByScore, topByCount, categories, freq, explanation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Choose another port or stop the process using it.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});
