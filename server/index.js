require('dotenv').config()
const express = require('express')
require('express-async-errors')
const app = express()
const playersRouter = require('./routers/players')
const statsRouter = require('./routers/stats')
const mongoose = require('mongoose')

const PORT = process.env.PORT || 8888

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('connected to MongoDB'))
  .catch((error) => console.log('error connecting to MongoDB:', error.message))

app.use(express.json({ limit: '50mb' }))

app.use('/api/players', playersRouter)
app.use('/api/stats', statsRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
