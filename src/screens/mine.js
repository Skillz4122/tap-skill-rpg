import { renderHomeScreen } from "./home.js";
import { gameState } from "../systems/state.js";
import { saveGame } from "../systems/saveSystem.js";
import { addXp, getXpForNextLevel } from "../systems/xpSystem.js";
import { rocks } from "../data/rocks.js";

let currentRock = rocks.copperRock;
let rockHP = randomBetween(currentRock.hpMin, currentRock.hpMax);
let maxRockHP = rockHP;
let isRespawning = false;

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function spawnRock() {
  const miningLevel = gameState.skills.mining.level;

  if (miningLevel >= 10) {
    currentRock = rocks.ironRock;
  } else {
    currentRock = rocks.copperRock;
  }

  rockHP = randomBetween(currentRock.hpMin, currentRock.hpMax);
  maxRockHP = rockHP;
}

function getOreName(inventoryKey) {
  if (inventoryKey === "copperOre") return "Copper Ore";
  if (inventoryKey === "ironOre") return "Iron Ore";
  return "Ore";
}

function updateMineUI() {
  const mining = gameState.skills.mining;

  document.querySelector("#mining-level").textContent =
    `Mining Lv. ${mining.level}`;

  document.querySelector("#rock-name").textContent = currentRock.name;

  document.querySelector("#rock-hp").textContent =
    `HP: ${rockHP} / ${maxRockHP}`;

  document.querySelector("#xp").textContent =
    `XP: ${mining.xp} / ${getXpForNextLevel(mining.level)}`;
}

export function renderMineScreen(app) {
  const mining = gameState.skills.mining;

  spawnRock();

app.innerHTML = `
  <main class="screen">
    <header class="top-bar">
      <button id="back-button">← Village</button>
      <h2>Mining</h2>
    </header>

    <section class="mine-area">
      <p id="mining-level">Mining Lv. ${mining.level}</p>

      <h3 id="rock-name">${currentRock.name}</h3>

      <button id="rock-button" class="rock-placeholder">
        ${currentRock.icon}
      </button>

      <p id="rock-hp">HP: ${rockHP} / ${maxRockHP}</p>

      <p id="xp">
        XP: ${mining.xp} / ${getXpForNextLevel(mining.level)}
      </p>

      <p id="mine-message">Tap the rock to mine ore.</p>
    </section>
  </main>
`;

  document.querySelector("#back-button").addEventListener("click", () => {
    renderHomeScreen(app);
  });

  document.querySelector("#rock-button").addEventListener("click", () => {
    if (isRespawning) return;

    rockHP -= 1;

    if (rockHP <= 0) {
      rockHP = 0;

      const dropsEarned = randomBetween(
        currentRock.dropMin,
        currentRock.dropMax
      );

      gameState.inventory[currentRock.inventoryKey] += dropsEarned;

      const xpResult = addXp("mining", currentRock.xp);

      saveGame();

      isRespawning = true;

      updateMineUI();

      if (xpResult.leveledUp) {
        if (
          xpResult.level === 10 &&
          currentRock.id === "copperRock"
        ) {
          document.querySelector("#mine-message").textContent =
            "Iron Rocks Unlocked!";
        } else {
          document.querySelector("#mine-message").textContent =
            `Mining Level ${xpResult.level}!`;
        }
      } else {
        document.querySelector("#mine-message").textContent =
          `+${dropsEarned} ${getOreName(currentRock.inventoryKey)} | +${currentRock.xp} Mining XP`;
      }

      document.querySelector("#rock-button").textContent =
        currentRock.brokenIcon;

      document.querySelector("#rock-button").disabled = true;

      setTimeout(() => {
        spawnRock();

        isRespawning = false;

        document.querySelector("#rock-button").textContent =
          currentRock.icon;

        document.querySelector("#rock-button").disabled = false;

        document.querySelector("#mine-message").textContent =
          `A new ${currentRock.name} appears.`;

        updateMineUI();
      }, 1500);

      return;
    }

    updateMineUI();
  });
}