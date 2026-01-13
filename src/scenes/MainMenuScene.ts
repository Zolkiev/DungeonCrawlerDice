import Phaser from 'phaser';

/**
 * MainMenuScene - Main menu of the game
 * Provides options to start game, view instructions, etc.
 */
export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Title
    const title = this.add.text(width / 2, height / 3, 'DUNGEON CRAWLER DICE', {
      fontSize: '48px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);

    // Subtitle
    const subtitle = this.add.text(width / 2, height / 3 + 60, 'A Tactical Roguelike', {
      fontSize: '20px',
      color: '#aaaaaa',
    });
    subtitle.setOrigin(0.5);

    // Start button
    this.createButton(width / 2, height / 2 + 50, 'START GAME', () => {
      this.scene.start('CombatScene');
    });

    // Instructions button
    this.createButton(width / 2, height / 2 + 110, 'HOW TO PLAY', () => {
      console.log('Instructions clicked - TODO: Show instructions');
    });

    console.log('MainMenuScene: Ready');
  }

  private createButton(
    x: number,
    y: number,
    text: string,
    callback: () => void
  ): Phaser.GameObjects.Text {
    const button = this.add.text(x, y, text, {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#444444',
      padding: { x: 20, y: 10 },
    });
    button.setOrigin(0.5);
    button.setInteractive({ useHandCursor: true });

    // Hover effects
    button.on('pointerover', () => {
      button.setBackgroundColor('#666666');
    });

    button.on('pointerout', () => {
      button.setBackgroundColor('#444444');
    });

    button.on('pointerdown', () => {
      button.setBackgroundColor('#222222');
    });

    button.on('pointerup', () => {
      button.setBackgroundColor('#666666');
      callback();
    });

    return button;
  }
}
