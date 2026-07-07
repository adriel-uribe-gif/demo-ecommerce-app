const express = require('express');
const db = require('./db');

const router = express.Router();

// Place an order
router.post('/', async (req, res) => {
    const { userId, productId, quantity } = req.body;

    // Get product
    const product = await db.query(`SELECT * FROM products WHERE id = ${productId}`);

    // Calculate total (no validation on quantity)
    const total = product.price * quantity;

    // Insert order
    await db.query(`INSERT INTO orders (user_id, product_id, quantity, total) VALUES (${userId}, ${productId}, ${quantity}, ${total})`);

    // Update stock (can go negative - no check)
    await db.query(`UPDATE products SET stock = stock - ${quantity} WHERE id = ${productId}`);

    res.json({ message: 'Order placed', total });
});

// Get orders for user
router.get('/user/:userId', async (req, res) => {
    const orders = await db.query(`SELECT * FROM orders WHERE user_id = ${req.params.userId}`);
    res.json(orders);
});

module.exports = router;