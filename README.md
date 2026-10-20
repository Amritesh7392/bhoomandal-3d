# Bhoomandal 🌌 — Interactive 3D Solar System

Bhoomandal is a responsive astronomy learning web app featuring a Three.js 3D solar system, educational planet profiles, stellar evolution, and NASA data panels.

## New in this version

- **Interactive 3D solar system powered by Three.js**: drag to rotate, scroll/pinch to zoom, click planets to select them, focus a planet from the dropdown, pause/resume animation, adjust orbital animation speed, and toggle labels/orbit paths.
- Procedurally generated planet surface textures, a star field, Saturn's rings, and an atmospheric glow around Earth.
- **NASA live-data panels**: Astronomy Picture of the Day, daily Near-Earth Object feed, and NASA Image and Video Library search.
- Existing planet facts and star life-cycle learning sections are preserved.
- Responsive layout for desktop, tablet, and mobile.

## Scientific accuracy note

The 3D model is designed for learning and exploration. Planet sizes, distances, textures, and orbital speeds are deliberately adjusted so the whole system is visible and motion is easy to understand. It is **not** a scale model, live telescope stream, spacecraft tracker, or precision planetary ephemeris. For accurate positions and observational calculations, use [NASA/JPL Horizons](https://ssd.jpl.nasa.gov/horizons/).

NASA data panels use external services and need an internet connection. NASA API rate limits and temporary service outages can affect the data panels without preventing the local 3D model from running.

## Tech stack

- HTML, CSS, vanilla JavaScript
- [Three.js](https://threejs.org/) loaded from jsDelivr via an import map
- Node.js 18+ and Express
- NASA APOD, NASA NeoWs, and NASA Image and Video Library APIs

## Project structure

```text
Bhoomandal/
├── public/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   ├── solar-system.js      # Three.js scene, orbit animation, controls, selection
│   ├── assets/favicon.svg
│   └── data/planet-index.json
├── server.js                # Express server and NASA API proxy endpoints
├── package.json
├── .env.example
├── .gitignore
├── README.md
└── LICENSE
```

## Run on Windows

1. Install Node.js 18+ from [nodejs.org](https://nodejs.org/).
2. Extract the ZIP.
3. Open PowerShell or VS Code terminal in the folder containing `package.json`.
4. Install dependencies:

   ```powershell
   npm.cmd install
   ```

5. Create your local environment file:

   ```powershell
   Copy-Item .env.example .env
   ```

   If `.env` already exists, keep it and skip this step.

6. Optionally get a NASA API key at [api.nasa.gov](https://api.nasa.gov/) and put it in `.env`:

   ```env
   NASA_API_KEY=your_key_here
   PORT=3000
   ```

   Keep `.env` private. The default `DEMO_KEY` is rate-limited.

7. Start the server:

   ```powershell
   npm.cmd start
   ```

8. Open [http://localhost:3000](http://localhost:3000).

> The 3D engine is loaded from jsDelivr, so the first visit needs internet access. The NASA data panels also need internet access. If Three.js fails to load, check the browser console and your connection.

## API endpoints

| Route | Purpose |
|---|---|
| `GET /api/health` | Server health check |
| `GET /api/apod` | NASA's current astronomy feature |
| `GET /api/neo` | Near-Earth objects for the current UTC date |
| `GET /api/nasa-search?q=nebula` | Search NASA's public image library |

The server proxies NASA API requests so the NASA key is not placed in frontend JavaScript.

## Controls

- **Drag:** rotate the camera around the solar system.
- **Scroll / pinch:** zoom in and out.
- **Click a planet:** show its summary.
- **Focus dropdown:** move the camera toward a selected body.
- **Pause / Play:** stop or resume orbit animation.
- **Speed slider:** adjust illustrative animation speed.
- **Orbits / Labels:** show or hide orbit paths and labels.

## Troubleshooting

- **`package.json` not found:** run `dir` and move into the inner `Bhoomandal` folder that contains `package.json` and `server.js`.
- **PowerShell blocks `npm.ps1`:** use `npm.cmd install` and `npm.cmd start`.
- **NASA panel fails:** check internet, the API key, and NASA rate limits. The 3D model and educational planet content can still work.
- **3D scene remains on loading:** verify internet access to jsDelivr and check browser DevTools Console for module/WebGL errors.
- **Port 3000 is in use:** set `PORT=3001` in `.env` and open `http://localhost:3001`.

## Data sources

- [NASA Science](https://science.nasa.gov/)
- [NASA Open APIs](https://api.nasa.gov/)
- [NASA Image and Video Library](https://images.nasa.gov/)
- [NASA/JPL Horizons](https://ssd.jpl.nasa.gov/horizons/)
- [Three.js documentation](https://threejs.org/manual/)
