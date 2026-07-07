const { Pool } = require('pg');

// Database connection
const pool = new Pool({
    host: 'localhost',
    database: 'ecommerce',
    user: 'admin',
    password: 'admin123',
    port: 5432
});

module.exports = {
    query: (text, params) => pool.query(text, params)
};