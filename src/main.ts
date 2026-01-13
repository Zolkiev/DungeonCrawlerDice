import Phaser from 'phaser';
import { GameConfig } from '@config/gameConfig';
import { BootScene } from '@scenes/BootScene';
import { PreloadScene } from '@scenes/PreloadScene';
import { MainMenuScene } from '@scenes/MainMenuScene';
import { CombatScene } from '@scenes/CombatScene';

/**
 * Main entry point for the Dungeon Crawler Dice game
 * Initializes Phaser and registers all game scenes
 */
class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

// Initialize the game when the DOM is ready
window.addEventListener('load', () => {
  const config: Phaser.Types.Core.GameConfig = {
    ...GameConfig,
    parent: 'game-container',
    scene: [BootScene, PreloadScene, MainMenuScene, CombatScene],
  };

  new Game(config);
});
