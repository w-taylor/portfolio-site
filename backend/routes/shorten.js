import express from 'express';
const router = express.Router();
import { query } from '../db.js';

router.post('/shorten', async (req, res) => {
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

export default router;
