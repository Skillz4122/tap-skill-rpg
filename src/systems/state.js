export const gameState = {
  gold: 0,

  inventory: {
    logs: 0,
    oakLogs: 0,
    copperOre: 0,
    ironOre: 0,
    copperBar: 0,
    ironBar: 0,
  },

    equipment: {
    axe: "starterAxe",
    pickaxe: null,
    weapon: null,
    helmet: null,
    armor: null,
  },

  skills: {
    woodcutting: {
      level: 1,
      xp: 0,
    },
    mining: {
      level: 1,
      xp: 0,
    },
    smithing: {
      level: 1,
      xp: 0,
    },
    combat: {
      level: 1,
      xp: 0,
    },
  },
};