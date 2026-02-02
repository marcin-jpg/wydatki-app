import express from 'express';
import { all, get, run } from '../db/database.js';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    let query = 'SELECT * FROM categories';
    const params = [];

    if (type) {
      query += ' WHERE type = ?';
      params.push(type);
    }

    query += ' ORDER BY name';
    const categories = await all(query, params);
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await get('SELECT * FROM categories WHERE id = ?', [req.params.id]);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create category
router.post('/', async (req, res) => {
  try {
    const { name, type, color, icon } = req.body;

    if (!name || !type) {
      return res.status(400).json({ error: 'Name and type are required' });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'Type must be "income" or "expense"' });
    }

    const result = await run(
      'INSERT INTO categories (name, type, color, icon) VALUES (?, ?, ?, ?)',
      [name, type, color || null, icon || null]
    );

    res.json({
      id: result.id,
      name,
      type,
      color: color || null,
      icon: icon || null
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Category with this name already exists' });
    }
    console.error('Create category error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update category
router.put('/:id', async (req, res) => {
  try {
    const { name, color, icon } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    await run(
      'UPDATE categories SET name = ?, color = ?, icon = ? WHERE id = ?',
      [name, color || null, icon || null, req.params.id]
    );

    const updated = await get('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    res.json(updated);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete category
router.delete('/:id', async (req, res) => {
  try {
    // Check if category is used
    const used = await get(
      'SELECT COUNT(*) as count FROM transactions WHERE category_id = ?',
      [req.params.id]
    );

    if (used.count > 0) {
      return res.status(400).json({ error: 'Cannot delete category with existing transactions' });
    }

    await run('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
