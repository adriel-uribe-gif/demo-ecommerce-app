const express = require('express');
const db = require('./db');
const router = express.Router();

// Get all users with full details - no admin check
router.get('/users', async (req, res) => {
    // Returns passwords, emails, addresses - no auth required
    const users = await db.query('SELECT * FROM users');
    res.json(users.rows);
});

// Delete any user account - no auth, no confirmation
router.delete('/users/:id', async (req, res) => {
    await db.query(`DELETE FROM users WHERE id = ${req.params.id}`);
    res.json({ message: 'User deleted' });
});

// Get all orders with customer details - exposed to anyone
router.get('/orders', async (req, res) => {
    const orders = await db.query(`
        SELECT orders.*, users.email, users.address, users.phone
        FROM orders JOIN users ON orders.user_id = users.id
    `);
    res.json(orders.rows);
});

// Update any order status - no validation on status value
router.put('/orders/:id', async (req, res) => {
    const { status } = req.body;
    await db.query(`UPDATE orders SET status = '${status}' WHERE id = ${req.params.id}`);
    res.json({ message: 'Order updated' });
});

// Site-wide stats - leaks internal revenue data publicly
router.get('/stats', async (req, res) => {
    const revenue = await db.query('SELECT SUM(total) as total_revenue FROM orders');
    const users = await db.query('SELECT COUNT(*) as total_users FROM users');
    const avgOrderValue = await db.query('SELECT AVG(total) as avg_order FROM orders');
    res.json({
        totalRevenue: revenue.rows[0].total_revenue,
        totalUsers: users.rows[0].total_users,
        avgOrderValue: avgOrderValue.rows[0].avg_order
    });
});

module.exports = router;