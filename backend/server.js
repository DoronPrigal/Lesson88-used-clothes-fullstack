const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// חיבור לבסיס הנתונים של PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 1. בדיקת שרת
app.get('/', (req, res) => {
  res.send('שרת בגדי יד שנייה מוכן לעבודה!');
});

// 2. קבלת כל הבגדים למכירה
app.get('/api/clothes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clothes ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'שגיאה במשיכת הבגדים' });
  }
});

// 3. הוספת בגד חדש למכירה
app.post('/api/clothes', async (req, res) => {
  const { title, description, price, image_url, seller_email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO clothes (title, description, price, image_url, seller_email) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, price, image_url, seller_email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'שגיאה בהוספת הפריט' });
  }
});

// 4. שליחת הודעה ממוכר לקונה
app.post('/api/messages', async (req, res) => {
  const { clothes_id, sender_email, receiver_email, message_text } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO messages (clothes_id, sender_email, receiver_email, message_text) VALUES ($1, $2, $3, $4) RETURNING *',
      [clothes_id, sender_email, receiver_email, message_text]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'שגיאה בשליחת ההודעה' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});