# Jumping Box Game - TypeScript Edition

A simple Phaser 3 game built with TypeScript that compiles to a single HTML file.

## Features

- 🎮 Click anywhere to make the box jump
- 🎨 Physics-based jumping with gravity and bouncing
- ✨ Visual effects (rotation in air, scaling on jump)
- 📦 Single HTML file output with all assets inlined
- 🔧 Built with TypeScript for better development experience

## Quick Start

### Development Mode
```bash
npm install
npm run dev
```
This will start a development server at `http://localhost:8080`

### Production Build
```bash
npm run build
```
This creates a single `dist/index.html` file that contains everything needed to run the game.

### Clean Build
```bash
npm run clean
npm run build
```

## Project Structure

```
├── src/
│   ├── game.ts       # Main game logic (TypeScript)
│   ├── styles.css    # Game styling
│   └── index.html    # HTML template
├── dist/             # Built files (generated)
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
└── webpack.config.js # Build configuration
```

## Technologies Used

- **Phaser 3**: Game framework
- **TypeScript**: Type-safe JavaScript
- **Webpack**: Module bundler
- **CSS**: Styling

## Game Controls

- **Click** anywhere on the screen to make the blue box jump
- The box will rotate while in the air and bounce when it lands
- Physics prevent double-jumping (must touch ground first)

## Deployment

After running `npm run build`, you can serve the `dist/index.html` file from any web server or open it directly in a browser. Everything is self-contained in this single file. 