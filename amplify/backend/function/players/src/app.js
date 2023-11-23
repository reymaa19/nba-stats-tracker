const express = require('express')
require('express-async-errors')
const app = express()
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const mongoose = require('mongoose')
const playersRouter = require('./playersRouter')

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
  .use('/players', playersRouter)

app.listen(process.env.PORT, function () {
  console.log('App started')
})

module.exports = app
