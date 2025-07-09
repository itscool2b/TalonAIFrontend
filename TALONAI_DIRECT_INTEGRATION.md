# TalonAI Direct Integration

## Overview
The frontend now communicates directly with the TalonAI backend without session management in our database.

## Architecture

```
User → talonai.us → talonaibackend.onrender.com/chat/
```

## Key Changes

### 1. Removed Session Management
- No more database storage for sessions
- No more PUT/GET/DELETE operations for sessions
- Sessions are managed locally in the frontend only

### 2. Direct API Calls
The frontend sends messages directly to:
```javascript
https://talonaibackend.onrender.com/chat/
```

### 3. Request Format
```javascript
{
  "query": "User's message",
  "user_id": "clerk_user_id",
  "session_id": "generated_session_id"
}
```

### 4. Response Format
```javascript
{
  "message": "AI response",
  "type": "general|parts|diagnostic|etc",
  "mod_recommendations": [...] // optional
}
```

## CORS Configuration
Make sure TalonAI backend allows requests from:
- https://talonai.us
- https://www.talonai.us

## Local Sessions
Sessions are stored in React state only:
- Generated IDs using timestamp + random string
- Not persisted to database
- Lost on page refresh (by design)

## Benefits
- Simpler architecture
- No database maintenance
- Direct connection to AI
- Faster response times
- Less points of failure 