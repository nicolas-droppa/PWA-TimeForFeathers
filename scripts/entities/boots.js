import { Item } from './_item.js';
import { BOOTS_SIZE } from '../_constants/_constants.js';
export class Boots extends Item {
    constructor(x, y, canvas) {
        super(x, y, BOOTS_SIZE, canvas);
        this.image.src = '../../assets/images/boots.png';
        this.pickedUp = false;
    }

    checkCollision(playerX, playerY, playerSize, timer) {
        /**
         * Check if the player overlaps with the item.
         * If so, mark the item as "picked-up."
         * @paramplayerX : x-position of player
         * @param playerY : y-position of player
         * @param playerSize : size of player
         * @param timer : timer object
         */
        const overlapX = playerX < this.x + this.size && playerX + playerSize > this.x;
        const overlapY = playerY < this.y + this.size && playerY + playerSize > this.y;

        if (overlapX && overlapY) {
            this.pickedUp = true;
            this.logEvent(timer);
        }
    }

    logEvent(timer) {
        /**
         * Logs event in case of item being picked up
         * @param timer : timer object
         */
        const [minutes,seconds,milliseconds] = timer.getFormattedTime();
        const eventContainer = document.getElementById('eventTable');
        const eventElement = document.createElement('p');
        eventElement.id = 'event';
        eventElement.innerHTML = `<span id="eventTitle">Boots</span><span id="eventTime">${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}.${milliseconds < 10 ? '0' + milliseconds : milliseconds}</span>`;
        eventContainer.appendChild(eventElement);
    }

    draw() {
        /**
         * Default displaying of items
         */
        if (this.pickedUp) {
            this.ctx.clearRect(this.x, this.y, this.size, this.size);
            return;
        }
        this.ctx.clearRect(this.x, this.y, this.size, this.size);
        this.ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
    }

    update(playerX, playerY, playerSize, timer) {
        /**
         * Parrent class for all the smaller functions regarding chicken script
         * @param playerX : ...
         * @param playerY : ...
         * @param playerSize : ...
         * @param timer : timer object
         */
        this.checkCollision(playerX, playerY, playerSize, timer);
        this.draw();
    }
}