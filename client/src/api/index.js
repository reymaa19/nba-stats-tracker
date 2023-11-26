import axios from 'axios'
const PLAYERS_BASE_URL = '/api/players'
const STATS_BASE_URL = '/api/stats'

const searchPlayers = async (name) => {
  const response = await axios.get(`${PLAYERS_BASE_URL}?search=${name}`)
  return response.data
}

const getStats = async (id, player_id, name) => {
  const response = await axios.get(
    `${STATS_BASE_URL}/${id}?player_id=${player_id}&name=${name}`
  )
  return response.data
}

const addPlayer = async (player) => {
  const response = await axios.post(PLAYERS_BASE_URL, player)
  return response.data
}

const addStats = async (stats, id) => {
  const response = await axios.post(`${STATS_BASE_URL}?player_id=${id}`, stats)
  return response.data
}

const calculatePlayerSeasonTotals = async (pinnedPlayers) => {
  const response = await axios.post(
    `${STATS_BASE_URL}/calculatePlayerSeasonTotals`,
    pinnedPlayers
  )

  return response.data
}

const calculatePlayerCareerTotals = async (seasonTotals) => {
  const response = await axios.post(
    `${STATS_BASE_URL}/calculatePlayerCareerTotals`,
    seasonTotals
  )

  return response.data
}

export default {
  searchPlayers,
  getStats,
  addPlayer,
  addStats,
  calculatePlayerSeasonTotals,
  calculatePlayerCareerTotals,
}
