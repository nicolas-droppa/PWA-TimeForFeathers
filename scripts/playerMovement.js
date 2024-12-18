import { TILE_WIDTH, PIXEL_ART_RATIO} from './_constants.js';
export class Player {
    constructor(x, y, speed, canvas, levelDataUrl) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.size = 32;

        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
        };
        this.initEventListeners();

        this.tileMap = null;
        this.tileSize = TILE_WIDTH * PIXEL_ART_RATIO;
        this.loadLevelData(levelDataUrl);
    }

    async loadLevelData(url) {
        /*
         * Loads tileMap and stores it in the constructor of player
         */
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch level data: ${response.status}`);
            }
            const data = await response.json();
            this.tileMap = data.levels[0].tileMap;
        } catch (error) {
            console.error("Error fetching level data:", error);
        }
    }

    initEventListeners() {
        window.addEventListener('keydown', (e) => {
            if (e.key in this.keys) {
                this.keys[e.key] = true;
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.key in this.keys) {
                this.keys[e.key] = false;
            }
        });
    }

    isWalkable(x, y) {
        /*
         * Checks if a position is walkable (tileMap value is 0).
         */
        if (!this.tileMap) return false; // Tilemap not loaded yet
        const col = Math.floor(x / this.tileSize);
        const row = Math.floor(y / this.tileSize);
        return this.tileMap[row]?.[col] === 0;
    }

    updatePosition() {
        /*
         * Moves the player in a given direction at a consistent speed.
         * Checks for walkable tiles in the tileMap.
         */
        let x = 0;
        let y = 0;

        if (this.keys.ArrowLeft) x = -1;
        if (this.keys.ArrowRight) x = 1;
        if (this.keys.ArrowUp) y = -1;
        if (this.keys.ArrowDown) y = 1;

        // Normalize diagonal movement
        if (x !== 0 && y !== 0) {
            const length = Math.sqrt(x ** 2 + y ** 2);
            x /= length;
            y /= length;
        }

        // Calculate the new position
        const newX = this.x + x * this.speed;
        const newY = this.y + y * this.speed;

        // Check if the new position is walkable
        const corners = [
            [newX, newY], // Top-left corner
            [newX + this.size, newY], // Top-right corner
            [newX, newY + this.size], // Bottom-left corner
            [newX + this.size, newY + this.size], // Bottom-right corner
        ];

        const canMove = corners.every(([cornerX, cornerY]) => this.isWalkable(cornerX, cornerY));

        if (canMove) {
            this.x = newX;
            this.y = newY;
        }
    }

    draw() {
        /*
         * Clears the previous frame and draws player as blue square only on playerLayer.
         */
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    update() {
        this.updatePosition();
        this.draw();
    }
}