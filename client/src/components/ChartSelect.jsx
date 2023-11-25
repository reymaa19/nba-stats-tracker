import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
const ChartSelect = ({ onChangeChartType, chartType }) => {
  return (
    <FormControl sx={{ width: '48%' }}>
      <InputLabel id="chartSelectLabel">Chart</InputLabel>
      <Select
        size="small"
        labelId="chartSelectLabel"
        label="Chart"
        name="chartSelect"
        defaultValue="line"
        value={chartType}
        onChange={(e) => onChangeChartType(e.target.value)}
      >
        <MenuItem value="line">Line</MenuItem>
        <MenuItem value="scatter">Scatter</MenuItem>
        <MenuItem value="bar">Bar</MenuItem>
        <MenuItem value="pie">Pie</MenuItem>
      </Select>
    </FormControl>
  )
}

export default ChartSelect
