import { DiceFace, Hero, Enemy } from '@entities/types';

/**
 * DiceSystem - Handles all dice rolling mechanics
 */
export class DiceSystem {
  /**
   * Roll a single die and return a random face
   */
  static rollDice(dice: DiceFace[]): DiceFace {
    const randomIndex = Math.floor(Math.random() * dice.length);
    return dice[randomIndex];
  }

  /**
   * Roll all dice for all heroes in the party
   */
  static rollAllHeroes(heroes: Hero[]): DiceFace[] {
    return heroes.map((hero) => this.rollDice(hero.dice));
  }

  /**
   * Roll all dice for all enemies
   */
  static rollAllEnemies(enemies: Enemy[]): DiceFace[] {
    return enemies.map((enemy) => this.rollDice(enemy.dice));
  }

  /**
   * Get a color for a dice type (for UI display)
   */
  static getDiceColor(type: DiceFace['type']): number {
    switch (type) {
      case 'attack':
        return 0xff4444; // Red
      case 'defend':
        return 0x4444ff; // Blue
      case 'heal':
        return 0x44ff44; // Green
      case 'special':
        return 0xff44ff; // Purple
	  case 'empty':
		return 0x666666; // Grey
      default:
        return 0xffffff; // White
    }
  }

  /**
   * Get a symbol for a dice type
   */
  static getDiceSymbol(type: DiceFace['type']): string {
    switch (type) {
      case 'attack':
        return '⚔️';
      case 'defend':
        return '🛡️';
      case 'heal':
        return '❤️';
      case 'special':
        return '✨';
	  case 'empty':
		return '❌';
      default:
        return '?';
    }
  }

  /**
   * Format a dice face for display
   */
  static formatDiceFace(face: DiceFace): string {
    return `${this.getDiceSymbol(face.type)} ${face.value}`;
  }
}
