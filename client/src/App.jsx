import { Grid, useMediaQuery } from '@mui/material'
import { useEffect, useState } from 'react'
import api from './api/index'
import ChartSelect from './components/ChartSelect'
import Charts from './components/Charts'
import Players from './components/Players'
import Search from './components/Search'
import StatSelect from './components/StatSelect'

const App = () => {
  const [search, setSearch] = useState('')
  const [players, setPlayers] = useState([])
  const [error, setError] = useState('')
  const [pinnedPlayers, setPinnedPlayers] = useState([])
  const [statCategory, setStatCategory] = useState('pts')
  const [chartType, setChartType] = useState('line')
  const [height, setHeight] = useState(window.innerHeight)

  useEffect(() => {
    window.addEventListener('resize', () => setHeight(window.innerHeight))
  }, [])

  useEffect(() => {
    handleChangePlayers(players)
  }, [pinnedPlayers])

  const handleChangeError = (errorMessage) => {
    setError(errorMessage)
    setTimeout(() => setError(''), 3000)
  }

  const handleChangePlayers = (newPlayers) => {
    const pinned = players.filter((player) =>
      pinnedPlayers.map((p) => p.id).includes(player.id)
    )
    const searched = newPlayers.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    setPlayers(
      Array.from(
        new Set(pinned.concat(searched).map(JSON.stringify)),
        JSON.parse
      )
    )
  }

  const searchPlayers = async () => {
    if (search.replace(' ', '').length < 4) {
      handleChangeError('Search must be at least 4 characters long')
      return
    }
    try {
      const newPlayers = await api.searchPlayers(search)
      if (newPlayers.length == 0) return handleChangeError('No players found')
      handleChangePlayers(newPlayers)
    } catch (error) {
      handleChangeError(error.response.data.message)
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid
        item
        xs={useMediaQuery('(min-width:1100px)') ? 2.2 : 12}
        m={5}
        pr={2}
        pb={2}
      >
        <Grid
          item
          container
          spacing={2}
          pl={2}
          justifyContent={'space-between'}
          mb="6%"
        >
          <StatSelect
            onChangeStatCategory={(newCategory) => setStatCategory(newCategory)}
            statCategory={statCategory}
            chartType={chartType}
          />
          <ChartSelect
            onChangeChartType={(newChart) => {
              if (newChart === 'bar') setStatCategory('car')
              else if (statCategory === 'car') setStatCategory('pts')
              setChartType(newChart)
            }}
            chartType={chartType}
          />
        </Grid>
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
          onChangePinnedPlayers={(newPinnedPlayers) =>
            setPinnedPlayers(newPinnedPlayers)
          }
          onChangeError={(newError) => handleChangeError(newError)}
        />
      </Grid>
      <Grid item xs>
        <Charts
          chartType={chartType}
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
