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
  stats.forEach((stat) => {
    prevStat = totals[totals.length - 1] || 0
    totals.push(
      prevStat + stat.reduce((prev, curr) => prev + curr[category], 0)
    )
  })

  return totals
}

const calculatePlayerSeasonTotals = (record) => {
  const pts = getTotals([0], record.stats, 'pts')
  const ast = getTotals([0], record.stats, 'ast')
  const reb = getTotals([0], record.stats, 'reb')
  const blk = getTotals([0], record.stats, 'blk')
  const stl = getTotals([0], record.stats, 'stl')

  const totals = { pts, ast, reb, blk, stl }

  return totals
}

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

module.exports = {
  fetchPlayerStats,
  calculatePlayerSeasonTotals,
  calculatePlayerCareerTotals,
}
