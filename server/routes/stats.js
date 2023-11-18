const statsRouter = require('express').Router()
const Player = require('../models/player')
const Stats = require('../models/stats')
const utils = require('../utils')

statsRouter.get('/:id', async (req, res) => {
  const id = req.params.id
  const stats = await Stats.findById(id)
  res.json(stats)

  // const player_id = req.query.player_id
  // const stats = []
  // const seasons = {}

  // const results = await getCareerStats(player_id, 1)
  // results.stats.map((stat) => stats.push(stat))

  // for (let i = 2; i <= results.total; i++) {
  //   const nextResults = await getCareerStats(player_id, i)
  //   nextResults.stats.map((stat) => stats.push(stat))
  // }

  // for (let i = 0; i < stats.length; i++) {
  //   const stat = stats[i]

  //   if (!seasons[stat.szn]) seasons[stat.szn] = []

  //   stat.min && seasons[stat.szn].push(stat)
  // }

  // res.json(seasons)
})

statsRouter.post('/', async (req, res) => {
  const stats = new Stats({ data: req.body })

  const savedStats = await stats.save()

  const player = await Player.findById(req.query.player_id)
  player.stats = savedStats._id

  await player.save()

  res.status(201).json(savedStats)
})

module.exports = statsRouter
