# Render Deployment Guide

This guide explains how to deploy your TalonAI frontend app to Render.

## Prerequisites

1. A Render account (https://render.com)
2. Your GitHub repository connected to Render
3. MongoDB Atlas database (already configured)

## Render Configuration

### Web Service Settings

**Build Command:**
```bash
npm install && npx expo export --platform web
```

**Start Command:**
```bash
npm start
```

### Environment Variables

Add these environment variables in your Render dashboard:

| Variable | Value |
|----------|--------|
| `VITE_CLERK_PUBLISHABLE_KEY` | `[YOUR_CLERK_PUBLISHABLE_KEY]` |
| `MONGODB_URI` | `[YOUR_MONGODB_CONNECTION_STRING]` |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |

## Project Structure

Your project is configured with:
- Express.js server (`server.js`) that serves both static files and API routes
- API routes converted from Vercel serverless functions to Express routes
- Expo web build output served from `dist/` directory
- MongoDB integration for chat persistence

## API Endpoints

The following API endpoints are available:

- `GET /api/health` - Health check
- `GET /api/sessions/:userId` - Get user's chat sessions
- `GET /api/sessions/:userId/:sessionId` - Get specific session
- `POST /api/sessions/:userId` - Create new session
- `PUT /api/sessions/:userId/:sessionId` - Update session
- `DELETE /api/sessions/:userId/:sessionId` - Delete session

## Deployment Steps

1. **Connect Repository**: Link your GitHub repository to Render
2. **Create Web Service**: Choose "Web Service" and select your repository
3. **Configure Settings**:
   - **Name**: `talonai-frontend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx expo export --platform web`
   - **Start Command**: `npm start`
4. **Set Environment Variables**: Add all the environment variables listed above
5. **Deploy**: Click "Create Web Service"

## Local Development

For local development, you can still use:
```bash
npm run dev  # Starts Expo development server
```

For testing the production build locally:
```bash
npm run build  # Build the Expo web app
npm start      # Start the Express server
```

## Troubleshooting

### Common Issues

1. **Build Fails**: Make sure all dependencies are in `package.json`
2. **API Routes Not Working**: Check that MongoDB URI is correctly set
3. **Static Files Not Serving**: Ensure `dist/` directory exists after build

### Logs

Check Render logs for any deployment issues:
- Build logs show compilation errors
- Runtime logs show server startup and API errors

## Database Connection

The app uses MongoDB Atlas with the following features:
- Automatic connection pooling
- Error handling and reconnection
- Session-based chat storage
- User-specific chat history

## Security

- Environment variables are securely stored in Render
- API routes include CORS configuration
- MongoDB connection uses SSL/TLS encryption
- Clerk authentication handles user security

## Performance

- Static files are served efficiently by Express
- MongoDB queries are optimized with indexes
- Client-side routing handled by React Router
- Lazy loading for better performance 