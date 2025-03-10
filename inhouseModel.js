// models/inhouseModel.js

import mongoose from 'mongoose';

const inhouseSchema = new mongoose.Schema({
  fullname: { type: String, required: true }, // Changed from guestName to match bookingModel
  location: { type: String, required: true }, // Added to match bookingModel
  roomNo: { type: String, required: true }, // Changed from roomNumber to match bookingModel
  totalPeople: { type: Number, required: true }, // Added to match bookingModel
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  price: { type: Number, required: true }, // Added to match bookingModel
  mobile: { type: String, required: true }, // Added to match bookingModel
  notice: { type: String },
  inHouse: { type: Boolean, default: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'confirmed' },
  paymentStatus: { type: String, enum: ['unpaid', 'partially_paid', 'paid'], default: 'unpaid' },
  amountPaid: { type: Number, default: 0 },
  remainingAmount: {
    type: Number,
    default: function() {
      return this.price - this.amountPaid;
    }
  },
  createdAt: { type: Date, default: Date.now }
});

// Add validation to ensure check-out date is after check-in date
inhouseSchema.pre('save', function(next) {
  if (this.checkOutDate <= this.checkInDate) {
    next(new Error('Check-out date must be after check-in date'));
  }
  next();
});

// Add validation to ensure room number is not empty
inhouseSchema.pre('save', function(next) {
  if (!this.roomNo || this.roomNo.trim() === '') {
    next(new Error('Room number cannot be empty'));
  }
  next();
});

// Add validation to ensure guest name is not empty
inhouseSchema.pre('save', function(next) {
  if (!this.fullname || this.fullname.trim() === '') {
    next(new Error('Guest name cannot be empty'));
  }
  next();
});

// Add validation to ensure total people is positive
inhouseSchema.pre('save', function(next) {
  if (this.totalPeople <= 0) {
    next(new Error('Total people must be greater than 0'));
  }
  next();
});

// Add validation to ensure price is positive and remaining amount is not negative
inhouseSchema.pre('save', function(next) {
  if (this.price <= 0) {
    next(new Error('Price must be greater than 0'));
  }
  if (this.amountPaid > this.price) {
    next(new Error('Amount paid cannot exceed total price'));
  }
  next();
});

const Inhouse = mongoose.model('Inhouse', inhouseSchema);

export default Inhouse;
