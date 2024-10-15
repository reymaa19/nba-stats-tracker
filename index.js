require('dotenv').config();
const playersRouter = require('./routers/players');
const statsRouter = require('./routers/stats');
const middleware = require('./utils/middleware');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('connected to MongoDB'))
  .catch((error) => console.log('error connecting to MongoDB:', error.message));

const app = express();

// Middleware and routes
app
  .use(express.static(path.join(__dirname, 'dist')))
  .use(express.json({ limit: '50mb' }))
  .use(middleware.requestLogger)
  .use('/api/players', playersRouter)
  .use('/api/stats', statsRouter)
  .use(middleware.errorHandler);

// Export the app for serverless deployment
module.exports = app;
