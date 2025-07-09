const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// MongoDB Schema
const MessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
    enum: ['user', 'agent']
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ChatSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    default: 'New Chat'
  },
  messages: [MessageSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

ChatSessionSchema.index({ userId: 1, lastUpdated: -1 });

let ChatSession;
if (mongoose.models.ChatSession) {
  ChatSession = mongoose.models.ChatSession;
} else {
  ChatSession = mongoose.model('ChatSession', ChatSessionSchema);
}

// MongoDB connection
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) return;
  
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Get all sessions for a user or specific session
router.get('/:userId/:sessionId?', async (req, res) => {
  try {
    await connectToDatabase();
    
    const { userId, sessionId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    if (sessionId) {
      // Get specific session
      const session = await ChatSession.findOne({ userId, sessionId });
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }
      return res.json(session);
    } else {
      // Get all sessions for user
      const sessions = await ChatSession.find({ userId })
        .sort({ lastUpdated: -1 })
        .select('sessionId title lastUpdated createdAt')
        .limit(50);
      return res.json(sessions);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Create new session
router.post('/:userId', async (req, res) => {
  try {
    await connectToDatabase();
    
    const { userId } = req.params;
    const { sessionId: newSessionId, title } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required in URL path' });
    }
    
    if (!newSessionId) {
      return res.status(400).json({ error: 'sessionId is required in request body' });
    }
    
    console.log('Creating session:', { userId, sessionId: newSessionId, title });
    
    const newSession = new ChatSession({
      userId,
      sessionId: newSessionId,
      title: title || 'New Chat',
      messages: [],
      lastUpdated: new Date(),
      createdAt: new Date()
    });
    
    await newSession.save();
    console.log('Session created successfully:', newSession._id);
    return res.status(201).json(newSession);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update session
router.put('/:userId/:sessionId', async (req, res) => {
  try {
    await connectToDatabase();
    
    const { userId, sessionId } = req.params;
    
    if (!userId || !sessionId) {
      return res.status(400).json({ error: 'userId and sessionId are required' });
    }
    
    const { messages, title: updateTitle } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }
    
    const updateData = {
      messages,
      lastUpdated: new Date()
    };
    
    if (updateTitle) {
      updateData.title = updateTitle;
    }
    
    const session = await ChatSession.findOneAndUpdate(
      { userId, sessionId },
      updateData,
      { new: true, upsert: true }
    );
    
    return res.json(session);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete session
router.delete('/:userId/:sessionId', async (req, res) => {
  try {
    await connectToDatabase();
    
    const { userId, sessionId } = req.params;
    
    if (!userId || !sessionId) {
      return res.status(400).json({ error: 'userId and sessionId are required' });
    }
    
    const deletedSession = await ChatSession.findOneAndDelete({ userId, sessionId });
    
    if (!deletedSession) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    return res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 