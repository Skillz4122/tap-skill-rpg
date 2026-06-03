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

function getAxeDamage() {
  if (gameState.equipment && gameState.equipment.axe === "copperAxe") {
    return 2;
  }

  return 1;
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

    const woodcuttingPower = document.querySelector("#woodcutting-power");

if (woodcuttingPower) {
  woodcuttingPower.textContent = `Power: ${getAxeDamage()}`;
}
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
 <div class="forest-stats">
  <div class="forest-stat-card" id="woodcutting-level">
    Woodcutting Lv. ${woodcutting.level}
  </div>

  <div class="forest-stat-card" id="xp">
    XP: ${woodcutting.xp} / ${getXpForNextLevel(woodcutting.level)}
  </div>

  <div class="forest-stat-card" id="tree-hp">
    HP: ${treeHP} / ${maxTreeHP}
  </div>

  <div class="forest-stat-card" id="woodcutting-power">
  Power: ${getAxeDamage()}
</div>
</div>

<h3 id="tree-name">${currentTree.name}</h3>

<button id="tree-button" class="tree-placeholder">
  ${currentTree.icon}
</button>

  <p id="forest-message">Tap the tree to chop wood.</p>
</section>
    </main>
  `;

  document.querySelector("#back-button").addEventListener("click", () => {
    renderHomeScreen(app);
  });

  document.querySelector("#tree-button").addEventListener("click", () => {
    if (isRespawning) return;

    treeHP -= getAxeDamage();

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
  const treeButton = document.querySelector("#tree-button");
  const forestMessage = document.querySelector("#forest-message");

  if (!treeButton || !forestMessage) {
    isRespawning = false;
    return;
  }

  spawnTree();

  isRespawning = false;

  treeButton.textContent = currentTree.icon;
  treeButton.disabled = false;

  forestMessage.textContent = `A new ${currentTree.name} appears.`;

  updateForestUI();
}, 1500);

      return;
    }

    updateForestUI();
  });
}