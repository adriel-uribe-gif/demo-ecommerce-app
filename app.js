const express = require('express');
const authRoutes = require('./src/auth');
const productRoutes = require('./src/products');
const orderRoutes = require('./src/orders');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

module.exports = app;