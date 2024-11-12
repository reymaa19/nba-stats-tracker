# NBA Stats Tracker

A full-stack web application for visualizing and comparing NBA player statistics through interactive charts. Search for players and pin multiple players to compare their stats across seasons.

## Features

- **Player Search**
  - Real-time search with 4+ character minimum
  - Pin/unpin players for comparison
  - Pagination for search results

- **Statistical Visualization**
  - Line charts: Track season progression
  - Bar charts: Compare career totals
  - Scatter plots: View career averages
  - Support for multiple stats:
    - Points (PTS)
    - Assists (AST) 
    - Rebounds (REB)
    - Blocks (BLK)
    - Steals (STL)

- **Data Management**
  - Automatic stats updates from [BALLDONTLIE](https://docs.balldontlie.io/#nba-api)
  - MongoDB caching for faster subsequent loads
  - Rate-limited API requests (60/min)
  - Data updates for active players
  - 5-year staleness check for retired players

## Tech Stack

### Frontend
- React 18
- Material UI & MUI X-Charts
- Axios
- Vite

### Backend
- Node.js & Express
- MongoDB & Mongoose
- NBA Stats API integration
