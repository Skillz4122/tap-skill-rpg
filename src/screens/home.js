import { gameState } from "../systems/state.js";
import { renderForestScreen } from "./forest.js";

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
          <button class="activity-button" disabled>⛏️ Mine</button>
          <button class="activity-button" disabled>🔨 Blacksmith</button>
          <button class="activity-button" disabled>🕳️ Dungeon</button>
          <button class="activity-button" disabled>🏪 Merchant</button>
          <button class="activity-button" disabled>🎒 Inventory</button>
        </div>
      </section>

      <nav class="bottom-nav">
        <button>Village</button>
        <button>Inventory</button>
        <button>Dungeon</button>
        <button>Merchant</button>
        <button>Tasks</button>
      </nav>
    </main>
  `;

  document.querySelector("#forest-button").addEventListener("click", () => {
    renderForestScreen(app);
  });
}