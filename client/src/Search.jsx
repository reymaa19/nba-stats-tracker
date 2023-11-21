import api from './api/index'

const Search = ({ search, onChangeSearch, onChangePlayers }) => {
  const sanitize = (str) => str.replace(/[^a-z ,-]/gim, '')

  const searchPlayers = async () => {
    const players = await api.searchPlayers(search)
    onChangePlayers(players)
  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <input
        name="search"
        placeholder="Search NBA Player"
        onChange={(e) => onChangeSearch(sanitize(e.target.value))}
        value={search}
        autoComplete="off"
      />{' '}
      <button onClick={() => searchPlayers()}>search</button>
    </form>
  )
}

export default Search
