import axios from 'axios'
const PLAYERS_BASE_URL = '/api/players'
const STATS_BASE_URL = '/api/stats'

const searchPlayer = async (name) => {
  const request = await axios.get(`${PLAYERS_BASE_URL}/${name}`)
  return request.data
}

const getStats = async (id) => {
  const request = await axios.get(`${STATS_BASE_URL}/${id}`)
  return request.data
}

export default { searchPlayer, getStats }
