const express = require('express');
const { Pool } = require('pg');
const dns = require('dns');
const { URL } = require('url');

// Force IPv4 on Render
if (process.env.NODE_ENV === 'production') {
  dns.setDefaultResultOrder('ipv4first');
}

const router = express.Router();

// PostgreSQL connection
let pool;

// Function to convert IPv6 URL to IPv4 pooler URL
const convertToIPv4PoolerURL = (databaseUrl) => {
  try {
    // Check if URL contains IPv6 pattern (multiple colons)
    const ipv6Pattern = /([0-9a-fA-F]{1,4}:){2,}/;
    
    if (ipv6Pattern.test(databaseUrl)) {
      console.log('🔄 Detected IPv6 address, converting to IPv4 pooler URL...');
      
      // Extract password from the URL
      const passwordMatch = databaseUrl.match(/:([^@]+)@/);
      const password = passwordMatch ? passwordMatch[1] : '10715Royal!';
      
      // Extract username and project ref
      const usernameMatch = databaseUrl.match(/postgres\.([^:]+):/);
      const projectRef = usernameMatch ? usernameMatch[1] : 'kzsfexkobshtffdwdpmb';
      
      // Construct the IPv4 pooler URL
      const ipv4Url = `postgres://postgres.${projectRef}:${password}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`;
      console.log('✅ Converted to IPv4 pooler URL');
      return ipv4Url;
    }
    
    // Try parsing as regular URL for non-IPv6 cases
    try {
      const url = new URL(databaseUrl);
      return databaseUrl;
    } catch {
      // If parsing fails, return as-is
      return databaseUrl;
    }
  } catch (error) {
    console.error('Error converting URL:', error);
    return databaseUrl;
  }
};

const connectToDatabase = async () => {
  if (pool) return pool;
  
  try {
    // First check for explicit pooler URL (highest priority)
    let connectionString = process.env.SUPABASE_POOLER_URL || process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    // Convert IPv6 to IPv4 if needed
    connectionString = convertToIPv4PoolerURL(connectionString);
    
    console.log('Attempting to connect to Supabase PostgreSQL...');
    console.log('DATABASE_URL format:', connectionString.substring(0, 30) + '...' + connectionString.slice(-15));
    
    pool = new Pool({
      connectionString: connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { 
        rejectUnauthorized: false,
        // Handle Supabase SSL configuration
        ca: false 
      } : false,
      // Add connection pool settings for better reliability
      max: 10, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection could not be established
    });

    // Test connection with timeout
    console.log('Testing database connection...');
    const testQuery = await Promise.race([
      pool.query('SELECT NOW() as current_time, version() as db_version'),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout after 10 seconds')), 10000)
      )
    ]);
    
    console.log('✅ Connected to PostgreSQL successfully');
    console.log('Database time:', testQuery.rows[0].current_time);
    console.log('PostgreSQL version:', testQuery.rows[0].db_version.split(' ')[0]);

    // Create tables if they don't exist
    await createTables();
    
    return pool;
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error.message);
    console.error('Error code:', error.code);
    console.error('Error details:', {
      errno: error.errno,
      syscall: error.syscall,
      address: error.address,
      port: error.port
    });
    
    // Reset pool on connection failure
    pool = null;
    
    // Provide helpful error messages
    if (error.code === 'ENETUNREACH') {
      console.error('🔍 Network unreachable error - this usually means:');
      console.error('  1. Your DATABASE_URL is using IPv6 which Render cannot reach');
      console.error('  2. Update DATABASE_URL in Render to: postgres://postgres.kzsfexkobshtffdwdpmb:10715Royal!@aws-0-us-west-1.pooler.supabase.com:6543/postgres');
      console.error('  3. Or check if your Supabase database is paused');
    }
    
    throw error;
  }
};

