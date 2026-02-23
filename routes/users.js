const express = require('express');
const router = express.Router();
const db = require('../db/index');

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'You must be logged in' });
};

// GET /users/:id - get a user's profile
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, username, email, created_at FROM users WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /users/:id - update a user
router.put('/:id', isAuthenticated, async (req, res) => {
  const { username, email } = req.body;
  try {
    const result = await db.query(
      'UPDATE users SET username=$1, email=$2 WHERE id=$3 RETURNING id, username, email',
      [username, email, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /users/:id - delete a user
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM users WHERE id=$1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;