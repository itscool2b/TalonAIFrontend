const express = require('express');
const router = express.Router();

// Simple health check for chat endpoint
router.post('/', async (req, res) => {
  // This endpoint is no longer needed since frontend will call TalonAI directly
  // Just return success for compatibility
  res.json({ 
    message: 'Please update frontend to call TalonAI backend directly',
    status: 'deprecated' 
  });
});

module.exports = router; 