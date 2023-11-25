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
  const [careerTotals, setCareerTotals] = useState([])
  const [lineData, setLineData] = useState([])

  useEffect(() => {
    setLineData([])

    seasonTotals.map((t) => {
      setLineData((prev) => [
        ...prev,
        {
          curve: 'natural',
          label: t.player,
          data: t.totals[statCategory],
        },
      ])
    })
  }, [seasonTotals, statCategory])

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
      series={lineData}
      height={height - 25}
    />
  )

  const barChart = (
    <BarChart
      dataset={careerTotals}
      xAxis={[
        {
          scaleType: 'band',
          data:
            careerTotals.length > 0 ? careerTotals.map((t) => t.player) : [''],
          dataKey: 'player',
        },
      ]}
      series={[
        { dataKey: 'pts', label: 'Points' },
        { dataKey: 'ast', label: 'Assists' },
        { dataKey: 'reb', label: 'Rebounds' },
        { dataKey: 'blk', label: 'Blocks' },
        { dataKey: 'stl', label: 'Steals' },
      ]}
      height={height - 25}
    />
  )
  if (chart === 'line') return lineChart
  else if (chart === 'bar') return barChart
  return <></>
}

export default Charts
