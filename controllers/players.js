const Player = require('../models/player')

const getPlayers = async (req, res) => {
  const search = req.query.search.replace(/[^a-z ,'-]/gim, '')
  if (search.replace(' ', '').length < 4)
    return res
      .status(401)
      .json({ error: 'Search must be at least 4 characters long' })

  try {
    const players = await Player.find({
      name: { $regex: search, $options: 'i' },
    })
    res.status(200).json(players)
  } catch (err) {
    res.status(401).json({ error: 'Search unsuccessful' })
  }
}

const addPlayer = async (req, res) => {
  const player = new Player(req.body)

  try {
    const savedPlayer = await player.save()
    res.status(201).json(savedPlayer)
  } catch (err) {
    res.status(401).json({ error: 'Saving player to database unsuccessful' })
  }
}

module.exports = {
  getPlayers,
  addPlayer,
}
