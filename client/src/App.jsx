import { useEffect, useState } from 'react'
import Chart from './Chart'
import api from './api/index'

const App = () => {
  const [search, setSearch] = useState('')
  const [players, setPlayers] = useState([])
  const [stats, setStats] = useState(null)

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

  const getPlayerStats = async ({ target }) => {
    const statsId = target.value

    if (!statsId) {
      const stats = await api.getStats(null, target.id)
      setStats(stats)
      searchPlayers()
      return
    }

    const stats = await api.getStats(statsId, null)
    setStats(stats)
  }

  return (
    <>
      Name:{' '}
      <input
        name="search"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />
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
        onClick={() => setStats(null)}
      >
        Clear Graph
      </button>
      {stats && <Chart stats={stats} />}
    </>
  )
}

export default App
