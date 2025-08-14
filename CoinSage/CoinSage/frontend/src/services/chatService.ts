import api from './api';
import { ChatMessage, ChatRequest, SimulationRequest, FeedbackRequest } from '../types/index';

export const chatService = {
  // Create a new chat session
  async createChat(title?: string): Promise<{ chat: any }> {
    const response = await api.post('/api/chat/', {
      title: title || 'New Chat'
    });
    return response.data;
  },

  // Get user's chat sessions
  async getChats(): Promise<{ chats: any[] }> {
    const response = await api.get('/api/chat/');
    return response.data;
  },

  // Get chat messages for a specific chat
  async getChatMessages(chatId: string): Promise<{ chat: any }> {
    const response = await api.get(`/api/chat/${chatId}`);
    return response.data;
  },

  // Send a message and get AI response
  async sendMessage(message: string, sessionId?: string): Promise<{
    session_id: string;
    user_message: ChatMessage;
    ai_response: ChatMessage;
  }> {
    // If no sessionId, create a new chat first
    let chatId = sessionId;
    if (!chatId) {
      const newChat = await this.createChat();
      chatId = newChat.chat._id;
    }

    const response = await api.post(`/api/chat/${chatId}/messages`, {
      content: message
    });
    
    // Handle the actual backend response structure
    const chat = response.data.chat;
    const messages = chat.messages;
    const userMessage = messages[messages.length - 2]; // Second to last message
    const aiMessage = messages[messages.length - 1]; // Last message
    
    return {
      session_id: chatId,
      user_message: {
        id: Date.now() - 1,
        session: 0,
        message_type: 'user',
        content: userMessage.content,
        timestamp: userMessage.timestamp || new Date().toISOString()
      },
      ai_response: {
        id: Date.now(),
        session: 0,
        message_type: 'assistant',
        content: aiMessage.content,
        timestamp: aiMessage.timestamp || new Date().toISOString()
      }
    };
  },

  // Get chat history
  async getChatHistory(sessionId: string): Promise<{
    session_id: string;
    messages: ChatMessage[];
  }> {
    const response = await api.get(`/api/chat/${sessionId}`);
    return {
      session_id: sessionId,
      messages: response.data.chat.messages || []
    };
  },

  // Submit feedback
  async submitFeedback(messageId: number, rating: number, comment?: string): Promise<void> {
    await api.post('/api/chat/feedback/', {
      message_id: messageId,
      rating,
      comment,
    });
  },

  // Life event simulation
  async runSimulation(simulationData: SimulationRequest): Promise<{
    life_event: any;
    simulation_result: any;
  }> {
    const response = await api.post('/api/simulation/', simulationData);
    return response.data;
  },

  // Get life events
  async getLifeEvents(): Promise<any[]> {
    const response = await api.get('/api/life-events/');
    return response.data.results || response.data;
  },

  async createLifeEvent(eventData: Partial<any>): Promise<any> {
    const response = await api.post('/api/life-events/', eventData);
    return response.data;
  },
}; 