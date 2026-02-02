import { all, get } from '../db/database.js';

export async function getCategoryBreakdown(year, month) {
  const transactions = await all(
    `SELECT c.id, c.name, c.icon, c.type, SUM(t.amount) as total, COUNT(t.id) as count
     FROM transactions t
     JOIN categories c ON t.category_id = c.id
     WHERE strftime('%Y', t.date) = ? AND strftime('%m', t.date) = ?
     GROUP BY c.id, c.name, c.type, c.icon
     ORDER BY total DESC`,
    [String(year), String(month).padStart(2, '0')]
  );

  const breakdown = { income: [], expense: [] };
  let totalIncome = 0;
  let totalExpense = 0;

  for (const t of transactions) {
    const item = {
      id: t.id,
      name: t.name,
      icon: t.icon,
      amount: t.total,
      count: t.count,
      percentage: 0
    };

    if (t.type === 'income') {
      totalIncome += t.total;
      breakdown.income.push(item);
    } else {
      totalExpense += t.total;
      breakdown.expense.push(item);
    }
  }

  // Calculate percentages
  for (const item of breakdown.income) {
    item.percentage = totalIncome > 0 ? (item.amount / totalIncome) * 100 : 0;
  }
  for (const item of breakdown.expense) {
    item.percentage = totalExpense > 0 ? (item.amount / totalExpense) * 100 : 0;
  }

  return {
    income: breakdown.income,
    expense: breakdown.expense,
    totalIncome,
    totalExpense,
    netCashFlow: totalIncome - totalExpense
  };
}

export async function getTrendData(months = 12) {
  const trends = [];
  const today = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    const incomeResult = await all(
      `SELECT SUM(amount) as total FROM transactions
       WHERE type = 'income' AND strftime('%Y', date) = ? AND strftime('%m', date) = ?`,
      [String(year), month]
    );

    const expenseResult = await all(
      `SELECT SUM(amount) as total FROM transactions
       WHERE type = 'expense' AND strftime('%Y', date) = ? AND strftime('%m', date) = ?`,
      [String(year), month]
    );

    const income = incomeResult[0]?.total || 0;
    const expense = expenseResult[0]?.total || 0;

    trends.push({
      date: `${date.toLocaleString('pl-PL', { month: 'short' })} ${year}`,
      year,
      month: date.getMonth() + 1,
      income,
      expense,
      net: income - expense
    });
  }

  return trends;
}

export async function getMonthlyStats(year, month) {
  const [incomeData, expenseData] = await Promise.all([
    all(
      `SELECT c.name, SUM(t.amount) as total
       FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE t.type = 'income' AND strftime('%Y', t.date) = ? AND strftime('%m', t.date) = ?
       GROUP BY c.name
       ORDER BY total DESC`,
      [String(year), String(month).padStart(2, '0')]
    ),
    all(
      `SELECT c.name, SUM(t.amount) as total
       FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE t.type = 'expense' AND strftime('%Y', t.date) = ? AND strftime('%m', t.date) = ?
       GROUP BY c.name
       ORDER BY total DESC`,
      [String(year), String(month).padStart(2, '0')]
    )
  ]);

  const totalIncome = incomeData.reduce((sum, item) => sum + item.total, 0);
  const totalExpense = expenseData.reduce((sum, item) => sum + item.total, 0);

  return {
    month,
    year,
    income: {
      items: incomeData,
      total: totalIncome
    },
    expense: {
      items: expenseData,
      total: totalExpense
    },
    net: totalIncome - totalExpense,
    savingRate: totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0
  };
}

export async function getTopCategories(type = 'expense', limit = 5) {
  return all(
    `SELECT c.id, c.name, c.icon, c.color, SUM(t.amount) as total, COUNT(t.id) as count
     FROM transactions t
     JOIN categories c ON t.category_id = c.id
     WHERE t.type = ?
     GROUP BY c.id, c.name, c.icon, c.color
     ORDER BY total DESC
     LIMIT ?`,
    [type, limit]
  );
}

export async function getBalance() {
  const result = await all(
    `SELECT
      (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'income') as total_income,
      (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'expense') as total_expense`
  );

  const { total_income, total_expense } = result[0] || { total_income: 0, total_expense: 0 };
  return {
    income: total_income,
    expense: total_expense,
    balance: total_income - total_expense
  };
}

export async function getDailySpending(year, month) {
  const days = await all(
    `SELECT DATE(date) as day, SUM(amount) as total
     FROM transactions
     WHERE type = 'expense' AND strftime('%Y', date) = ? AND strftime('%m', date) = ?
     GROUP BY DATE(date)
     ORDER BY day ASC`,
    [String(year), String(month).padStart(2, '0')]
  );

  return days;
}

export async function compareMonths(year, month1, month2) {
  const [stats1, stats2] = await Promise.all([
    getMonthlyStats(year, month1),
    getMonthlyStats(year, month2)
  ]);

  return {
    month1: stats1,
    month2: stats2,
    incomeChange: stats2.income.total - stats1.income.total,
    expenseChange: stats2.expense.total - stats1.expense.total,
    netChange: stats2.net - stats1.net
  };
}
