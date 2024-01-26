const statsRouter = require('express').Router()
const { getStats } = require('../controllers/stats')

statsRouter.get('/:id', getStats)

module.exports = statsRouter
