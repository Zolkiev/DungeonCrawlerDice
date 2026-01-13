import Phaser from 'phaser';
import { getAllTier1Heroes } from '@data/HeroDatabase';
import { getAllAvailableMonsters } from '@data/MonsterDatabase';

/**
 * PreloadScene - Handles loading of all game assets
 * Shows loading progress and transitions to MainMenuScene when complete
 */
export class PreloadScene extends Phaser.Scene {
  private loadingText!: Phaser.GameObjects.Text;
  private progressBar!: Phaser.GameObjects.Graphics;
  private progressBox!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    this.createLoadingUI();
    this.loadAssets();
    this.setupLoadingEvents();
  }

  private createLoadingUI(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Loading text
    this.loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      fontSize: '24px',
      color: '#ffffff',
    });
    this.loadingText.setOrigin(0.5, 0.5);

    // Progress bar background
    this.progressBox = this.add.graphics();
    this.progressBox.fillStyle(0x222222, 0.8);
    this.progressBox.fillRect(width / 2 - 160, height / 2, 320, 30);

    // Progress bar
    this.progressBar = this.add.graphics();
  }

  private loadAssets(): void {
    // Load hero avatars
    this.loadHeroAvatars();
    
    // Load enemy avatars
    this.loadEnemyAvatars();
    
    // Placeholder for missing images
    this.load.image('placeholder', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
  }

  private loadHeroAvatars(): void {
    const allHeroes = getAllTier1Heroes();
    
    allHeroes.forEach(hero => {
      const heroKey = `avatar_${hero.name.toLowerCase()}`;
      const heroPath = `src/ui/heroes/${hero.name.toLowerCase()}.png`;
      
      // Try to load, fallback handled in HeroCard
      this.load.image(heroKey, heroPath);
    });
  }

  private loadEnemyAvatars(): void {
    // Get all monsters from the database
    const allMonsters = getAllAvailableMonsters();
    
    allMonsters.forEach(monster => {
      const enemyKey = `avatar_enemy_${monster.name.toLowerCase().replace(/\s+/g, '_')}`;
      const enemyPath = `src/ui/monsters/${monster.name.toLowerCase().replace(/\s+/g, '_')}.png`;
      
      // Try to load, fallback handled in EnemyCard
      this.load.image(enemyKey, enemyPath);
    });
  }

  private setupLoadingEvents(): void {
    this.load.on('progress', (value: number) => {
      this.progressBar.clear();
      this.progressBar.fillStyle(0x00ff00, 1);
      this.progressBar.fillRect(
        this.cameras.main.width / 2 - 150,
        this.cameras.main.height / 2 + 5,
        300 * value,
        20
      );
    });

    this.load.on('complete', () => {
      this.progressBar.destroy();
      this.progressBox.destroy();
      this.loadingText.destroy();
    });
    
    // Handle loading errors gracefully
    this.load.on('loaderror', (file: any) => {
      console.warn(`Failed to load: ${file.key}`);
    });
  }

  create(): void {
    console.log('PreloadScene: Assets loaded');
    this.scene.start('MainMenuScene');
  }
}
