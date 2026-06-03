export function createDefaultState() {
  return {
    gold: 0,

    player: {
      hp: 30,
      maxHp: 30
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
      copperSword: 0,
      bread: 0
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

      cooking: {
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
}

export const gameState = createDefaultState();

export function resetGameState() {
  const freshState = createDefaultState();

  Object.keys(gameState).forEach((key) => {
    delete gameState[key];
  });

  Object.assign(gameState, freshState);
}