import { useEffect, useState } from 'react'
import api from './api/index'
import allPlayers from './players.json'

const App = () => {
  const [search, setSearch] = useState('')
  const [players, setPlayers] = useState([])
  const [stats, setStats] = useState([])

  const searchPlayers = async () => {
    const players = await api.searchPlayers(search)
    setPlayers(players)
  }

  useEffect(() => {
    const searchAfterTyping = setTimeout(() => {
      search ? searchPlayers() : setPlayers([])
    }, 500)

    return () => clearTimeout(searchAfterTyping)
  }, [search])

  const getPlayerStats = async (e) => {
    const statsId = e.target.value

    if (!statsId) {
      console.log('scraping data')

      const stats = await api.getStats(null, e.target.id)
      setStats(stats)

      searchPlayers()

      return
    }
    console.log('fetching from db')

    const stats = await api.getStats(statsId, null)
    setStats(stats)
  }

  return (
    <>
      Name: <input onChange={(e) => setSearch(e.target.value)} value={search} />
      <div>
        <ul>
          {players.map((p) => (
            <li key={p.id}>
              <button onClick={getPlayerStats} id={p.id} value={p.stats}>
                {p.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <button
      // onClick={() => {
      //   const test = Object.entries(allPlayers)
      //   test[0][1].forEach(async (player) => await api.addPlayer(player))
      // }}
      >
        tests
      </button>
    </>
  )
}

export default App
