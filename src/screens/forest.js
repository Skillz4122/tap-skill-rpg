import { renderHomeScreen } from "./home.js";
import { gameState } from "../systems/state.js";
import { saveGame } from "../systems/saveSystem.js";

let treeHP = 20;
let maxTreeHP = 20;
let isRespawning = false;

function updateForestUI() {
  document.querySelector("#tree-hp").textContent = `HP: ${treeHP} / ${maxTreeHP}`;

  document.querySelector("#logs").textContent =
    `Logs: ${gameState.inventory.logs}`;

  document.querySelector("#xp").textContent =
    `XP: ${gameState.skills.woodcutting.xp}`;
}

export function renderForestScreen(app) {
  app.innerHTML = `
    <main class="screen">
      <header class="top-bar">
        <button id="back-button">← Village</button>
        <h2>Woodcutting</h2>
      </header>

      <section class="forest-area">
        <h3>Tree</h3>

        <button id="tree-button" class="tree-placeholder">
          🌳
        </button>

        <p id="tree-hp">HP: ${treeHP} / ${maxTreeHP}</p>
        <p id="logs">Logs: ${gameState.inventory.logs}</p>
        <p id="xp">XP: ${gameState.skills.woodcutting.xp}</p>

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

      gameState.inventory.logs += 2;
      gameState.skills.woodcutting.xp += 10;
      saveGame();

      isRespawning = true;

      updateForestUI();

      document.querySelector("#forest-message").textContent =
        "+2 Logs, +10 Woodcutting XP";

      document.querySelector("#tree-button").textContent = "🪵";
      document.querySelector("#tree-button").disabled = true;

      setTimeout(() => {
        treeHP = maxTreeHP;
        isRespawning = false;

        document.querySelector("#tree-button").textContent = "🌳";
        document.querySelector("#tree-button").disabled = false;
        document.querySelector("#forest-message").textContent =
          "A new tree appears.";

        updateForestUI();
      }, 1500);

      return;
    }

    updateForestUI();
  });
}