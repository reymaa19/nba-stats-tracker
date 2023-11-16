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
  const players = await Player.find({
    name: { $regex: req.query.search, $options: 'i' },
  })

  res.send(players)
})

const getCareerStats = async (id, page) => {
  const baseStats = {
    gms: 0,
    pts: 0,
    ast: 0,
    reb: 0,
    blk: 0,
    stl: 0,
  }

  const response = await fetch(
    `${API_URI}/stats?start_date=1946-01-01&end_date=2023-12-31&player_ids[]=${id}&per_page=100&page=${page}&postseason=false`
  )

  const result = await response.json()

  const checkMinutes = [null, '', '00', 0, '0:00', false, '0']

  stats = result.data.reduce((prev, curr) => {
    prev.pts += curr.pts
    prev.ast += curr.ast
    prev.reb += curr.reb
    prev.blk += curr.blk
    prev.stl += curr.stl
    !checkMinutes.includes(curr.min) && prev.gms++
    return prev
  }, baseStats)

  return { stats: stats, total: result.meta.total_pages }
}

app.post('/api/players', async (req, res) => {
  const player = new Player(req.body)

  const savedPlayer = await player.save()

  res.status(201).json(savedPlayer)
})

app.get('/api/stats', async (req, res) => {
  const id = req.query.player_id
  const stats = []

  const results = await getCareerStats(id, 1)

  stats.push(results.stats)

  for (let i = 2; i <= results.total; i++) {
    const nextResults = await getCareerStats(id, i)
    stats.push(nextResults.stats)
  }

  res.send(stats)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
