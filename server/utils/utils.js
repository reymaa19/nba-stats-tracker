const API_URI = process.env.API_URI

/**
 * Fetches the players stats from the API.
 * @param {String} player_id - The players id to be searched.
 * @param {String} page - The page of the API to be searched.
 * @param {String} lastPlayed - The last time the player played.
 * @returns The players stats from the API.
 */
const fetchPlayerStatsFromAPI = async (player_id, page, lastPlayed) => {
  const startAndEndDate = `start_date=${lastPlayed}&end_date=${
    new Date().toISOString().split('T')[0]
  }`
  const REQUEST_URI = `${API_URI}&${startAndEndDate}&player_ids[]=${player_id}&page=${page}`

  const invalidMinutes = [null, '', '00', 0, '0:00', false, '0']
  const allStats = []

  const response = await fetch(REQUEST_URI) // MAX 60 requests/min
  const result = await response.json()

  for (let i = 0; i < result.data.length; i++) {
    const stat = result.data[i]

    const stats = {
      pts: stat.pts,
      ast: stat.ast,
      reb: stat.reb,
      blk: stat.blk,
      stl: stat.stl,
      date: stat.game.date,
      szn: stat.game.season,
      min: !invalidMinutes.includes(stat.min) && stat.min,
    }

    if (stat.min) allStats.push(stats)
  }

  return { stats: allStats, nextPage: result.meta.next_page }
}

/**
 * Calculates the players totals per season.
 * @param {Array} totals - The totals to be added upon per player season.
 * @param {Object} stats - The stats to be calculated.
 * @param {String} category - The stat category name.
 * @returns Each of the players important stat category totals per season.
 */
const getTotals = (totals, stats, category) => {
  const statsPerSeason = new Map(Object.entries(stats))

  statsPerSeason.forEach((stat) => {
    const prevStat = totals[totals.length - 1] || 0
    totals.push(
      prevStat + stat.reduce((prev, curr) => prev + curr[category], 0)
    )
  })

  return totals
}

/**
 * Calculates the player's season totals.
 * @param {Object} stats - The stats to be calculated.
 * @returns The players season totals.
 */
const calculatePlayerSeasonTotals = (stats) => {
  const pts = getTotals([0], stats, 'pts')
  const ast = getTotals([0], stats, 'ast')
  const reb = getTotals([0], stats, 'reb')
  const blk = getTotals([0], stats, 'blk')
  const stl = getTotals([0], stats, 'stl')

  const totals = { pts, ast, reb, blk, stl }

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
 * Fetches all the player's stats from the API.
 * @param {String} player_id - The player's id.
 * @param {String} lastPlayed - The last time the player played.
 * @returns Total stats per season and the last time the player played.
 */
const fetchAllStatsFromAPI = async (player_id, lastPlayed = '1946-01-01') => {
  const stats = []
  let page = 1

  while (page) {
    const results = await fetchPlayerStatsFromAPI(player_id, page, lastPlayed)
    results.stats.map((stat) => stats.push(stat))
    page = results.nextPage
  }

  return stats
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
  let lastPlayed = data[0].date.split('T')[0]

  data.map((stat) => {
    const date = stat.date.split('T')[0]

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
  calculateTotals,
  verifyStats,
}
