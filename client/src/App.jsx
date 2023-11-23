import { Grid, useMediaQuery } from '@mui/material'
import { useEffect, useState } from 'react'
import Chart from './Chart'
import Players from './Players'
import Search from './Search'
import StatCategories from './StatCategories'
import api from './api/index'

const App = () => {
  // const [search, setSearch] = useState('')
  // const [players, setPlayers] = useState([])
  // const [pinnedPlayers, setPinnedPlayers] = useState(new Map())
  // const [statCategory, setStatCategory] = useState('pts')
  // const [error, setError] = useState({})
  // const [height, setHeight] = useState(window.innerHeight)
  // const narrowScreenSize = useMediaQuery('(min-width:1100px)')

  // useEffect(() => {
  //   window.addEventListener('resize', () => setHeight(window.innerHeight))
  // }, [])

  // const handleChangePlayers = (newPlayers) => {
  //   const isPinned = (player) => pinnedPlayers.has(player.name)
  //   const isMatchingName = (player) =>
  //     search && player.name.toLowerCase().includes(search.toLowerCase())

  //   if (!newPlayers) {
  //     setPlayers(pinnedPlayers.size > 0 ? players.filter(isPinned) : [])
  //     return
  //   }

  //   const pinned = players.filter(isPinned)
  //   const searched = newPlayers.filter(isMatchingName)
  //   const notPinnedSearched = searched.filter((player) => !isPinned(player))

  //   const updatedPlayers = pinned.concat(notPinnedSearched)

  //   setPlayers(updatedPlayers)
  // }

  // const searchPlayers = async () => {
  //   if (search.replace(' ', '').length <= 3) {
  //     setError({
  //       search: 'Search must be at least 4 characters long',
  //     })
  //     setTimeout(() => {
  //       const newError = error
  //       delete newError.search
  //       setError(newError)
  //     }, 2000)
  //   } else {
  //     const players = await api.searchPlayers(search)
  //     handleChangePlayers(players)
  //   }
  // }

  return (
    <button onClick={() => api.test()}>Test</button>
    // <Grid container spacing={2}>
    //   <Grid item xs={narrowScreenSize ? 2.2 : 12} m={3} pr={2} pb={2}>
    //     <StatCategories
    //       onChangeStatCategory={(newCategory) => setStatCategory(newCategory)}
    //     />
    //     <Search
    //       search={search}
    //       onChangeSearch={(newSearch) => setSearch(newSearch)}
    //       onChangePlayers={(newPlayers) => handleChangePlayers(newPlayers)}
    //       searchPlayers={searchPlayers}
    //       error={error.search}
    //     />
    //     <Players
    //       players={players}
    //       pinnedPlayers={pinnedPlayers}
    //       onChangePinnedPlayers={(newPlayers) => setPinnedPlayers(newPlayers)}
    //       onChangePlayers={(newPlayers) => handleChangePlayers(newPlayers)}
    //       searchPlayers={searchPlayers}
    //       height={height}
    //     />
    //   </Grid>
    //   <Grid item xs>
    //     <Chart
    //       pinnedPlayers={pinnedPlayers}
    //       statCategory={statCategory}
    //       height={height}
    //     />
    //   </Grid>
    // </Grid>
  )
}

export default App
