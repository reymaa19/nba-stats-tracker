import { Grid, useMediaQuery } from '@mui/material'
import { useEffect, useState } from 'react'
import Chart from './Chart'
import Players from './Players'
import Search from './Search'
import StatCategories from './StatCategories'
import api from './api/index'

const App = () => {
  const [search, setSearch] = useState('')
  const [players, setPlayers] = useState([])
  const [error, setError] = useState('')
  const [pinnedPlayers, setPinnedPlayers] = useState(new Map())
  const [statCategory, setStatCategory] = useState('pts')
  const [height, setHeight] = useState(window.innerHeight)

  const narrowScreenSize = useMediaQuery('(min-width:1100px)')

  useEffect(() => {
    window.addEventListener('resize', () => setHeight(window.innerHeight))
  }, [])

  const handleChangePlayers = (newPlayers) => {
    const pinned = players.filter((player) => pinnedPlayers.has(player.name))
    setPlayers(
      Array.from(
        new Set(pinned.concat(newPlayers).map(JSON.stringify)),
        JSON.parse
      )
    )
  }

  const handleChangeError = (errorMessage) => {
    setError(errorMessage)
    setTimeout(() => setError(''), 3000)
  }

  const searchPlayers = async () => {
    if (search.replace(' ', '').length < 4) {
      handleChangeError('Search must be at least 4 characters long')
      return
    }
    try {
      const players = await api.searchPlayers(search)
      if (players.length == 0 && pinnedPlayers.size == 0)
        handleChangeError('No players found')
      handleChangePlayers(players)
    } catch (error) {
      handleChangeError(error.response.data.message)
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={narrowScreenSize ? 2.2 : 12} m={3} pr={2} pb={2}>
        <StatCategories
          onChangeStatCategory={(newCategory) => setStatCategory(newCategory)}
        />
        <Search
          search={search}
          error={error}
          searchPlayers={searchPlayers}
          onChangeSearch={(newSearch) => setSearch(newSearch)}
          onChangePlayers={(newPlayers) => handleChangePlayers(newPlayers)}
        />
        <Players
          players={players}
          pinnedPlayers={pinnedPlayers}
          height={height}
          searchPlayers={searchPlayers}
          onChangePinnedPlayers={(newPlayers) => setPinnedPlayers(newPlayers)}
          onChangePlayers={(newPlayers) => handleChangePlayers(newPlayers)}
          onChangeError={(newError) => handleChangeError(newError)}
        />
      </Grid>
      <Grid item xs>
        <Chart
          pinnedPlayers={pinnedPlayers}
          statCategory={statCategory}
          height={height}
          onChangeError={(newError) => handleChangeError(newError)}
        />
      </Grid>
    </Grid>
  )
}

export default App
