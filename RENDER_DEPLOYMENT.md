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
| `DATABASE_URL` | `[YOUR_SUPABASE_DATABASE_URL]` |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |

**Important**: Make sure your Supabase `DATABASE_URL` follows this format:
```
postgresql://[username]:[password]@[host]:[port]/[database]?sslmode=require
```

## Project Structure

Your project is configured with:
- Express.js server (`server.js`) that serves both static files and API routes
- API routes converted from Vercel serverless functions to Express routes
- Expo web build output served from `dist/` directory
- Supabase PostgreSQL integration for chat persistence

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
2. **API Routes Not Working**: Check that `DATABASE_URL` is correctly set with your Supabase connection string
3. **Database Connection Errors**: 
   - Verify your Supabase URL format: `postgresql://[user]:[pass]@[host]:[port]/[db]?sslmode=require`
   - Check that your Supabase project allows connections from Render's IP range
   - Ensure your database is not paused (Supabase pauses inactive databases)
4. **Static Files Not Serving**: Ensure `dist/` directory exists after build
5. **IPv6 Connection Issues**: If you see `ENETUNREACH` errors, try using the IPv4 connection string from Supabase

### Logs

Check Render logs for any deployment issues:
- Build logs show compilation errors
- Runtime logs show server startup and API errors
- Database connection errors will appear in runtime logs

### Database Connection Debugging

If you're getting database connection errors:

1. **Check Environment Variable**: Ensure `DATABASE_URL` is set in Render dashboard
2. **Test Connection Format**: Your Supabase connection string should include `?sslmode=require`
3. **Verify Database Status**: Check your Supabase dashboard to ensure the database is active
4. **Connection Pooling**: The app uses PostgreSQL connection pooling for optimal performance

## Database Connection

The app uses Supabase PostgreSQL with the following features:
- Automatic connection pooling with `pg` library
- SSL/TLS encryption for secure connections
- Error handling and reconnection logic
- Session-based chat storage
- User-specific chat history
- Automatic table creation on first run

## Security

- Environment variables are securely stored in Render
- API routes include CORS configuration
- PostgreSQL/Supabase connection uses SSL/TLS encryption
- Clerk authentication handles user security

## Performance

- Static files are served efficiently by Express
- MongoDB queries are optimized with indexes
- Client-side routing handled by React Router
- Lazy loading for better performance 