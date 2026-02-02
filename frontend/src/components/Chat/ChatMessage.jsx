import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import './Chat.css';

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
                  {data.type === 'income' ? '+' : '-'}{formatCurrency(data.amount)}
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
