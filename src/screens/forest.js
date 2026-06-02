export function renderForestScreen(app) {
    app.innerHTML = `
    <main class="screen">
      <header class="top-bar">
        <button class="icon-button" id="back-button">⬅Village</button>
        <h2>Woodcutting</h2>
      </header>

      <section class="forest-area">
       <h3>Tree</h3>

        <div class="tree-placeholder">
          🌳
        </div>

        <p>HP: 20 / 20</p>

        <button id="tree-button">
          Chop Tree
        </button>
      </section>

    </main>
  `;

  document
    .querySelector("#back-button")
    .addEventListener("click", () => {
      console.log("Back To Village");
    });

  document
    .querySelector("#tree-button")
    .addEventListener("click", () => {
      console.log("Chop Tree");
    });
}