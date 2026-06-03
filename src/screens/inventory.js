import { renderHomeScreen } from "./home.js";
import { gameState } from "../systems/state.js";

function equipItem(itemId) {
  if (itemId === "copperAxe") {
    gameState.equipment.axe = "copperAxe";
  }

  if (itemId === "copperPickaxe") {
    gameState.equipment.pickaxe = "copperPickaxe";
  }

  if (itemId === "copperSword") {
    gameState.equipment.weapon = "copperSword";
  }

  saveGame();
}

function getEquippedLabel(itemId) {
  if (gameState.equipment.axe === itemId) return "Equipped";
  if (gameState.equipment.pickaxe === itemId) return "Equipped";
  if (gameState.equipment.weapon === itemId) return "Equipped";
  return "Equip";
}

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

         <div class="inventory-item">
  <span>🪓 Copper Axe</span>
  <strong>${gameState.inventory.copperAxe || 0}</strong>
  ${
    (gameState.inventory.copperAxe || 0) > 0
      ? `<button class="equip-button" data-item-id="copperAxe">${getEquippedLabel("copperAxe")}</button>`
      : ""
  }
</div>

<div class="inventory-item">
  <span>⛏️ Copper Pickaxe</span>
  <strong>${gameState.inventory.copperPickaxe || 0}</strong>
  ${
    (gameState.inventory.copperPickaxe || 0) > 0
      ? `<button class="equip-button" data-item-id="copperPickaxe">${getEquippedLabel("copperPickaxe")}</button>`
      : ""
  }
</div>

<div class="inventory-item">
  <span>🗡️ Copper Sword</span>
  <strong>${gameState.inventory.copperSword || 0}</strong>
  ${
    (gameState.inventory.copperSword || 0) > 0
      ? `<button class="equip-button" data-item-id="copperSword">${getEquippedLabel("copperSword")}</button>`
      : ""
  }
</div>
        </div>
      </section>
    </main>
  `;

  document.querySelector("#back-button").addEventListener("click", () => {
    renderHomeScreen(app);
  });
}