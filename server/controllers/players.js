const Player = require('../models/player')

const getPlayers = async (req, res) => {
  const search = req.query.search.replace(/[^a-z ,-]/gim, '')
  if (search.replace(' ', '').length <= 3)
    res.status(400).json({ error: 'Search must be at least 4 characters long' })

  const players = await Player.find({
    name: { $regex: search, $options: 'i' },
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
