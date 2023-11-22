import { useState } from 'react'
import Chart from './Chart'
import Players from './Players'
import Search from './Search'
import StatCategories from './StatCategories'

const App = () => {
  const [search, setSearch] = useState('')
  const [players, setPlayers] = useState([])
  const [pinnedPlayers, setPinnedPlayers] = useState(new Map())
  const [statCategory, setStatCategory] = useState('pts')

  const handlePlayerChange = (newPlayers) => {
    const isMatchingName = (player) =>
      player.name.toLowerCase().includes(search.toLowerCase())

    const pinned = players.filter((player) => pinnedPlayers.has(player.name))
    const searched = newPlayers.filter(isMatchingName)
    const pinnedSearched = pinned.filter(isMatchingName)

    const updatedPlayers =
      pinnedSearched.length > 0
        ? searched.concat(
            pinned.filter((p) => pinnedSearched.some((ps) => ps.name != p.name))
          )
        : searched.concat(pinned)

    setPlayers(updatedPlayers)
  }

  return (
    <>
      <Search
        search={search}
        onChangeSearch={(newSearch) => setSearch(newSearch)}
        onChangePlayers={(newPlayers) => handlePlayerChange(newPlayers)}
      />
      <Players
        players={players}
        pinnedPlayers={pinnedPlayers}
        onChangePinnedPlayers={(newPlayers) => setPinnedPlayers(newPlayers)}
        onChangePlayers={(newPlayers) => handlePlayerChange(newPlayers)}
      />
      <StatCategories
        onChangeStatCategory={(newCategory) => setStatCategory(newCategory)}
      />
      <Chart pinnedPlayers={pinnedPlayers} statCategory={statCategory} />
    </>
  )
}

export default App
