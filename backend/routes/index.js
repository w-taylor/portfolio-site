import express from 'express';
const router = express.Router();

import shortenRoutes from './shorten.js';
import linkRoutes from './link.js';
import pingboardRoutes from './pingboard.js';

router.use('/api', shortenRoutes);
router.use('/api/pingboard', pingboardRoutes);

// Shortcut redirect links don't use /api in URL path, just /link (accounted for by reverse proxy)
router.use('/link', linkRoutes);

router.get('/api/ping', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default router;
