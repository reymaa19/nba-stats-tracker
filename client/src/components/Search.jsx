import { TextField } from '@mui/material'
import { useEffect } from 'react'

const Search = ({
  search,
  onChangeSearch,
  onChangePlayers,
  searchPlayers,
  error,
}) => {
  const sanitize = (str) => str.replace(/[^a-z ,'-]/gim, '')

  useEffect(() => {
    const searchAfterTyping = setTimeout(() => {
      search ? searchPlayers() : onChangePlayers({ searched: [], pinned: [] })
    }, 500)

    return () => clearTimeout(searchAfterTyping)
  }, [search])

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <TextField
        autoFocus
        size="small"
        label="Search NBA Player"
        value={search}
        onChange={(e) => onChangeSearch(sanitize(e.target.value))}
        autoComplete="off"
        helperText={error}
        FormHelperTextProps={{ sx: { color: 'red' } }}
        fullWidth
        color={error && 'error'}
      />
    </form>
  )
}

export default Search
