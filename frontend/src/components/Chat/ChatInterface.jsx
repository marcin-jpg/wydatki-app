import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import './Chat.css';

export function ChatInterface({ token }) {
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
      const response = await fetch('https://wydatki-app.onrender.com/api/transactions/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      });

      const data = await response.json();

      if (data.success) {
        setMessages(prev => [...prev, {
          type: 'transaction',
          role: 'assistant',
          content: 'Transakcja dodana!',
          data: data.transaction
        }]);
      } else {
        setMessages(prev => [...prev, {
          type: 'error',
          role: 'assistant',
          content: data.error || 'Nie udalo sie przetworzyc transakcji',
          data: null
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        type: 'error',
        role: 'assistant',
        content: 'Blad: ' + err.message,
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
