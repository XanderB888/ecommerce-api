const express = require('express');
const router = express.Router();
const db = require('../db/index');

// GET /products - get all products
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /products/:id - get one product
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM products WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /products - create a product
router.post('/', async (req, res) => {
  const { name, description, price, quantity_in_stock } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO products (name, description, price, quantity_in_stock) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, price, quantity_in_stock]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /products/:id - update a product
router.put('/:id', async (req, res) => {
  const { name, description, price, quantity_in_stock } = req.body;
  try {
    const result = await db.query(
      'UPDATE products SET name=$1, description=$2, price=$3, quantity_in_stock=$4 WHERE id=$5 RETURNING *',
      [name, description, price, quantity_in_stock, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /products/:id - delete a product
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM products WHERE id=$1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;