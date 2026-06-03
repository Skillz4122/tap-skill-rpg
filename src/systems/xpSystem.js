import { gameState } from "./state.js";

export function getXpForNextLevel(level) {
  return level * 100;
}

export function addXp(skillName, xpAmount) {
  const skill = gameState.skills[skillName];

  if (!skill) {
    console.error(`Skill not found: ${skillName}`);
    return {
      leveledUp: false,
      level: 1
    };
  }

  skill.xp += xpAmount;

  let leveledUp = false;

  while (skill.xp >= getXpForNextLevel(skill.level)) {
    skill.xp -= getXpForNextLevel(skill.level);
    skill.level += 1;
    leveledUp = true;
  }

  return {
    leveledUp,
    level: skill.level
  };
}