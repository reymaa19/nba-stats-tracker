import { useState } from 'react'
import api from './api/index'

const App = () => {
  const [search, setSearch] = useState('')
  const [players, setPlayers] = useState([])
  const [stats, setStats] = useState([])

  const searchPlayer = async (e) => {
    e.preventDefault()
    const result = await api.searchPlayer(search)
    setPlayers(result)
  }

  const getPlayerStats = async (e) => {
    const result = await api.getStats(e.target.value)
    console.log(result)
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
              <button onClick={getPlayerStats} value={p.id}>
                {p.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default App
