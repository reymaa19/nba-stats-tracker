const statsRouter = require('express').Router()
const Player = require('../models/player')
const Stats = require('../models/stats')
const utils = require('../utils')

const saveStats = async (stats, id) => {
  const player = await Player.findById(id)
  stats.player = player.name

  const savedStats = await stats.save()
  player.stats = savedStats._id

  await player.save()

  return savedStats
}

statsRouter.get('/:id', async (req, res) => {
  const id = req.params.id

  if (id != 'null') {
    const recordedStats = await Stats.findById(id)
    res.json(recordedStats.data)
    return
  }

  const player_id = req.query.player_id
  const stats = []
  const seasons = {}

  // scrape players career stats starting for the first page
  const results = await utils.scrapeCareerStats(player_id, 1)
  results.stats.map((stat) => stats.push(stat))

  // use the returned total pages to scrape each page until the last
  for (let i = 2; i <= results.total; i++) {
    const nextResults = await utils.scrapeCareerStats(player_id, i)
    nextResults.stats.map((stat) => stats.push(stat))
  }

  // assign each stat to its appropriate season
  for (let i = 0; i < stats.length; i++) {
    const stat = stats[i]

    // creates a new object with the season as its name and with empty array
    if (!seasons[stat.szn]) seasons[stat.szn] = []

    // if 0 play time then no stats were recorded
    stat.min && seasons[stat.szn].push(stat)
  }

  const statsToSave = new Stats({ data: seasons })
  const savedStats = await saveStats(statsToSave, player_id)

  res.json(savedStats.data)
})

statsRouter.post('/', async (req, res) => {
  const stats = new Stats({ data: req.body })
  const savedStats = await saveStats(stats, req.query.player_id)

  res.status(201).json(savedStats)
})

module.exports = statsRouter
