import { startGame } from './app.js';
import { SKIP_MENU } from './_dev.js';

export class GameManager {
    constructor({ gameContainerId, menuId }) {
        this.gameContainer = document.getElementById(gameContainerId);
        this.menuContainer = document.getElementById(menuId);
        this.currentMenu = null;
    }

    initialize() {
        /*
         * initialize game and skips menu based on dev file
         */
        if (SKIP_MENU) {
            this.startGame(() => startGame());
        } else {
            this.showMenu('mainMenu');
            this.setupMenuListeners();
        }
    }

    showMenu(menuId) {
        /*
         * Shows menu
         * menuId : id of menu
         */
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
        /*
         * Shows game container and hides menu container
         */
        this.gameContainer.style.display = 'block';
        this.menuContainer.style.display = 'none';
    }

    setupMenuListeners() {
        /*
         * Prepares buttons for main menu and their listeners
         */
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
        /*
         * Handling level completion
         */
        console.log("Level completed");
    }
}