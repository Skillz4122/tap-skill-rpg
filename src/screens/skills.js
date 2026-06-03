import { renderHomeScreen } from "./home.js";
import { gameState } from "../systems/state.js";
import { getXpForNextLevel } from "../systems/xpSystem.js";

function ensureSkill(skillName) {
  if (!gameState.skills[skillName]) {
    gameState.skills[skillName] = {
      level: 1,
      xp: 0
    };
  }

  return gameState.skills[skillName];
}

function skillCardHTML(label, skillName, icon) {
  const skill = ensureSkill(skillName);

  return `
    <div class="skill-card">
      <span>${icon} ${label}</span>
      <strong>Lv. ${skill.level}</strong>
      <small>XP: ${skill.xp} / ${getXpForNextLevel(skill.level)}</small>
    </div>
  `;
}

export function renderSkillsScreen(app) {
  app.innerHTML = `
    <main class="screen">
      <header class="top-bar">
        <button id="back-button">← Village</button>
        <h2>Skills</h2>
      </header>

      <section class="skills-area">
        <h3>Skill Levels</h3>

        <div class="skills-list">
          ${skillCardHTML("Woodcutting", "woodcutting", "🌲")}
          ${skillCardHTML("Mining", "mining", "⛏️")}
          ${skillCardHTML("Smithing", "smithing", "🔥")}
          ${skillCardHTML("Cooking", "cooking", "🍞")}
          ${skillCardHTML("Combat", "combat", "⚔️")}
        </div>
      </section>
    </main>
  `;

  document.querySelector("#back-button").addEventListener("click", () => {
    renderHomeScreen(app);
  });
}