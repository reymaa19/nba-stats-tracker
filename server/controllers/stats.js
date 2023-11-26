const Player = require('../models/player')
const Stats = require('../models/stats')
const utils = require('../utils/utils')

const saveStats = async (stats, id) => {
  try {
    const player = await Player.findById(id)
    stats.player = player.name

    const savedStats = await stats.save()

    player.stats = savedStats._id
    await player.save()

    return savedStats
  } catch (err) {
    res.json(401).json({ error: 'Saving stats unsuccessful' })
  }
}

const getStats = async (req, res) => {
  const id = req.params.id
  const { name, player_id } = req.query

  if (id != 'null') {
    try {
      const recordedStats = await Stats.findById(id)

      const seasonTotals = utils.calculatePlayerSeasonTotals({
        stats: recordedStats.data,
        name,
        id: player_id,
      })
      const careerTotals = utils.calculatePlayerCareerTotals(seasonTotals)
      res.status(200).json({ seasonTotals, careerTotals, name, id: player_id })
      return
    } catch (err) {
      res.status(401).json({ error: 'Finding stats unsuccessful' })
    }
  }

  const stats = []
  const seasons = {}

  const results = await utils.fetchPlayerStats(player_id, 1)
  results.stats.map((stat) => stats.push(stat))

  for (let i = 2; i <= results.total; i++) {
    const nextResults = await utils.fetchPlayerStats(player_id, i)
    nextResults.stats.map((stat) => stats.push(stat))
  }

  for (let i = 0; i < stats.length; i++) {
    const stat = stats[i]

    if (!seasons[stat.szn]) seasons[stat.szn] = []

    seasons[stat.szn].push(stat)
  }

  try {
    const statsToSave = new Stats({ data: seasons })
    const savedStats = await saveStats(statsToSave, player_id)
    const seasonTotals = utils.calculatePlayerSeasonTotals({
      stats: savedStats.data,
      name,
      id: player_id,
    })
    const careerTotals = utils.calculatePlayerCareerTotals(seasonTotals)
    res.status(200).json({ seasonTotals, careerTotals, name, id: player_id })
  } catch (error) {
    res.status(401).json({ error: 'Finding stats unsuccessful' })
  }
}

const addStats = async (req, res) => {
  const stats = new Stats({ data: req.body })
  try {
    const savedStats = await saveStats(stats, req.query.player_id)
    res.status(201).json(savedStats)
  } catch (err) {
    res.status(401).json({ error: 'Saving stats unsuccessful' })
  }
}

const calculatePlayerSeasonTotals = (req, res) => {
  try {
    const seasonTotals = utils.calculatePlayerSeasonTotals(req.body)
    res.status(200).json(seasonTotals)
  } catch (err) {
    res.status(401).json({ error: 'Improper data received' })
  }
}

const calculatePlayerCareerTotals = (req, res) => {
  const careerTotals = utils.calculatePlayerCareerTotals(req.body)
  res.status(200).json(careerTotals)
}

module.exports = {
  getStats,
  addStats,
  calculatePlayerSeasonTotals,
  calculatePlayerCareerTotals,
}
