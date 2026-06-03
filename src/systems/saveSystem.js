import { gameState } from "./state.js";

const SAVE_KEY = "tapSkillRpgSave";

export function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
}

export function loadGame() {
  const savedData = localStorage.getItem(SAVE_KEY);

  if (!savedData) return;

  const parsedData = JSON.parse(savedData);

  Object.assign(gameState, parsedData);

gameState.inventory.logs ??= 0;
gameState.inventory.oakLogs ??= 0;

gameState.equipment ??= {};
gameState.equipment.axe ??= "starterAxe";
gameState.equipment.pickaxe ??= null;
gameState.equipment.weapon ??= null;
gameState.equipment.helmet ??= null;
gameState.equipment.armor ??= null;
}