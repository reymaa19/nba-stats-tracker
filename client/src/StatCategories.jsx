const StatCategories = ({ onChangeStatCategory }) => {
  return (
    <select name="stat" onChange={(e) => onChangeStatCategory(e.target.value)}>
      <option value="pts">Points</option>
      <option value="ast">Assists</option>
      <option value="reb">Rebounds</option>
      <option value="blk">Blocks</option>
      <option value="stl">Steals</option>
    </select>
  )
}

export default StatCategories
