const API_BASE = 'https://wydatki-app.onrender.com/api';

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

async function apiCall(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: getHeaders()
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'API Error');
  }
  return { data };
}

// Transactions
export const parseTransaction = (text) =>
  apiCall('/transactions/parse', { method: 'POST', body: JSON.stringify({ text }) });

export const getTransactions = (params) => {
  const query = new URLSearchParams(params).toString();
  return apiCall(`/transactions?${query}`);
};

// Categories
export const getCategories = (type) =>
  apiCall(`/categories${type ? `?type=${type}` : ''}`);

// Budgets
export const getBudgets = (month, year) =>
  apiCall(`/budgets?month=${month}&year=${year}`);

// Analytics
export const getCategoryBreakdown = (month, year) =>
  apiCall(`/analytics/breakdown?month=${month}&year=${year}`);

export const getTrendData = (months = 12) =>
  apiCall(`/analytics/trends?months=${months}`);

export const getAnalyticsMonthlyStats = (month, year) =>
  apiCall(`/analytics/monthly?month=${month}&year=${year}`);

export const getBalance = () =>
  apiCall('/analytics/balance');

export const getForecast = (month, year) =>
  apiCall(`/analytics/forecast?month=${month}&year=${year}`);
