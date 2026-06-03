import { renderHomeScreen } from "./home.js";
import { gameState } from "../systems/state.js";
import { saveGame } from "../systems/saveSystem.js";
import { addXp, getXpForNextLevel } from "../systems/xpSystem.js";
import { monsters } from "../data/monsters.js";

let currentMonster = monsters.goblin;
let monsterHP = randomBetween(currentMonster.hpMin, currentMonster.hpMax);
let maxMonsterHP = monsterHP;
let isRespawning = false;
let monsterAttackTimer = null;

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

function spawnMonster() {
  currentMonster = monsters.goblin;

  monsterHP = randomBetween(currentMonster.hpMin, currentMonster.hpMax);
  maxMonsterHP = monsterHP;
}

function getWeaponDamage() {
  if (gameState.equipment && gameState.equipment.weapon === "copperSword") {
    return 2;
  }

  return 1;
}

function stopMonsterAttackTimer() {
  if (monsterAttackTimer) {
    clearInterval(monsterAttackTimer);
    monsterAttackTimer = null;
  }
}

function updateCombatUI() {
  ensurePlayerState();

  const combat = gameState.skills.combat;

  const combatLevel = document.querySelector("#combat-level");
  const monsterName = document.querySelector("#monster-name");
  const monsterHp = document.querySelector("#monster-hp");
  const xp = document.querySelector("#xp");
  const gold = document.querySelector("#gold");
  const playerHp = document.querySelector("#player-hp");
  const weaponDamage = document.querySelector("#weapon-damage");

  if (combatLevel) {
    combatLevel.textContent = `Combat Lv. ${combat.level}`;
  }

  if (monsterName) {
    monsterName.textContent = currentMonster.name;
  }

  if (monsterHp) {
    monsterHp.textContent = `Enemy HP: ${monsterHP} / ${maxMonsterHP}`;
  }

  if (xp) {
    xp.textContent =
      `XP: ${combat.xp} / ${getXpForNextLevel(combat.level)}`;
  }

  if (gold) {
    gold.textContent = `Gold: ${gameState.gold || 0}`;
  }

  if (playerHp) {
    playerHp.textContent =
      `HP: ${gameState.player.hp} / ${gameState.player.maxHp}`;
  }

  if (weaponDamage) {
    weaponDamage.textContent = `Damage: ${getWeaponDamage()}`;
  }
}

function resetFightAfterDefeat() {
  stopMonsterAttackTimer();

  gameState.player.hp = gameState.player.maxHp;

  spawnMonster();

  isRespawning = false;

  saveGame();

  const monsterButton = document.querySelector("#monster-button");
  const combatMessage = document.querySelector("#combat-message");

  if (monsterButton) {
    monsterButton.textContent = currentMonster.icon;
    monsterButton.disabled = false;
  }

  if (combatMessage) {
    combatMessage.textContent =
      "You were knocked out and returned to your feet. The fight resets.";
  }

  updateCombatUI();

  startMonsterAttackTimer();
}

function monsterAttack() {
  if (isRespawning) return;

  const combatMessage = document.querySelector("#combat-message");

  if (!document.querySelector("#monster-button")) {
    stopMonsterAttackTimer();
    return;
  }

  const damage = randomBetween(
    currentMonster.damageMin,
    currentMonster.damageMax
  );

  gameState.player.hp -= damage;

  if (gameState.player.hp < 0) {
    gameState.player.hp = 0;
  }

  if (gameState.player.hp <= 0) {
    if (combatMessage) {
      combatMessage.textContent =
        `${currentMonster.name} hit you for ${damage}. You were knocked out!`;
    }

    updateCombatUI();

    setTimeout(() => {
      if (!document.querySelector("#monster-button")) {
        stopMonsterAttackTimer();
        return;
      }

      resetFightAfterDefeat();
    }, 1200);

    return;
  }

  if (combatMessage) {
    combatMessage.textContent =
      `${currentMonster.name} hits you for ${damage} damage.`;
  }

  saveGame();
  updateCombatUI();
}

function startMonsterAttackTimer() {
  stopMonsterAttackTimer();

  monsterAttackTimer = setInterval(() => {
    monsterAttack();
  }, currentMonster.attackSpeed);
}

export function renderCombatScreen(app) {
  ensurePlayerState();

  const combat = gameState.skills.combat;

  stopMonsterAttackTimer();

  app.innerHTML = `
    <main class="screen">
      <header class="top-bar">
        <button id="back-button">← Village</button>
        <h2>Combat</h2>
      </header>

      <section class="combat-area">
        <div class="combat-stats">
          <div class="combat-stat-card" id="combat-level">
            Combat Lv. ${combat.level}
          </div>

          <div class="combat-stat-card" id="gold">
            Gold: ${gameState.gold || 0}
          </div>

          <div class="combat-stat-card" id="player-hp">
            HP: ${gameState.player.hp} / ${gameState.player.maxHp}
          </div>

          <div class="combat-stat-card" id="weapon-damage">
            Damage: ${getWeaponDamage()}
          </div>

          <div class="combat-stat-card" id="monster-hp">
            Enemy HP: ${monsterHP} / ${maxMonsterHP}
          </div>

          <div class="combat-stat-card" id="xp">
            XP: ${combat.xp} / ${getXpForNextLevel(combat.level)}
          </div>
        </div>

        <h3 id="monster-name">${currentMonster.name}</h3>

        <button id="monster-button" class="monster-placeholder">
          ${currentMonster.icon}
        </button>

        <p id="combat-message">Tap the monster to attack.</p>
      </section>
    </main>
  `;

  document.querySelector("#back-button").addEventListener("click", () => {
    stopMonsterAttackTimer();
    renderHomeScreen(app);
  });

  document.querySelector("#monster-button").addEventListener("click", () => {
    if (isRespawning) return;

    monsterHP -= getWeaponDamage();

    if (monsterHP < 0) {
      monsterHP = 0;
    }

    if (monsterHP <= 0) {
      monsterHP = 0;

      const goldEarned = randomBetween(
        currentMonster.goldMin,
        currentMonster.goldMax
      );

      gameState.gold = (gameState.gold || 0) + goldEarned;

      const xpResult = addXp("combat", currentMonster.xp);

      saveGame();

      isRespawning = true;

      stopMonsterAttackTimer();

      updateCombatUI();

      const combatMessage = document.querySelector("#combat-message");

      if (xpResult.leveledUp) {
        combatMessage.textContent =
          `Combat Level ${xpResult.level}! +${goldEarned} Gold`;
      } else {
        combatMessage.textContent =
          `Defeated ${currentMonster.name}! +${goldEarned} Gold | +${currentMonster.xp} Combat XP`;
      }

      const monsterButton = document.querySelector("#monster-button");

      monsterButton.textContent = currentMonster.deadIcon;
      monsterButton.disabled = true;

      setTimeout(() => {
        const monsterButton = document.querySelector("#monster-button");
        const combatMessage = document.querySelector("#combat-message");

        if (!monsterButton || !combatMessage) {
          isRespawning = false;
          stopMonsterAttackTimer();
          return;
        }

        spawnMonster();

        isRespawning = false;

        monsterButton.textContent = currentMonster.icon;
        monsterButton.disabled = false;

        combatMessage.textContent = `A new ${currentMonster.name} appears.`;

        updateCombatUI();

        startMonsterAttackTimer();
      }, 1500);

      return;
    }

    updateCombatUI();
  });

  updateCombatUI();
  startMonsterAttackTimer();
}