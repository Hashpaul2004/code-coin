const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/agents/status
// @desc    Get AI agents status
// @access  Private
router.get('/status', async (req, res) => {
  try {
    res.json({
      status: 'active',
      message: 'AI agents are running',
      timestamp: new Date().toISOString(),
      user: req.user.username
    });
  } catch (error) {
    console.error('Agent status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/agents/process
// @desc    Process requests through AI agents
// @access  Private
router.post('/process', async (req, res) => {
  try {
    const { request } = req.body;
    
    if (!request) {
      return res.status(400).json({ error: 'Request content is required' });
    }

    // Placeholder for AI agent processing
    const response = {
      status: 'processing',
      message: 'Request received by AI agent',
      request,
      timestamp: new Date().toISOString(),
      user: req.user.username
    };

    res.json(response);
  } catch (error) {
    console.error('Agent process error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 