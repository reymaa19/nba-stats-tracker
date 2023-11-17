require('dotenv').config()

const PORT = process.env.PORT || 8888
const API_URI = process.env.API_URI

const express = require('express')
require('express-async-errors')
const app = express()
const mongoose = require('mongoose')
const Player = require('./models/player')
const Stats = require('./models/stats')

app.use(express.json())

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('connected to MongoDB'))
  .catch((error) => console.log('error connecting to MongoDB:', error.message))

app.get('/api/players', async (req, res) => {
  const players = await Player.find({
    name: { $regex: req.query.search, $options: 'i' },
  })

  res.json(players)
})

const getCareerStats = async (id, page) => {
  const checkMinutes = [null, '', '00', 0, '0:00', false, '0']
  const allStats = []

  const response = await fetch(
    `${API_URI}/stats?start_date=1946-01-01&end_date=2023-12-31&player_ids[]=${id}&per_page=100&page=${page}&postseason=false`
  )
  const result = await response.json()
  const data = result.data

  for (let i = 0; i < data.length; i++) {
    const stats = { min: '', pts: 0, ast: 0, reb: 0, blk: 0, stl: 0, szn: null }
    stats.pts += data[i].pts
    stats.ast += data[i].ast
    stats.reb += data[i].reb
    stats.blk += data[i].blk
    stats.stl += data[i].stl
    stats.szn = data[i].game.season
    stats.min = !checkMinutes.includes(data[i].min) && data[i].min

    allStats.push(stats)
  }

  return { stats: allStats, total: result.meta.total_pages }
}

app.post('/api/players', async (req, res) => {})

app.get('/api/stats', async (req, res) => {
  const id = req.query.player_id
  const stats = []
  const seasons = {}

  const results = await getCareerStats(id, 1)
  results.stats.map((stat) => stats.push(stat))

  for (let i = 2; i <= results.total; i++) {
    const nextResults = await getCareerStats(id, i)
    nextResults.stats.map((stat) => stats.push(stat))
  }

  for (let i = 0; i < stats.length; i++) {
    const stat = stats[i]

    if (!seasons[stat.szn]) seasons[stat.szn] = []

    stat.min && seasons[stat.szn].push(stat)
  }

  res.json(seasons)
})

app.post('/api/stats', async (req, res) => {
  const body = req.body

  res.status(201).json(savedStats)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
