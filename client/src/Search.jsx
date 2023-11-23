import { TextField } from '@mui/material'
import { useEffect } from 'react'

const Search = ({
  search,
  onChangeSearch,
  onChangePlayers,
  searchPlayers,
  error,
}) => {
  const sanitize = (str) => str.replace(/[^a-z ,-]/gim, '')

  useEffect(() => {
    const searchAfterTyping = setTimeout(() => {
      search ? searchPlayers() : onChangePlayers(null)
    }, 500)

    return () => clearTimeout(searchAfterTyping)
  }, [search])

  return (
    <>
      <TextField
        sx={{ mt: 3 }}
        fullWidth
        size="small"
        label="Search NBA Player"
        onChange={(e) => onChangeSearch(sanitize(e.target.value))}
        value={search}
        autoComplete="off"
        helperText={error}
        FormHelperTextProps={{ sx: { color: 'red' } }}
        color={error && 'error'}
      />
    </>
  )
}

export default Search
