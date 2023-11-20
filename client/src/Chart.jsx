import { LineChart } from '@mui/x-charts/LineChart'

const Chart = ({ pinned }) => {
  const SEASONS = Array.from(Array(22).keys())
  const allStats = []

  pinned.forEach((stats, player) => {
    const totals = []
    Object.entries(stats).map((stat) => {
      const previousSeasonTotal = totals[totals.length - 1] || 0
      totals.push(
        previousSeasonTotal + stat[1].reduce((prev, curr) => prev + curr.pts, 0)
      )
    })

    allStats.push({ label: player, data: totals })
  })

  return (
    <LineChart
      xAxis={[
        {
          data: SEASONS,
          valueFormatter: (v) => v.toString(),
        },
      ]}
      series={allStats}
      width={1000}
      height={500}
    />
  )
}

export default Chart
