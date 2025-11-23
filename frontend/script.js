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
      // Hitung jumlah kemunculan kata
      let wordCounts = {};
      data.results.forEach(item => {
        if (item.content) {
          item.content.toLowerCase().replace(/[^a-zA-Z\s]/g, " ").split(/\s+/).forEach(token => {
            if (token) wordCounts[token] = (wordCounts[token] || 0) + 1;
          });
        }
      });
      // Tabel kata TF-IDF (top by score)
      let tfidfTable = `<h2>Top 20 Kata Berdasarkan TF-IDF (Score)</h2><table><tr><th>No</th><th>Kata</th><th>Jumlah</th><th>Score</th></tr>`;
      analysis.topByScore.forEach((w, i) => {
        tfidfTable += `<tr><td>${i+1}</td><td>${w.word}</td><td>${analysis.freq[w.word] || 0}</td><td>${w.score.toFixed(3)}</td></tr>`;
      });
      tfidfTable += `</table>`;
      // Tabel kata berdasarkan frekuensi (top by count)
      let freqTable = `<h2>Top 20 Kata Berdasarkan Jumlah Muncul</h2><table><tr><th>No</th><th>Kata</th><th>Jumlah</th><th>Score (TF-IDF)</th></tr>`;
      analysis.topByCount.forEach((w, i) => {
        freqTable += `<tr><td>${i+1}</td><td>${w.word}</td><td>${w.count}</td><td>${(w.score||0).toFixed(3)}</td></tr>`;
      });
      freqTable += `</table>`;
      // Kategori
      let kategoriList = `<h2>Kategori Artikel</h2><ul>`;
      analysis.categories.forEach(c => {
        kategoriList += `<li><a href="${c.url}" target="_blank">${c.url}</a>: <b>${c.kategori}</b></li>`;
      });
      kategoriList += `</ul>`;
      // Penjelasan
      let explanation = `<h2>Penjelasan Pola Kata</h2><p>${analysis.explanation}</p>`;
      // Dua grafik: (A) berdasarkan score TF-IDF (topByScore), (B) berdasarkan jumlah kemunculan (topByCount)
      const topScoreChartItems = analysis.topByScore.slice(0, 10);
      const topCountChartItems = analysis.topByCount.slice(0, 10);

      let chartHtml = `<div class='charts-row'>`;
      // Chart A: TF-IDF score (bars scaled by score)
      chartHtml += `<div class='chart-card'><h3>Top (by TF-IDF score)</h3><div class='freq-bar-container'>`;
      const maxScore = topScoreChartItems[0] ? topScoreChartItems[0].score : 1;
      topScoreChartItems.forEach(item => {
        const h = 30 + (item.score / (maxScore || 1)) * 140;
        chartHtml += `
          <div class='freq-bar' style='height:${h}px;'>
            <span>${(item.score||0).toFixed(3)}</span>
            <div class='freq-bar-label'>${item.word}</div>
          </div>`;
      });
      chartHtml += `</div></div>`;

      // Chart B: Count (bars scaled by count)
      chartHtml += `<div class='chart-card'><h3>Top (by Count)</h3><div class='freq-bar-container'>`;
      const maxCount = topCountChartItems[0] ? topCountChartItems[0].count : 1;
      topCountChartItems.forEach(item => {
        const h = 30 + (item.count / (maxCount || 1)) * 140;
        chartHtml += `
          <div class='freq-bar' style='height:${h}px;'>
            <span>${item.count}</span>
            <div class='freq-bar-label'>${item.word}</div>
          </div>`;
      });
      chartHtml += `</div></div>`;
      chartHtml += `</div>`;

      analysisDiv.innerHTML = tfidfTable + freqTable + kategoriList + explanation + chartHtml;

      // Word Cloud sederhana (text size)
      let wcHtml = `<h2>Word Cloud</h2><div style="display:flex;flex-wrap:wrap;gap:8px;max-width:600px;">`;
      // Use topByScore for word cloud
      analysis.topByScore.forEach(w => {
        wcHtml += `<span style="font-size:${12 + (w.score||0)*20}px;color:#${Math.floor(Math.random()*16777215).toString(16)};font-weight:bold;">${w.word}</span> `;
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
