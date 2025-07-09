const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

// Handle AI chat requests
router.post('/', async (req, res) => {
  try {
    console.log('Chat request received:', req.body);
    
    const { query, user_id, session_id } = req.body;
    
    if (!query || !user_id || !session_id) {
      return res.status(400).json({ 
        error: 'Missing required fields: query, user_id, session_id' 
      });
    }
    
    // Forward request to TalonAI backend
    const response = await fetch('https://talonaibackend.onrender.com/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://talonai.us',
        'User-Agent': 'TalonAIFrontend/1.0',
      },
      body: JSON.stringify({
        query: query,
        user_id: user_id,
        session_id: session_id,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('TalonAI backend error:', errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: `TalonAI backend error: ${response.status}` };
      }
      return res.status(response.status).json(errorData);
    }
    
    const data = await response.json();
    console.log('TalonAI response:', data);
    
    // Forward response back to client
    res.json(data);
    
  } catch (error) {
    console.error('Chat API Error:', error);
    
    // Handle different error types
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return res.status(503).json({ 
        error: 'Unable to connect to TalonAI backend. Please try again later.' 
      });
    }
    
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

module.exports = router; 