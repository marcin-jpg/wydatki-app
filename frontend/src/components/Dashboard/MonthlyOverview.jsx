import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatDate } from '../../utils/formatters';
import './Dashboard.css';

export function MonthlyOverview({ data = [] }) {
  if (data.length === 0) {
    return <div className="monthly-overview loading">Brak danych</div>;
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          {payload.map((entry, index) => (
            <div key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="monthly-overview">
      <h3>Trendy (12 ostatnich miesięcy)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="income" fill="#27ae60" name="Przychody" />
          <Bar dataKey="expense" fill="#e74c3c" name="Wydatki" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
