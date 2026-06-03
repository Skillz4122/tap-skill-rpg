export const gameState = {
  gold: 0,

  player: {
    hp: 30,
    manHP: 30
  },

  inventory: {
    logs: 0,
    oakLogs: 0,
    copperOre: 0,
    ironOre: 0,
    copperBar: 0,
    ironBar: 0,
    copperAxe: 0,
    copperPickaxe: 0,
    copperSword: 0
  },

  skills: {
    woodcutting: {
      level: 1,
      xp: 0
    },

    mining: {
      level: 1,
      xp: 0
    },

    smithing: {
      level: 1,
      xp: 0
    },

    combat: {
      level: 1,
      xp: 0
    }
  },

  equipment: {
    axe: null,
    pickaxe: null,
    weapon: null,
    helmet: null,
    armor: null
  }
};