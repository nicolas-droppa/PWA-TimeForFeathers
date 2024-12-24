export class GameManager {
    constructor({ gameContainerId, menuId }) {
        this.gameContainer = document.getElementById(gameContainerId);
        this.menuContainer = document.getElementById(menuId);
        this.currentMenu = null;
    }

    initialize() {
        this.showMenu('mainMenu');
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
}