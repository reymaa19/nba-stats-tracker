require('dotenv').config()
const express = require('express')
require('express-async-errors')
const app = express()
const playersRouter = require('./routers/players')
const statsRouter = require('./routers/stats')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')

const PORT = process.env.PORT || 8888

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('connected to MongoDB'))
  .catch((error) => console.log('error connecting to MongoDB:', error.message))

app
  .use(middleware.requestLogger)
  .use(express.json({ limit: '50mb' }))
  .use('/api/players', playersRouter)
  .use('/api/stats', statsRouter)
  .use(middleware.errorHandler)
  .listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
