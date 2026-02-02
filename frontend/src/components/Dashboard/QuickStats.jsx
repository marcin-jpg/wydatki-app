import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import './Dashboard.css';

export function QuickStats({ stats }) {
  if (!stats) {
    return <div className="quick-stats loading">Ładowanie...</div>;
  }

  return (
    <div className="quick-stats">
      <div className="stat-card">
        <div className="stat-label">Przychody</div>
        <div className="stat-value income">{formatCurrency(stats.income)}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Wydatki</div>
        <div className="stat-value expense">{formatCurrency(stats.expense)}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Saldo</div>
        <div className={`stat-value ${stats.net >= 0 ? 'positive' : 'negative'}`}>
          {formatCurrency(stats.net)}
        </div>
      </div>
    </div>
  );
}
