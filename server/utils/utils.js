const API_URI = process.env.API_URI

const statScraper = async (player_id, page) => {
  const REQUEST_URI = `${API_URI}&player_ids[]=${player_id}&page=${page}`

  const invalidMinutes = [null, '', '00', 0, '0:00', false, '0']
  const allStats = []

  const response = await fetch(REQUEST_URI)
  const result = await response.json()
  const data = result.data

  for (let i = 0; i < data.length; i++) {
    const stats = {
      min: '',
      pts: 0,
      ast: 0,
      reb: 0,
      blk: 0,
      stl: 0,
      date: null,
      szn: null,
    }
    stats.pts += data[i].pts
    stats.ast += data[i].ast
    stats.reb += data[i].reb
    stats.blk += data[i].blk
    stats.stl += data[i].stl
    stats.date = data[i].game.date
    stats.szn = data[i].game.season
    stats.min = !invalidMinutes.includes(data[i].min) && data[i].min

    allStats.push(stats)
  }

  return { stats: allStats, total: result.meta.total_pages }
}

module.exports = { statScraper }
