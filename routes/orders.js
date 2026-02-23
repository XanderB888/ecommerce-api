const express = require('express');
const router = express.Router();
const db = require('../db/index');

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'You must be logged in' });
};

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders for logged in user
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of orders
 *       401:
 *         description: Not logged in
 */
// GET /orders - get all orders for logged in user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get a single order with items
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order found
 *       401:
 *         description: Not logged in
 *       404:
 *         description: Order not found
 */
// GET /orders/:id - get a single order with all items
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const order = await db.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (order.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const items = await db.query(
      `SELECT oi.quantity, oi.unit_price, p.name, p.description
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [req.params.id]
    );

    res.json({
      order: order.rows[0],
      items: items.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;