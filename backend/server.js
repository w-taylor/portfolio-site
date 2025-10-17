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


const PORT = process.env.BACKEND_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
