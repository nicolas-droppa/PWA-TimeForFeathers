import { Chicken } from './chicken.js';
import { FAST_CHICKEN_SPEED } from '../_constants/_constants.js';

export class FastChicken extends Chicken {
    constructor(x, y, canvas, path) {
        super(x, y, canvas, path);
        
        this.imageLeft.src = '../../assets/images/chicken/chicken_left_faster.png';
        this.imageRight.src = '../../assets/images/chicken/chicken_right_faster.png';

        this.speed = FAST_CHICKEN_SPEED;
    }

    logEvent(timer) {
        const [minutes, seconds, milliseconds] = timer.getFormattedTime();
        const eventContainer = document.getElementById('eventTable');
        const eventElement = document.createElement('p');
        eventElement.id = 'event';
        eventElement.innerHTML = `<span id="eventTitle">Fast Chicken</span><span id="eventTime">${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}.${milliseconds < 10 ? '0' + milliseconds : milliseconds}</span>`;
        eventContainer.appendChild(eventElement);
    }
}