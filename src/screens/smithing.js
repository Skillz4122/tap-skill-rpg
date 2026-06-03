import { gameState } from "../systems/state.js";
import { saveGame } from "../systems/saveSystem.js";
import { addXp } from "../systems/xpSystem.js";
import { smithingRecipes } from "../data/smithingRecipes.js";
import { renderHomeScreen } from "./home.js";

function recipeButtonHTML(recipe) {
  if (!recipe) {
    console.error("Missing smithing recipe passed to recipeButtonHTML");
    return "";
  }

  const playerLevel = gameState.skills.smithing.level;
  const ownedInput = gameState.inventory[recipe.inputKey] ?? 0;

  const hasLevel = playerLevel >= recipe.levelRequired;
  const hasMaterials = ownedInput >= recipe.inputAmount;

  const disabled = !hasLevel || !hasMaterials ? "disabled" : "";

  let requirementText = "Ready to craft";

  if (!hasLevel) {
    requirementText = `Requires Smithing Lv. ${recipe.levelRequired}`;
  } else if (!hasMaterials) {
    requirementText = `Need ${recipe.inputAmount} ${recipe.inputKey}`;
  }

  return `
    <div class="card">
      <h3>${recipe.name}</h3>
      <p>Cost: ${recipe.inputAmount} ${recipe.inputKey}</p>
      <p>Creates: ${recipe.outputAmount} ${recipe.outputKey}</p>
      <p>XP: ${recipe.xp}</p>
      <p>${requirementText}</p>
      <button id="craft-${recipe.id}" ${disabled}>Craft</button>
    </div>
  `;
}

function craftRecipe(recipe) {
  const playerLevel = gameState.skills.smithing.level;
  const ownedInput = gameState.inventory[recipe.inputKey] ?? 0;

  if (playerLevel < recipe.levelRequired) {
    return;
  }

  if (ownedInput < recipe.inputAmount) {
    return;
  }

  gameState.inventory[recipe.inputKey] -= recipe.inputAmount;

  if (gameState.inventory[recipe.outputKey] === undefined) {
    gameState.inventory[recipe.outputKey] = 0;
  }

  gameState.inventory[recipe.outputKey] += recipe.outputAmount;

 addXp("smithing", recipe.xp);

  saveGame();
  updateSmithingScreen();
}

function updateSmithingScreen() {
  const app = document.querySelector("#app");

  const recipeButtonsHTML = smithingRecipes
    .map((recipe) => recipeButtonHTML(recipe))
    .join("");

  app.innerHTML = `
    <div class="screen">
      <h1>Smithing</h1>

      <p>Smithing Level: ${gameState.skills.smithing.level}</p>
      <p>Smithing XP: ${gameState.skills.smithing.xp}</p>

      <h2>Resources</h2>
      <p>Logs: ${gameState.inventory.logs ?? 0}</p>
      <p>Oak Logs: ${gameState.inventory.oakLogs ?? 0}</p>
      <p>Copper Ore: ${gameState.inventory.copperOre ?? 0}</p>
      <p>Iron Ore: ${gameState.inventory.ironOre ?? 0}</p>
      <p>Copper Bars: ${gameState.inventory.copperBar ?? 0}</p>
      <p>Iron Bars: ${gameState.inventory.ironBar ?? 0}</p>

      <h2>Recipes</h2>
      ${recipeButtonsHTML}

      <button id="back-to-village-button">Back to Village</button>
    </div>
  `;

  document.querySelector("#back-to-village-button").addEventListener("click", () => {
    renderHomeScreen();
  });

  smithingRecipes.forEach((recipe) => {
    const button = document.querySelector(`#craft-${recipe.id}`);

    if (!button) {
      return;
    }

    button.addEventListener("click", () => {
      craftRecipe(recipe);
    });
  });
}

export function renderSmithingScreen() {
  updateSmithingScreen();
}