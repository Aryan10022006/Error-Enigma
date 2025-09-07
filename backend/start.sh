#!/bin/bash

# Render startup script to run both Node.js and Python services

echo "🚀 Starting EdTech Platform Services..."

# Install Python dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "📦 Installing Python dependencies..."
    pip install -r requirements.txt
fi

# Start Python service in background
echo "🐍 Starting Python Adaptive API..."
python python_adaptive_api.py &
PYTHON_PID=$!

# Start Node.js service
echo "🟢 Starting Node.js Backend..."
node server.js &
NODE_PID=$!

# Function to cleanup processes on exit
cleanup() {
    echo "🛑 Shutting down services..."
    kill $PYTHON_PID 2>/dev/null
    kill $NODE_PID 2>/dev/null
    exit
}

# Set trap to cleanup on script termination
trap cleanup SIGTERM SIGINT

# Wait for processes
wait $NODE_PID
