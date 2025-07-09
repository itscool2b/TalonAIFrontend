const express = require('express');
// Load environment variables from .env or .env.local for local development
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const serveStatic = require('serve-static');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Import API routes
const healthRoute = require('./api/health');
const sessionsRoute = require('./api/sessions/[...params]');
const chatRoute = require('./api/chat');

// API Routes
app.use('/api/health', healthRoute);
app.use('/api/sessions', sessionsRoute);
app.use('/api/chat', chatRoute);

// Serve static files from the dist directory (Expo web build output)
app.use(serveStatic(path.join(__dirname, 'dist'), {
  index: ['index.html']
}));

// Handle client-side routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    res.status(404).json({ error: 'API route not found' });
  }
});

// Global error handler - ensure we always return JSON for API errors
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  // Always return JSON for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(err.status || 500).json({
      error: err.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
  
  // For non-API routes, send to client error page
  res.status(err.status || 500).send('Server Error');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 