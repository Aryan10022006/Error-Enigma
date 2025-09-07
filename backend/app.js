const express = require('express');
const { spawn } = require('child_process');
const path = require('path');

// Start the main Node.js server
require('./server.js');

// Start Python service as subprocess if in production
if (process.env.NODE_ENV === 'production') {
  console.log('🐍 Starting Python Adaptive API subprocess...');
  
  const pythonProcess = spawn('python', ['python_adaptive_api.py'], {
    cwd: __dirname,
    stdio: 'inherit',
    env: {
      ...process.env,
      PYTHON_PORT: process.env.PYTHON_PORT || '5001'
    }
  });

  pythonProcess.on('error', (err) => {
    console.error('❌ Python process error:', err);
  });

  pythonProcess.on('exit', (code) => {
    console.log(`🐍 Python process exited with code ${code}`);
  });

  // Cleanup on exit
  process.on('SIGTERM', () => {
    console.log('🛑 Shutting down Python subprocess...');
    pythonProcess.kill();
  });

  process.on('SIGINT', () => {
    console.log('🛑 Shutting down Python subprocess...');
    pythonProcess.kill();
  });
}
