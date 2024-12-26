import { startGame } from './app.js';
import { SKIP_MENU, AUTO_NEXT_LEVEL, STARTING_LEVEL } from './_dev.js';
import { getCurrentLevel, getLevelCount } from './storageSystem.js';

export class GameManager {
    constructor({ gameContainerId, menuId, eventTableId }) {
        this.gameContainer = document.getElementById(gameContainerId);
        this.menuContainer = document.getElementById(menuId);
        this.eventTable = document.getElementById(eventTableId);
        this.currentMenu = null;
        this.currentLevel = null;
        this.isLevelCompleted = false;
    }

    initialize() {
        /*
         * initialize game and skips menu based on dev file
         */
        if (STARTING_LEVEL != -1)
            this.currentLevel = STARTING_LEVEL - 1;
        else
            this.currentLevel = getCurrentLevel();

        if (SKIP_MENU)
            this.startGame(() => startGame());
        
        this.showMenu('mainMenu');
        this.setupMenuListeners();
    }

    showMenu(menuId) {
        /*
         * Shows menu
         * menuId : id of menu
         */
        this.hideAllMenus();
        const menu = document.getElementById(menuId);
        if (menu) {
            menu.style.display = 'flex';
            this.currentMenu = menu;
        }
    }

    hideAllMenus() {
        /*
         * Hiding all menu types
         */
        const menus = this.menuContainer.querySelectorAll('.menu-screen');
        menus.forEach(menu => menu.style.display = 'none');
    }

    startGame(startCallback = () => {}) {
        this.isLevelCompleted = false;
        this.prepareGameEnvironment();
        startCallback();
    }

    prepareGameEnvironment() {
        /*
         * Shows game container and hides menu container
         */
        this.gameContainer.style.display = 'block';
        this.menuContainer.style.display = 'none';
        this.displayCurrentLevel();
        this.clearEventTable();
    }

    prepareMenuEnvironment() {
        /*
         * Shows menu container and hides game container
         */
        this.gameContainer.style.display = 'none';
        this.menuContainer.style.display = 'flex';
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

    async setupLevelListeners() {
        /*
         * Prepares buttons for level menu and their listeners
         */
        const levelCount = await getLevelCount('../levels.json');
        const nextButton = document.getElementById('nextButton');
        const retryButton = document.getElementById('retryButton');

        nextButton.replaceWith(nextButton.cloneNode(true));
        retryButton.replaceWith(retryButton.cloneNode(true));

        if (SKIP_MENU) {
            if (AUTO_NEXT_LEVEL)
                this.currentLevel = this.currentLevel + 1 < levelCount ? this.currentLevel + 1 : 0;

            this.startGame(() => startGame());
        }

        document.getElementById('nextButton').addEventListener('click', () => {
            this.currentLevel = this.currentLevel + 1 < levelCount ? this.currentLevel + 1 : 0;
            this.startGame(() => startGame());
        });
    
        document.getElementById('retryButton').addEventListener('click', () => {
            this.startGame(() => startGame());
        });
    }

    levelCompleted() {
        /*
         * Handling level completion
         */
        if (this.isLevelCompleted)
            return;

        this.isLevelCompleted = true;
        this.prepareMenuEnvironment();
        this.showMenu('levelCompleted');
        this.setupLevelListeners();
    }

    clearEventTable() {
        /*
         * Clears eventTable from previous logs
         */
        while (this.eventTable.firstChild) {
            this.eventTable.removeChild(this.eventTable.firstChild);
        }
    }

    displayCurrentLevel() {
        /*
         * Displays current level number in specified container
         */
        const levelContainer = document.getElementById('level-id');
        levelContainer.innerHTML = this.currentLevel + 1;
    }
}