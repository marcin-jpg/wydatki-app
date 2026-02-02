import express from 'express';
import { all, get, run } from '../db/database.js';
import { parseTransaction, validateParsedTransaction } from '../services/nlpParser.js';
import { getMonthYear } from '../utils/dateHelpers.js';

const router = express.Router();

// Parse natural language and create transaction
router.post('/parse', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const parsed = parseTransaction(text);
    const validation = validateParsedTransaction(parsed);

    if (!validation.valid) {
      return res.status(400).json({ error: 'Invalid transaction', errors: validation.errors });
    }

    // Get or create category
    let category = await get(
      'SELECT id FROM categories WHERE LOWER(name) = LOWER(?) AND type = ?',
      [parsed.category, parsed.type]
    );

    if (!category) {
      // Create category automatically
      const newCat = await run(
        'INSERT INTO categories (name, type, color, icon) VALUES (?, ?, ?, ?)',
        [parsed.category, parsed.type, '#667eea', '📦']
      );
      category = { id: newCat.id };
    }

    // Create transaction
    const result = await run(
      'INSERT INTO transactions (user_id, date, amount, type, category_id, description) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, parsed.date, parsed.amount, parsed.type, category.id, parsed.description]
    );

    res.json({
      success: true,
      id: result.id,
      transaction: {
        id: result.id,
        date: parsed.date,
        amount: parsed.amount,
        type: parsed.type,
        category: parsed.category,
        description: parsed.description,
        confidence: parsed.confidence
      }
    });
  } catch (error) {
    console.error('Parse error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const { month, year, type, category_id, limit, offset } = req.query;
    let query = `SELECT t.*, c.name as category_name, c.icon
                 FROM transactions t
                 JOIN categories c ON t.category_id = c.id`;
    const params = [];

    const conditions = ['t.user_id = ?'];
    params.push(req.user.id);
    if (month && year) {
      conditions.push(`strftime('%m', t.date) = ? AND strftime('%Y', t.date) = ?`);
      params.push(String(month).padStart(2, '0'), String(year));
    }
    if (type) {
      conditions.push('t.type = ?');
      params.push(type);
    }
    if (category_id) {
      conditions.push('t.category_id = ?');
      params.push(category_id);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY t.date DESC';

    if (limit) {
      query += ' LIMIT ?';
      params.push(limit);
      if (offset) {
        query += ' OFFSET ?';
        params.push(offset);
      }
    }

    const transactions = await all(query, params);
    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const transaction = await get(
      `SELECT t.*, c.name as category_name, c.icon
       FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE t.id = ?`,
      [req.params.id]
    );

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update transaction
router.put('/:id', async (req, res) => {
  try {
    const { amount, type, category_id, date, description } = req.body;

    if (!amount || !type || !category_id || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await run(
      'UPDATE transactions SET amount = ?, type = ?, category_id = ?, date = ?, description = ? WHERE id = ?',
      [amount, type, category_id, date, description, req.params.id]
    );

    const updated = await get(
      `SELECT t.*, c.name as category_name
       FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE t.id = ?`,
      [req.params.id]
    );

    res.json(updated);
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    await run('DELETE FROM transactions WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get monthly summary
router.get('/stats/monthly', async (req, res) => {
  try {
    const { month, year } = req.query;
    const { month: currentMonth, year: currentYear } = getMonthYear();

    const m = month || currentMonth;
    const y = year || currentYear;

    const [incomeResult, expenseResult] = await Promise.all([
      all(
        `SELECT SUM(amount) as total FROM transactions
         WHERE type = 'income' AND strftime('%m', date) = ? AND strftime('%Y', date) = ?`,
        [String(m).padStart(2, '0'), String(y)]
      ),
      all(
        `SELECT SUM(amount) as total FROM transactions
         WHERE type = 'expense' AND strftime('%m', date) = ? AND strftime('%Y', date) = ?`,
        [String(m).padStart(2, '0'), String(y)]
      )
    ]);

    const income = incomeResult[0]?.total || 0;
    const expense = expenseResult[0]?.total || 0;

    res.json({
      month: m,
      year: y,
      income,
      expense,
      net: income - expense
    });
  } catch (error) {
    console.error('Monthly stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
