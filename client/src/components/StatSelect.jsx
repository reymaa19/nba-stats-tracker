import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
const StatSelect = ({ onChangeStatCategory }) => {
  return (
    <FormControl sx={{ width: '48%' }}>
      <InputLabel id="statCategorySelect">Statistic</InputLabel>
      <Select
        size="small"
        labelId="statCategorySelect"
        label="Statistic"
        name="statisticSelect"
        defaultValue="pts"
        onChange={(e) => onChangeStatCategory(e.target.value)}
      >
        <MenuItem value="pts">Points</MenuItem>
        <MenuItem value="ast">Assists</MenuItem>
        <MenuItem value="reb">Rebounds</MenuItem>
        <MenuItem value="blk">Blocks</MenuItem>
        <MenuItem value="stl">Steals</MenuItem>
      </Select>
    </FormControl>
  )
}

export default StatSelect
