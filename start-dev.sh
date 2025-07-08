#!/bin/bash

# Development startup script for TalonAI

echo "🚀 Starting TalonAI Development Environment..."

# Set environment variables
export VITE_CLERK_PUBLISHABLE_KEY="pk_test_dml0YWwtb3Jpb2xlLTI5LmNsZXJrLmFjY291bnRzLmRldiQ"
export CHAT_BACKEND_URL="http://localhost:3001"
export MONGODB_URI="mongodb+srv://itscool2b:10715Royal!@talonai.biu18sm.mongodb.net/talonai-chat?retryWrites=true&w=majority&appName=TalonAI"

echo "✅ Environment variables set"

# Start chat backend in background
echo "🔧 Starting chat backend..."
cd chat-backend
MONGODB_URI="$MONGODB_URI" PORT=3001 node server.js &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 3

# Test backend
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ Chat backend is running on port 3001"
else
    echo "❌ Chat backend failed to start"
    exit 1
fi

# Start frontend
echo "🎨 Starting frontend..."
npx expo start

# Cleanup function
cleanup() {
    echo "🧹 Cleaning up..."
    kill $BACKEND_PID 2>/dev/null
    exit 0
}

# Trap cleanup on script exit
trap cleanup EXIT INT TERM 