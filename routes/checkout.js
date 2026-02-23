const express = require('express');
const router = express.Router();
const db = require('../db/index');

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'You must be logged in' });
};

// POST /checkout
router.post('/', isAuthenticated, async (req, res) => {
  try {
    // Get user's cart
    const cart = await db.query(
      'SELECT * FROM carts WHERE user_id = $1',
      [req.user.id]
    );
    if (cart.rows.length === 0) {
      return res.status(400).json({ error: 'No cart found' });
    }
    const cart_id = cart.rows[0].id;

    // Get cart items with product prices
    const cartItems = await db.query(
      `SELECT ci.quantity, p.price, p.id as product_id
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = $1`,
      [cart_id]
    );
    if (cartItems.rows.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate total price
    const totalPrice = cartItems.rows.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    // Create order
    const order = await db.query(
      'INSERT INTO orders (user_id, total_price, status) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, totalPrice, 'pending']
    );
    const order_id = order.rows[0].id;

    // Insert order items
    for (const item of cartItems.rows) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)',
        [order_id, item.product_id, item.quantity, item.price]
      );
    }

    // Clear the cart
    await db.query(
      'DELETE FROM cart_items WHERE cart_id = $1',
      [cart_id]
    );

    res.status(201).json({
      message: 'Order placed successfully',
      order: order.rows[0]
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;