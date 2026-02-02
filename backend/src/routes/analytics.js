import express from 'express';
import {
  getCategoryBreakdown,
  getTrendData,
  getMonthlyStats,
  getTopCategories,
  getBalance,
  getDailySpending,
  compareMonths
} from '../services/analytics.js';
import { forecastMonthlyExpenses, forecastBalance, getBudgetStatus } from '../services/forecasting.js';

const router = express.Router();

// Get category breakdown for a month
router.get('/breakdown', async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ error: 'Month and year are required' });
    }

    const breakdown = await getCategoryBreakdown(year, month);
    res.json(breakdown);
  } catch (error) {
    console.error('Get breakdown error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get trend data
router.get('/trends', async (req, res) => {
  try {
    const { months = 12 } = req.query;
    const trends = await getTrendData(parseInt(months));
    res.json(trends);
  } catch (error) {
    console.error('Get trends error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get monthly stats
router.get('/monthly', async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ error: 'Month and year are required' });
    }

    const stats = await getMonthlyStats(year, month);
    res.json(stats);
  } catch (error) {
    console.error('Get monthly stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get top categories
router.get('/top', async (req, res) => {
  try {
    const { type = 'expense', limit = 5 } = req.query;
    const topCategories = await getTopCategories(type, parseInt(limit));
    res.json(topCategories);
  } catch (error) {
    console.error('Get top categories error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get balance
router.get('/balance', async (req, res) => {
  try {
    const balance = await getBalance();
    res.json(balance);
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get daily spending
router.get('/daily-spending', async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ error: 'Month and year are required' });
    }

    const daily = await getDailySpending(year, month);
    res.json(daily);
  } catch (error) {
    console.error('Get daily spending error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Compare two months
router.get('/compare', async (req, res) => {
  try {
    const { year, month1, month2 } = req.query;

    if (!year || !month1 || !month2) {
      return res.status(400).json({ error: 'Year, month1, and month2 are required' });
    }

    const comparison = await compareMonths(year, month1, month2);
    res.json(comparison);
  } catch (error) {
    console.error('Compare months error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get forecast
router.get('/forecast', async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ error: 'Month and year are required' });
    }

    const forecast = await forecastMonthlyExpenses(year, month);
    res.json(forecast);
  } catch (error) {
    console.error('Get forecast error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get budget status
router.get('/budget-status', async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ error: 'Month and year are required' });
    }

    const status = await getBudgetStatus(year, month);
    res.json(status);
  } catch (error) {
    console.error('Get budget status error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
