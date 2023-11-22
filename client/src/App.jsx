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
    const pinned = players.filter((player) => pinnedPlayers.has(player.name))
    const searched = newPlayers.filter((player) =>
      player.name.toLowerCase().includes(search.toLowerCase())
    )

    setPlayers([...new Set(searched.concat(pinned))])
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
