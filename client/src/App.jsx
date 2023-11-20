import { useEffect, useState } from 'react'
import Chart from './Chart'
import api from './api/index'

const App = () => {
  const [search, setSearch] = useState('')
  const [players, setPlayers] = useState([])
  const [pinnedPlayers, setPinnedPlayers] = useState(new Map())

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

  const pinPlayer = async ({ name, stats, id }) => {
    if (!stats) {
      const playerStats = await api.getStats(null, id)
      setPinnedPlayers((prev) => new Map([...prev, [name, playerStats]]))
      searchPlayers()
      return
    }

    const playerStats = await api.getStats(stats, null)
    setPinnedPlayers((prev) => new Map([...prev, [name, playerStats]]))
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
              {p.name} <button onClick={() => pinPlayer(p)}>pin</button>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={() => {
          setPinnedPlayers(new Map())
        }}
      >
        Clear
      </button>
      {pinnedPlayers.size > 0 && <Chart pinned={pinnedPlayers} />}
    </>
  )
}

export default App
