const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend server is running successfully!');
});

app.get('/api/health', (_req, res) => res.json({ message: 'Student API is running' }));

app.get('/api/students', async (_req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM students ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch students', error: error.message });
  }
});

app.get('/api/students/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM students WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Student not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch student', error: error.message });
  }
});

app.post('/api/students', async (req, res) => {
  const { name, email, course } = req.body;
  if (!name?.trim() || !email?.trim() || !course?.trim()) {
    return res.status(400).json({ message: 'Name, email and course are required' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO students (name, email, course) VALUES (?, ?, ?)',
      [name.trim(), email.trim(), course.trim()]
    );
    const [rows] = await db.query('SELECT * FROM students WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(error.code === 'ER_DUP_ENTRY' ? 409 : 500).json({
      message: error.code === 'ER_DUP_ENTRY' ? 'Email already exists' : 'Could not create student'
    });
  }
});

app.put('/api/students/:id', async (req, res) => {
  const { name, email, course } = req.body;
  if (!name?.trim() || !email?.trim() || !course?.trim()) {
    return res.status(400).json({ message: 'Name, email and course are required' });
  }
  try {
    const [result] = await db.query(
      'UPDATE students SET name = ?, email = ?, course = ? WHERE id = ?',
      [name.trim(), email.trim(), course.trim(), req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ message: 'Student not found' });
    const [rows] = await db.query('SELECT * FROM students WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    res.status(error.code === 'ER_DUP_ENTRY' ? 409 : 500).json({
      message: error.code === 'ER_DUP_ENTRY' ? 'Email already exists' : 'Could not update student'
    });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM students WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Could not delete student', error: error.message });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
