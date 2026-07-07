const express = require('express');
const authRoutes = require('./src/auth');
const productRoutes = require('./src/products');
const orderRoutes = require('./src/orders');
const paymentRoutes = require('./src/payments');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/payments', paymentRoutes);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

module.exports = app;