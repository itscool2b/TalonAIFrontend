# TalonAI Chat Backend

MongoDB-based chat session management backend for TalonAI.

## Features

- Store chat sessions in MongoDB
- User-specific session management
- Message persistence
- RESTful API endpoints
- CORS enabled for TalonAI frontend

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set environment variables:
```bash
export MONGODB_URI="mongodb+srv://itscool2b:10715Royal!@talonai.biu18sm.mongodb.net/talonai-chat?retryWrites=true&w=majority&appName=TalonAI"
export PORT=3001
```

3. Run the server:
```bash
npm start
```

For development:
```bash
npm run dev
```

## API Endpoints

### Get User Sessions
```
GET /api/sessions/:userId
```
Returns all chat sessions for a user, sorted by last updated.

### Get Specific Session
```
GET /api/sessions/:userId/:sessionId
```
Returns a specific chat session with all messages.

### Create New Session
```
POST /api/sessions
Body: { userId, sessionId, title }
```
Creates a new chat session.

### Update Session
```
PUT /api/sessions/:userId/:sessionId
Body: { messages, title }
```
Updates a chat session with new messages and/or title.

### Delete Session
```
DELETE /api/sessions/:userId/:sessionId
```
Deletes a chat session.

### Health Check
```
GET /health
```
Returns server status.

## Database Schema

### ChatSession
- `sessionId`: Unique session identifier
- `userId`: User identifier from Clerk
- `title`: Session title (auto-generated from first message)
- `messages`: Array of message objects
- `lastUpdated`: Last modification timestamp
- `createdAt`: Creation timestamp

### Message
- `sender`: 'user' or 'agent'
- `text`: Message content
- `timestamp`: Message timestamp

## Deployment

This backend can be deployed to any Node.js hosting service:

1. **Railway**: Connect GitHub repo and deploy
2. **Heroku**: Use Heroku CLI or GitHub integration
3. **Vercel**: Deploy as serverless functions
4. **DigitalOcean**: Deploy to droplet or App Platform

Make sure to set the `MONGODB_URI` environment variable in your deployment platform.

## CORS Configuration

The backend is configured to accept requests from:
- https://talonai.us
- https://www.talonai.us
- http://localhost:3000 (development)
- http://127.0.0.1:3000 (development) 