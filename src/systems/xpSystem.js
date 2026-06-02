addXp("woodcutting", 10);

import { gameState } from "./state.js";
import { saveGame } from "./saveSystem.js";

export function getXpForNextLevel(level) {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function addXp(skillName, amount) {
  const skill = gameState.skills[skillName];

  if (!skill) {
    console.error(`Skill "${skillName}" does not exist.`);
    return;
  }

  skill.xp += amount;

  let leveledUp = false;

  while (skill.level < 20 && skill.xp >= getXpForNextLevel(skill.level)) {
    skill.xp -= getXpForNextLevel(skill.level);
    skill.level += 1;
    leveledUp = true;
  }

  saveGame();

  return {
    level: skill.level,
    xp: skill.xp,
    xpToNext: getXpForNextLevel(skill.level),
    leveledUp,
  };
}

