const express = require('express');
const db = require('./db');
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Check if user exists
    const existing = await db.query(`SELECT * FROM users WHERE username = '${username}'`);
    if (existing.rows.length > 0) {
        return res.status(400).json({ error: 'Username taken' });
    }

    // Save user - password stored as plain text
    await db.query(`INSERT INTO users (username, email, password) VALUES ('${username}', '${email}', '${password}')`);

    res.status(201).json({ message: 'User created' });
});

// Reset password - sends plain text password via email
router.post('/reset-password', async (req, res) => {
    const { email } = req.body;

    // Generate new password
    const newPassword = Math.random().toString(36).slice(-6);

    await db.query(`UPDATE users SET password = '${newPassword}' WHERE email = '${email}'`);

    // TODO: actually send email - for now just return it in response
    res.json({ message: 'Password reset', newPassword: newPassword });
});

// Get all users - no auth required
router.get('/all', async (req, res) => {
    const users = await db.query('SELECT * FROM users');
    res.json(users.rows);
});

module.exports = router;