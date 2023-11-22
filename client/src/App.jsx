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

  const seasonTotals = () => {
    const seasonTotals = []

    pinnedPlayers.forEach((stats, player) => {
      const totals = [0]

      Object.entries(stats).map((stat) => {
        const previousSeasonTotal = totals[totals.length - 1] || 0
        totals.push(
          previousSeasonTotal +
            stat[1].reduce((prev, curr) => prev + curr[statCategory], 0)
        )
      })

      seasonTotals.push({ curve: 'natural', label: player, data: totals })
    })

    return seasonTotals
  }

  const handlePlayerChange = (newPlayers) => {
    const searchMatchesName = (player) =>
      player.name.toLowerCase().includes(search.toLowerCase())
    // keep pinned from previous players searches
    const pinned = players.filter((player) => pinnedPlayers.has(player.name))
    // find players that match new players searched
    const searched = newPlayers.filter(searchMatchesName)
    // find pinned that occur in new search
    const pinnedSearched = pinned.filter(searchMatchesName)

    if (pinnedSearched.length > 0)
      setPlayers(
        searched.concat(
          pinned.filter(
            (p) => pinnedSearched.find((ps) => ps.name === p.name) != p
          )
        )
      )
    else setPlayers(searched.concat(pinned))
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
      <button
        onClick={() => {
          setPinnedPlayers(new Map())
        }}
      >
        Clear
      </button>
      <StatCategories
        onChangeStatCategory={(newStatCategory) =>
          setStatCategory(newStatCategory)
        }
      />
      <Chart seasonTotals={seasonTotals} />
    </>
  )
}

export default App
