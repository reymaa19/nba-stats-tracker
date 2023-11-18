require('dotenv').config()
const express = require('express')
require('express-async-errors')
const app = express()
const playersRouter = require('./routes/players')
const statsRouter = require('./routes/stats')
const morgan = require('morgan')
const mongoose = require('mongoose')

const PORT = process.env.PORT || 8888

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('connected to MongoDB'))
  .catch((error) => console.log('error connecting to MongoDB:', error.message))

app.use(morgan('dev'))
app.use(express.json({ limit: '50mb' }))

app.use('/api/players', playersRouter)
app.use('/api/stats', statsRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
