# DinoJump

Browser-based clone of the Chrome offline dinosaur game. Vanilla HTML, CSS, and JavaScript with no dependencies. All sprite assets are embedded as base64 data URIs.

## Architecture

Three files, no build step:

```
dinojump/
  index.html    # Page structure: game container, score displays, game-over overlay
  style.css     # Layout, sprite backgrounds (base64), score positioning
  game.js       # All game logic: physics, obstacles, scoring, input handling
```

### Game loop

`game.js` runs entirely on `setInterval` timers (no `requestAnimationFrame`):

1. **`startGame()`** -- resets state, starts three interval timers:
   - `obstacleInterval` (2s) -- spawns a cactus or bird at random sub-intervals
   - `cloudInterval` (3s) -- spawns decorative background clouds
   - `scoreInterval` (100ms) -- increments score by 10, bumps `animationSpeed` every 500 points
2. **`jump()`** -- 20ms interval: 15-tick ascent with decreasing height, then gravity-based descent
3. **`generateObstacle()`** -- creates a DOM element (`.cactus` or `.bird`), moves it left on a 20ms interval, checks collision at each tick
4. **`gameOver()`** -- clears all timers, shows overlay, updates high score in `localStorage`

### Collision detection

Simple bounding-box check: obstacle is between x=0 and x=60, and dino's vertical position is below the obstacle's height threshold (40px for cactus, 90px for bird).

### Difficulty scaling

- `animationSpeed` starts at 3, increases by 0.5 every 500 points, caps at 8
- Obstacle spawn interval shrinks as score increases: `random(2000 - score/100) + 1000`ms
- Birds only appear after score > 500, with 30% probability

## Stack

- **HTML5** -- minimal structure (game container div with child elements)
- **CSS** -- sprite images as base64 `background-image` data URIs (dino, cactus, bird, cloud)
- **JavaScript** -- vanilla, no libraries, no module system

## Key patterns

- **No external assets** -- all sprites are base64-encoded PNG data URIs in `style.css`, making the game fully self-contained
- **DOM-based rendering** -- obstacles and clouds are created as DOM elements and moved via `style.left`, not canvas-based
- **`localStorage` persistence** -- high score survives page refreshes
- **Mobile support** -- `touchstart` event listener for jump and restart
- **Multiple input methods** -- Space, W, ArrowUp to jump; Space or Enter to restart after game over

## Commands

- `open index.html` -- play the game in any browser
