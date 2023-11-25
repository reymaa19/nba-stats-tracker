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

const getTotals = (totals, stats, category) => {
  Object.entries(stats).map((stat) => {
    const previousStat = totals[totals.length - 1] || 0
    totals.push(
      previousStat + stat[1].reduce((prev, curr) => prev + curr[category], 0)
    )
  })

  return totals
}

const calculatePlayerSeasonTotals = (pinnedPlayers) => {
  const seasonTotals = []

  pinnedPlayers.forEach((stats, player) => {
    const pts = getTotals([0], stats, 'pts')
    const ast = getTotals([0], stats, 'ast')
    const reb = getTotals([0], stats, 'reb')
    const blk = getTotals([0], stats, 'blk')
    const stl = getTotals([0], stats, 'stl')

    const totals = { pts, ast, reb, blk, stl }

    seasonTotals.push({ player, totals })
  })

  return seasonTotals
}

const calculatePlayerCareerTotals = (seasonTotals) => {
  return seasonTotals.map((t) => {
    const curr = t.totals
    const final = curr.pts.length - 1

    return {
      player: t.player,
      pts: curr.pts[final],
      ast: curr.ast[final],
      reb: curr.reb[final],
      blk: curr.blk[final],
      stl: curr.stl[final],
    }
  })
}

module.exports = {
  fetchPlayerStats,
  calculatePlayerSeasonTotals,
  calculatePlayerCareerTotals,
}
