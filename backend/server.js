import express from 'express';
import cors from 'cors';
import { query } from './db.js';

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

// Get existing tasks from database
app.get('/api/get_tasks', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM todo_tasks');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update selected task status to complete
app.put('/api/tasks/:id/complete', async (req, res) => {
  const { id } = req.params;
  const { is_completed } = req.body;

  try {
    const result = await query(
      `UPDATE todo_tasks 
       SET is_completed = $1, 
           date_completed = CASE WHEN $1 THEN NOW() ELSE NULL END
       WHERE id = $2
       RETURNING *`,
      [is_completed, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Server error - ${id}` });
  }
});

app.post('/api/submit_task', async (req,res) => {
  const {newDesc} = req.body;

  try {
    const result = await query(
      `INSERT INTO todo_tasks (description, date_added, date_completed, is_completed)
      VALUES ($1, NOW(), NULL, FALSE)
      RETURNING *`,
      [newDesc]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Error submitting new task.` });

  }
});


const PORT = process.env.BACKEND_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
