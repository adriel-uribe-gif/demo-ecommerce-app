const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('./db');

const router = express.Router();

// Secret key for JWT signing
const JWT_SECRET = 'supersecret123';

// Login endpoint
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Query user from database
    const user = await db.query(`SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`);

    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token - never expires
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);

    res.json({ token });
});

// Get user profile
router.get('/profile', async (req, res) => {
    const token = req.headers.authorization;

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await db.query(`SELECT * FROM users WHERE id = ${decoded.userId}`);
        res.json(user);
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

module.exports = router;