const playersRouter = require('express').Router()
const { getPlayers, addPlayer } = require('./playersController')

playersRouter.get('/', getPlayers)

playersRouter.post('/', addPlayer)

module.exports = playersRouter
