import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
const StatSelect = ({ onChangeStatCategory, statCategory, chartType }) => {
  return (
    <FormControl sx={{ width: '47%' }}>
      <InputLabel id="statCategorySelect">Statistic</InputLabel>
      <Select
        size="small"
        labelId="statCategorySelect"
        label="Statistic"
        name="statisticSelect"
        defaultValue="pts"
        value={statCategory}
        onChange={(e) => onChangeStatCategory(e.target.value)}
      >
        <MenuItem value="pts">Points</MenuItem>
        <MenuItem value="ast">Assists</MenuItem>
        <MenuItem value="reb">Rebounds</MenuItem>
        <MenuItem value="blk">Blocks</MenuItem>
        <MenuItem value="stl">Steals</MenuItem>
        <MenuItem value="car" sx={{ display: chartType != 'bar' && 'none' }}>
          Career Totals
        </MenuItem>
      </Select>
    </FormControl>
  )
}

export default StatSelect
