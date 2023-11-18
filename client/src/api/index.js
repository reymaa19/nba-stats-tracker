import axios from 'axios'
const PLAYERS_BASE_URL = '/api/players'
const STATS_BASE_URL = '/api/stats'

const searchPlayers = async (name) => {
  const request = await axios.get(`${PLAYERS_BASE_URL}?search=${name}`)
  return request.data
}

const getStats = async (id, player_id) => {
  const request = await axios.get(`${STATS_BASE_URL}/${id}?player_id=${player_id}`)
  return request.data
}

const addPlayer = async (player) => {
  const request = await axios.post(PLAYERS_BASE_URL, player)
  return request.data
}

const addStats = async (stats, id) => {
  const request = await axios.post(`${STATS_BASE_URL}?player_id=${id}`, stats)
  return request.data
}

export default { searchPlayers, getStats, addPlayer, addStats }
