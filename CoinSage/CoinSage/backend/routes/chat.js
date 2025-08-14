const express = require('express');
const { body, validationResult } = require('express-validator');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Chat = require('../models/Chat');
const auth = require('../middleware/auth');

const router = express.Router();

// Initialize Google Generative AI (Gemini)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY, {
  apiVersion: 'v1'
});

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/chat/test
// @desc    Test Gemini API connection
// @access  Private
router.get('/test', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello, this is a test message.");
    const response = result.response.text();
    res.json({ 
      success: true, 
      message: 'Gemini API is working!',
      response: response 
    });
  } catch (error) {
    console.error('Gemini test error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Gemini API test failed: ' + error.message 
    });
  }
});

// @route   GET /api/chat/models
// @desc    List available Gemini models
// @access  Private
router.get('/models', async (req, res) => {
  try {
    // Note: The Google AI SDK doesn't have a direct listModels method
    // So we'll try different model names to see what works
    const modelsToTest = [
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-pro",
      "gemini-1.0-pro"
    ];
    
    const results = [];
    
    for (const modelName of modelsToTest) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Test");
        results.push({
          model: modelName,
          status: "working",
          response: result.response.text().substring(0, 50) + "..."
        });
      } catch (error) {
        results.push({
          model: modelName,
          status: "failed",
          error: error.message
        });
      }
    }
    
    res.json({ 
      success: true, 
      message: 'Model availability test',
      results: results
    });
  } catch (error) {
    console.error('Models test error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Models test failed: ' + error.message 
    });
  }
});

// @route   GET /api/chat
// @desc    Get user chats
// @access  Private
router.get('/', async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id, isActive: true })
      .sort({ lastActivity: -1 })
      .select('title lastActivity createdAt');

    res.json({ chats });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/chat
// @desc    Create a new chat
// @access  Private
router.post('/', [
  body('title').optional().isString().withMessage('Title must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const chat = new Chat({
      user: req.user._id,
      title: req.body.title || 'New Chat'
    });

    await chat.save();

    res.status(201).json({ chat });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/chat/:id
// @desc    Get chat messages
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.json({ chat });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/chat/:id/messages
// @desc    Send a message and get AI response
// @access  Private
router.post('/:id/messages', [
  body('content').notEmpty().withMessage('Message content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const chat = await Chat.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const { content } = req.body;

    // Add user message to chat
    chat.messages.push({
      role: 'user',
      content
    });

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare conversation history for Gemini
    const systemPrompt = `You are a financial advisor AI assistant. You help users with:
    - Budget planning and management
    - Investment advice and strategies
    - Debt management and reduction
    - Financial goal setting
    - Expense tracking and analysis
    - Tax planning tips
    - Retirement planning
    - Emergency fund recommendations
    
    Always provide practical, actionable advice. Be encouraging but realistic. 
    If you need more information to give better advice, ask for it.`;

    try {
      // For the first message, include system prompt
      let prompt;
      if (chat.messages.length === 1) {
        // First message - include system prompt
        prompt = `${systemPrompt}\n\nUser: ${content}`;
        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();

        // Add AI response to chat
        chat.messages.push({
          role: 'assistant',
          content: aiResponse
        });

        // Generate title
        const titleResult = await model.generateContent([
          'Generate a short, descriptive title (max 50 characters) for this financial conversation.',
          content
        ]);
        chat.title = titleResult.response.text().trim();
      } else {
        // Subsequent messages - use chat history
        const chatSession = model.startChat({
          history: chat.messages.slice(0, -1).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          })),
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7,
          },
        });

        const result = await chatSession.sendMessage(content);
        const aiResponse = result.response.text();

        // Add AI response to chat
        chat.messages.push({
          role: 'assistant',
          content: aiResponse
        });
      }

      await chat.save();

      res.json({
        user_message: {
          role: 'user',
          content: content,
          timestamp: new Date()
        },
        ai_response: {
          role: 'assistant',
          content: chat.messages[chat.messages.length - 1].content,
          timestamp: new Date()
        },
        chat
      });
    } catch (aiError) {
      console.error('AI API error:', aiError);
      throw aiError;
    }
  } catch (error) {
    console.error('Send message error:', error);
    if (error.message && error.message.includes('API key')) {
      res.status(401).json({ error: 'Invalid API key provided' });
    } else if (error.message && error.message.includes('quota')) {
      res.status(503).json({ error: 'AI service temporarily unavailable' });
    } else {
      res.status(500).json({ error: 'Server error: ' + error.message });
    }
  }
});

// @route   DELETE /api/chat/:id
// @desc    Delete a chat
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isActive: false },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 