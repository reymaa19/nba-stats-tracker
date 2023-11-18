const API_URI = process.env.API_URI

const statScraper = async (id, page) => {
  const checkMinutes = [null, '', '00', 0, '0:00', false, '0']
  const allStats = []

  const response = await fetch(
    `${API_URI}/stats?start_date=1946-01-01&end_date=2023-12-31&player_ids[]=${id}&per_page=100&page=${page}&postseason=false`
  )
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
    stats.min = !checkMinutes.includes(data[i].min) && data[i].min

    allStats.push(stats)
  }

  return { stats: allStats, total: result.meta.total_pages }
}

module.exports = { statScraper }
