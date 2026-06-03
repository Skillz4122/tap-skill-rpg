import { renderHomeScreen } from "./home.js";
import { gameState } from "../systems/state.js";
import { saveGame } from "../systems/saveSystem.js";

function ensurePlayerState() {
  if (!gameState.player) {
    gameState.player = {
      hp: 30,
      maxHp: 30
    };
  }

  if (gameState.player.maxHp === undefined) {
    gameState.player.maxHp = 30;
  }

  if (gameState.player.hp === undefined) {
    gameState.player.hp = gameState.player.maxHp;
  }
}

function ensureEquipmentState() {
  if (!gameState.equipment) {
    gameState.equipment = {
      axe: null,
      pickaxe: null,
      weapon: null,
      helmet: null,
      armor: null
    };
  }
}

function getItemDisplayName(itemId) {
  const itemNames = {
    copperAxe: "Copper Axe",
    copperPickaxe: "Copper Pickaxe",
    copperSword: "Copper Sword"
  };

  return itemNames[itemId] || "None";
}

function getItemIcon(itemId) {
  const itemIcons = {
    copperAxe: "🪓",
    copperPickaxe: "⛏️",
    copperSword: "🗡️"
  };

  return itemIcons[itemId] || "—";
}

function equipItem(itemId) {
  ensureEquipmentState();

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
  ensureEquipmentState();

  if (gameState.equipment.axe === itemId) return "Equipped";
  if (gameState.equipment.pickaxe === itemId) return "Equipped";
  if (gameState.equipment.weapon === itemId) return "Equipped";
  if (gameState.equipment.helmet === itemId) return "Equipped";
  if (gameState.equipment.armor === itemId) return "Equipped";

  return "Equip";
}

function useBread() {
  ensurePlayerState();

  if ((gameState.inventory.bread || 0) <= 0) {
    return "You do not have any Bread.";
  }

  if (gameState.player.hp >= gameState.player.maxHp) {
    return "HP is already full.";
  }

  gameState.inventory.bread -= 1;
  gameState.player.hp += 10;

  if (gameState.player.hp > gameState.player.maxHp) {
    gameState.player.hp = gameState.player.maxHp;
  }

  saveGame();

  return "You ate Bread and restored 10 HP.";
}

export function renderInventoryScreen(app, message = "") {
  ensurePlayerState();
  ensureEquipmentState();

  const equipment = gameState.equipment;

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

        <h3>Consumables</h3>

        <div class="inventory-list">
          <div class="inventory-item">
            <span>🍞 Bread</span>
            <strong>${gameState.inventory.bread || 0}</strong>
            ${
              (gameState.inventory.bread || 0) > 0
                ? `<button class="use-bread-button">Use</button>`
                : ""
            }
          </div>

          <div class="inventory-item">
            <span>❤️ HP</span>
            <strong>${gameState.player.hp} / ${gameState.player.maxHp}</strong>
          </div>
        </div>

        <p id="inventory-message">${message}</p>

        <h3>Equipped Gear</h3>

        <div class="inventory-list">
          <div class="inventory-item">
            <span>${getItemIcon(equipment.axe)} Axe</span>
            <strong>${getItemDisplayName(equipment.axe)}</strong>
          </div>

          <div class="inventory-item">
            <span>${getItemIcon(equipment.pickaxe)} Pickaxe</span>
            <strong>${getItemDisplayName(equipment.pickaxe)}</strong>
          </div>

          <div class="inventory-item">
            <span>${getItemIcon(equipment.weapon)} Weapon</span>
            <strong>${getItemDisplayName(equipment.weapon)}</strong>
          </div>

          <div class="inventory-item">
            <span>🪖 Helmet</span>
            <strong>${getItemDisplayName(equipment.helmet)}</strong>
          </div>

          <div class="inventory-item">
            <span>🛡️ Armor</span>
            <strong>${getItemDisplayName(equipment.armor)}</strong>
          </div>
        </div>

        <h3>Gear</h3>

        <div class="inventory-list">
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
           <div class="inventory-item">
            <span>🪓 Iron Axe</span>
            <strong>${gameState.inventory.ironAxe || 0}</strong>
            ${
              (gameState.inventory.ironAxe || 0) > 0
                ? `<button class="equip-button" data-item-id="ironAxe">${getEquippedLabel("ironAxe")}</button>`
                : ""
            }
          </div>

          <div class="inventory-item">
            <span>⛏️ Iron Pickaxe</span>
            <strong>${gameState.inventory.ironPickaxe || 0}</strong>
            ${
              (gameState.inventory.ironPickaxe || 0) > 0
                ? `<button class="equip-button" data-item-id="ironPickaxe">${getEquippedLabel("ironPickaxe")}</button>`
                : ""
            }
          </div>

          <div class="inventory-item">
            <span>🗡️ Iron Sword</span>
            <strong>${gameState.inventory.ironSword || 0}</strong>
            ${
              (gameState.inventory.ironSword || 0) > 0
                ? `<button class="equip-button" data-item-id="ironSword">${getEquippedLabel("ironSword")}</button>`
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

  document.querySelectorAll(".equip-button").forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.dataset.itemId;

      equipItem(itemId);

      renderInventoryScreen(app);
    });
  });

  const useBreadButton = document.querySelector(".use-bread-button");

  if (useBreadButton) {
    useBreadButton.addEventListener("click", () => {
      const resultMessage = useBread();

      renderInventoryScreen(app, resultMessage);
    });
  }
}