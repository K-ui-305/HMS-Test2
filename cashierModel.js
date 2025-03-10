import mongoose from 'mongoose';

const cashierSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    validate: {
      validator: function(v) {
        return v > 0;
      },
      message: 'Amount must be greater than 0'
    }
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cash', 'card', 'online']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  }
});

// Add validation to ensure amount is positive
cashierSchema.pre('save', function(next) {
  if (this.amount <= 0) {
    next(new Error('Amount must be greater than 0'));
  }
  next();
});

const Cashier = mongoose.model('Cashier', cashierSchema);

export default Cashier;
