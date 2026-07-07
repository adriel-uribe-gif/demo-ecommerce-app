const express = require('express');
const db = require('./db');
const router = express.Router();

// Search products by name or category - no input sanitization
router.get('/search', async (req, res) => {
    const { q, category } = req.query;
    let query = `SELECT * FROM products WHERE name LIKE '%${q}%'`;
    if (category) {
        query += ` AND category = '${category}'`;
    }
    const results = await db.query(query);
    // Returns all columns including internal cost_price - should be hidden
    res.json(results.rows);
});

// Filter by price range - crashes if no results found
router.get('/filter', async (req, res) => {
    const { minPrice, maxPrice } = req.query;
    const results = await db.query(
        `SELECT * FROM products WHERE price >= ${minPrice} AND price <= ${maxPrice}`
    );
    // Will crash with TypeError if results is empty
    const topCategory = results.rows[0].category;
    res.json({ products: results.rows, topCategory });
});

// Related products - loads entire table into memory
router.get('/:id/related', async (req, res) => {
    const product = await db.query(`SELECT * FROM products WHERE id = ${req.params.id}`);
    // Loads ALL products then filters in JS - extremely slow on large catalogs
    const all = await db.query('SELECT * FROM products');
    const related = all.rows.filter(p => p.category === product.rows[0].category);
    res.json(related);
});

module.exports = router;