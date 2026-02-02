import { startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { all, get } from '../db/database.js';

export async function forecastMonthlyExpenses(year, month) {
  // Get all transactions for the past 3 months
  const pastExpenses = await getPastTransactionsByMonth(year, month, 3);

  // Get recurring transactions
  const recurring = await all('SELECT * FROM recurring_transactions WHERE is_active = 1');

  // Calculate forecast
  const forecast = {
    total: 0,
    byCategory: {},
    recurring: {},
    average: 0,
    daysInMonth: 0,
    remainingDays: 0
  };

  // Get current month boundaries
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const today = new Date();

  forecast.daysInMonth = lastDay.getDate();
  forecast.remainingDays = Math.max(0, lastDay.getDate() - today.getDate());

  // Calculate average daily expense from past months
  let totalDaysConsidered = 0;
  const categoryAverages = {};

  for (const monthData of pastExpenses) {
    for (const [category, total] of Object.entries(monthData.byCategory)) {
      if (!categoryAverages[category]) {
        categoryAverages[category] = { total: 0, count: 0 };
      }
      categoryAverages[category].total += total;
      categoryAverages[category].count += 1;
    }
    totalDaysConsidered += monthData.daysInMonth;
  }

  // Calculate projections based on averages
  for (const [category, data] of Object.entries(categoryAverages)) {
    const avgPerMonth = data.total / data.count;
    forecast.byCategory[category] = avgPerMonth;
    forecast.total += avgPerMonth;
  }

  // Add recurring transactions
  for (const rec of recurring) {
    const categoryName = await getCategoryName(rec.category_id);
    const occurrences = calculateOccurrences(new Date(year, month - 1, 1), lastDay, rec.frequency);

    if (!forecast.byCategory[categoryName]) {
      forecast.byCategory[categoryName] = 0;
    }

    const recurringAmount = rec.amount * occurrences;
    forecast.byCategory[categoryName] += recurringAmount;
    forecast.recurring[rec.name] = {
      amount: recurringAmount,
      frequency: rec.frequency,
      occurrences
    };
    forecast.total += recurringAmount;
  }

  // Get current month expenses
  const currentMonthExpenses = await getTransactionsByMonth(year, month, 'expense');
  const spent = currentMonthExpenses.reduce((sum, t) => sum + t.amount, 0);

  forecast.spent = spent;
  forecast.projected = forecast.total;
  forecast.remaining = forecast.total - spent;

  return forecast;
}

export async function forecastBalance(year, month) {
  // Get all transactions up to current month
  const allTransactions = await all(
    'SELECT type, amount FROM transactions WHERE date <= ? AND type IN ("income", "expense")',
    [new Date(year, month - 1, 1).toISOString().split('T')[0]]
  );

  let balance = 0;
  for (const t of allTransactions) {
    balance += t.type === 'income' ? t.amount : -t.amount;
  }

  return balance;
}

export async function getBudgetStatus(year, month) {
  const budgets = await all(
    `SELECT b.*, c.name as category_name, c.type
     FROM budgets b
     JOIN categories c ON b.category_id = c.id
     WHERE b.month = ? AND b.year = ?`,
    [month, year]
  );

  const result = [];
  for (const budget of budgets) {
    const transactions = await all(
      `SELECT SUM(amount) as total FROM transactions
       WHERE category_id = ? AND type = ? AND strftime('%m', date) = ? AND strftime('%Y', date) = ?`,
      [budget.category_id, 'expense', String(month).padStart(2, '0'), year]
    );

    const spent = transactions[0]?.total || 0;
    const percentage = (spent / budget.amount) * 100;

    result.push({
      categoryId: budget.category_id,
      categoryName: budget.category_name,
      budgetAmount: budget.amount,
      spent,
      remaining: budget.amount - spent,
      percentage,
      status: percentage > 100 ? 'exceeded' : percentage > 80 ? 'warning' : 'ok'
    });
  }

  return result;
}

async function getPastTransactionsByMonth(year, month, monthsBack) {
  const result = [];

  for (let i = monthsBack; i > 0; i--) {
    let m = month - i;
    let y = year;

    while (m <= 0) {
      m += 12;
      y -= 1;
    }

    const transactions = await getTransactionsByMonth(y, m, 'expense');
    const byCategory = {};

    for (const t of transactions) {
      const categoryName = await getCategoryName(t.category_id);
      if (!byCategory[categoryName]) {
        byCategory[categoryName] = 0;
      }
      byCategory[categoryName] += t.amount;
    }

    const firstDay = new Date(y, m - 1, 1);
    const lastDay = new Date(y, m, 0);

    result.push({
      year: y,
      month: m,
      daysInMonth: lastDay.getDate(),
      byCategory,
      total: transactions.reduce((sum, t) => sum + t.amount, 0)
    });
  }

  return result;
}

async function getTransactionsByMonth(year, month, type) {
  return all(
    `SELECT * FROM transactions
     WHERE type = ? AND strftime('%m', date) = ? AND strftime('%Y', date) = ?`,
    [type, String(month).padStart(2, '0'), year]
  );
}

async function getCategoryName(categoryId) {
  const category = await get('SELECT name FROM categories WHERE id = ?', [categoryId]);
  return category?.name || 'Inne';
}

function calculateOccurrences(startDate, endDate, frequency) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let occurrences = 0;

  switch (frequency) {
    case 'daily':
      occurrences = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
      break;
    case 'weekly':
      occurrences = Math.floor((end - start) / (1000 * 60 * 60 * 24 * 7)) + 1;
      break;
    case 'biweekly':
      occurrences = Math.floor((end - start) / (1000 * 60 * 60 * 24 * 14)) + 1;
      break;
    case 'monthly':
      occurrences = 1;
      break;
    case 'quarterly':
      occurrences = (end.getMonth() - start.getMonth()) / 3;
      break;
    case 'yearly':
      occurrences = (end.getFullYear() - start.getFullYear());
      break;
    default:
      occurrences = 1;
  }

  return Math.max(1, occurrences);
}
