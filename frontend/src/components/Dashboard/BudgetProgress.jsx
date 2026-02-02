import React from 'react';
import { formatCurrency, getPercentageColor } from '../../utils/formatters';
import './Dashboard.css';

export function BudgetProgress({ budgets }) {
  if (!budgets || budgets.length === 0) {
    return (
      <div className="budget-overview">
        <h3>💰 Budżety</h3>
        <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
          Brak ustawionych budżetów
        </div>
      </div>
    );
  }

  return (
    <div className="budget-overview">
      <h3>💰 Budżety</h3>
      <div className="category-list">
        {budgets.map((budget) => (
          <div key={budget.id} className="budget-item">
            <div className="budget-label">
              <p className="budget-name">{budget.categoryName}</p>
              <div className="budget-progress">
                <div
                  className={`budget-bar ${budget.status === 'exceeded' ? 'exceeded' : budget.status === 'warning' ? 'warning' : ''}`}
                  style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                />
              </div>
            </div>
            <div className="budget-amount">
              <p className="budget-spent">{formatCurrency(budget.spent)}</p>
              <p className="budget-limit">z {formatCurrency(budget.budgetAmount)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
