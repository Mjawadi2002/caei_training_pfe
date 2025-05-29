import React, { useState, useRef, useEffect } from 'react';
import { IoSend } from 'react-icons/io5';
import { IoMdClose } from 'react-icons/io';
import { FaQuestionCircle } from 'react-icons/fa';
import axios from 'axios';
import './Chatbot.css';

// Typing dots animation
const TypingDots = () => (
  <span className="typing-dots">
    <span></span>
    <span></span>
    <span></span>
  </span>
);

const FAQ_QUESTIONS = [
  {
    question: "What is CAEI Training?",
    answer: "CAEI Training is a professional training platform that offers various courses and certifications to help individuals enhance their skills and advance their careers."
  },
  {
    question: "What courses are available?",
    answer: "We offer a wide range of courses including professional certifications, technical training, and specialized programs. You can view all available courses in our Formations section."
  },
  {
    question: "How can I enroll in a course?",
    answer: "To enroll in a course, you need to create an account, browse our available courses, and click on the 'Enroll' button for your chosen course."
  },
  {
    question: "What is your purpose?",
    answer: "Our purpose is to provide high-quality education and training to help individuals achieve their professional goals and advance their careers through accessible and comprehensive learning programs."
  }
];

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
  const [showFAQ, setShowFAQ] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFAQClick = (question, answer) => {
    setMessages(prev => [...prev, 
      { role: 'user', content: question },
      { role: 'assistant', content: answer }
    ]);
    setShowFAQ(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];

    try {
      setIsLoading(true);
      setIsTyping(true);
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
        const updated = [...prev.slice(0, -1), response.data];
        return updated;
      });
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
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
    <div className="chatbot-container">
      {/* Header */}
      <div className="chatbot-header">
        <h6 className="mb-0 fw-bold">AI Assistant</h6>
        <div className="header-buttons">
          <button 
            className="btn btn-sm text-white faq-button" 
            onClick={() => setShowFAQ(!showFAQ)}
            title="FAQ"
          >
            <FaQuestionCircle size={20} />
          </button>
          <button className="btn btn-sm text-white" onClick={onClose}>
            <IoMdClose size={20} />
          </button>
        </div>
      </div>

      {/* FAQ Panel */}
      {showFAQ && (
        <div className="faq-panel">
          <h6 className="faq-title">Frequently Asked Questions</h6>
          <div className="faq-list">
            {FAQ_QUESTIONS.map((faq, index) => (
              <button
                key={index}
                className="faq-item"
                onClick={() => handleFAQClick(faq.question, faq.answer)}
              >
                {faq.question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat messages */}
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-wrapper ${msg.role === 'user' ? 'user' : 'assistant'}`}
          >
            <div className={`message ${msg.role === 'user' ? 'user-message' : 'assistant-message'}`}>
              {msg.content === '...' && isTyping ? <TypingDots /> : msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="chat-input-form">
        <div className="input-group">
          <input
            type="text"
            className="form-control chat-input"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="btn btn-success send-button"
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
