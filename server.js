import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';  // Load environment variables from .env file
import cors from 'cors';
const app = express();

dotenv.config();  // Initialize dotenv

// Import user routes
import userRouter from './routes/userRouter.js';
import bookingRouter from './routes/bookingRouter.js';
import cashierRouter from './routes/cashierRouter.js';
import inhouseRouter from './routes/inhouseRouter.js';

// Enable CORS before other middleware
app.use(cors({
  origin: 'http://127.0.0.1:5500',
}));

app.get('/api/endpoint', (req, res) => {
  res.json({ message: 'CORS enabled!' });
});

// Middleware to parse incoming JSON
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/hotel_management", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB successfully');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Test route
app.get('/', (req, res) => {
  res.send('Hotel Management System - Backend is Working!');
});

// API routes
app.use('/api', userRouter);
app.use('/api', bookingRouter);
app.use('/api', cashierRouter);
app.use('/api', inhouseRouter);

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
