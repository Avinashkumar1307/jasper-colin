import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import { apiLimiter, authLimiter } from './middleware/rateLimiter';
import productRoutes from './routes/products';
import authRoutes from './routes/auth';

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Rate limiting
app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', pid: process.pid });
});

export default app;
