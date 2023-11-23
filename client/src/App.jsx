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
    const notPinnedSearched = searched.filter((player) => !isPinned(player))

    const updatedPlayers = pinned.concat(notPinnedSearched)

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
          height={window.innerHeight - 110}
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
