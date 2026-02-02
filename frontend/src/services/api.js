import axios from 'axios';

// Dynamiczny URL API - lokalnie lub z produkcji
const getApiBase = () => {
  // W produkcji użyj zmiennej środowiskowej
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // W development'cie lokalne proxy
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return '/api';
  }
  // W produkcji użyj pełnego URL (jeśli backend jest na innej domenie)
  return `${window.location.origin}/api`;
};

const API_BASE = getApiBase();

const api = axios.create({
  baseURL: API_BASE
});

// Transactions
export const parseTransaction = (text) =>
  api.post('/transactions/parse', { text });

export const getTransactions = (params) =>
  api.get('/transactions', { params });

export const getTransaction = (id) =>
  api.get(`/transactions/${id}`);

export const updateTransaction = (id, data) =>
  api.put(`/transactions/${id}`, data);

export const deleteTransaction = (id) =>
  api.delete(`/transactions/${id}`);

export const getMonthlyStats = (month, year) =>
  api.get('/transactions/stats/monthly', { params: { month, year } });

// Categories
export const getCategories = (type) =>
  api.get('/categories', { params: type ? { type } : {} });

export const getCategory = (id) =>
  api.get(`/categories/${id}`);

export const createCategory = (data) =>
  api.post('/categories', data);

export const updateCategory = (id, data) =>
  api.put(`/categories/${id}`, data);

export const deleteCategory = (id) =>
  api.delete(`/categories/${id}`);

// Budgets
export const getBudgets = (month, year) =>
  api.get('/budgets', { params: { month, year } });

export const getBudget = (id) =>
  api.get(`/budgets/${id}`);

export const createBudget = (data) =>
  api.post('/budgets', data);

export const updateBudget = (id, data) =>
  api.put(`/budgets/${id}`, data);

export const deleteBudget = (id) =>
  api.delete(`/budgets/${id}`);

export const getBudgetStatus = (month, year) =>
  api.get('/budgets/status/month', { params: { month, year } });

// Recurring
export const getRecurringTransactions = (activeOnly = false) =>
  api.get('/recurring', { params: { active_only: activeOnly } });

export const getRecurringTransaction = (id) =>
  api.get(`/recurring/${id}`);

export const createRecurringTransaction = (data) =>
  api.post('/recurring', data);

export const updateRecurringTransaction = (id, data) =>
  api.put(`/recurring/${id}`, data);

export const deleteRecurringTransaction = (id) =>
  api.delete(`/recurring/${id}`);

export const processRecurringTransaction = (id) =>
  api.post(`/recurring/${id}/process`);

// Analytics
export const getCategoryBreakdown = (month, year) =>
  api.get('/analytics/breakdown', { params: { month, year } });

export const getTrendData = (months = 12) =>
  api.get('/analytics/trends', { params: { months } });

export const getAnalyticsMonthlyStats = (month, year) =>
  api.get('/analytics/monthly', { params: { month, year } });

export const getTopCategories = (type = 'expense', limit = 5) =>
  api.get('/analytics/top', { params: { type, limit } });

export const getBalance = () =>
  api.get('/analytics/balance');

export const getDailySpending = (month, year) =>
  api.get('/analytics/daily-spending', { params: { month, year } });

export const compareMonths = (year, month1, month2) =>
  api.get('/analytics/compare', { params: { year, month1, month2 } });

export const getForecast = (month, year) =>
  api.get('/analytics/forecast', { params: { month, year } });

export const getBudgetStatusAnalytics = (month, year) =>
  api.get('/analytics/budget-status', { params: { month, year } });

export default api;
