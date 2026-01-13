import Phaser from 'phaser';

/**
 * BootScene - First scene that runs
 * Sets up basic game settings and transitions to PreloadScene
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Set up any boot-time configurations here
    this.cameras.main.setBackgroundColor('#000000');
  }

  create(): void {
    console.log('BootScene: Initialized');
    // Transition to preload scene
    this.scene.start('PreloadScene');
  }
}
