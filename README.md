# 🧳 TripIntel — Full-Stack Trip Planner

A full-stack travel planning web app with interactive maps, flight/hotel/transport search, and smart city autocomplete.

## Live Stack

- **Frontend:** React 19 + Vite + TypeScript + Leaflet + Tailwind CSS
- **Backend:** Express 5 + Node.js
- **Database:** SQLite (better-sqlite3) with seeded city/flight/hotel/transport data
- **APIs:** OpenStreetMap Nominatim for geocoding
- **Search:** Fuse.js fuzzy search across city names and aliases

## Features

- 🗺️ Interactive Leaflet map with city markers and route polylines
- ✈️ Flight search between cities with date-based scheduling
- 🏨 Hotel listings per destination
- 🚗 Transport options per city
- 🔍 Fuzzy city search with alias support (e.g., "BOM" → Mumbai)
- 📅 Date-range picker with stay duration calculation
- 📱 Responsive layout with tabbed navigation (Flights / Hotels / Transport)
- 💾 SQLite-backed data layer with REST API

## Quick Start

```bash
# Install dependencies
npm install

# Run dev server (frontend + backend concurrently)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Architecture

```
├── server/
│   ├── index.js        # Express API routes
│   ├── db.js           # SQLite data layer
│   └── routes/         # Flight, Hotel, Transport, City endpoints
├── client/
│   ├── src/
│   │   ├── App.jsx     # Main planner UI with Leaflet map
│   │   ├── pages/      # Trip planning components
│   │   └── index.css   # Tailwind + custom styles
│   └── vite.config.js
├── .env.example        # Environment variables template
└── package.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cities?q=` | Search cities with fuzzy matching |
| GET | `/api/cities/:id` | City details with aliases |
| GET | `/api/flights?from=&to=&date=` | Search flights |
| GET | `/api/hotels?cityId=` | Hotels in a city |
| GET | `/api/transport?cityId=` | Transport options |
| GET | `/api/health` | Service health + data counts |

## Tech Details

- **Fuzzy Search:** Fuse.js with threshold 0.2 for city name/alias matching
- **Geocoding:** Fallback to OpenStreetMap Nominatim when local DB misses a query
- **Atomic Writes:** SQLite transactions for data integrity
- **Hot Reload:** Vite HMR on frontend, nodemon on backend via concurrently

## License

ISC
