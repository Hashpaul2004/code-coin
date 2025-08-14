import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../services/chatService';
import { ChatMessage } from '../types/index';
import {
  Send,
  MessageCircle,
  Star,
  ThumbsUp,
  ThumbsDown,
  Bot,
  User,
  Loader,
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState<{
    messageId: number;
    show: boolean;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      session: 0,
      message_type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await chatService.sendMessage(inputMessage, sessionId || undefined);
      
      if (!sessionId) {
        setSessionId(response.session_id);
      }

      const aiMessage: ChatMessage = {
        id: response.ai_response.id,
        session: response.ai_response.session,
        message_type: 'assistant',
        content: response.ai_response.content,
        timestamp: response.ai_response.timestamp,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
      // Remove the user message if AI response failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFeedback = async (messageId: number, rating: number, comment?: string) => {
    try {
      await chatService.submitFeedback(messageId, rating, comment);
      toast.success('Feedback submitted successfully');
      setFeedbackModal(null);
    } catch (error: any) {
      toast.error('Failed to submit feedback');
    }
  };

  const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.message_type === 'user';
    const isAI = message.message_type === 'assistant';

    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div
          className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
            isUser ? 'flex-row-reverse space-x-reverse' : ''
          }`}
        >
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              isUser ? 'bg-primary-600' : 'bg-gray-600'
            }`}
          >
            {isUser ? (
              <User className="h-4 w-4 text-white" />
            ) : (
              <Bot className="h-4 w-4 text-white" />
            )}
          </div>
          <div
            className={`rounded-lg px-4 py-2 ${
              isUser
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs opacity-70">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
              {isAI && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleFeedback(message.id, 5)}
                    className="text-xs text-gray-500 hover:text-success-600 transition-colors"
                    title="Rate as helpful"
                  >
                    <ThumbsUp className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleFeedback(message.id, 1)}
                    className="text-xs text-gray-500 hover:text-danger-600 transition-colors"
                    title="Rate as unhelpful"
                  >
                    <ThumbsDown className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => setFeedbackModal({ messageId: message.id, show: true })}
                    className="text-xs text-gray-500 hover:text-warning-600 transition-colors"
                    title="Rate with comment"
                  >
                    <Star className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="flex items-center space-x-2 mb-6">
          <MessageCircle className="h-6 w-6 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">AI Financial Advisor</h1>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto mb-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Bot className="h-12 w-12 mb-4 text-gray-400" />
              <p className="text-lg font-medium">Welcome to CoinSage AI!</p>
              <p className="text-sm text-center mt-2">
                Ask me anything about your finances, budgeting, investments, or financial goals.
                I'm here to help you make informed financial decisions.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {loading && (
                <div className="flex justify-start mb-4">
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-lg px-4 py-2">
                      <div className="flex items-center space-x-2">
                        <Loader className="h-4 w-4 animate-spin text-gray-500" />
                        <span className="text-sm text-gray-500">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="flex space-x-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about your finances..."
            className="flex-1 input-field resize-none"
            rows={3}
            disabled={loading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || loading}
            className="btn-primary self-end"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        {/* Suggested Questions */}
        {messages.length === 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Try asking:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                "How can I create a budget?",
                "What's the best way to save for retirement?",
                "How much should I save for emergencies?",
                "What are good investment strategies?",
                "How can I reduce my expenses?",
                "What's the 50/30/20 rule?",
              ].map((question) => (
                <button
                  key={question}
                  onClick={() => setInputMessage(question)}
                  className="text-left p-3 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {feedbackModal?.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Rate this response</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleFeedback(feedbackModal.messageId, rating)}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <Star className={`h-5 w-5 ${
                        rating <= 3 ? 'text-warning-500' : 'text-gray-300'
                      }`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFeedbackModal(null)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat; 