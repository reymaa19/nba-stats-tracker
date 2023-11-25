const statsRouter = require('express').Router()
const {
  getStats,
  addStats,
  calculatePlayerSeasonTotals,
  calculatePlayerCareerTotals,
} = require('../controllers/stats')

statsRouter.get('/:id', getStats)

statsRouter.post('/', addStats)

statsRouter.post('/calculatePlayerSeasonTotals', calculatePlayerSeasonTotals)

statsRouter.post('/calculatePlayerCareerTotals', calculatePlayerCareerTotals)

module.exports = statsRouter
