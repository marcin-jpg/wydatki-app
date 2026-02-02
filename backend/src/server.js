import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './db/database.js';
import { verifyToken } from './middleware/auth.js';
import authRouter from './routes/auth.js';
import transactionsRouter from './routes/transactions.js';
import categoriesRouter from './routes/categories.js';
import budgetsRouter from './routes/budgets.js';
import recurringRouter from './routes/recurring.js';
import analyticsRouter from './routes/analytics.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRouter);

// Protected routes
app.use('/api/transactions', verifyToken, transactionsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/budgets', verifyToken, budgetsRouter);
app.use('/api/recurring', verifyToken, recurringRouter);
app.use('/api/analytics', verifyToken, analyticsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
async function start() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
