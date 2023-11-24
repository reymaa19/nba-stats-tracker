import { LineChart } from '@mui/x-charts/LineChart'
import { useEffect, useState } from 'react'
import api from './api/index'

const Chart = ({ pinnedPlayers, statCategory, height, onChangeError }) => {
  const [seasonTotals, setSeasonTotals] = useState([])

  useEffect(() => {
    const getSeasonTotals = async () => {
      try {
        const totals = await api.calculatePlayerSeasonTotals(
          pinnedPlayers,
          statCategory
        )

        setSeasonTotals(totals)
      } catch (error) {
        onChangeError(error.response.data.message)
      }
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
      height={height - 25}
    />
  )
}

export default Chart
