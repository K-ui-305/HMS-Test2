import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define schema for User
const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  hotelname: { type: String, required: true }, 
  totalRoom: { 
    type: Number, 
    required: true,
    validate: {
      validator: function(v) {
        return v > 0;
      },
      message: 'Total rooms must be greater than 0'
    }
  },
  mobile: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  password: { 
    type: String, 
    required: true,
    minlength: [8, 'Password must be at least 8 characters long']
  },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date }
}, { timestamps: true });

// Hash the password before saving the user
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Password comparison method with login attempt tracking
userSchema.methods.matchPassword = async function(enteredPassword) {
  // Check if account is locked
  if (this.lockUntil && this.lockUntil > Date.now()) {
    throw new Error('Account is locked. Try again later.');
  }

  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  
  if (!isMatch) {
    // Increment login attempts
    this.loginAttempts += 1;
    
    // Lock account after 5 failed attempts
    if (this.loginAttempts >= 5) {
      this.lockUntil = new Date(Date.now() + 30*60*1000); // Lock for 30 minutes
    }
    
    await this.save();
    return false;
  }

  // Reset login attempts on successful login
  this.loginAttempts = 0;
  this.lastLogin = new Date();
  await this.save();
  
  return true;
};

// Create model from schema
const User = mongoose.model('User', userSchema);

// Correct export for ES Modules 
export default User;
