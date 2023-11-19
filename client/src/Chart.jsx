import { LineChart } from '@mui/x-charts/LineChart'

const Chart = ({ stats }) => {
  let totals = []
  const seasons = []

  Object.entries(stats).map((stat) => {
    seasons.push(stat[0])
    const previousSeasonTotal = totals[totals.length - 1] || 0
    totals.push(
      previousSeasonTotal + stat[1].reduce((prev, curr) => prev + curr.pts, 0)
    )
  })

  return (
    <LineChart
      xAxis={[{ data: seasons, valueFormatter: (v) => v.toString() }]}
      series={[
        {
          label: 'LeBron James',
          data: totals,
        },
      ]}
      width={1000}
      height={500}
    />
  )
}

export default Chart
