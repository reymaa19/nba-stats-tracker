const playersRouter = require('express').Router()
const Player = require('../models/player')

playersRouter.get('/', async (req, res) => {
  const players = await Player.find({
    name: { $regex: req.query.search, $options: 'i' },
  })
  console.log('test')

  res.json(players)
})

playersRouter.post('/', async (req, res) => {
  const player = new Player(req.body)

  const savedPlayer = await player.save()

  res.status(201).json(savedPlayer)
})

module.exports = playersRouter
