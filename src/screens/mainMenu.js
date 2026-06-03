import { renderHomeScreen } from "./home.js";
import { hasSaveGame, loadGame, newGame } from "../systems/saveSystem.js";

export function renderMainMenu(app) {
  const saveExists = hasSaveGame();

  app.innerHTML = `
    <main class="screen">
      <section class="main-menu-card">
        <h1>Stonehollow</h1>
        <h2>Awakening</h2>

        <p>A frontier village stirs as old dangers return.</p>

        <div class="main-menu-actions">
          <button 
            id="load-game-button" 
            class="main-menu-button"
            ${saveExists ? "" : "disabled"}
          >
            Load Game
          </button>

          <button id="new-game-button" class="main-menu-button danger-button">
            New Game
          </button>
        </div>

        <p class="main-menu-note">
          ${
            saveExists
              ? "Save found. Continue from your latest progress."
              : "No save found. Start a new game."
          }
        </p>
      </section>
    </main>
  `;

  const loadButton = document.querySelector("#load-game-button");

  if (loadButton) {
    loadButton.addEventListener("click", () => {
      const loaded = loadGame();

      if (loaded) {
        renderHomeScreen(app);
      } else {
        alert("No save file found.");
        renderMainMenu(app);
      }
    });
  }

  document.querySelector("#new-game-button").addEventListener("click", () => {
    const confirmed = confirm(
      "Start a new game? This will permanently erase your current save."
    );

    if (!confirmed) return;

    newGame();
    renderHomeScreen(app);
  });
}