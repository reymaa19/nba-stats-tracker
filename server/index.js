require('dotenv').config()

const PORT = process.env.PORT || 8888
const API_URI = process.env.API_URI

const express = require('express')
const cors = require('cors')

require('express-async-errors')

const app = express()

app.use(cors())

app.get('/api/players/:search', async (req, res) => {
  const response = await fetch(
    `${API_URI}/players?search=${req.params.search}&per_page=100`
  )
  const result = await response.json()
  const players = result.data.map((p) => {
    const details = {
      id: p.id,
      name: `${p.first_name} ${p.last_name}`,
      position: p.position,
    }

    return details
  })

  res.send(players)
})

app.get('/api/stats/:id', async (req, res) => {
  const response = await fetch(
    `${API_URI}/stats?seasons[]=2023&player_ids[]=${req.params.id}&per_page=100`
  )
  const result = await response.json()
  const stats = { gms: 0, pts: 0, ast: 0, reb: 0, blk: 0, stl: 0 }
  const allStats = result.data.reduce((prev, curr) => {
    prev.pts += curr.pts
    prev.ast += curr.ast
    prev.reb += curr.reb
    prev.blk += curr.blk
    prev.stl += curr.stl
    prev.gms += curr.min !== '00' && 1
    return prev
  }, stats)

  res.send(allStats)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
