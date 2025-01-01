// Game / Tiles
export const TILE_WIDTH = 32;
export const TILE_HEIGHT = 32;

//Game / Pixel-Art 
export const PIXEL_ART_RATIO = 2;
export const CANVAS_WIDTH = 500;
export const CANVAS_HEIGHT = 500;

//Game / Local-Storage
export const LOCAL_STORAGE_KEY = "gameData";

//Entities / Fox
export const FOX_SIZE = 32;
export const FOX_SPEED = 250;

//Entities / Chicken
export const CHICKEN_SIZE = 32;
export const CHICKEN_SPEED = 150;

//Entities / Fast Chicken
export const FAST_CHICKEN_SPEED = 230;

//Entities / Dog
export const DOG_SIZE = 32;
export const DOG_SPEED = 80;
export const DOG_STATE = Object.freeze({
    GUARDING: "guarding",
    ALARMED: "alarmed",
    CHASING: "chasing",
    CONFUSED: "confused",
});

//Entities / Farmer
export const FARMER_SIZE = 32;
export const FARMER_SPEED = 60;
export const FARMER_STATE = Object.freeze({
    GUARDING: "guarding",
    ALARMED: "alarmed",
    SHOOTING: "shooting",
    CONFUSED: "confused",
});

//Entities / Bullet
export const MAX_DISTANCE = 180;
export const BULLET_SPEED = 300;
export const SHOOTING_INTERVAL = 1000;

// Entities / Boots
export const BOOTS_SIZE = 32;