const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
app.use(express.json());

app.post('/scrape', async (req, res) => {
    const urls = req.body.urls;
    const results = [];
    for (const url of urls) {
        try {
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);
            const title = $('.c-read-title h1').text() || 'Tidak ada judul';
            const date = $('.c-read-credit-date').text() || 'Tidak ada tanggal';
            let content = '';
            $('.c-read-body p, .c-read-body span').each((i, el) => {
                content += $(el).text() + ' ';
            });
            content = content.trim() || 'Tidak ada konten';
            results.push({ url, title, date, content });
        } catch (err) {
            results.push({ url, title: 'Error', date: 'Error', content: 'Error' });
        }
    }
    res.json(results);
});

app.listen(3000, () => {
    console.log('Backend running on http://localhost:3000');
});