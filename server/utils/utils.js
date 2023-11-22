const API_URI = process.env.API_URI

const fetchPlayerStats = async (player_id, page) => {
  const REQUEST_URI = `${API_URI}&player_ids[]=${player_id}&page=${page}`

  const invalidMinutes = [null, '', '00', 0, '0:00', false, '0']
  const allStats = []

  const response = await fetch(REQUEST_URI)
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

  return { stats: allStats, total: result.meta.total_pages }
}

const calculatePlayerSeasonTotals = (pinnedPlayers, statCategory) => {
  const seasonTotals = []

  pinnedPlayers.forEach((stats, player) => {
    const totals = [0]
    Object.entries(stats).map((stat) => {
      const previousSeasonTotal = totals[totals.length - 1] || 0
      totals.push(
        previousSeasonTotal +
          stat[1].reduce((prev, curr) => prev + curr[statCategory], 0)
      )
    })

    seasonTotals.push({ curve: 'natural', label: player, data: totals })
  })

  return seasonTotals
}

module.exports = { fetchPlayerStats, calculatePlayerSeasonTotals }
