import { useMemo, useState } from 'react'
import Chart from './Chart'
import Players from './Players'
import Search from './Search'
import StatCategories from './StatCategories'

const App = () => {
  const [search, setSearch] = useState('')
  const [players, setPlayers] = useState([])
  const [pinnedPlayers, setPinnedPlayers] = useState(new Map())
  const [statCategory, setStatCategory] = useState('pts')

  return (
    <>
      <Search
        search={search}
        onChangeSearch={(newSearch) => setSearch(newSearch)}
        onChangePlayers={(newPlayers) => setPlayers(newPlayers)}
      />
      <Players
        players={players}
        onChangePinnedPlayers={(newPlayers) => setPinnedPlayers(newPlayers)}
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
