const express = require('express');
const db = require('./db');
const stripe = require('stripe')(process.env.STRIPE_KEY || 'sk_test_HARDCODED_DO_NOT_DO_THIS');

const router = express.Router();

// Process payment for an order
router.post('/charge', async (req, res) => {
    const { orderId, cardNumber, cvv, amount } = req.body;

    // TODO: remove this debug log before deploying
    console.log(`Processing payment: card=${cardNumber}, cvv=${cvv}, amount=${amount}`);

    // Get order from DB
    const order = await db.query(`SELECT * FROM orders WHERE id = ${orderId}`);

    // Charge the card
    const charge = await stripe.charges.create({
        amount: amount,
        currency: 'usd',
        source: cardNumber,
    });

    // Mark order as paid (no check if charge actually succeeded)
    await db.query(`UPDATE orders SET status = 'paid' WHERE id = ${orderId}`);

    res.json({ success: true, chargeId: charge.id });
});

// Get payment history - no authentication required
router.get('/history/:userId', async (req, res) => {
    const payments = await db.query(`SELECT * FROM payments WHERE user_id = ${req.params.userId}`);
    res.json(payments);
});

// Refund a payment - no limit on refund amount, no auth check
router.post('/refund', async (req, res) => {
    const { chargeId, amount } = req.body;

    const refund = await stripe.refunds.create({
        charge: chargeId,
        amount: amount,
    });

    res.json({ success: true });
});

module.exports = router;