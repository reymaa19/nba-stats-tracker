import { BarChart, LineChart, ScatterChart } from '@mui/x-charts'
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
        setCareerTotals(newCareerTotals)
        setSeasonTotals(newSeasonTotals)
      } catch (error) {
        onChangeError(error.response.data.message)
      }
    }

    getSeasonTotals()
  }, [pinnedPlayers.size])

  const barLabels = () => {
    switch (statCategory) {
      case 'pts':
        return [{ dataKey: 'pts', label: 'Points' }]
      case 'ast':
        return [{ dataKey: 'ast', label: 'Assists' }]
      case 'reb':
        return [{ dataKey: 'reb', label: 'Rebounds' }]
      case 'blk':
        return [{ dataKey: 'blk', label: 'Blocks' }]
      case 'stl':
        return [{ dataKey: 'stl', label: 'Steals' }]
      default:
        return [
          { dataKey: 'pts', label: 'Points' },
          { dataKey: 'ast', label: 'Assists' },
          { dataKey: 'reb', label: 'Rebounds' },
          { dataKey: 'blk', label: 'Blocks' },
          { dataKey: 'stl', label: 'Steals' },
        ]
    }
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
        series={seasonTotals.map((st) => ({
          curve: 'natural',
          label: st.player,
          data: st.totals[statCategory],
        }))}
        height={height - 25}
      />
    )
  else if (chartType === 'scatter')
    return (
      <ScatterChart
        series={careerTotals.map((ct) => ({
          label: ct.player,
          data: [
            {
              x: ct.szn,
              y: ct[statCategory],
              id: ct.player,
            },
          ],
        }))}
        height={height - 25}
      />
    )
  else
    return (
      <BarChart
        dataset={careerTotals.map((ct) => {
          if (statCategory === 'car') return ct
          return { player: ct.player, [statCategory]: ct[statCategory] }
        })}
        xAxis={[{ scaleType: 'band', dataKey: 'player' }]}
        series={careerTotals.length > 0 ? barLabels() : []}
        height={height - 25}
      />
    )
}

export default Charts
