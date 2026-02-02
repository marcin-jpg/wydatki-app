import React from 'react';
import { formatDate } from '../../utils/formatters';
import './Chat.css';

const CURRENCY_SYMBOLS = {
  'PLN': 'zł',
  'EUR': '€',
  'USD': '$',
  'GBP': '£',
  'CHF': 'CHF',
  'CZK': 'Kč',
  'NOK': 'kr',
  'SEK': 'kr',
  'UAH': '₴',
  'JPY': '¥',
  'CNY': '¥',
  'BTC': '₿',
  'ETH': 'Ξ'
};

function formatAmount(amount, currency) {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  return `${amount.toFixed(2)} ${symbol}`;
}

export function ChatMessage({ message }) {
  const { type, role, content, data } = message;

  if (role === 'user') {
    return (
      <div className="message user-message">
        <div className="message-content">{content}</div>
      </div>
    );
  }

  if (type === 'transaction') {
    return (
      <div className="message assistant-message">
        <div className="message-content">
          <div className="transaction-confirmation">
            <div className="transaction-icon">
              {data.type === 'income' ? '📈' : '📉'}
            </div>
            <div className="transaction-details">
              <p className="transaction-main">
                <span className="category-badge">{data.category}</span>
                {' '}
                <span className={`amount ${data.type}`}>
                  {data.type === 'income' ? '+' : '-'}{formatAmount(data.amount, data.currency || 'PLN')}
                </span>
              </p>
              <p className="transaction-meta">
                {formatDate(data.date)}
              </p>
            </div>
            <div className="checkmark">✓</div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'error') {
    return (
      <div className="message assistant-message error">
        <div className="message-content">
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {content}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'info') {
    return (
      <div className="message assistant-message">
        <div className="message-content">{content}</div>
      </div>
    );
  }

  return (
    <div className="message assistant-message">
      <div className="message-content">{content}</div>
    </div>
  );
}
