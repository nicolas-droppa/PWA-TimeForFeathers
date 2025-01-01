import { Entity } from './_entity.js';
import { Bullet } from './bullet.js';
import { FARMER_SIZE, FARMER_STATE, TILE_WIDTH, PIXEL_ART_RATIO, FARMER_SPEED, BULLET_SPEED, SHOOTING_INTERVAL } from '../_constants/_constants.js';
export class Farmer extends Entity {
    constructor(x, y, canvas, bulletCanvas, path, levelDataUrl, currentLevel) {
        super(x, y, FARMER_SIZE, FARMER_SPEED, canvas);
        this.path = path.map(([col, row]) => [
            col * (TILE_WIDTH * PIXEL_ART_RATIO) + ((TILE_WIDTH * PIXEL_ART_RATIO) - FARMER_SIZE) / 2,
            row * (TILE_WIDTH * PIXEL_ART_RATIO) + ((TILE_WIDTH * PIXEL_ART_RATIO) - FARMER_SIZE) / 2
        ]);
        this.currentTargetIndex = 0;
        this.reachedTarget = true;
        this.state = FARMER_STATE.GUARDING;
        this.stateFlag = false;
        this.fovAngle = Math.PI * 2 / 3; //120 degrees
        this.detectionRadius = 120;
        this.walkingSpeed = FARMER_SPEED;
        this.shootingSpeed = 0;

        this.tileMap = null;
        this.loadLevelData(levelDataUrl, currentLevel);

        this.bulletCanvas = bulletCanvas;
        this.bullets = [];
        this.bulletSpeed = BULLET_SPEED;
        this.lastShotTime = 0;
        this.shootInterval = SHOOTING_INTERVAL;
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

    isTileWalkable(x, y, tileMap) {
        /**
         * Checks if a tile is walkable.
         * @param {number} x : Tile x index
         * @param {number} y : Tile y index
         * @param {Array} tileMap : 2D map array
         * @returns {boolean} : True if the tile is walkable, false otherwise
         */
        return (
            y >= 0 &&
            x >= 0 &&
            y < tileMap.length &&
            x < tileMap[y].length &&
            tileMap[y][x] === 0
        );
    }

    canMoveTo(newX, newY) {
        /**
         * Checks if the farmer can move to the target position based on the tileMap
         * @param {number} newX : Target X position
         * @param {number} newY : Target Y position
         * @return {boolean} : true if the player can move, false otherwise
         */
        const corners = [
            [newX, newY],
            [newX + this.size, newY],
            [newX, newY + this.size],
            [newX + this.size, newY + this.size],
        ];
    
        return corners.every(([cornerX, cornerY]) => {
            const tileX = Math.floor(cornerX / (TILE_WIDTH * PIXEL_ART_RATIO));
            const tileY = Math.floor(cornerY / (TILE_WIDTH * PIXEL_ART_RATIO));
    
            // Check if the tile is within bounds and walkable
            return (
                tileY >= 0 &&
                tileX >= 0 &&
                tileY < this.tileMap.length &&
                tileX < this.tileMap[tileY].length &&
                this.tileMap[tileY][tileX] == 0
            );
        });
    }

    canMove() {
        const directions = [
            { dx: -10, dy: 0 },
            { dx: -10, dy: -10 },
            { dx: 0, dy: -10 },
            { dx: 0, dy: 0 },
            { dx: +10, dy: 0 },
            { dx: +10, dy: +10 },
            { dx: 0, dy: +10 },
            { dx: -10, dy: +10 },
            { dx: +10, dy: -10 },
        ];
    
        return directions.some(({ dx, dy }) => {
            const canMove = this.canMoveTo(this.x + dx, this.y + dy);
            if (!canMove) {
                console.log(`Blocked at direction dx: ${dx}, dy: ${dy}`);
            }
            return canMove;
        });
    }

    shoot(direction) {
        /**
         * Farmer shoots bullet in that direction.
         * @param direction : direction in radians
         */
        //const bullet = new Bullet(this.x, this.y, direction, this.bulletSpeed, this.canvas);
        const bullet = new Bullet(this.x, this.y, direction, this.bulletSpeed, this.bulletCanvas);
        this.bullets.push(bullet);
    }

    updatePosition(deltaTime, playerX, playerY, playerSize) {
        /**
         * Updates position of a farmer
         * @param deltaTime : value for movement normalization
         */
        if (this.state == FARMER_STATE.ALARMED || this.state == FARMER_STATE.CONFUSED)
            return;
        
        if (this.state == FARMER_STATE.SHOOTING) {
            const currentTime = Date.now();

            // Check if enough time has passed since the last shot
            if (currentTime - this.lastShotTime >= this.shootInterval) {
                // Calculate the direction to shoot at the player
                const centerX = this.x + this.size / 2;
                const centerY = this.y + this.size / 2;
                const playerCenterX = playerX + playerSize / 2;
                const playerCenterY = playerY + playerSize / 2;

                const direction = Math.atan2(playerCenterY - centerY, playerCenterX - centerX);

                // Shoot in the calculated direction
                this.shoot(direction);
                this.shoot(direction-0.15);
                this.shoot(direction+0.15);

                this.lastShotTime = currentTime;
            }
            return;
        }
        
        const [targetX, targetY] = this.path[this.currentTargetIndex];

        super.updatePosition(deltaTime, targetX, targetY);

        const distance = Math.sqrt((targetX - this.x) ** 2 + (targetY - this.y) ** 2);
        if (distance < this.speed * deltaTime) {
            this.currentTargetIndex = (this.currentTargetIndex + 1) % this.path.length;
        }
    }

    drawCone(centerX, centerY, detectionRadius, angle, facingDirection) {
        /**
         * Draws a cone-shaped field of view (FOV) for the farmer
         * @param centerX : X-coordinate of the farmer's center
         * @param centerY : Y-coordinate of the farmer's center
         * @param detectionRadius : The radius of the cone
         * @param angle : The FOV angle in radians
         * @param facingDirection : The direction the farmer is facing (in radians)
         */
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        const startAngle = facingDirection - angle / 2;
        const endAngle = facingDirection + angle / 2;
    
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.arc(centerX, centerY, detectionRadius, startAngle, endAngle);
        this.ctx.closePath();
    
        this.ctx.fillStyle = 'rgba(255, 0, 8, 0.2)';
        this.ctx.fill();
        this.ctx.strokeStyle = 'red';
        this.ctx.stroke();
    }

    isPathClear(startX, startY, endX, endY) {
        /**
         * Checks if there are any obstacles (non-zero tiles) along a straight line between two points
         * @param startX : Starting X position (tile coordinates)
         * @param startY : Starting Y position (tile coordinates)
         * @param endX : Ending X position (tile coordinates)
         * @param endY : Ending Y position (tile coordinates)
         * @param tileMap : 2D array representing the map (0 = free, 1 = obstacle)
         * @return : true if path is clear, false otherwise
         */
        startX = parseInt(startX / TILE_WIDTH / PIXEL_ART_RATIO);
        startY = parseInt(startY / TILE_WIDTH / PIXEL_ART_RATIO);
        endX = parseInt(endX / TILE_WIDTH / PIXEL_ART_RATIO);
        endY = parseInt(endY / TILE_WIDTH / PIXEL_ART_RATIO);
        const dx = Math.abs(endX - startX);
        const dy = Math.abs(endY - startY);
        const sx = startX < endX ? 1 : -1;
        const sy = startY < endY ? 1 : -1;
    
        let err = dx - dy;
    
        let x = startX;
        let y = startY;
    
        while (x !== endX || y !== endY) {
            if (this.tileMap[y][x] !== 0) {
                return false;
            }
    
            const e2 = 2 * err;
    
            if (e2 > -dy) {
                err -= dy;
                x += sx;
            }
            if (e2 < dx) {
                err += dx;
                y += sy;
            }
        }
    
        return true;
    }

    checkForPlayerInSight(playerX, playerY, playerSize) {
        /**
         * Checks if the player is within the farmer's cone-shaped field of view
         * @param playerX : X position of the player
         * @param playerY : Y position of the player
         * @param playerSize : Size of the player
         */
        const farmerCenterX = this.x + this.size / 2;
        const farmerCenterY = this.y + this.size / 2;
        const playerCenterX = playerX + playerSize / 2;
        const playerCenterY = playerY + playerSize / 2;
    
        let targetX, targetY;
    
        if (this.state == FARMER_STATE.SHOOTING) {
            targetX = parseInt(playerX);
            targetY = parseInt(playerY);
        } else {
            [targetX, targetY] = this.path[this.currentTargetIndex];
        }
    
        const facingDirection = Math.atan2(targetY - this.y, targetX - this.x);
    
        // Draw the cone for visualization
        this.drawCone(farmerCenterX, farmerCenterY, this.detectionRadius, this.fovAngle, facingDirection);
    
        // Check if the player is within the detection radius
        const dx = playerCenterX - farmerCenterX;
        const dy = playerCenterY - farmerCenterY;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);
    
        if (distance <= this.detectionRadius) {
            // Check if the player is within the field of view angle
            const angleToPlayer = Math.atan2(dy, dx);
            const deltaAngle = Math.abs(facingDirection - angleToPlayer);
    
            // Normalize angles to account for edge cases at 0/2π
            const normalizedDeltaAngle = Math.min(deltaAngle, Math.abs(2 * Math.PI - deltaAngle));
    
            if (normalizedDeltaAngle <= this.fovAngle / 2) {
                // Player detected within cone
                if (!this.stateFlag) {
                    console.log("Alarmed!");
                    this.state = FARMER_STATE.ALARMED;
                    this.speed = this.shootingSpeedSpeed;
                    this.stateFlag = true;
    
                    setTimeout(() => {
                        console.log("Shooting!");
                        this.state = FARMER_STATE.SHOOTING;
                    }, 250);
                }
                return;
            }
        }
    
        if (this.stateFlag) {
            console.log("Confused?");
            this.state = FARMER_STATE.CONFUSED;
            this.speed = this.walkingSpeed;
    
            setTimeout(() => {
                console.log("Guarding...");
                this.state = FARMER_STATE.GUARDING;
                this.stateFlag = false;
            }, 250);
        }
    }
    
