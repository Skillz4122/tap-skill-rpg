import { renderHomeScreen } from "./home.js";
import { gameState } from "../systems/state.js";
import { saveGame } from "../systems/saveSystem.js";
import { addXp, getXpForNextLevel } from "../systems/xpSystem.js";
import { cookingRecipes } from "../data/cookingRecipes.js";

function ensureCookingState() {
  if (!gameState.skills.cooking) {
    gameState.skills.cooking = {
      level: 1,
      xp: 0
    };
  }

  if (gameState.inventory.bread === undefined) {
    gameState.inventory.bread = 0;
  }
}

function cookRecipe(recipe) {
  ensureCookingState();

  const cooking = gameState.skills.cooking;
  const ownedInput = gameState.inventory[recipe.inputKey] || 0;

  if (cooking.level < recipe.levelRequired) {
    return `Requires Cooking Lv. ${recipe.levelRequired}.`;
  }

  if (ownedInput < recipe.inputAmount) {
    return `Not enough ${recipe.inputName}. Need ${recipe.inputAmount}.`;
  }

  gameState.inventory[recipe.inputKey] -= recipe.inputAmount;

  gameState.inventory[recipe.outputKey] =
    (gameState.inventory[recipe.outputKey] || 0) + recipe.outputAmount;

  const xpResult = addXp("cooking", recipe.xp);

  saveGame();

  if (xpResult.leveledUp) {
    return `Cooked ${recipe.outputAmount} ${recipe.outputName}. Cooking Level ${xpResult.level}!`;
  }

  return `Cooked ${recipe.outputAmount} ${recipe.outputName}. +${recipe.xp} Cooking XP.`;
}

function recipeHTML(recipe) {
  const cooking = gameState.skills.cooking;
  const ownedInput = gameState.inventory[recipe.inputKey] || 0;
  const ownedOutput = gameState.inventory[recipe.outputKey] || 0;

  const isLocked = cooking.level < recipe.levelRequired;
  const notEnoughMaterials = ownedInput < recipe.inputAmount;
  const disabled = isLocked || notEnoughMaterials;

  let statusText = "Ready";

  if (isLocked) {
    statusText = `Locked: Requires Cooking Lv. ${recipe.levelRequired}`;
  } else if (notEnoughMaterials) {
    statusText = `Need ${recipe.inputAmount} ${recipe.inputName}`;
  }

  return `
    <div class="cooking-recipe">
      <h3>${recipe.icon} ${recipe.name}</h3>

      <p>Requires: ${recipe.inputAmount} ${recipe.inputName}</p>
      <p>Owned: ${ownedInput} ${recipe.inputName}</p>
      <p>You Have: ${ownedOutput} ${recipe.outputName}</p>
      <p>Heals: ${recipe.healAmount} HP</p>
      <p>XP: ${recipe.xp}</p>
      <p>${statusText}</p>

      <button 
        class="cooking-button" 
        data-recipe-id="${recipe.id}"
        ${disabled ? "disabled" : ""}
      >
        Cook ${recipe.name}
      </button>
    </div>
  `;
}

function updateCookingScreen(app, message = "Choose a recipe to cook.") {
  ensureCookingState();

  const cooking = gameState.skills.cooking;

  app.innerHTML = `
    <main class="screen">
      <header class="top-bar">
        <button id="back-button">← Village</button>
        <h2>Cooking</h2>
      </header>

      <section class="cooking-area">
        <div class="cooking-stats">
          <div class="cooking-stat-card" id="cooking-level">
            Cooking Lv. ${cooking.level}
          </div>

          <div class="cooking-stat-card" id="xp">
            XP: ${cooking.xp} / ${getXpForNextLevel(cooking.level)}
          </div>
        </div>

        <p id="cooking-message">${message}</p>

        <div class="cooking-list">
          ${recipeHTML(cookingRecipes.bread)}
        </div>
      </section>
    </main>
  `;

  document.querySelector("#back-button").addEventListener("click", () => {
    renderHomeScreen(app);
  });

  document.querySelectorAll(".cooking-button").forEach((button) => {
    button.addEventListener("click", () => {
      const recipeId = button.dataset.recipeId;
      const recipe = cookingRecipes[recipeId];

      const resultMessage = cookRecipe(recipe);

      updateCookingScreen(app, resultMessage);
    });
  });
}

export function renderCookingScreen(app) {
  updateCookingScreen(app);
}