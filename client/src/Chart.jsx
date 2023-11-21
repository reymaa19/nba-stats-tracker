import { LineChart } from '@mui/x-charts/LineChart'

const Chart = ({ seasonTotals }) => {
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
      series={seasonTotals()}
      width={1000}
      height={500}
    />
  )
}

export default Chart
