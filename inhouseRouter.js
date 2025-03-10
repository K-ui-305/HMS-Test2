// routes/inhouseRouter.js

import express from 'express';
import Inhouse from '../models/inhouseModel.js';

const router = express.Router();

// Register Inhouse data
router.post('/inhouse/register', async (req, res) => {
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

  // Validate price and total people
  if (req.body.price <= 0) {
    return res.status(400).json({ success: false, message: 'Price must be greater than 0' });
  }

  if (req.body.totalPeople <= 0) {
    return res.status(400).json({ success: false, message: 'Total people must be greater than 0' });
  }

  try {
    const newInhouse = new Inhouse({
      fullname: req.body.fullname,
      location: req.body.location,
      roomNo: req.body.roomNo,
      totalPeople: req.body.totalPeople,
      checkInDate: req.body.checkInDate,
      checkOutDate: req.body.checkOutDate,
      price: req.body.price,
      mobile: req.body.mobile,
      notice: req.body.notice
    });

    const savedInhouse = await newInhouse.save();
    res.status(201).json({ success: true, savedData: savedInhouse });
  } catch (err) {
    console.error("Error saving inhouse data", err);
    res.status(500).json({ success: false, message: 'Error saving inhouse data', error: err });
  }
});

export default router;
