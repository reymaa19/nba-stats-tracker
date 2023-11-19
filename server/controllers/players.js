const Player = require('../models/player')

const getPlayers = async (req, res) => {
  const players = await Player.find({
    name: { $regex: req.query.search, $options: 'i' },
  })

  res.status(200).json(players)
}

const addPlayer = async (req, res) => {
  const player = new Player(req.body)

  const savedPlayer = await player.save()

  res.status(201).json(savedPlayer)
}

module.exports = {
  getPlayers,
  addPlayer,
}
