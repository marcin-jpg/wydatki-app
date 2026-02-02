import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { parseTransaction, getBalance } from '../../services/api';
import { getMonthYear, formatCurrency } from '../../utils/formatters';
import './Chat.css';

export function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      type: 'info',
      role: 'assistant',
      content: 'Cześć! 👋 Jestem Twoim asystentem finansowym. Możesz dodawać transakcje w naturalnym języku polskim.',
      data: null
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text) => {
    // Add user message
    setMessages(prev => [...prev, {
      type: 'text',
      role: 'user',
      content: text,
      data: null
    }]);

    setIsLoading(true);

    try {
      const response = await parseTransaction(text);
      const { success, transaction, error } = response.data;

      if (success) {
        setMessages(prev => [...prev, {
          type: 'transaction',
          role: 'assistant',
          content: 'Transakcja dodana!',
          data: transaction
        }]);
      } else {
        setMessages(prev => [...prev, {
          type: 'error',
          role: 'assistant',
          content: error || 'Nie udało się przetworzyć transakcji',
          data: null
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        type: 'error',
        role: 'assistant',
        content: 'Błąd: ' + (err.response?.data?.error || err.message),
        data: null
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    'Wydałem 50 zł na obiad',
    'Pensja 5000 zł',
    'Kupił nowe buty za 200 zł',
    'Rachunek za prąd 150 zł'
  ];

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h2>💬 Asystent Finansowy</h2>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput
        onSend={handleSend}
        isLoading={isLoading}
        suggestions={suggestions}
      />
    </div>
  );
}
