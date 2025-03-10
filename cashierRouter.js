import express from 'express';
import Cashier from '../models/cashierModel.js';
import Booking from '../models/bookingModel.js';
import InHouse from '../models/inhouseModel.js';

const router = express.Router();

// GET all cashier transactions
router.get('/cashier', async (req, res) => {
    try {
        const transactions = await Cashier.find().populate('bookingId');
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve transactions', error: err });
    }
});

// POST a new cashier transaction
router.post('/cashier', async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['amount', 'paymentMethod', 'bookingId', 'description'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ success: false, message: `${field} is required` });
            }
        }

        // Check if booking exists in either Booking or InHouse collection
        let booking = await Booking.findById(req.body.bookingId);
        if (!booking) {
            booking = await InHouse.findById(req.body.bookingId);
            if (!booking) {
                return res.status(404).json({ success: false, message: 'Booking not found' });
            }
        }

        // Check if payment amount is valid
        if (req.body.amount <= 0) {
            return res.status(400).json({ success: false, message: 'Payment amount must be greater than 0' });
        }

        if (req.body.amount > booking.remainingAmount) {
            return res.status(400).json({ success: false, message: 'Payment amount cannot exceed remaining balance' });
        }

        const newTransaction = new Cashier(req.body);
        const savedTransaction = await newTransaction.save();

        // Update booking payment status
        booking.amountPaid += req.body.amount;
        booking.remainingAmount = booking.price - booking.amountPaid;
        booking.paymentStatus = booking.remainingAmount === 0 ? 'paid' : 'partially_paid';
        await booking.save();

        res.status(201).json({ success: true, transaction: savedTransaction });
    } catch (err) {
        res.status(400).json({ message: 'Failed to add transaction', error: err });
    }
});

// DELETE a cashier transaction by ID
router.delete('/cashier/:id', async (req, res) => {
    try {
        const transaction = await Cashier.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }

        // Check if booking exists in either Booking or InHouse collection
        let booking = await Booking.findById(transaction.bookingId);
        if (!booking) {
            booking = await InHouse.findById(transaction.bookingId);
        }

        if (booking) {
            booking.amountPaid -= transaction.amount;
            booking.remainingAmount = booking.price - booking.amountPaid;
            booking.paymentStatus = booking.amountPaid === 0 ? 'unpaid' : 'partially_paid';
            await booking.save();
        }

        await Cashier.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Transaction deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete transaction', error: err });
    }
});

export default router;
