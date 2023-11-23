import { LineChart } from '@mui/x-charts/LineChart'
import { useEffect, useState } from 'react'
import api from './api/index'

const Chart = ({ pinnedPlayers, statCategory }) => {
  const [seasonTotals, setSeasonTotals] = useState([])

  useEffect(() => {
    const getSeasonTotals = async () => {
      const totals = await api.calculatePlayerSeasonTotals(
        pinnedPlayers,
        statCategory
      )

      setSeasonTotals(totals)
    }

    getSeasonTotals()
  }, [pinnedPlayers.size, statCategory])

  return (
    <LineChart
      xAxis={[
        {
          data: Array.from(Array(23).keys()),
        },
      ]}
      sx={{
        '.MuiMarkElement-root': {
          scale: '0.3',
          strokeWidth: 9,
        },
      }}
      series={seasonTotals}
      height={window.innerHeight - 100}
    />
  )
}

export default Chart
