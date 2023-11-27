import { BarChart, LineChart, ScatterChart } from '@mui/x-charts'
import colors from '../colors.json'

const Charts = ({ statCategory, height, chartType, totals }) => {
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
          '.MuiChartsLegend-root': {
            display: totals.career.length > 6 && 'none',
          },
        }}
        series={totals.season.map((st) => ({
          curve: 'natural',
          label: st.name,
          data: st.data[statCategory],
        }))}
        colors={colors}
        height={height - 25}
      />
    )
  else if (chartType === 'scatter')
    return (
      <ScatterChart
        sx={{
          '.MuiChartsLegend-root': {
            display: totals.career.length > 6 && 'none',
          },
        }}
        series={totals.career.map((ct) => ({
          label: ct.name,
          data: [
            {
              x: ct.data.szn,
              y: ct.data[statCategory],
              id: ct.id,
            },
          ],
        }))}
        colors={colors}
        height={height - 25}
      />
    )
  else
    return (
      <BarChart
        dataset={totals.career.map((ct) => {
          if (statCategory === 'car')
            return Object.assign({ name: ct.name }, ct.data)
          return { name: ct.name, [statCategory]: ct.data[statCategory] }
        })}
        xAxis={[{ scaleType: 'band', dataKey: 'name' }]}
        series={totals.career.length > 0 ? barLabels() : []}
        height={height - 25}
      />
    )
}

export default Charts
