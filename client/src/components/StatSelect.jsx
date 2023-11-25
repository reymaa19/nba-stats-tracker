import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
const StatSelect = ({ onChangeStatCategory, statCategory, chartType }) => {
  const isBar = Boolean(chartType === 'bar')
  const isPie = Boolean(chartType === 'pie')
  return (
    <FormControl sx={{ width: '48%' }}>
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
        <MenuItem value="pts" sx={{ display: (isBar || isPie) && 'none' }}>
          Points
        </MenuItem>
        <MenuItem value="ast" sx={{ display: (isBar || isPie) && 'none' }}>
          Assists
        </MenuItem>
        <MenuItem value="reb" sx={{ display: (isBar || isPie) && 'none' }}>
          Rebounds
        </MenuItem>
        <MenuItem value="blk" sx={{ display: (isBar || isPie) && 'none' }}>
          Blocks
        </MenuItem>
        <MenuItem value="stl" sx={{ display: (isBar || isPie) && 'none' }}>
          Steals
        </MenuItem>
        <MenuItem value="car" sx={{ display: !isBar && 'none' }}>
          Career Totals
        </MenuItem>
        <MenuItem value="avg" sx={{ display: !isPie && 'none' }}>
          Player Averages
        </MenuItem>
      </Select>
    </FormControl>
  )
}

export default StatSelect
