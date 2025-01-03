import { Entity } from './_entity.js';
import { TILE_WIDTH, PIXEL_ART_RATIO, FOX_SIZE, FOX_SPEED} from '../_constants/_constants.js';
import { startGame } from '../app/app.js';

export class Player extends Entity {
    constructor(x, y, canvas, levelDataUrl, currentLevel) {
        super(x, y, FOX_SIZE, FOX_SPEED, canvas);
        this.imageLeft.src = '../../assets/images/fox/fox_left.png';
        this.imageRight.src = '../../assets/images/fox/fox_right.png';

        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
            R: false,
            r: false,
        };
        this.initEventListeners();

        this.tileMap = null;
        this.tileSize = TILE_WIDTH * PIXEL_ART_RATIO;
        this.loadLevelData(levelDataUrl, currentLevel);

        this.dead = false;

        this.pickedUpBoots = false;

        this.onRetry = null;
    }

    async loadLevelData(url, currentLevel) {
        /**
         * Loads tileMap and stores it in the constructor of player
         * @param url : Path to stored levels
         * @param currentLevel : level to fetch data from 
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

            if (e.key == 'R' || e.key == 'r' && typeof this.onRetry == 'function') {
                console.log('R key pressed');
                this.onRetry();
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.key in this.keys) {
                this.keys[e.key] = false;
            }
        });
    }

    isWalkable(x, y) {
        /**
         * Checks if a position is walkable (tileMap value is 0).
         * @param x : x-position of player
         * @param y : y-position of player
         */
        if (!this.tileMap)
            return false;
        const col = Math.floor(x / this.tileSize);
        const row = Math.floor(y / this.tileSize);
        return this.tileMap[row]?.[col] == 0;
    }

    updatePosition(deltaTime) {
        /**
         * Checks if player can move in direction and moves player
         * @param deltaTime : time diff for movement normalization
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

    checkCollision({ dogs }, timer) {
        /**
         * Check if the player overlaps with the dog.
         * If so, mark the player as "dead"
         * @param { dogs }
         * @param dogX : x-position of dog
         * @param dogY : y-position of dog
         * @param dogSize : size of dog
         * 
         * @param timer : timer object
         */
        dogs.forEach((dog) => {
            const overlapX = dog.x < this.x + this.size && dog.x + dog.size > this.x;
            const overlapY = dog.y < this.y + this.size && dog.y + dog.size > this.y;
    
            if (overlapX && overlapY) {
                this.dead = true;
                this.logEvent(timer);
            }
        });
    }

    checkBulletCollision({ farmers }, timer) {
        /**
         * Check if the player collides with any bullet from farmers.
         * If so, mark the player as "dead".
         * @param { farmers } : Array of farmer objects
         * @param timer : Timer object
         */
        farmers.forEach((farmer) => {
            farmer.bullets.forEach((bullet) => {
                const bulletX = bullet.x;
                const bulletY = bullet.y;
                const bulletSize = bullet.size;
                
                // Check if the player overlaps with the bullet
                const overlapX = bulletX < this.x + this.size && bulletX + bulletSize > this.x;
                const overlapY = bulletY < this.y + this.size && bulletY + bulletSize > this.y;
    
                if (overlapX && overlapY) {
                    this.dead = true;
                    this.logEvent(timer);
                }
            });
        });
    }

    checkPickedUpBoots({ boots }) {
        /**
         * Check if the player picked-up items.
         * If so, make affect player...
         * @param { items }
         */
        boots.forEach((item) => {
            if (item.pickedUp) {
                this.pickedUpBoots = true;
                this.speed = this.speed * 1.5;
            }
        })
    }

    logEvent(timer) {
        /**
         * Logs event in case of player being killed
         * @param timer : timer object
         */
        const [minutes,seconds,milliseconds] = timer.getFormattedTime();
        const eventContainer = document.getElementById('eventTable');
        const eventElement = document.createElement('p');
        eventElement.id = 'event';
        eventElement.innerHTML = `<span id="eventTitle">Fox</span><span id="eventTime">${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}.${milliseconds < 10 ? '0' + milliseconds : milliseconds}</span>`;
        eventContainer.appendChild(eventElement);
    }

    update({ dogs }, { farmers }, { boots }, timer, deltaTime) {
        /**
         * Parrent class for all the smaller functions regarding player script
         * @param deltaTime : value used to normalize movement speed
         */
        this.updatePosition(deltaTime);
        this.checkCollision({ dogs }, timer);
        this.checkBulletCollision({ farmers }, timer);
        if (!this.pickedUpBoots)
            this.checkPickedUpBoots({ boots });
        this.draw();
    }
}