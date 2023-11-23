import PushPinIcon from '@mui/icons-material/PushPin'
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Pagination,
} from '@mui/material'
import { useState } from 'react'
import api from './api/index'

const Players = ({
  players,
  pinnedPlayers,
  onChangePinnedPlayers,
  onChangePlayers,
}) => {
  const [currentPage, setCurrentPage] = useState(0)

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

  const perPage = Math.floor((window.innerHeight - 220) / 48) - 1
  const pages = [[]]

  let current = 0

  players.map((player) => {
    if (pages[current].length < perPage) {
      pages[current].push(player)
    } else {
      current++
      pages.push([])
    }
  })

  return (
    <>
      <List>
        {pages[currentPage].map((player) => (
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
                  sx={{ '&:hover': { color: 'red' } }}
                />
              </IconButton>
            }
          >
            <ListItemText primary={player.name} />
          </ListItem>
        ))}
      </List>
      <Pagination
        sx={{ width: '100%' }}
        count={pages.length}
        variant="outlined"
        shape="rounded"
        onChange={(e, current) => setCurrentPage(current - 1)}
        boundaryCount={1}
        siblingCount={0}
      />
    </>
  )
}

export default Players
