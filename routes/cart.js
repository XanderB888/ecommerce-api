const express = require('express');
const router = express.Router();
const db = require('../db/index');

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'You must be logged in' });
};

// GET /cart - get current user's cart
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const cart = await db.query(
      'SELECT * FROM carts WHERE user_id = $1',
      [req.user.id]
    );
    if (cart.rows.length === 0) {
      return res.json({ message: 'Cart is empty' });
    }
    const items = await db.query(
      `SELECT ci.id, ci.quantity, p.name, p.price, p.description
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = $1`,
      [cart.rows[0].id]
    );
    res.json({ cart_id: cart.rows[0].id, items: items.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /cart - add item to cart
router.post('/', isAuthenticated, async (req, res) => {
  const { product_id, quantity } = req.body;
  try {
    // Get or create cart
    let cart = await db.query(
      'SELECT * FROM carts WHERE user_id = $1',
      [req.user.id]
    );
    if (cart.rows.length === 0) {
      cart = await db.query(
        'INSERT INTO carts (user_id) VALUES ($1) RETURNING *',
        [req.user.id]
      );
    }
    const cart_id = cart.rows[0].id;

    // Add item to cart
    const result = await db.query(
      'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
      [cart_id, product_id, quantity]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /cart/:itemId - update item quantity
router.put('/:itemId', isAuthenticated, async (req, res) => {
  const { quantity } = req.body;
  try {
    const result = await db.query(
      'UPDATE cart_items SET quantity=$1 WHERE id=$2 RETURNING *',
      [quantity, req.params.itemId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /cart/:itemId - remove item from cart
router.delete('/:itemId', isAuthenticated, async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM cart_items WHERE id=$1 RETURNING *',
      [req.params.itemId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;