import express from 'express';
import { all, get, run } from '../db/database.js';
import { addMonths, addWeeks, addDays } from 'date-fns';

const router = express.Router();

// Get all recurring transactions
router.get('/', async (req, res) => {
  try {
    const { active_only } = req.query;
    let query = `SELECT rt.*, c.name as category_name
                 FROM recurring_transactions rt
                 JOIN categories c ON rt.category_id = c.id`;
    const params = [];

    if (active_only === 'true') {
      query += ' WHERE rt.is_active = 1';
    }

    query += ' ORDER BY rt.next_date ASC';

    const recurring = await all(query, params);
    res.json(recurring);
  } catch (error) {
    console.error('Get recurring error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get recurring transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const recurring = await get(
      `SELECT rt.*, c.name as category_name
       FROM recurring_transactions rt
       JOIN categories c ON rt.category_id = c.id
       WHERE rt.id = ?`,
      [req.params.id]
    );

    if (!recurring) {
      return res.status(404).json({ error: 'Recurring transaction not found' });
    }

    res.json(recurring);
  } catch (error) {
    console.error('Get recurring error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create recurring transaction
router.post('/', async (req, res) => {
  try {
    const { name, amount, type, category_id, frequency, next_date } = req.body;

    if (!name || !amount || !type || !category_id || !frequency || !next_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly'].includes(frequency)) {
      return res.status(400).json({ error: 'Invalid frequency' });
    }

    const result = await run(
      `INSERT INTO recurring_transactions (name, amount, type, category_id, frequency, next_date, is_active)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [name, amount, type, category_id, frequency, next_date]
    );

    res.json({
      id: result.id,
      name,
      amount,
      type,
      category_id,
      frequency,
      next_date,
      is_active: 1
    });
  } catch (error) {
    console.error('Create recurring error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update recurring transaction
router.put('/:id', async (req, res) => {
  try {
    const { name, amount, frequency, next_date, is_active } = req.body;

    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (amount !== undefined) {
      updates.push('amount = ?');
      params.push(amount);
    }
    if (frequency !== undefined) {
      updates.push('frequency = ?');
      params.push(frequency);
    }
    if (next_date !== undefined) {
      updates.push('next_date = ?');
      params.push(next_date);
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?');
      params.push(is_active ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(req.params.id);
    await run(`UPDATE recurring_transactions SET ${updates.join(', ')} WHERE id = ?`, params);

    const updated = await get(
      `SELECT rt.*, c.name as category_name
       FROM recurring_transactions rt
       JOIN categories c ON rt.category_id = c.id
       WHERE rt.id = ?`,
      [req.params.id]
    );

    res.json(updated);
  } catch (error) {
    console.error('Update recurring error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete recurring transaction
router.delete('/:id', async (req, res) => {
  try {
    await run('DELETE FROM recurring_transactions WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete recurring error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Process recurring transactions (create transaction from recurring template)
router.post('/:id/process', async (req, res) => {
  try {
    const recurring = await get(
      'SELECT * FROM recurring_transactions WHERE id = ?',
      [req.params.id]
    );

    if (!recurring) {
      return res.status(404).json({ error: 'Recurring transaction not found' });
    }

    const today = new Date().toISOString().split('T')[0];

    // Create transaction
    const result = await run(
      `INSERT INTO transactions (date, amount, type, category_id, description, is_recurring)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [today, recurring.amount, recurring.type, recurring.category_id, recurring.name]
    );

    // Calculate next date
    const nextDate = calculateNextDate(recurring.next_date, recurring.frequency);

    // Update next_date in recurring transaction
    await run(
      'UPDATE recurring_transactions SET next_date = ? WHERE id = ?',
      [nextDate, req.params.id]
    );

    res.json({
      success: true,
      transactionId: result.id,
      nextDate
    });
  } catch (error) {
    console.error('Process recurring error:', error);
    res.status(500).json({ error: error.message });
  }
});

function calculateNextDate(currentDate, frequency) {
  const date = new Date(currentDate);

  switch (frequency) {
    case 'daily':
      return addDays(date, 1).toISOString().split('T')[0];
    case 'weekly':
      return addWeeks(date, 1).toISOString().split('T')[0];
    case 'biweekly':
      return addWeeks(date, 2).toISOString().split('T')[0];
    case 'monthly':
      return addMonths(date, 1).toISOString().split('T')[0];
    case 'quarterly':
      return addMonths(date, 3).toISOString().split('T')[0];
    case 'yearly':
      return addMonths(date, 12).toISOString().split('T')[0];
    default:
      return currentDate;
  }
}

export default router;
