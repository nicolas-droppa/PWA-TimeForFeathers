export class Timer {
    constructor() {
        this.startTime = Date.now();
        this.elapsedTime = 0;
    }

    getFormattedTime() {
        /*
         * Calculate and return the formatted time
         */
        this.elapsedTime = Date.now() - this.startTime;

        const minutes = Math.floor(this.elapsedTime / 60000);
        const seconds = Math.floor((this.elapsedTime % 60000) / 1000);
        const milliseconds = this.elapsedTime % 100;

        return [minutes,seconds,milliseconds];
    }

    display(container) {
        /*
         * Display the time in its container
         */
        const [minutes,seconds,milliseconds] = this.getFormattedTime();
        console.log(this.getFormattedTime());

        container.querySelector("#minutes").textContent = minutes < 10 ? '0' + minutes : minutes;
        container.querySelector("#seconds").textContent = seconds < 10 ? '0' + seconds : seconds;
        container.querySelector("#miliseconds").textContent = milliseconds < 10 ? '0' + milliseconds : milliseconds;
    }
}