import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeArticles(urls) {
  const results = [];
  for (const url of urls) {
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      // Scrap judul
      let title = $(".c-read-title h1").text().trim() || "Tidak ada judul";
      // Scrap tanggal
      let date = $(".c-read-credit-date").text().trim() || "Tidak ada tanggal";
      // Scrap isi berita
      let content = "Tidak ada konten";
      const body = $(".c-read-body");
      if (body.length) {
        content = body.find("p, span").map((i, el) => $(el).text().trim()).get().join(" ");
      }
      results.push({ url, title, date, content });
    } catch (err) {
      results.push({ url, title: "Gagal scrape", date: "", content: err.message });
    }
  }
  return results;
}
