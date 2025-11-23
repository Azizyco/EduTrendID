document.getElementById("scrapeForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const urls = document.getElementById("urls").value.split(/\n+/).map(u => u.trim()).filter(u => u);
  const resultsDiv = document.getElementById("results");
  const analysisDiv = document.getElementById("analysis");
  const wordcloudDiv = document.getElementById("wordcloud");
  resultsDiv.innerHTML = "<p>Memproses scraping...</p>";
  analysisDiv.innerHTML = "";
  wordcloudDiv.innerHTML = "";
  try {
    const res = await fetch("http://localhost:3000/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls })
    });
    const data = await res.json();
    if (data.results && data.results.length) {
      resultsDiv.innerHTML = data.results.map(item => `
        <div class="article">
          <div class="article-title">${item.title}</div>
          <div class="article-date">${item.date}</div>
          <div class="article-content">${item.content}</div>
          <div class="article-url"><a href="${item.url}" target="_blank">${item.url}</a></div>
        </div>
      `).join("");

      // Kirim ke endpoint /analyze
      const res2 = await fetch("http://localhost:3000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articles: data.results })
      });
      const analysis = await res2.json();
      // Tabel kata TF-IDF
      let tfidfTable = `<h2>Kata TF-IDF Tertinggi</h2><table><tr><th>Kata</th><th>Bobot</th></tr>`;
      analysis.topWords.forEach(w => {
        tfidfTable += `<tr><td>${w.word}</td><td>${w.score.toFixed(3)}</td></tr>`;
      });
      tfidfTable += `</table>`;
      // Kategori
      let kategoriList = `<h2>Kategori Artikel</h2><ul>`;
      analysis.categories.forEach(c => {
        kategoriList += `<li><a href="${c.url}" target="_blank">${c.url}</a>: <b>${c.kategori}</b></li>`;
      });
      kategoriList += `</ul>`;
      // Penjelasan
      let explanation = `<h2>Penjelasan Pola Kata</h2><p>${analysis.explanation}</p>`;
      // Grafik frekuensi kata
      let freqData = Object.entries(analysis.freq).sort((a,b)=>b[1]-a[1]).slice(0,10);
      let freqBar = `<h2>Grafik Frekuensi Kata</h2><div style="display:flex;align-items:flex-end;gap:8px;height:120px;">`;
      freqData.forEach(([word, val]) => {
        freqBar += `<div style="background:#3498db;width:40px;height:${val*10}px;text-align:center;color:#fff;border-radius:4px 4px 0 0;">${word}<br><span style="font-size:0.9em;">${val}</span></div>`;
      });
      freqBar += `</div>`;
      analysisDiv.innerHTML = tfidfTable + kategoriList + explanation + freqBar;

      // Word Cloud sederhana (text size)
      let wcHtml = `<h2>Word Cloud</h2><div style="display:flex;flex-wrap:wrap;gap:8px;max-width:600px;">`;
      analysis.topWords.forEach(w => {
        wcHtml += `<span style="font-size:${12 + w.score*2}px;color:#${Math.floor(Math.random()*16777215).toString(16)};font-weight:bold;">${w.word}</span> `;
      });
      wcHtml += `</div>`;
      wordcloudDiv.innerHTML = wcHtml;
    } else {
      resultsDiv.innerHTML = "<p>Tidak ada hasil.</p>";
    }
  } catch (err) {
    resultsDiv.innerHTML = `<p>Error: ${err.message}</p>`;
  }
});
