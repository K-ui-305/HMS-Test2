import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  location: { type: String, required: true }, 
  roomNo: { type: String, required: true },
  totalPeople: { type: Number, required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  price: { type: Number, required: true },
  mobile: { type: String, required: true },
  notice: { type: String },
  createdAt: { type: Date, default: Date.now },
  inHouse: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['unpaid', 'partially_paid', 'paid'], default: 'unpaid' },
  amountPaid: { type: Number, default: 0 },
  remainingAmount: { 
    type: Number,
    default: function() {
      return this.price - this.amountPaid;
    }
  }
});

// Add validation to ensure check-out date is after check-in date
bookingSchema.pre('save', function(next) {
  if (this.checkOutDate <= this.checkInDate) {
    next(new Error('Check-out date must be after check-in date'));
  }
  next();
});

// Add validation to ensure remaining amount is not negative
bookingSchema.pre('save', function(next) {
  if (this.amountPaid > this.price) {
    next(new Error('Amount paid cannot exceed total price'));
  }
  next();
});

// Add validation to ensure total people is positive
bookingSchema.pre('save', function(next) {
  if (this.totalPeople <= 0) {
    next(new Error('Total people must be greater than 0'));
  }
  next();
});

// Add validation to ensure price is positive
bookingSchema.pre('save', function(next) {
  if (this.price <= 0) {
    next(new Error('Price must be greater than 0'));
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
