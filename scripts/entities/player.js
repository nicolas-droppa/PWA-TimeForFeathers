import { Entity } from './_entity.js';
import { TILE_WIDTH, PIXEL_ART_RATIO, FOX_SIZE} from '../_constants/_constants.js';

export class Player extends Entity {
    constructor(x, y, speed, canvas, levelDataUrl, currentLevel) {
        super(x, y, FOX_SIZE, speed, canvas);
        this.imageLeft.src = '../../assets/images/fox/fox_left.png';
        this.imageRight.src = '../../assets/images/fox/fox_right.png';

        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
        };
        this.initEventListeners();

        this.tileMap = null;
        this.tileSize = TILE_WIDTH * PIXEL_ART_RATIO;
        this.loadLevelData(levelDataUrl, currentLevel);
    }

    async loadLevelData(url, currentLevel) {
        /*
         * Loads tileMap and stores it in the constructor of player
         * url : Path to stored levels
         * currentLevel : level to fetch data from 
        */
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch level data: ${response.status}`);
            }
            const data = await response.json();
            this.tileMap = data.levels[currentLevel].tileMap;
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

    updatePosition(deltaTime) {
        /*
         * Checks if player can move in direction and moves player
         * deltaTime : time diff for movement normalization
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
    
        const newX = this.x + x * this.speed * deltaTime;
        const newY = this.y + y * this.speed * deltaTime;
    
        const horizontalCorners = [
            [newX, this.y],
            [newX + this.size, this.y],
            [newX, this.y + this.size],
            [newX + this.size, this.y + this.size],
        ];
        const canMoveHorizontally = horizontalCorners.every(([cornerX, cornerY]) => this.isWalkable(cornerX, cornerY));
    
        if (canMoveHorizontally) {
            this.x = newX;
        }
    
        const verticalCorners = [
            [this.x, newY],
            [this.x + this.size, newY],
            [this.x, newY + this.size],
            [this.x + this.size, newY + this.size],
        ];
        const canMoveVertically = verticalCorners.every(([cornerX, cornerY]) => this.isWalkable(cornerX, cornerY));
    
        if (canMoveVertically) {
            this.y = newY;
        }
    }

    update(deltaTime) {
        this.updatePosition(deltaTime);
        this.draw();
    }
}