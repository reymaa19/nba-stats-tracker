import { BarChart, LineChart } from '@mui/x-charts'
import { useEffect, useState } from 'react'
import api from '../api/index'

const Charts = ({
  pinnedPlayers,
  statCategory,
  height,
  onChangeError,
  chart,
}) => {
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

  const lineChart = (
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

  const test = seasonTotals.map((p) => {
    const total = { [p.label]: [p.data[p.data.length - 1]] }
    return total
  })
  console.log(test)
  // LEFT OFF HERE

  // Change backend utils get totals per season function

  const barChart = (
    <BarChart
      xAxis={[{ scaleType: 'band', data: seasonTotals.map((p) => p.label) }]}
      series={test}
      height={height - 25}
    />
  )

  return barChart
}

export default Charts
