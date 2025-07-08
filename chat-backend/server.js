const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const ChatSession = require('./models/ChatSession');

const app = express();

// Middleware
app.use(cors({
  origin: ['https://talonai.us', 'https://www.talonai.us', 'http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://itscool2b:10715Royal!@talonai.biu18sm.mongodb.net/talonai-chat?retryWrites=true&w=majority&appName=TalonAI';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// API Routes

// Get all chat sessions for a user
app.get('/api/sessions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const sessions = await ChatSession.find({ userId })
      .sort({ lastUpdated: -1 })
      .select('sessionId title lastUpdated createdAt')
      .limit(50); // Limit to 50 most recent sessions
    
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Get a specific chat session
app.get('/api/sessions/:userId/:sessionId', async (req, res) => {
  try {
    const { userId, sessionId } = req.params;
    const session = await ChatSession.findOne({ userId, sessionId });
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Create a new chat session
app.post('/api/sessions', async (req, res) => {
  try {
    const { userId, sessionId, title } = req.body;
    
    if (!userId || !sessionId) {
      return res.status(400).json({ error: 'userId and sessionId are required' });
    }
    
    const newSession = new ChatSession({
      userId,
      sessionId,
      title: title || 'New Chat',
      messages: [],
      lastUpdated: new Date(),
      createdAt: new Date()
    });
    
    await newSession.save();
    res.status(201).json(newSession);
  } catch (error) {
    console.error('Error creating session:', error);
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Session already exists' });
    }
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Update chat session with new messages
app.put('/api/sessions/:userId/:sessionId', async (req, res) => {
  try {
    const { userId, sessionId } = req.params;
    const { messages, title } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }
    
    const updateData = {
      messages,
      lastUpdated: new Date()
    };
    
    if (title) {
      updateData.title = title;
    }
    
    const session = await ChatSession.findOneAndUpdate(
      { userId, sessionId },
      updateData,
      { new: true, upsert: true }
    );
    
    res.json(session);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ error: 'Failed to update session' });
  }
});

// Delete a chat session
app.delete('/api/sessions/:userId/:sessionId', async (req, res) => {
  try {
    const { userId, sessionId } = req.params;
    
    const session = await ChatSession.findOneAndDelete({ userId, sessionId });
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Chat backend server running on port ${PORT}`);
}); 