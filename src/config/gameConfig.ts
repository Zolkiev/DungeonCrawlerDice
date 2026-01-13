import Phaser from 'phaser';

/**
 * Core game configuration
 * Defines window size, rendering settings, and physics
 */
export const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#2d2d2d',
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { x: 0, y: 0 },
    },
  },
};

/**
 * Game constants and balancing values - Slice and Dice style
 */
export const GameConstants = {
  // Combat
  STARTING_HEROES: 1,
  MAX_HEROES: 5,
  STARTING_HEALTH: 5, // 5 HP per character (displayed as hearts)
  
  // Dice
  DICE_FACES: 6,
  MAX_REROLLS: 3, // Maximum rerolls per turn
  
  // Damage values
  MIN_DAMAGE: 1,
  MAX_DAMAGE: 3,
  
  // Progression
  STARTING_GOLD: 0,
  ROOM_REWARD_GOLD: 10,
  
  // UI
  ANIMATION_SPEED: 0.3,
  DICE_ROLL_DURATION: 800,
};
