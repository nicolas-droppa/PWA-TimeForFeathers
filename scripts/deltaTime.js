export class DeltaTime {
    /*
     * Making sure that movement speed of entities is not based on hardware
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