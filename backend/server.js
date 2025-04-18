import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

/*

app.get('/api/data', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM items');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.post('/api/data', async (req, res) => {
  const { name } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO items (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});*/

app.get('/api/data', async (req, res) => {
  try {
    const out = {"output": "my test output"}
    res.json(out);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
