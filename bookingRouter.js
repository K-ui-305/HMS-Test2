import express from 'express';
import Booking from '../models/bookingModel.js';

const router = express.Router();

// Create new booking
router.post('/register', async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['fullname', 'location', 'roomNo', 'totalPeople', 'checkInDate', 'checkOutDate', 'price', 'mobile'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ success: false, message: `${field} is required` });
            }
        }

        // Validate dates
        const checkIn = new Date(req.body.checkInDate);
        const checkOut = new Date(req.body.checkOutDate);
        if (checkOut <= checkIn) {
            return res.status(400).json({ success: false, message: 'Check-out date must be after check-in date' });
        }

        const booking = new Booking(req.body);
        await booking.save();
        res.status(201).json({ success: true, savedData: booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error registering booking' });
    }
});

// Get all bookings
router.get('/allBData', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching bookings' });
    }
});

// Update a booking
router.put('/allBData/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (req.body.checkInDate && req.body.checkOutDate) {
            const checkIn = new Date(req.body.checkInDate);
            const checkOut = new Date(req.body.checkOutDate);
            if (checkOut <= checkIn) {
                return res.status(400).json({ success: false, message: 'Check-out date must be after check-in date' });
            }
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        res.status(200).json({ success: true, updatedData: updatedBooking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error updating booking' });
    }
});

// Delete a booking
router.delete('/allBData/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        await Booking.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Booking deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting booking' });
    }
});

export default router;
