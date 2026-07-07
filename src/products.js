const express = require('express');
const db = require('./db');

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
    const products = await db.query('SELECT * FROM products');
    res.json(products);
});

// Get product by ID
router.get('/:id', async (req, res) => {
    const product = await db.query(`SELECT * FROM products WHERE id = ${req.params.id}`);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
});

// Create a new product
router.post('/', async (req, res) => {
    const { name, price, stock } = req.body;
    await db.query(`INSERT INTO products (name, price, stock) VALUES ('${name}', ${price}, ${stock})`);
    res.status(201).json({ message: 'Product created' });
});

module.exports = router;