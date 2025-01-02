export class DeltaTime {
    /**
     * Making sure that movement speed of entities is not based on hardware but rather dependent on time (still not perfect)
     * @returns : time difference in seconds
     */
    constructor() {
        this.lastTime = performance.now();
    }

    getDeltaTime() {
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = currentTime;
        return deltaTime;
    }
}