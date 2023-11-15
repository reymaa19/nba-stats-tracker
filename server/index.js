require('dotenv').config()

const PORT = process.env.PORT || 8888
const API_URI = process.env.API_URI

const express = require('express')
const cors = require('cors')
require('express-async-errors')
const app = express()

app.use(cors())

app.get('/api/players', async (req, res) => {
  console.log(API_URI)
  const response = await fetch(API_URI)
  const result = await response.json()
  res.send(result)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
