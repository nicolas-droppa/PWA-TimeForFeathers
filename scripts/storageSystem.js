import { LOCAL_STORAGE_KEY } from "./_constants.js";

export function saveCurrentLevel() {
    /*
     * Saves current level to local storage
     */
    let currentLevel = JSON.stringify(1);
    localStorage.setItem(LOCAL_STORAGE_KEY, currentLevel);
}

export function getCurrentLevel() {
    /*
     * Returns current level from local storage
     */
    let currentLevel = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || 0);
    return currentLevel;
}

export function resetGameData() {
    /*
     * Resets local storage
     */
    localStorage.removeItem(LOCAL_STORAGE_KEY);
}