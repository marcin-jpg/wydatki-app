import React, { useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import './Dashboard.css';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#fa709a', '#fee140'];

export function CategoryBreakdown({ data }) {
  const [activeTab, setActiveTab] = useState('expense');

  if (!data) {
    return <div className="category-breakdown loading">Brak danych</div>;
  }

  const categories = activeTab === 'expense' ? data.expense : data.income;
  const total = activeTab === 'expense' ? data.totalExpense : data.totalIncome;

  const chartData = categories.map(cat => ({
    name: cat.name,
    value: cat.amount
  }));

  return (
    <div className="category-breakdown">
      <h3>📂 Rozkład kategorii</h3>
      <div className="category-tabs">
        <button
          className={`category-tab ${activeTab === 'expense' ? 'active' : ''}`}
          onClick={() => setActiveTab('expense')}
        >
          Wydatki
        </button>
        <button
          className={`category-tab ${activeTab === 'income' ? 'active' : ''}`}
          onClick={() => setActiveTab('income')}
        >
          Przychody
        </button>
      </div>

      {chartData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>

          <div className="category-list">
            {categories.map((cat, index) => (
              <div key={cat.id} className="category-item">
                <div className="category-icon">{cat.icon || '📦'}</div>
                <div className="category-info">
                  <p className="category-name">{cat.name}</p>
                  <p className="category-percentage">{cat.percentage.toFixed(1)}% ({cat.count} transakcji)</p>
                </div>
                <div className="category-amount">{formatCurrency(cat.amount)}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
          Brak transakcji w tej kategorii
        </div>
      )}
    </div>
  );
}
