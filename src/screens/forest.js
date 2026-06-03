import { renderHomeScreen } from "./home.js";
import { gameState } from "../systems/state.js";
import { saveGame } from "../systems/saveSystem.js";
import { addXp, getXpForNextLevel } from "../systems/xpSystem.js";
import { trees } from "../data/trees.js";

let currentTree = trees.tree;
let treeHP = randomBetween(currentTree.hpMin, currentTree.hpMax);
let maxTreeHP = treeHP;
let isRespawning = false;

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function spawnTree() {
  const woodcuttingLevel = gameState.skills.woodcutting.level;

  if (woodcuttingLevel >= 10) {
    currentTree = trees.oakTree;
  } else {
    currentTree = trees.tree;
  }

  treeHP = randomBetween(currentTree.hpMin, currentTree.hpMax);
  maxTreeHP = treeHP;
}

function canUseTree(tree) {
  return gameState.skills.woodcutting.level >= tree.levelRequired;
}

function updateForestUI() {
  const woodcutting = gameState.skills.woodcutting;

  document.querySelector("#woodcutting-level").textContent =
    `Woodcutting Lv. ${woodcutting.level}`;

  document.querySelector("#tree-name").textContent = currentTree.name;

  document.querySelector("#tree-hp").textContent =
    `HP: ${treeHP} / ${maxTreeHP}`;

  document.querySelector("#xp").textContent =
    `XP: ${woodcutting.xp} / ${getXpForNextLevel(woodcutting.level)}`;
}

export function renderForestScreen(app) {
  const woodcutting = gameState.skills.woodcutting;

  app.innerHTML = `
    <main class="screen">
      <header class="top-bar">
        <button id="back-button">← Village</button>
        <h2>Woodcutting</h2>
      </header>

     <section class="forest-area">
  <p id="woodcutting-level">Woodcutting Lv. ${woodcutting.level}</p>


  <h3 id="tree-name">${currentTree.name}</h3>

  <button id="tree-button" class="tree-placeholder">
    ${currentTree.icon}
  </button>

  <p id="tree-hp">HP: ${treeHP} / ${maxTreeHP}</p>

  <p id="xp">
    XP: ${woodcutting.xp} / ${getXpForNextLevel(woodcutting.level)}
  </p>

  <p id="forest-message">Tap the tree to chop wood.</p>
</section>
    </main>
  `;

  document.querySelector("#back-button").addEventListener("click", () => {
    renderHomeScreen(app);
  });

  document.querySelector("#tree-button").addEventListener("click", () => {
    if (isRespawning) return;

    treeHP -= 1;

    if (treeHP <= 0) {
      treeHP = 0;

      const dropsEarned = randomBetween(
        currentTree.dropMin,
        currentTree.dropMax
      );

      gameState.inventory[currentTree.inventoryKey] += dropsEarned;

      const xpResult = addXp("woodcutting", currentTree.xp);

      saveGame();

      isRespawning = true;

      updateForestUI();

    if (xpResult.leveledUp) {

  if (
    xpResult.level === 10 &&
    currentTree.id === "tree"
  ) {
    spawnTree();

    document.querySelector("#forest-message")
      .textContent =
      "Oak Trees Unlocked!";
  }
  else {
    document.querySelector("#forest-message")
      .textContent =
      `Woodcutting Level ${xpResult.level}!`;
  }
}

      document.querySelector("#tree-button").textContent = currentTree.brokenIcon;
      document.querySelector("#tree-button").disabled = true;

      setTimeout(() => {
        spawnTree();

        isRespawning = false;

        document.querySelector("#tree-button").textContent = currentTree.icon;
        document.querySelector("#tree-button").disabled = false;
        document.querySelector("#forest-message").textContent =
          `A new ${currentTree.name} appears.`;

        updateForestUI();
      }, 1500);

      return;
    }

    updateForestUI();
  });
}