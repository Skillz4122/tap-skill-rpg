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

      <p id="tree-hp">HP: 20/20</p>
      <p id="logs">Logs: 0</p>
      <p id="xp">XP: 0</p>

        <button id="tree-button">
          Chop Tree
        </button>
      </section>

    </main>
  `;

  let treeHP = 20;
  let logs = 0;
  let xp = 0;

  function updateForestUI() {
  document.querySelector("#tree-hp").textContent =
    `HP: ${treeHP}/20`;
  if (treeHP <= 0) {

  logs += 2;
  xp += 10;

  document.querySelector("#tree-button")
    .disabled = true;

  document.querySelector("#tree-hp")
    .textContent = "Tree Cut Down";

  setTimeout(() => {

    treeHP = 20;

    document.querySelector("#tree-button")
      .disabled = false;

    updateForestUI();

  }, 1500);
}

  document.querySelector("#logs").textContent =
    `Logs: ${logs}`;

  document.querySelector("#xp").textContent =
    `XP: ${xp}`;
}


  document
    .querySelector("#back-button")
    .addEventListener("click", () => {
      console.log("Back To Village");
    });

 document
  .querySelector("#tree-button")
  .addEventListener("click", () => {

    treeHP--;

    updateForestUI();

  });

}