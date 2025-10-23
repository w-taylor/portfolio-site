import express from 'express';
import cors from 'cors';
import { query } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

//URL redirect for URL shortener
app.get('/link/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  const dbResult = await query(
    'SELECT original_url FROM short_urls WHERE short_code = $1',
    [shortCode]
  );

  if (dbResult.rows.length === 0) {
    return res.status(400).send('Link not found'); //Will want to update this to send to svelte server's 404 page probably...
  }

  await query(
    'UPDATE short_urls SET clicks = clicks + 1 WHERE short_code = $1',
    [shortCode]
  );

  res.redirect(302, dbResult.rows[0].original_url);
});

app.post('/api/shorten', async (req, res) => {
  let { url } = req.body;

  url = url.trim();

  if (url.length >= 2000) {
    return res.status(400).json({ error: 'URL must be under 2000 characters!' });
  }
  
  // Add protocol if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url; // Default to HTTPS
  }
  
  try {
    // Validate the structure is consistent with a URL
    const parsed = new URL(url);

    if (!(parsed.hostname && parsed.hostname.length >= 3 && /[a-z0-9-]+\.[a-z0-9-]+/i.test(parsed.hostname))) {
      throw "Invalid URL";
    }
    
    // Save to database
    const result = await query(
      'INSERT INTO short_urls (short_code, original_url) VALUES ($1, $2) RETURNING *',
      [generateShortCode(), url]
    );
    
    res.json({ shortUrl: `${result.rows[0].short_code}` });
    
  } catch (error) {
    res.status(400).json({ error: 'Invalid URL - please try again' });
  }
});

function generateShortCode() {
  return Array(6).fill(0).map(() => 
    'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]
  ).join('');
}


const PORT = process.env.BACKEND_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
