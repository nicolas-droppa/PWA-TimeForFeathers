import { startGame } from './app.js';
import { SKIP_MENU } from './_dev.js';

export class GameManager {
    constructor({ gameContainerId, menuId }) {
        this.gameContainer = document.getElementById(gameContainerId);
        this.menuContainer = document.getElementById(menuId);
        this.currentMenu = null;
    }

    initialize() {
        if (SKIP_MENU) {
            this.startGame(() => startGame());
        } else {
            this.showMenu('mainMenu');
            this.setupMenuListeners();
        }
    }

    showMenu(menuId) {
        const menu = document.getElementById(menuId);
        if (menu) {
            menu.style.display = 'flex';
            this.currentMenu = menu;
        }
    }

    startGame(startCallback = () => {}) {
        this.prepareGameEnvironment();
        startCallback();
    }

    prepareGameEnvironment() {
        this.gameContainer.style.display = 'block';
        this.menuContainer.style.display = 'none';
    }

    setupMenuListeners() {
        const startButton = document.getElementById('startButton');
        startButton.addEventListener('click', () => {
            this.startGame(() => startGame());
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

    static levelCompleted() {
        console.log("Level completed");
    }
}