import PushPinIcon from '@mui/icons-material/PushPin'
import {
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Pagination,
} from '@mui/material'
import { useState } from 'react'
import api from '../api/index'

const Players = ({
  players,
  pinnedPlayers,
  onChangePinnedPlayers,
  onChangePlayers,
  searchPlayers,
  height,
  onChangeError,
}) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [playerBeingLoaded, setPlayerBeingLoaded] = useState('')

  const pinPlayer = async ({ stats, name, id }) => {
    setPlayerBeingLoaded(id)
    try {
      const playerStats = stats
        ? await api.getStats(stats, null)
        : await api.getStats(null, id)

      onChangePinnedPlayers((prev) => new Map([...prev, [name, playerStats]]))
      !stats && searchPlayers()
    } catch (error) {
      onChangeError(error.response.data.message)
    }

    setPlayerBeingLoaded('')
  }

  const unpinPlayer = async ({ name }) => {
    const newPinnedPlayers = pinnedPlayers

    newPinnedPlayers.delete(name)

    onChangePinnedPlayers(newPinnedPlayers)
    onChangePlayers(players)
  }

  const getPages = () => {
    const pages = [[]]
    let current = 0

    players.map((player) => {
      if (pages[current].length < perPage) {
        pages[current].push(player)
      } else {
        current++
        pages.push([])
        pages[current].push(player)
      }
    })

    pages[pages.length - 1].length == 0 && pages.pop()

    return pages
  }

  const perPage = Math.floor((height - 144) / 48) - 1
  const pages = getPages()

  return (
    <List>
      {pages[currentPage]
        ? pages[currentPage].map((player) => (
            <ListItem
              key={player.id}
              secondaryAction={
                <IconButton
                  onClick={() =>
                    pinnedPlayers.has(player.name)
                      ? unpinPlayer(player)
                      : pinPlayer(player)
                  }
                  disabled={Boolean(playerBeingLoaded)}
                >
                  {playerBeingLoaded == player.id ? (
                    <CircularProgress size={20} />
                  ) : (
                    <PushPinIcon
                      fontSize="small"
                      color={
                        pinnedPlayers.has(player.name) ? 'error' : 'disabled'
                      }
                      sx={{
                        '&:hover': { color: 'red' },
                      }}
                    />
                  )}
                </IconButton>
              }
            >
              <ListItemText
                primary={player.name}
                primaryTypographyProps={{ whiteSpace: 'nowrap' }}
              />
            </ListItem>
          ))
        : players.length > 0 && setCurrentPage(0)}
      {pages.length > 1 && (
        <Pagination
          sx={{ display: 'flex', justifyContent: 'center' }}
          count={pages.length}
          variant="outlined"
          shape="rounded"
          onChange={(e, current) => setCurrentPage(current - 1)}
          page={currentPage + 1}
          boundaryCount={1}
          siblingCount={0}
        />
      )}
    </List>
  )
}

export default Players
