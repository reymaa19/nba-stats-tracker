import { useEffect, useMemo, useState } from 'react'
import Chart from './Chart'
import api from './api/index'

const App = () => {
  const [search, setSearch] = useState('Michael Jordan')
  const [players, setPlayers] = useState([])
  const [pinnedPlayers, setPinnedPlayers] = useState(new Map())
  const [statCategory, setStatCategory] = useState('pts')

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
      <input
        name="search"
        placeholder="Search"
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
      <br />
      <select name="stat" onChange={(e) => setStatCategory(e.target.value)}>
        <option value="pts">Points</option>
        <option value="ast">Assists</option>
        <option value="reb">Rebounds</option>
        <option value="blk">Blocks</option>
        <option value="stl">Steals</option>
      </select>
      {useMemo(
        () => (
          <Chart pinnedPlayers={pinnedPlayers} statCategory={statCategory} />
        ),
        [pinnedPlayers, statCategory]
      )}
    </>
  )
}

export default App
