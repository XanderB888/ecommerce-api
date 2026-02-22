const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db/index');

// POST /auth/register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    const hash = await bcrypt.hash(password, 10);
    
    const result = await db.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email', //$ are placeholders, values are passed as an array to avoid SQL injection
      [username, email, hash]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;