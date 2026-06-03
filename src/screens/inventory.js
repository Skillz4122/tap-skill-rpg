import { renderHomeScreen } from "./home.js";
import { gameState } from "../systems/state.js";

export function renderInventoryScreen(app) {
  app.innerHTML = `
    <main class="screen">
      <header class="top-bar">
        <button id="back-button">← Village</button>
        <h2>Inventory</h2>
      </header>

      <section class="inventory-area">
        <h3>Resources</h3>

        <div class="inventory-list">
          <div class="inventory-item">
            <span>🪵 Logs</span>
            <strong>${gameState.inventory.logs || 0}</strong>
          </div>

          <div class="inventory-item">
            <span>🌳 Oak Logs</span>
            <strong>${gameState.inventory.oakLogs || 0}</strong>
          </div>

          <div class="inventory-item">
            <span>🟠 Copper Ore</span>
            <strong>${gameState.inventory.copperOre || 0}</strong>
          </div>

          <div class="inventory-item">
            <span>🪨 Iron Ore</span>
            <strong>${gameState.inventory.ironOre || 0}</strong>
          </div>

          <div class="inventory-item">
            <span>🔶 Copper Bar</span>
            <strong>${gameState.inventory.copperBar || 0}</strong>
          </div>

          <div class="inventory-item">
            <span>🔘 Iron Bar</span>
            <strong>${gameState.inventory.ironBar || 0}</strong>
          </div>
        </div>
      </section>
    </main>
  `;

  document.querySelector("#back-button").addEventListener("click", () => {
    renderHomeScreen(app);
  });
}