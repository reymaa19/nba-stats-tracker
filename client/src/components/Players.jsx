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
  onChangePlayers,
  height,
  onChangeError,
  onChangeTotals,
}) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [playerBeingLoaded, setPlayerBeingLoaded] = useState('')

  const pinPlayer = async ({ stats, name, id }) => {
    setPlayerBeingLoaded(id)

    try {
      const newPinnedPlayer = stats
        ? await api.getStats(stats, id, name)
        : await api.getStats(null, id, name)

      if (!stats) {
        const indexOfNewPinnedPlayer = players.searched.findIndex(
          (p) => p.id == id
        )
        const newSearched = players.searched
        newSearched[indexOfNewPinnedPlayer] = {
          name,
          id,
          stats: newPinnedPlayer.stats,
        }

        onChangePlayers({
          searched: newSearched,
          pinned: players.pinned.concat([{ name, id }]),
        })
      } else
        onChangePlayers({
          searched: players.searched,
          pinned: players.pinned.concat([{ name, id }]),
        })

      onChangeTotals((prev) => {
        const newSeason = [
          ...prev.season,
          { data: newPinnedPlayer.seasonTotals, id, name },
        ]
        const newCareer = [
          ...prev.career,
          { data: newPinnedPlayer.careerTotals, id, name },
        ]

        return { season: newSeason, career: newCareer }
      })
    } catch (error) {
      onChangeError(error.response.data.error)
    }

    setPlayerBeingLoaded('')
  }

  const unpinPlayer = ({ id }) => {
    const removeUnPinned = players.pinned

    onChangePlayers({
      searched: players.searched,
      pinned: removeUnPinned.filter((p) => p.id != id),
    })
  }

  const isPinned = (player) => players.pinned.some((p) => p.id == player.id)

  const getPages = () => {
    const pages = [[]]
    let current = 0

    players.pinned.map((player) => {
      if (!player) return
      else if (pages[current].length < perPage) {
        pages[current].push(player)
      } else {
        current++
        pages.push([])
        pages[current].push(player)
      }
    })

    players.searched.map((player) => {
      if (!player) return
      else if (pages[current].length < perPage) {
        !isPinned(player) && pages[current].push(player)
      } else {
        current++
        pages.push([])
        !isPinned(player) && pages[current].push(player)
      }
    })

    pages[pages.length - 1].length == 0 && pages.pop()

    return pages
  }

  const perPage = Math.floor((height - 200) / 48) - 1
  const pages = getPages()

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
        : pages.length > 0 && setCurrentPage(0)}
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
