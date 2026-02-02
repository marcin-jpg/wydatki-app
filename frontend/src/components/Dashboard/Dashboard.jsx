import React, { useState, useEffect } from 'react';
import { QuickStats } from './QuickStats';
import { MonthlyOverview } from './MonthlyOverview';
import { CategoryBreakdown } from './CategoryBreakdown';
import { BudgetProgress } from './BudgetProgress';
import * as api from '../../services/api';
import { getMonthYear, getMonthName } from '../../utils/formatters';
import './Dashboard.css';

export function Dashboard() {
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [breakdown, setBreakdown] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  const { month, year } = getMonthYear();

  useEffect(() => {
    loadDashboardData();
  }, [month, year]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, trendsRes, breakdownRes, budgetsRes, forecastRes] = await Promise.all([
        api.getAnalyticsMonthlyStats(month, year),
        api.getTrendData(12),
        api.getCategoryBreakdown(month, year),
        api.getBudgets(month, year),
        api.getForecast(month, year)
      ]);

      setStats({
        income: statsRes.data.income.total,
        expense: statsRes.data.expense.total,
        net: statsRes.data.net
      });
      setTrends(trendsRes.data);
      setBreakdown(breakdownRes.data);
      setBudgets(budgetsRes.data);
      setForecast(forecastRes.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard loading">Ładowanie...</div>;
  }

  return (
    <div className="dashboard">
      <h1>📊 Dashboard • {getMonthName(month)} {year}</h1>

      <QuickStats stats={stats} />

      <div className="dashboard-grid">
        <MonthlyOverview data={trends} />
        <CategoryBreakdown data={breakdown} />
      </div>

      <div className="dashboard-grid">
        <BudgetProgress budgets={budgets} />
        <ForecastSection forecast={forecast} />
      </div>
    </div>
  );
}

function ForecastSection({ forecast }) {
  if (!forecast) {
    return <div className="forecast-section loading">Ładowanie prognoz...</div>;
  }

  return (
    <div className="forecast-section">
      <h3>🔮 Prognozy na koniec miesiąca</h3>
      <div className="forecast-item">
        <span className="forecast-label">Prognozowane wydatki</span>
        <span className="forecast-value">
          {new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(forecast.projected)}
        </span>
      </div>
      <div className="forecast-item">
        <span className="forecast-label">Już wydano</span>
        <span className="forecast-value">
          {new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(forecast.spent)}
        </span>
      </div>
      <div className="forecast-item">
        <span className="forecast-label">Pozostało do wydania</span>
        <span className="forecast-value">
          {new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(forecast.remaining)}
        </span>
      </div>
    </div>
  );
}
