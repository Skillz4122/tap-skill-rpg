import { gameState } from "../systems/state.js";
import { renderForestScreen } from "./forest.js";
import { renderMineScreen } from "./mine.js";
import { renderInventoryScreen } from "./inventory.js";
import { renderSmithingScreen } from "./smithing.js";
import { renderCombatScreen } from "./combat.js";
import { renderCookingScreen } from "./cooking.js";
import { renderSkillsScreen } from "./skills.js";

export function renderHomeScreen(app) {
  app.innerHTML = `
    <main class="screen home-screen">
      <header class="top-bar">
        <div>
          <h1>Frontier Skiller</h1>
          <p>Gold: ${gameState.gold}</p>
        </div>
        <button class="icon-button">⚙️</button>
      </header>

      <section class="village-card">
        <h2>Village</h2>
        <p>A small frontier village waiting to be rebuilt.</p>

        <div class="activity-grid">
          <button class="activity-button" id="forest-button">🌲 Forest</button>
          <button class="activity-button" id="mine-button">⛏️ Mine</button>
          <button class="activity-button" id="smithing-button">🔨 Blacksmith</button>
          <button id="combat-button" class="activity-button">⚔️ Combat</button>          
          <button class="activity-button" disabled>🏪 Merchant</button>
          <button class="activity-button" id="inventory-button">🎒 Inventory</button>     
          <button id="cooking-button" class="activity-button">🍞 Cooking</button>
          <button id="skills-button" class="activity-button">📊 Skills</button>
          </section>
          
    </div>
          </main>
  `;

  document.querySelector("#combat-button").addEventListener("click", () => {
  renderCombatScreen(app);
});

  document.querySelector("#forest-button").addEventListener("click", () => {
    renderForestScreen(app);
  });

  document.querySelector("#inventory-button").addEventListener("click", () => {
  renderInventoryScreen(app);
});

document.querySelector("#mine-button").addEventListener("click", () => {
  renderMineScreen(app);
});

document.querySelector("#smithing-button").addEventListener("click", () => {
  renderSmithingScreen(app);
});

document.querySelector("#cooking-button").addEventListener("click", () => {
  renderCookingScreen(app);
});

document.querySelector("#skills-button").addEventListener("click", () => {
  renderSkillsScreen(app);
});
}