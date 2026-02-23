const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db/index');
const passport = require('passport');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with username and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       401:
 *         description: Incorrect credentials
 */
// POST /auth/login
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ 
    message: 'Logged in successfully', 
    user: { 
      id: req.user.id, 
      username: req.user.username, 
      email: req.user.email 
    } 
  });
});

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout current user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
// GET /auth/logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;