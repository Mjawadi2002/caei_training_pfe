import React, { useState, useRef, useEffect } from 'react';
import { IoSend } from 'react-icons/io5';
import { IoMdClose } from 'react-icons/io';
import axios from 'axios';

// Typing dots animation
const TypingDots = () => (
  <span className="typing-dots">
    <span></span>
    <span></span>
    <span></span>
  </span>
);

const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! How can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];

    try {
      setIsLoading(true);
      setIsTyping(true);
      // Add placeholder "typing..." message
      setMessages([...newMessages, { role: 'assistant', content: '...' }]);

      const response = await axios.post(
        'http://localhost:5000/api/v1/chatbot/chat',
        { messages: newMessages },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        }
      );

      if (!response.data?.content) throw new Error('Invalid response format');

      setMessages((prev) => {
        // Replace last '...' message with actual response
        const updated = [...prev.slice(0, -1), response.data];
        return updated;
      });
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages((prev) => [
        ...prev.slice(0, -1), // remove the placeholder
        {
          role: 'assistant',
          content: 'Service is currently unavailable. Please try again later.',
        },
      ]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
      setInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="position-fixed bottom-0 end-0 m-4 shadow-lg rounded-4 overflow-hidden border border-light bg-white"
      style={{ width: '380px', height: '500px', zIndex: 1050 }}
    >
      {/* Header */}
      <div className="bg-success text-white px-3 py-2 d-flex justify-content-between align-items-center">
        <h6 className="mb-0 fw-bold">AI Assistant</h6>
        <button className="btn btn-sm text-white" onClick={onClose}>
          <IoMdClose size={20} />
        </button>
      </div>

      {/* Chat messages */}
      <div className="flex-grow-1 p-3 overflow-auto" style={{ height: '380px', backgroundColor: '#f8f9fa' }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-3 d-flex ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
          >
            <div
              className={`px-3 py-2 rounded-pill ${
                msg.role === 'user' ? 'bg-success text-white' : 'bg-light text-dark'
              }`}
            >
              {msg.content === '...' && isTyping ? <TypingDots /> : msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="border-top px-3 py-2 bg-white">
        <div className="input-group">
          <input
            type="text"
            className="form-control rounded-start-pill border-success"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="btn btn-success rounded-end-pill"
            disabled={isLoading || !input.trim()}
          >
            <IoSend />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;