const createTables = async () => {
  const createSessionsTable = `
    CREATE TABLE IF NOT EXISTS chat_sessions (
      id SERIAL PRIMARY KEY,
      session_id VARCHAR(255) UNIQUE NOT NULL,
      user_id VARCHAR(255) NOT NULL,
      title VARCHAR(500) NOT NULL DEFAULT 'New Chat',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createMessagesTable = `
    CREATE TABLE IF NOT EXISTS chat_messages (
      id SERIAL PRIMARY KEY,
      session_id VARCHAR(255) REFERENCES chat_sessions(session_id) ON DELETE CASCADE,
      sender VARCHAR(10) NOT NULL CHECK (sender IN ('user', 'agent')),
      text TEXT NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createIndexes = `
    CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON chat_sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_last_updated ON chat_sessions(last_updated DESC);
    CREATE INDEX IF NOT EXISTS idx_messages_session_id ON chat_messages(session_id);
    CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON chat_messages(timestamp);
  `;

  await pool.query(createSessionsTable);
  await pool.query(createMessagesTable);
  await pool.query(createIndexes);
  console.log('Database tables created/verified');
};

// Get all sessions for a user or specific session
router.get('/:userId/:sessionId?', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const { userId, sessionId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    if (sessionId) {
      // Get specific session with messages
      const sessionQuery = `
        SELECT session_id, user_id, title, created_at, last_updated
        FROM chat_sessions 
        WHERE user_id = $1 AND session_id = $2
      `;
      
      const messagesQuery = `
        SELECT sender, text, timestamp
        FROM chat_messages 
        WHERE session_id = $1 
        ORDER BY timestamp ASC
      `;

      const [sessionResult, messagesResult] = await Promise.all([
        db.query(sessionQuery, [userId, sessionId]),
        db.query(messagesQuery, [sessionId])
      ]);

      if (sessionResult.rows.length === 0) {
        return res.status(404).json({ error: 'Session not found' });
      }

      const session = sessionResult.rows[0];
      const messages = messagesResult.rows;

      return res.json({
        sessionId: session.session_id,
        userId: session.user_id,
        title: session.title,
        messages: messages,
        createdAt: session.created_at,
        lastUpdated: session.last_updated
      });
    } else {
      // Get all sessions for user
      const query = `
        SELECT session_id, title, created_at, last_updated
        FROM chat_sessions 
        WHERE user_id = $1 
        ORDER BY last_updated DESC 
        LIMIT 50
      `;
      
      const result = await db.query(query, [userId]);
      return res.json(result.rows.map(row => ({
        sessionId: row.session_id,
        title: row.title,
        createdAt: row.created_at,
        lastUpdated: row.last_updated
      })));
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Create new session
router.post('/:userId', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const { userId } = req.params;
    const { sessionId: newSessionId, title } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required in URL path' });
    }
    
    if (!newSessionId) {
      return res.status(400).json({ error: 'sessionId is required in request body' });
    }
    
    console.log('Creating session:', { userId, sessionId: newSessionId, title });
    
    const query = `
      INSERT INTO chat_sessions (session_id, user_id, title, created_at, last_updated)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    
    const result = await db.query(query, [newSessionId, userId, title || 'New Chat']);
    const session = result.rows[0];
    
    console.log('Session created successfully:', session.id);
    
    return res.status(201).json({
      sessionId: session.session_id,
      userId: session.user_id,
      title: session.title,
      messages: [],
      createdAt: session.created_at,
      lastUpdated: session.last_updated
    });
  } catch (error) {
    console.error('API Error:', error);
    if (error.code === '23505') { // Unique constraint violation
      return res.status(409).json({ error: 'Session ID already exists' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update session
router.put('/:userId/:sessionId', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const { userId, sessionId } = req.params;
    
    if (!userId || !sessionId) {
      return res.status(400).json({ error: 'userId and sessionId are required' });
    }
    
    const { messages, title: updateTitle } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Start transaction
    await db.query('BEGIN');

    try {
      // Update session title and last_updated
      let updateQuery = `
        UPDATE chat_sessions 
        SET last_updated = CURRENT_TIMESTAMP
      `;
      let queryParams = [userId, sessionId];
      
      if (updateTitle) {
        updateQuery += `, title = $3`;
        queryParams.splice(2, 0, updateTitle);
      }
      
      updateQuery += ` WHERE user_id = $1 AND session_id = $2 RETURNING *`;
      
      const sessionResult = await db.query(updateQuery, queryParams);
      
      if (sessionResult.rows.length === 0) {
        // Session doesn't exist, create it
        const createQuery = `
          INSERT INTO chat_sessions (session_id, user_id, title, created_at, last_updated)
          VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          RETURNING *
        `;
        await db.query(createQuery, [sessionId, userId, updateTitle || 'New Chat']);
      }

      // Delete existing messages for this session
      await db.query('DELETE FROM chat_messages WHERE session_id = $1', [sessionId]);

      // Insert new messages
      if (messages.length > 0) {
        const messageValues = messages.map((msg, index) => 
          `($1, $${index * 3 + 2}, $${index * 3 + 3}, $${index * 3 + 4})`
        ).join(', ');
        
        const messageParams = [sessionId];
        messages.forEach(msg => {
          messageParams.push(msg.sender, msg.text, msg.timestamp || new Date());
        });

        const insertMessagesQuery = `
          INSERT INTO chat_messages (session_id, sender, text, timestamp)
          VALUES ${messageValues}
        `;
        
        await db.query(insertMessagesQuery, messageParams);
      }

      // Commit transaction
      await db.query('COMMIT');

      // Fetch updated session with messages
      const finalSessionQuery = `
        SELECT session_id, user_id, title, created_at, last_updated
        FROM chat_sessions 
        WHERE user_id = $1 AND session_id = $2
      `;
      
      const finalMessagesQuery = `
        SELECT sender, text, timestamp
        FROM chat_messages 
        WHERE session_id = $1 
        ORDER BY timestamp ASC
      `;

      const [finalSessionResult, finalMessagesResult] = await Promise.all([
        db.query(finalSessionQuery, [userId, sessionId]),
        db.query(finalMessagesQuery, [sessionId])
      ]);

      const session = finalSessionResult.rows[0];
      const finalMessages = finalMessagesResult.rows;

      return res.json({
        sessionId: session.session_id,
        userId: session.user_id,
        title: session.title,
        messages: finalMessages,
        createdAt: session.created_at,
        lastUpdated: session.last_updated
      });

    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete session
router.delete('/:userId/:sessionId', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const { userId, sessionId } = req.params;
    
    if (!userId || !sessionId) {
      return res.status(400).json({ error: 'userId and sessionId are required' });
    }
    
    const query = `
      DELETE FROM chat_sessions 
      WHERE user_id = $1 AND session_id = $2 
      RETURNING *
    `;
    
    const result = await db.query(query, [userId, sessionId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    return res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 