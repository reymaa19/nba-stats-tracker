import { Grid, useMediaQuery } from '@mui/material'
import { useEffect, useState } from 'react'
import api from './api/index'
import ChartSelect from './components/ChartSelect'
import Charts from './components/Charts'
import Players from './components/Players'
import Search from './components/Search'
import StatSelect from './components/StatSelect'

const App = () => {
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [chartType, setChartType] = useState('line')
  const [statCategory, setStatCategory] = useState('pts')
  const [searched, setSearched] = useState([])
  const [pinned, setPinned] = useState([])
  const [totals, setTotals] = useState({ season: [], career: [] })
  const [height, setHeight] = useState(window.innerHeight)

  const fetchKobeAndMike = async () => {
    let kobe = await api.searchPlayers('Kobe Bryant')
    kobe = kobe[0]
    const kobeStats = await api.getStats(kobe.stats, kobe.id, kobe.name)

    let mike = await api.searchPlayers('Michael Jordan')
    mike = mike[0]
    const mikeStats = await api.getStats(mike.stats, mike.id, mike.name)
    setPinned([kobe, mike])

    setTotals({
      season: [
        {
          data: kobeStats.seasonTotals,
          id: kobeStats.id,
          name: kobeStats.name,
        },
        {
          data: mikeStats.seasonTotals,
          id: mikeStats.id,
          name: mikeStats.name,
        },
      ],
      career: [
        {
          data: kobeStats.careerTotals,
          id: kobeStats.id,
          name: kobeStats.name,
        },
        {
          data: mikeStats.careerTotals,
          id: mikeStats.id,
          name: mikeStats.name,
        },
      ],
    })
  }

  const removeTotalsOnUnpin = () => {
    if (pinned.length < totals.season.length) {
      const removeTotal = (id) => {
        const removedSeason = totals.season.filter((total) => total.id != id)
        const removedCareer = totals.career.filter((total) => total.id != id)

        setTotals({ season: removedSeason, career: removedCareer })
      }

      const isPinned = (id) => pinned.some((player) => player.id == id)

      totals.season.map((total) => !isPinned(total.id) && removeTotal(total.id))
    }
  }

  useEffect(() => {
    window.addEventListener('resize', () => setHeight(window.innerHeight))
    fetchKobeAndMike()
  }, [])

  useEffect(removeTotalsOnUnpin, [pinned])

  const handleChangeError = (errorMessage) => {
    setError(errorMessage)
    setTimeout(() => setError(''), 3000)
  }

  const searchPlayers = async () => {
    if (!search) setSearched([])
    else if (search.replace(' ', '').length < 4)
      handleChangeError('Search must be at least 4 characters long')
    else
      try {
        const newSearched = await api.searchPlayers(search)
        if (newSearched.length == 0)
          return handleChangeError('No players found')
        setSearched(newSearched)
      } catch (error) {
        handleChangeError(error.response.data.error)
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
              newChart === 'bar' && setStatCategory('car')
              statCategory === 'car' && setStatCategory('pts')
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
        />
        <Players
          searched={searched}
          pinned={pinned}
          onChangeSearched={(newSearched) => setSearched(newSearched)}
          onChangePinned={(newPinned) => setPinned(newPinned)}
          onChangeError={(newError) => handleChangeError(newError)}
          onChangeTotals={(newTotals) => setTotals(newTotals)}
          height={height}
        />
      </Grid>
      <Grid item xs>
        <Charts
          statCategory={statCategory}
          chartType={chartType}
          height={height}
          totals={totals}
        />
      </Grid>
    </Grid>
  )
}

export default App
