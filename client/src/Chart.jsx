import { LineChart } from '@mui/x-charts/LineChart'

const Chart = ({ pinnedPlayers, statCategory }) => {
  const allStats = []

  pinnedPlayers.forEach((stats, player) => {
    const totals = [0]

    Object.entries(stats).map((stat) => {
      const previousSeasonTotal = totals[totals.length - 1] || 0
      totals.push(
        previousSeasonTotal +
          stat[1].reduce((prev, curr) => prev + curr[statCategory], 0)
      )
    })

    allStats.push({ curve: 'natural', label: player, data: totals })
  })

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
      series={allStats}
      width={1000}
      height={500}
    />
  )
}

export default Chart
