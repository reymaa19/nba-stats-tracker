const statsRouter = require('express').Router()
const {
  getStats,
  addStats,
  calculatePlayerSeasonTotals,
} = require('../controllers/stats')

statsRouter.get('/:id', getStats)

statsRouter.post('/', addStats)

statsRouter.post('/calculatePlayerSeasonTotals', calculatePlayerSeasonTotals)

module.exports = statsRouter
