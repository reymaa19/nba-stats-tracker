import { TextField } from '@mui/material'
import { useEffect } from 'react'
import api from './api/index'

const Search = ({ search, onChangeSearch, onChangePlayers }) => {
  const sanitize = (str) => str.replace(/[^a-z ,-]/gim, '')

  const searchPlayers = async () => {
    if (search.replace(' ', '').length <= 3) return // Do error handling here
    const players = await api.searchPlayers(search)
    onChangePlayers(players)
  }

  useEffect(() => {
    const searchAfterTyping = setTimeout(() => {
      search ? searchPlayers() : onChangePlayers(null)
    }, 500)

    return () => clearTimeout(searchAfterTyping)
  }, [search])

  return (
    <TextField
      sx={{ mt: 3 }}
      fullWidth
      size="small"
      label="Search NBA Player"
      onChange={(e) => onChangeSearch(sanitize(e.target.value))}
      value={search}
      autoComplete="off"
    />
  )
}

export default Search
