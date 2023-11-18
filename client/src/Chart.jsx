import { LineChart } from '@mui/x-charts/LineChart'

const Chart = ({ stats }) => {
  let total = 0
  const test = stats.map((stat) => {
    total += stat.pts
    return total
  })
  // This is rendering too often (.map is being called inside this component on every render)
  // https://stackoverflow.com/questions/57853288/react-warning-maximum-update-depth-exceeded
  const length = Array.from(Array(stats.length).keys())

  return (
    <LineChart
      xAxis={[{ data: length }]}
      series={[
        {
          data: test,
        },
      ]}
      width={1000}
      height={500}
    />
  )
}

export default Chart
