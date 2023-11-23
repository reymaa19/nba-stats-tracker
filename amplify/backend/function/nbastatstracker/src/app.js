const express = require('express')
require('express-async-errors')
const app = express()
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const mongoose = require('mongoose')
const playersRouter = require('./routers/players')
const statsRouter = require('./routers/stats')

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('connected to MongoDB'))
  .catch((error) => console.log('error connecting to MongoDB:', error.message))

app
  .use(awsServerlessExpressMiddleware.eventContext())
  .use(express.json({ limit: '50mb' }))
  .use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')
    next()
  })
  .use('/nba/players', playersRouter)
  .use('/nba/stats', statsRouter)

app.listen(process.env.PORT, function () {
  console.log('App started')
})

module.exports = app
