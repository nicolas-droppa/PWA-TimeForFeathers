import { LOCAL_STORAGE_KEY } from "../_constants/_constants.js";
import { LOCAL_STORAGE_KEY_TIMES } from "../_constants/_constants.js";

export function saveCurrentLevel(level) {
    /**
     * Saves current level to local storage
     * @param { number } level : current level to be saved
     */
    let currentLevel = JSON.stringify(level);
    localStorage.setItem(LOCAL_STORAGE_KEY, currentLevel);
}

export function saveCurrentTime(time, level) {
    /**
     * Checks if current time is best and saves it to local storage
     * @param { number } time : formated time to be saved
     * @param { number } level : current level
     */
    let bestTimes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TIMES)) || [Infinity, Infinity, Infinity, Infinity, Infinity];

    while (bestTimes.length <= level) {
        bestTimes.push(Infinity);
    }

    if (time < bestTimes[level]) {
        bestTimes[level] = time;
    }

    localStorage.setItem(LOCAL_STORAGE_KEY_TIMES, JSON.stringify(bestTimes));
    console.log(bestTimes);
}

export function getBestTimes() {
    /**
     * Retrieves the best times from local storage.
     * @returns {Array<number>} - An array of best times for each level.
     */
    let bestTimes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TIMES)) || [Infinity, Infinity, Infinity, Infinity, Infinity];
    return bestTimes.map(time => (time === Infinity ? null : time));
}

export function getCurrentLevel() {
    /**
     * Returns current level from local storage
     */
    let currentLevel = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || 0);
    return currentLevel;
}

export function resetGameData() {
    /**
     * Resets local storage
     */
    localStorage.removeItem(LOCAL_STORAGE_KEY);
}

export async function getLevelCount(url) {
    /**
     * Returns how many levels are there
     * @param url : url to fetched data
     */
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch levels file: ${response.statusText}`);
        }
        const levelsData = await response.json();
        return levelsData.levels.length;
    } catch (error) {
        console.error('Error loading levels:', error);
        return 0;
    }
}