    isPointInTriangle(px, py, [v1, v2, v3]) {
        /**
         * Determines if a point is inside a triangle
         * @param px : X coordinate of the point
         * @param py : Y coordinate of the point
         * @param [v1, v2, v3] : Array of triangle vertices
         */
        const area = (v1, v2, v3) =>
            Math.abs((v1[0] * (v2[1] - v3[1]) + v2[0] * (v3[1] - v1[1]) + v3[0] * (v1[1] - v2[1])) / 2);
    
        const A = area(v1, v2, v3);
        const A1 = area([px, py], v2, v3);
        const A2 = area(v1, [px, py], v3);
        const A3 = area(v1, v2, [px, py]);
    
        return Math.abs(A - (A1 + A2 + A3)) < 0.01; // Floating-point tolerance
    }

    draw() {
        /**
         * Draws the farmer on canvas
         */
        // -1 and +2 to prevent errors of not delelting whole chicken
        this.ctx.clearRect(this.prevX - 1, this.prevY - 1, this.size + 2, this.size + 2);
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.x, this.y, this.size, this.size);
        this.prevX = this.x;
        this.prevY = this.y;
    }

    update(playerX, playerY, playerSize, deltaTime) {
        /**
         * Parrent class for all the smaller functions regarding farmer script
         * @param playerX : ...
         * @param playerY : ...
         * @param playerSize : ...
         * @param deltaTime : value used to normalize movement speed
         */
        this.updatePosition(deltaTime, playerX, playerY, playerSize);
        this.checkForPlayerInSight(playerX, playerY, playerSize);
        this.draw();

        this.bullets = this.bullets.filter(bullet => bullet.active);
        this.bullets.forEach(bullet => bullet.update(deltaTime));
        this.bullets.forEach(bullet => bullet.draw());
    }
}
