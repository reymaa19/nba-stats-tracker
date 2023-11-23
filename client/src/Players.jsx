import PushPinIcon from '@mui/icons-material/PushPin'
import { IconButton, List, ListItem, ListItemText } from '@mui/material'
import api from './api/index'

const Players = ({
  players,
  pinnedPlayers,
  onChangePinnedPlayers,
  onChangePlayers,
}) => {
  const pinPlayer = async ({ stats, name, id }) => {
    const playerStats = stats
      ? await api.getStats(stats, null)
      : await api.getStats(null, id)

    onChangePinnedPlayers((prev) => new Map([...prev, [name, playerStats]]))
  }

  const unpinPlayer = async ({ name }) => {
    const newPinnedPlayers = pinnedPlayers

    newPinnedPlayers.delete(name)

    onChangePinnedPlayers(newPinnedPlayers)
    onChangePlayers(players)
  }

  return (
    <List>
      {players.map((player) => (
        <ListItem
          key={player.id}
          secondaryAction={
            <IconButton
              onClick={() =>
                pinnedPlayers.has(player.name)
                  ? unpinPlayer(player)
                  : pinPlayer(player)
              }
            >
              <PushPinIcon
                fontSize="small"
                color={pinnedPlayers.has(player.name) ? 'error' : 'disabled'}
              />
            </IconButton>
          }
        >
          <ListItemText primary={player.name} />
        </ListItem>
      ))}
    </List>
  )
}

export default Players
