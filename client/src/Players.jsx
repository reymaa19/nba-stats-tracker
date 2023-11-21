import api from './api/index'

const Players = ({ players, onChangePinnedPlayers }) => {
  const pinPlayer = async ({ name, stats, id }) => {
    if (!stats) {
      const playerStats = await api.getStats(null, id)
      onChangePinnedPlayers((prev) => new Map([...prev, [name, playerStats]]))
      searchPlayers()
      return
    }

    const playerStats = await api.getStats(stats, null)
    onChangePinnedPlayers((prev) => new Map([...prev, [name, playerStats]]))
  }

  return (
    <ul>
      {players.map((p) => (
        <li key={p.id}>
          {p.name} <button onClick={() => pinPlayer(p)}>pin</button>
        </li>
      ))}
    </ul>
  )
}

export default Players
