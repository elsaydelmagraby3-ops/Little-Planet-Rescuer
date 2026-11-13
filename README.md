# Little Planet Rescuer 🚀

A starter project for an interactive educational space adventure.

## What's included
- Responsive single-page experience with Home, Story Mode, Solar System, Mini Games, and Mission Control.
- Branching story choices (Mars / Saturn).
- Interactive 3D Solar System built with Three.js.
- Three mini-games: solar-panel repair question, hidden-planet search, and a short planet quiz.
- Explorer points, planet discoveries, achievements, and browser-local progress using `localStorage`.
- Optional GSAP animation and Howler.js library hooks.

## Run the project

**Important:** Because the 3D scene uses JavaScript modules, do not open `index.html` by double-clicking it. Run a local web server.

### Option A — VS Code
1. Open this folder in Visual Studio Code.
2. Install the **Live Server** extension.
3. Right-click `index.html`.
4. Choose **Open with Live Server**.

### Option B — Python
Open a terminal inside this folder and run:

```bash
python -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

## Project structure

```text
Little-Planet-Rescuer/
├── index.html
├── style.css
├── README.md
├── assets/
│   ├── images/
│   ├── sounds/
│   └── models/
└── js/
    ├── main.js
    ├── data.js
    ├── state.js
    ├── story.js
    ├── games.js
    ├── three-scene.js
    ├── ui.js
    └── animations.js
```

## Technologies
- HTML5
- CSS3
- Vanilla JavaScript (ES modules)
- Three.js
- GSAP (optional animation enhancement)
- Howler.js (library included; add audio files before using sound effects)

## Notes
- Three.js and Google Fonts are loaded from CDNs, so an internet connection is needed when running this starter.
- The 3D scene is a simplified educational visualization, not a scale-accurate orbital model.
- Planetary facts are starter content. Verify and expand the facts with NASA or other authoritative scientific sources before submitting the project.
- Progress is stored in the current browser only. There is no account system or online leaderboard.
- The sound toggle is a UI placeholder; add your own licensed audio assets and connect them in `js/animations.js` before enabling sound effects.
