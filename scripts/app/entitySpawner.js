import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../_constants/_constants.js';
import { Player } from '../entities/player.js';
import { Chicken } from '../entities/chicken.js';
import { FastChicken } from '../entities/fastChicken.js';
import { Dog } from '../entities/dog.js';
import { Farmer } from '../entities/farmer.js';
import { Timer } from './timer.js';
import { Boots } from '../entities/boots.js';

export function initializeCanvases(canvasIds) {
    /**
     * Initializes the canvas elements and sets their dimensions
     * @param canvasIds : Ids of every canvas
     * @returns : all the canvases
     */
    const canvases = {};
    canvasIds.forEach((id) => {
        const canvas = document.getElementById(id);
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        canvases[id] = canvas;
    });
    return canvases;
}

export async function fetchLevelData(levelDataPath) {
    /**
     * Fetches level data from the specified file
     * @param levelDataPath : path to levels.json
     * @returns : fetched data
     */
    return fetch(levelDataPath)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Error loading levels.json:', error);
            return null;
        });
}

export async function loadEntities(canvases, levelDataPath, currentLevel) {
    /**
     * Spawns entities based on the fetched level data
     * @param canvases : all the canvases for every needed layer
     * @param levelDataPath : path to levels.json
     * @returns { objects } : all the entities
     */
    const levelData = await fetchLevelData(levelDataPath);

    if (!levelData) {
        console.error('Failed to load level data. Entities cannot be spawned.');
        return null;
    }

    const level = levelData.levels[currentLevel];

    const playerConfig = level.fox;
    const player = new Player(
        playerConfig.spawn.x,
        playerConfig.spawn.y,
        canvases.playerLayer,
        levelDataPath,
        currentLevel
    );

    const chickens = level.chickens.map((chickenConfig) => {
        return new Chicken(
            chickenConfig.spawn.x,
            chickenConfig.spawn.y,
            canvases.chickenLayer,
            chickenConfig.path.map((p) => [p.x, p.y])
        );
    });

    const fastChickens = level.fastChickens.map((fastChickenConfig) => {
        return new FastChicken(
            fastChickenConfig.spawn.x,
            fastChickenConfig.spawn.y,
            canvases.chickenLayer,
            fastChickenConfig.path.map((p) => [p.x, p.y])
        );
    });

    const dogs = level.dogs.map((dogConfig) => {
        return new Dog(
            dogConfig.spawn.x,
            dogConfig.spawn.y,
            canvases.dogLayer,
            dogConfig.path.map((p) => [p.x, p.y]),
            levelDataPath,
            currentLevel
        );
    });

    const farmers = level.farmers.map((farmerConfig) => {
        return new Farmer(
            farmerConfig.spawn.x,
            farmerConfig.spawn.y,
            canvases.farmerLayer,
            canvases.bulletLayer,
            farmerConfig.path.map((p) => [p.x, p.y]),
            levelDataPath,
            currentLevel
        );
    });

    const boots = level.boots.map((bootConfig) => {
        return new Boots(
            bootConfig.spawn.x,
            bootConfig.spawn.y,
            canvases.itemLayer,
        );
    });

    const timer = new Timer();

    return { player, chickens, fastChickens, dogs, farmers, boots, timer };
}