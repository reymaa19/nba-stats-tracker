require('dotenv').config()

const PORT = process.env.PORT || 8888
const API_URI = process.env.API_URI

const express = require('express')
require('express-async-errors')
const app = express()
const mongoose = require('mongoose')
const Player = require('./models/player')

app.use(express.json())

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('connected to MongoDB'))
  .catch((error) => console.log('error connecting to MongoDB:', error.message))

app.get('/api/players', async (req, res) => {
  const players = await Player.findOne({ name: req.query.search })
  console.log(req.query.search)
  res.send(players)
})

app.post('/api/players', async (req, res) => {
  const player = new Player(req.body)

  const savedPlayer = await player.save()

  res.status(201).json(savedPlayer)
})

// app.get('/api/stats', async (req, res) => {
//   const season = 2023
//   const response = await fetch(
//     `${API_URI}/stats?seasons[]=${season}&player_ids[]=${req.query.player_id}&per_page=100`
//   )

//   const result = await response.json()
//   const stats = { gms: 0, pts: 0, ast: 0, reb: 0, blk: 0, stl: 0, szn: null }
//   const seasonStats = result.data.reduce((prev, curr) => {
//     prev.pts += curr.pts
//     prev.ast += curr.ast
//     prev.reb += curr.reb
//     prev.blk += curr.blk
//     prev.stl += curr.stl
//     prev.gms += curr.min !== '00' && 1
//     return prev
//   }, stats)
//   seasonStats.szn = season

//   res.send(seasonStats)
// })

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// const response = await fetch(
//   `${API_URI}/players?&per_page=100&search=${req.query.search}`
// )
// const result = await response.json()

// const players = result.data.map((p) => {
//   const details = {
//     id: p.id,
//     name: `${p.first_name} ${p.last_name}`,
//     position: p.position,
//   }

//   return details
// })
