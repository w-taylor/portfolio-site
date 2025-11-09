import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';

import cron from 'node-cron';
import { runAllChecks } from './routes/pingboard.js';


const app = express();
app.use(cors());
app.use(express.json());

app.use(routes);

// Run 'runAllChecks' function from pingboard once per hour at XX:05
cron.schedule('5 * * * *', () => {
  runAllChecks();
});

const PORT = process.env.BACKEND_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
