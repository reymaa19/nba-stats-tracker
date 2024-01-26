const API_URI = process.env.API_URI

/**
 * Fetches the player's stats from the API.
 * @param {String} player_id - The players id to be searched.
 * @param {String} page - The page of the API to be searched.
 * @param {String} lastPlayed - The last time the player played.
 * @returns The player's stats from the API.
 */
const fetchStatsFromAPI = async (player_id, page, lastPlayed) => {
  const startAndEndDate = `start_date=${lastPlayed}&end_date=${
    new Date().toISOString().split('T')[0]
  }`
  const requestURI = `${API_URI}&${startAndEndDate}&player_ids[]=${player_id}&page=${page}`

  return new Promise(async (resolve, reject) => {
    const response = await fetch(requestURI) // MAX 60 requests/min
    try {
      const { data } = await response.json()
      resolve(data)
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Fetches all the player's stats from the API.
 * @param {String} player_id - The player's id.
 * @param {String} lastPlayed - The last time the player played.
 * @returns Total stats per season and the last time the player played.
 */
const fetchAllStatsFromAPI = async (player_id, lastPlayed = '1946-01-01') => {
  let allStats = []

  let results = await Promise.all([
    fetchStatsFromAPI(player_id, 1, lastPlayed),
    fetchStatsFromAPI(player_id, 2, lastPlayed),
    fetchStatsFromAPI(player_id, 3, lastPlayed),
    fetchStatsFromAPI(player_id, 4, lastPlayed),
    fetchStatsFromAPI(player_id, 5, lastPlayed),
    fetchStatsFromAPI(player_id, 6, lastPlayed),
    fetchStatsFromAPI(player_id, 7, lastPlayed),
    fetchStatsFromAPI(player_id, 8, lastPlayed),
    fetchStatsFromAPI(player_id, 9, lastPlayed),
    fetchStatsFromAPI(player_id, 10, lastPlayed),
    fetchStatsFromAPI(player_id, 11, lastPlayed),
    fetchStatsFromAPI(player_id, 12, lastPlayed),
    fetchStatsFromAPI(player_id, 13, lastPlayed),
    fetchStatsFromAPI(player_id, 14, lastPlayed),
    fetchStatsFromAPI(player_id, 15, lastPlayed),
  ])

  for (let i = 0; i < results.length; i++) {
    if (results[i].length == 0) break
    for (let j = 0; j < results[i].length; j++) {
      const stats = results[i][j]
      const { pts, ast, reb, blk, stl } = stats

      if (pts || ast || reb || blk || stl) {
        allStats.push({
          pts,
          ast,
          reb,
          blk,
          stl,
          date: stats.game.date.split('T')[0],
          szn: stats.game.season,
        })
      }
    }
  }

  return allStats
}

/**
 * Calculates the player's season totals.
 * @param {Object} data - The stats data.
 * @returns The players season totals.
 */
const calculatePlayerSeasonTotals = (data) => {
  const totals = { pts: [0], ast: [0], reb: [0], blk: [0], stl: [0] }

  for (const szn in data) {
    for (const category in totals) {
      totals[category].push(
        totals[category][totals[category].length - 1] +
          data[szn].reduce((prev, curr) => prev + curr[category], 0)
      )
    }
  }

  return totals
}

/**
 * Calculates the player's career totals.
 * @param {Object} seasonTotals - The players season stat totals.
 * @returns The players career totals.
 */
const calculatePlayerCareerTotals = (seasonTotals) => {
  const final = seasonTotals.pts.length - 1

  return {
    pts: seasonTotals.pts[final],
    ast: seasonTotals.ast[final],
    reb: seasonTotals.reb[final],
    blk: seasonTotals.blk[final],
    stl: seasonTotals.stl[final],
    szn: final + 1,
  }
}

/**
 * Goes through each stat, separates it and finds the last time the player played.
 * @param {Array} stats - The stats to be verified and sorted.
 * @param {Object} data - The data that'll used to store the stats in.
 * @returns Total stats per season and the last time the player played.
 */
const verifyStats = (stats, data = {}) => {
  const totalStatsPerSeason = data

  for (let i = 0; i < stats.length; i++) {
    const stat = stats[i]

    if (!totalStatsPerSeason[stat.szn]) totalStatsPerSeason[stat.szn] = []

    totalStatsPerSeason[stat.szn].push(stat)
  }

  return totalStatsPerSeason
}

/**
 * Finds the last time the player played in an NBA game.
 * @param {Object} data - Stats data.
 * @returns The NBA game the player played in.
 */
const findLastGamePlayed = (data) => {
  let lastPlayed = data[0].date

  data.map((stat) => {
    const date = stat.date

    if (lastPlayed < date) lastPlayed = date
  })

  return lastPlayed
}

/**
 * Calculates the player's season and career totals.
 * @param {Object} data - Stats data.
 * @returns Player season and career totals.
 */
const calculateTotals = (data) => {
  const seasonTotals = calculatePlayerSeasonTotals(data)
  const careerTotals = calculatePlayerCareerTotals(seasonTotals)

  return { seasonTotals, careerTotals }
}

module.exports = {
  fetchAllStatsFromAPI,
  findLastGamePlayed,
  fetchStatsFromAPI,
  calculateTotals,
  verifyStats,
}
