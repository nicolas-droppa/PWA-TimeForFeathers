export class DeltaTime {
    constructor() {
        this.lastTime = performance.now();
    }

    getDeltaTime() {
        const currentTime = performance.now();
        let deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        deltaTime = Math.min(Math.max(deltaTime, 0.001), 0.033); // Between ~30 FPS and ~1000 FPS
        this.lastTime = currentTime;
        return deltaTime;
    }
}