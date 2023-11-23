const playersRouter = require('express').Router()
const { getPlayers, addPlayer } = require('../controllers/players')

playersRouter.get('/', getPlayers)

playersRouter.post('/', addPlayer)

module.exports = playersRouter
