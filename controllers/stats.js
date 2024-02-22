const mongoose = require('mongoose')
const Player = require('../models/player')
const Stats = require('../models/stats')
const utils = require('../utils/utils')

/**
 * Saves stats to the database.
 * @param {Object} data - The stats data.
 * @param {String} player_id - The player ID for the stats to be associated with.
 * @returns The saved stats.
 */
const saveStats = async (data, player_id) => {
  try {
    const stats = new Stats({ data })
    const player = await Player.findById(player_id)
    stats.player = player.name

    const savedStats = await stats.save()

    player.stats = savedStats._id
    await player.save()

    return savedStats
  } catch (err) {
    return 'Saving stats unsuccessful'
  }
}

/**
 * Updates old stats and replaced them to the database.
 * @param {Object} recordedStats - The old recorded stats.
 * @param {Object} data - The new stats data.
 * @returns The updated stats result.
 */
const updateStats = async (recordedStats, data) => {
  const _id = new mongoose.mongo.ObjectId(recordedStats.id)
  try {
    return await Stats.replaceOne(
      { _id },
      { data, player: recordedStats.player }
    )
  } catch (err) {
    return 'Saving stats unsuccessful'
  }
}

/**
 * Gets the stats from the API or database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns Stats in season and career total format.
 */
const getStats = async (req, res) => {
  const id = req.params.id
  const { name, player_id } = req.query

  const recordedStats = await Stats.findById(id)
  const data = JSON.parse(JSON.stringify(recordedStats.data))

  // If stats already exist in the database then return them
  if (mongoose.Types.ObjectId.isValid(id)) {
    try {
      const lastPlayed = utils.findLastGamePlayed(
        Object.values(data)[Object.values(data).length - 1]
      )
      const apiStats = await utils.fetchStatsFromAPI(player_id, 1, lastPlayed)

      apiStats.shift()

      // If new stats are found from the API update the database.
      if (apiStats.length > 0) {
        const totalStatsPerSeason = utils.verifyStats(apiStats, data)
        const { seasonTotals, careerTotals } =
          utils.calculateTotals(totalStatsPerSeason)

        await updateStats(recordedStats, totalStatsPerSeason)

        return res
          .status(200)
          .json({ seasonTotals, careerTotals, name, id: player_id })
      }

      const { seasonTotals, careerTotals } = utils.calculateTotals(data)

      return res
        .status(200)
        .json({ seasonTotals, careerTotals, name, id: player_id, stats: id })
    } catch (err) {
      const { seasonTotals, careerTotals } = utils.calculateTotals(data)
      return res
        .status(200)
        .json({ seasonTotals, careerTotals, name, id: player_id, stats: id })
    }
  }

  // If stats don't exist then fetch them from the API
  let totalStatsPerSeason = {}

  try {
    const result = await utils.fetchAllStatsFromAPI(player_id)
    totalStatsPerSeason = utils.verifyStats(result)
  } catch (err) {
    return res
      .status(401)
      .json({ error: 'Fetching too much new data. Try again later' })
  }

  try {
    const savedStats = await saveStats(totalStatsPerSeason, player_id)
    const { seasonTotals, careerTotals } =
      utils.calculateTotals(totalStatsPerSeason)

    res.status(200).json({
      seasonTotals,
      careerTotals,
      name,
      id: player_id,
      stats: savedStats.id,
    })
  } catch (err) {
    return res.status(401).json({ error: 'Saving stats unsuccessful' })
  }
}

module.exports = { getStats }
