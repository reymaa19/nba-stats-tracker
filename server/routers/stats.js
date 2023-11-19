const statsRouter = require('express').Router()
const { getStats, addStats } = require('../controllers/stats')

statsRouter.get('/:id', getStats)

statsRouter.post('/', addStats)

module.exports = statsRouter
