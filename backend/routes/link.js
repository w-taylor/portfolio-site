import express from 'express';
const router = express.Router();
import { query } from '../db.js';

router.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  const dbResult = await query(
    'SELECT original_url FROM short_urls WHERE short_code = $1',
    [shortCode]
  );

  if (dbResult.rows.length === 0) {
    return res.status(400).send('Link not found');
  }

  await query(
    'UPDATE short_urls SET clicks = clicks + 1 WHERE short_code = $1',
    [shortCode]
  );

  res.redirect(302, dbResult.rows[0].original_url);
});

export default router;
