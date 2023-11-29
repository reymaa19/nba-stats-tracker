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
  searched,
  pinned,
  onChangePinned,
  onChangeSearched,
  height,
  onChangeError,
  onChangeTotals,
}) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [playerBeingLoaded, setPlayerBeingLoaded] = useState('')

  const pinPlayer = async (player) => {
    setPlayerBeingLoaded(player.id)

    try {
      const newPinnedPlayer = player.stats
        ? await api.getStats(player.stats, player.id, player.name)
        : await api.getStats(null, player.id, player.name)

      if (!player.stats) {
        const indexOfNewPinnedPlayer = searched.findIndex(
          (p) => p.id == player.id
        )

        player.stats = newPinnedPlayer.stats
        searched[indexOfNewPinnedPlayer] = newPlayer

        onChangeSearched(newSearched)
      }

      onChangePinned((prev) => [...prev, { name: player.name, id: player.id }])

      onChangeTotals((prev) => ({
        season: [
          ...prev.season,
          {
            data: newPinnedPlayer.seasonTotals,
            id: player.id,
            name: player.name,
          },
        ],
        career: [
          ...prev.career,
          {
            data: newPinnedPlayer.careerTotals,
            id: player.id,
            name: player.name,
          },
        ],
      }))
    } catch (error) {
      onChangeError(error.response.data.error)
    }

    setPlayerBeingLoaded('')
  }

  const unpinPlayer = ({ id }) =>
    onChangePinned(pinned.filter((p) => p.id != id))

  const isPinned = (player) => pinned.some((p) => p.id == player.id)

  const getPages = () => {
    const pages = [[]]
    let current = 0

    pinned.map((player) => {
      if (!player) return
      else if (pages[current].length < perPage) {
        pages[current].push(player)
      } else {
        current++
        pages.push([])
        pages[current].push(player)
      }
    })

    searched.map((player) => {
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
