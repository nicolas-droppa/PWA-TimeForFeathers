// Constants for canvas rendering
const TILE_SIZE = 32; // Size of a single tile in pixels
const WALL_COLOR = "#654321"; // Brown for walls
const FLOOR_COLOR = "#dcdcdc"; // Light gray for walkable tiles
const FOX_COLOR = "#ffa500"; // Orange for the fox
const CHICKEN_COLOR = "#ffff00"; // Yellow for chickens

// Draw the tile map
function drawTileMap(ctx, tileMap) {
    for (let y = 0; y < tileMap.length; y++) {
        for (let x = 0; x < tileMap[y].length; x++) {
        ctx.fillStyle = tileMap[y][x] === 1 ? WALL_COLOR : FLOOR_COLOR;
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

        // Draw grid lines for better visibility
        ctx.strokeStyle = "#A9A9A9";
        ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
}

// Draw the fox
function drawFox(ctx, foxPosition) {
    ctx.fillStyle = FOX_COLOR;
    ctx.beginPath();
    ctx.arc(
        foxPosition.x * TILE_SIZE + TILE_SIZE / 2,
        foxPosition.y * TILE_SIZE + TILE_SIZE / 2,
        TILE_SIZE / 2.5, // Circle size for the fox
        0,
        2 * Math.PI
    );
    ctx.fill();
}

// Draw the chickens
function drawChickens(ctx, chickens) {
    chickens.forEach(chicken => {
        ctx.fillStyle = CHICKEN_COLOR;
        ctx.beginPath();
        ctx.arc(
        chicken.spawn.x * TILE_SIZE + TILE_SIZE / 2,
        chicken.spawn.y * TILE_SIZE + TILE_SIZE / 2,
        TILE_SIZE / 3, // Circle size for chickens
        0,
        2 * Math.PI
        );
        ctx.fill();
    });
}

// Fetch the level data from JSON and render the board
function loadLevelAndRender() {
    fetch('levels.json')
        .then(response => response.json())
        .then(data => {
            const level = data.levels[0]; // Assuming you want to render the first level
    
            // Get canvas and set its size
            const canvas = document.getElementById("gameCanvas");
            const ctx = canvas.getContext("2d");
    
            // Set canvas size based on the tile map dimensions
            canvas.width = level.tileMap[0].length * TILE_SIZE;
            canvas.height = level.tileMap.length * TILE_SIZE;
    
            // Draw the game board, fox, and chickens
            drawTileMap(ctx, level.tileMap);
            drawFox(ctx, level.foxSpawn);
            drawChickens(ctx, level.chickens);
        })
        .catch(error => {
            console.error('Error loading level data:', error);
        });
}

loadLevelAndRender();