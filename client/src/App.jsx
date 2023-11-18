import { useEffect, useState } from 'react'
import api from './api/index'
import allPlayers from './players.json'

const App = () => {
  const [search, setSearch] = useState('')
  const [players, setPlayers] = useState([])
  const [stats, setStats] = useState([])

  const searchPlayer = async (e) => {
    e.preventDefault()
    const players = await api.searchPlayer(search)
    setPlayers(players)
  }

  const getPlayerStats = async ({ target }) => {
    console.log(target.value)
    // const stats = await api.getStats(target.value)
    // setStats(stats)
  }

  useEffect(() => {
    let total = 0
    console.log(stats)
    for (const season in stats) {
      total += stats[season].length
    }
    console.log('total games: ', total)
  }, [stats])

  const saveStats = async ({ target }) => {
    // @ CREATING 1 Player
    // const response = await api.addPlayer(allPlayers[0][0])
    // console.log(response)
    // CREATING ALL PLAYERS
    // Object.entries(allPlayers[0]).forEach(async (player) => {
    //   const response = await api.addPlayer(player[1])
    //   console.log(response)
    // })
    // console.log('@@@@@ DONE @@@@@')
    // CREATING SELECTED PLAYERS STATS
    // console.log(stats)
    // console.log(target.value)
    // const response = await api.addStats(stats, target.value)
    // console.log(response)
  }

  return (
    <>
      <form onSubmit={searchPlayer}>
        Name:{' '}
        <input onChange={(e) => setSearch(e.target.value)} value={search} />{' '}
        <button type="submit">Search</button>
      </form>
      <div>
        <ul>
          {players.map((p) => (
            <li key={p.id}>
              <button onClick={getPlayerStats} value={p.stats}>
                {p.name}
              </button>
            </li>
          ))}
        </ul>
        {/* <button onClick={saveStats}>test</button> */}
      </div>
    </>
  )
}

export default App
