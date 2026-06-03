import { gameState, createDefaultState, resetGameState } from "./state.js";

const SAVE_KEY = "stonehollowSave";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function mergeDefaults(defaultState, savedState) {
  const merged = { ...defaultState };

  for (const key in defaultState) {
    const defaultValue = defaultState[key];
    const savedValue = savedState ? savedState[key] : undefined;

    if (isPlainObject(defaultValue)) {
      merged[key] = mergeDefaults(defaultValue, savedValue || {});
    } else {
      merged[key] = savedValue !== undefined ? savedValue : defaultValue;
    }
  }

  return merged;
}

function applyState(newState) {
  Object.keys(gameState).forEach((key) => {
    delete gameState[key];
  });

  Object.assign(gameState, newState);
}

export function saveGame() {
  console.trace("saveGame called from:");
  localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
  console.log("Game saved:", gameState);
}

export function loadGame() {
  const savedData = localStorage.getItem(SAVE_KEY);

  if (!savedData) {
    console.log("No save found.");
    return false;
  }

  try {
    const savedState = JSON.parse(savedData);
    const defaultState = createDefaultState();
    const mergedState = mergeDefaults(defaultState, savedState);

    applyState(mergedState);

    console.log("Game loaded:", gameState);
    return true;
  } catch (error) {
    console.error("Failed to load save data:", error);
    return false;
  }
}

export function hasSaveGame() {
  return localStorage.getItem(SAVE_KEY) !== null;
}

export function newGame() {
  localStorage.removeItem(SAVE_KEY);
  resetGameState();
  saveGame();
}

export function resetGame() {
  localStorage.removeItem(SAVE_KEY);
  resetGameState();
  location.reload();
}