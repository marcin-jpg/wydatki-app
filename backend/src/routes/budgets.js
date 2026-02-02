import express from 'express';
import { all, get, run } from '../db/database.js';
import { getBudgetStatus } from '../services/forecasting.js';

const router = express.Router();

// Get budgets for a specific month
router.get('/', async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ error: 'Month and year are required' });
    }

    const budgets = await all(
      `SELECT b.*, c.name as category_name, c.icon, c.color
       FROM budgets b
       JOIN categories c ON b.category_id = c.id
       WHERE b.month = ? AND b.year = ? AND c.type = 'expense'
       ORDER BY c.name`,
      [month, year]
    );

    // Get spending for each budget
    const enriched = [];
    for (const budget of budgets) {
      const transactions = await all(
        `SELECT SUM(amount) as total FROM transactions
         WHERE category_id = ? AND type = 'expense'
         AND strftime('%m', date) = ? AND strftime('%Y', date) = ?`,
        [budget.category_id, String(month).padStart(2, '0'), String(year)]
      );

      const spent = transactions[0]?.total || 0;
      enriched.push({
        ...budget,
        spent,
        remaining: budget.amount - spent,
        percentage: (spent / budget.amount) * 100,
        status: spent > budget.amount ? 'exceeded' : spent > budget.amount * 0.8 ? 'warning' : 'ok'
      });
    }

    res.json(enriched);
  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get budget by ID
router.get('/:id', async (req, res) => {
  try {
    const budget = await get(
      `SELECT b.*, c.name as category_name
       FROM budgets b
       JOIN categories c ON b.category_id = c.id
       WHERE b.id = ?`,
      [req.params.id]
    );

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    res.json(budget);
  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create or update budget
router.post('/', async (req, res) => {
  try {
    const { month, year, category_id, amount } = req.body;

    if (!month || !year || !category_id || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    // Check if budget already exists
    const existing = await get(
      'SELECT id FROM budgets WHERE month = ? AND year = ? AND category_id = ?',
      [month, year, category_id]
    );

    let result;
    if (existing) {
      await run(
        'UPDATE budgets SET amount = ? WHERE id = ?',
        [amount, existing.id]
      );
      result = await get('SELECT * FROM budgets WHERE id = ?', [existing.id]);
    } else {
      const insertResult = await run(
        'INSERT INTO budgets (month, year, category_id, amount) VALUES (?, ?, ?, ?)',
        [month, year, category_id, amount]
      );
      result = await get('SELECT * FROM budgets WHERE id = ?', [insertResult.id]);
    }

    res.json(result);
  } catch (error) {
    console.error('Create/update budget error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update budget
router.put('/:id', async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    await run('UPDATE budgets SET amount = ? WHERE id = ?', [amount, req.params.id]);

    const updated = await get('SELECT * FROM budgets WHERE id = ?', [req.params.id]);
    res.json(updated);
  } catch (error) {
    console.error('Update budget error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete budget
router.delete('/:id', async (req, res) => {
  try {
    await run('DELETE FROM budgets WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete budget error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get budget status for a month
router.get('/status/month', async (req, res) => {
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
