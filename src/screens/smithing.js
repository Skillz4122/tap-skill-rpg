import { renderHomeScreen } from "./home.js";
import { gameState } from "../systems/state.js";
import { saveGame } from "../systems/saveSystem.js";
import { addXp, getXpForNextLevel } from "../systems/xpSystem.js";
import { smithingRecipes } from "../data/smithingRecipes.js";

function canSmelt(recipe) {
  const smithingLevel = gameState.skills.smithing.level;
  const inputAmountOwned = gameState.inventory[recipe.inputKey] || 0;

  return (
    smithingLevel >= recipe.levelRequired &&
    inputAmountOwned >= recipe.inputAmount
  );
}

function smeltRecipe(recipe) {
  const smithing = gameState.skills.smithing;

  if (smithing.level < recipe.levelRequired) {
    return {
      success: false,
      message: `Requires Smithing Lv. ${recipe.levelRequired}.`
    };
  }

  if ((gameState.inventory[recipe.inputKey] || 0) < recipe.inputAmount) {
    return {
      success: false,
      message: `Not enough ${recipe.inputName}. Need ${recipe.inputAmount}.`
    };
  }

  gameState.inventory[recipe.inputKey] -= recipe.inputAmount;
  gameState.inventory[recipe.outputKey] =
    (gameState.inventory[recipe.outputKey] || 0) + recipe.outputAmount;

  const xpResult = addXp("smithing", recipe.xp);

  saveGame();

  if (xpResult.leveledUp) {
    return {
      success: true,
      message: `Created ${recipe.outputAmount} ${recipe.outputName}. Smithing Level ${xpResult.level}!`
    };
  }

  return {
    success: true,
    message: `Created ${recipe.outputAmount} ${recipe.outputName}. +${recipe.xp} Smithing XP.`
  };
}

function recipeButtonHTML(recipe) {
  const ownedInput = gameState.inventory[recipe.inputKey] || 0;
  const ownedOutput = gameState.inventory[recipe.outputKey] || 0;
  const smithingLevel = gameState.skills.smithing.level;
  const isLocked = smithingLevel < recipe.levelRequired;
  const notEnoughMaterials = ownedInput < recipe.inputAmount;
  const disabled = isLocked || notEnoughMaterials;

  let statusText = "Ready";

  if (isLocked) {
    statusText = `Locked: Requires Smithing Lv. ${recipe.levelRequired}`;
  } else if (notEnoughMaterials) {
    statusText = `Need ${recipe.inputAmount} ${recipe.inputName}`;
  }

  return `
    <div class="smithing-recipe">
      <h3>${recipe.icon} ${recipe.name}</h3>

      <p>Requires: ${recipe.inputAmount} ${recipe.inputName}</p>
      <p>Owned: ${ownedInput} ${recipe.inputName}</p>
      <p>You Have: ${ownedOutput} ${recipe.outputName}</p>
      <p>XP: ${recipe.xp}</p>
      <p>${statusText}</p>

      <button 
        class="smelt-button" 
        data-recipe-id="${recipe.id}"
        ${disabled ? "disabled" : ""}
      >
        Smelt ${recipe.name}
      </button>
    </div>
  `;
}

function updateSmithingScreen(app, message = "Choose a recipe to smelt.") {
  const smithing = gameState.skills.smithing;

  app.innerHTML = `
    <main class="screen">
      <header class="top-bar">
        <button id="back-button">← Village</button>
        <h2>Smithing</h2>
      </header>

      <section class="smithing-area">
        <p id="smithing-level">Smithing Lv. ${smithing.level}</p>

        <p id="smithing-xp">
          XP: ${smithing.xp} / ${getXpForNextLevel(smithing.level)}
        </p>

        <p id="smithing-message">${message}</p>

        <div class="smithing-list">
          ${recipeButtonHTML(smithingRecipes.copperBar)}
          ${recipeButtonHTML(smithingRecipes.ironBar)}
        </div>
      </section>
    </main>
  `;

  document.querySelector("#back-button").addEventListener("click", () => {
    renderHomeScreen(app);
  });

  document.querySelectorAll(".smelt-button").forEach((button) => {
    button.addEventListener("click", () => {
      const recipeId = button.dataset.recipeId;
      const recipe = smithingRecipes[recipeId];

      const result = smeltRecipe(recipe);

      updateSmithingScreen(app, result.message);
    });
  });
}

export function renderSmithingScreen(app) {
  updateSmithingScreen(app);
}