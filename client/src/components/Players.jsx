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

      onChangePinnedPlayers((prev) => [
        ...prev,
        { name, stats: playerStats, id },
      ])
      !stats && searchPlayers()
    } catch (error) {
      onChangeError(error.response.data.message)
    }

    setPlayerBeingLoaded('')
  }

  const unpinPlayer = ({ id }) =>
    onChangePinnedPlayers(pinnedPlayers.filter((p) => p.id != id))

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

  const perPage = Math.floor((height - 186) / 48) - 1
  const pages = getPages()

  const isPinned = (player) =>
    pinnedPlayers.some((pinned) => pinned.id == player.id)

  return (
    <List sx={{ mt: '3%' }}>
      {pages[currentPage]
        ? pages[currentPage].map((player) => (
            <ListItem
              key={player.id}
              secondaryAction={
                <IconButton
                  onClick={async () =>
                    isPinned(player)
                      ? unpinPlayer(player)
                      : await pinPlayer(player)
                  }
                  disabled={Boolean(playerBeingLoaded)}
                >
                  {playerBeingLoaded == player.id ? (
                    <CircularProgress size={20} />
                  ) : (
                    <PushPinIcon
                      fontSize="small"
                      color={isPinned(player) ? 'error' : 'disabled'}
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
          sx={{ display: 'flex', justifyContent: 'center', pt: '5%' }}
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
