import { GameManager } from './gameManager.js';
import { startGame } from './app.js';

export function initializeGame() {
    const gameManager = new GameManager({
        gameContainerId: 'gameContainer',
        menuId: 'menu',
    });

    gameManager.initialize();

    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', () => {
        gameManager.startGame(() => {
            startGame();
        });
    });

    const recordsButton = document.getElementById('recordsButton');
    recordsButton.addEventListener('click', () => {
        console.log('Show records menu');
    });

    const settingsButton = document.getElementById('settingsButton');
    settingsButton.addEventListener('click', () => {
        console.log('Show settings menu');
    });
}