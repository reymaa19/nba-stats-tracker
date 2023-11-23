import { Box, Grid } from '@mui/material'
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
    const isPinned = (player) => pinnedPlayers.has(player.name)
    const isMatchingName = (player) =>
      search && player.name.toLowerCase().includes(search.toLowerCase())

    if (!newPlayers) {
      setPlayers(pinnedPlayers.size > 0 ? players.filter(isPinned) : [])
      return
    }

    const pinned = players.filter(isPinned)
    const searched = newPlayers.filter(isMatchingName)
    const pinnedSearched = pinned.filter(isMatchingName)

    const updatedPlayers =
      pinnedSearched.length > 0
        ? searched.concat(
            pinned.filter(
              (p) => !pinnedSearched.some((ps) => ps.name === p.name)
            )
          )
        : pinned.concat(searched)

    setPlayers(updatedPlayers)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid
          item
          xs={2}
          m={3}
          pr={2}
          sx={{ backgroundColor: '#EEE' }}
          height={window.innerHeight - 150}
        >
          <StatCategories
            onChangeStatCategory={(newCategory) => setStatCategory(newCategory)}
          />
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
        </Grid>
        <Grid item xs={9}>
          <Chart pinnedPlayers={pinnedPlayers} statCategory={statCategory} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default App
