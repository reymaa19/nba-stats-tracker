import { BarChart, LineChart } from '@mui/x-charts'
import { useEffect, useState } from 'react'
import api from '../api/index'

const Charts = ({
  pinnedPlayers,
  statCategory,
  height,
  onChangeError,
  chartType,
}) => {
  const [seasonTotals, setSeasonTotals] = useState([])
  const [careerTotals, setCareerTotals] = useState([])

  useEffect(() => {
    const getSeasonTotals = async () => {
      try {
        const newSeasonTotals = await api.calculatePlayerSeasonTotals(
          pinnedPlayers
        )
        const newCareerTotals = await api.calculatePlayerCareerTotals(
          newSeasonTotals
        )

        setSeasonTotals(newSeasonTotals)
        setCareerTotals(newCareerTotals)
      } catch (error) {
        onChangeError(error.response.data.message)
      }
    }

    getSeasonTotals()
  }, [pinnedPlayers.size])

  const getLineData = () => {
    const data = []

    seasonTotals.map((t) => {
      data.push({
        curve: 'natural',
        label: t.player,
        data: t.totals[statCategory],
      })
    })

    return data
  }

  if (chartType === 'line')
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
        series={getLineData()}
        height={height - 25}
      />
    )
  else if (chartType === 'bar')
    return (
      <BarChart
        dataset={careerTotals}
        xAxis={[{ scaleType: 'band', dataKey: 'player' }]}
        series={
          careerTotals.length > 0
            ? [
                { dataKey: 'pts', label: 'Points' },
                { dataKey: 'ast', label: 'Assists' },
                { dataKey: 'reb', label: 'Rebounds' },
                { dataKey: 'blk', label: 'Blocks' },
                { dataKey: 'stl', label: 'Steals' },
              ]
            : []
        }
        height={height - 25}
      />
    )
  return <></>
}

export default Charts
