const express = require('express');
const db = require('./db');
const router = express.Router();

// Place an order - with proper validation and parameterized queries
router.post('/', async (req, res) => {
    const { userId, productId, quantity } = req.body;

    // Validate required fields
    if (!userId || !productId || !quantity) {
        return res.status(400).json({ error: 'userId, productId and quantity are required' });
    }

    // Validate quantity is a positive integer
    if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ error: 'quantity must be a positive integer' });
    }

    // Get product using parameterized query
    const result = await db.query('SELECT * FROM products WHERE id = $1', [productId]);
    const product = result.rows[0];

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    // Check sufficient stock before placing order
    if (product.stock < quantity) {
        return res.status(409).json({ error: 'Insufficient stock', available: product.stock });
    }

    const total = product.price * quantity;

    // Insert order with parameterized query
    await db.query(
        'INSERT INTO orders (user_id, product_id, quantity, total) VALUES ($1, $2, $3, $4)',
        [userId, productId, quantity, total]
    );

    // Update stock atomically - prevents going negative
    await db.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2 AND stock >= $1',
        [quantity, productId]
    );

    res.status(201).json({ message: 'Order placed successfully', total });
});

// Get orders for a specific user - parameterized
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    const result = await db.query(
        'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
    );
    res.json(result.rows);
});

module.exports = router;