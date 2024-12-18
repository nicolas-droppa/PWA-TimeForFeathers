export class Player {
    constructor(x, y, speed, canvas) {
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

    updatePosition() {
        /*
        Moves the player in a given direction at a consistent speed.
        Clamps diagonal movement to prevent faster speeds.
        Ensures the player remains within the canvas boundaries.
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
    
        this.x += x * this.speed;
        this.y += y * this.speed;
    
        this.x = Math.max(0, Math.min(this.canvas.width - this.size, this.x));
        this.y = Math.max(0, Math.min(this.canvas.height - this.size, this.y));
    }

    draw() {
        /*
        Clears the previous freame and draws player as blue square.
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