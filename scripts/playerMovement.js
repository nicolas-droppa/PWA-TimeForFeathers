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
         * url : Path to stored levels
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
         * x : x-position of player
         * y : y-position of player
         */
        if (!this.tileMap)
            return false;
        const col = Math.floor(x / this.tileSize);
        const row = Math.floor(y / this.tileSize);
        return this.tileMap[row]?.[col] == 0;
    }

    updatePosition() {
        /*
         * Moves the player in a given direction at a consistent speed.
         * Separates horizontal and vertical movement checks to handle walls better.
         */
        let x = 0;
        let y = 0;
    
        if (this.keys.ArrowLeft)
            x = -1;
        if (this.keys.ArrowRight)
            x = 1;
        if (this.keys.ArrowUp)
            y = -1;
        if (this.keys.ArrowDown)
            y = 1;
    
        // Normalize diagonal movement
        if (x !== 0 && y !== 0) {
            const length = Math.sqrt(x ** 2 + y ** 2);
            x /= length;
            y /= length;
        }
    
        const newX = this.x + x * this.speed;
        const newY = this.y + y * this.speed;
    
        const horizontalCorners = [
            [newX, this.y], //Top-left
            [newX + this.size, this.y], //Top-right
            [newX, this.y + this.size], //Bottom-left
            [newX + this.size, this.y + this.size], //Bottom-right
        ];
        const canMoveHorizontally = horizontalCorners.every(([cornerX, cornerY]) => this.isWalkable(cornerX, cornerY));
    
        if (canMoveHorizontally) {
            this.x = newX;
        }
    
        const verticalCorners = [
            [this.x, newY], //Top-left
            [this.x + this.size, newY], //Top-right
            [this.x, newY + this.size], //Bottom-left
            [this.x + this.size, newY + this.size], //Bottom-right
        ];
        const canMoveVertically = verticalCorners.every(([cornerX, cornerY]) => this.isWalkable(cornerX, cornerY));
    
        if (canMoveVertically) {
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