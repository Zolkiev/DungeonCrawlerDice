import { Hero, Enemy, DiceFace, CombatState } from '@entities/types';

/**
 * CombatSystem - Handles combat logic and dice resolution
 */
export class CombatSystem {
  /**
   * Roll a die for a hero or enemy
   */
  static rollDice(dice: DiceFace[]): DiceFace {
    const randomIndex = Math.floor(Math.random() * dice.length);
    return dice[randomIndex];
  }

  /**
   * Apply damage to an entity
   */
  static applyDamage(target: Hero | Enemy, damage: number): void {
    target.currentHealth = Math.max(0, target.currentHealth - damage);
  }

  /**
   * Apply healing to a hero
   */
  static applyHealing(target: Hero, healing: number): void {
    target.currentHealth = Math.min(target.maxHealth, target.currentHealth + healing);
  }

  /**
   * Check if an entity is dead
   */
  static isDead(entity: Hero | Enemy): boolean {
    return entity.currentHealth <= 0;
  }

  /**
   * Resolve combat round
   */
  static resolveCombat(heroes: Hero[], enemies: Enemy[]): void {
    // TODO: Implement full combat resolution
    // This is a placeholder for Phase 1
    console.log('Resolving combat...');
  }

  /**
   * Calculate total attack power from rolled dice
   */
  static calculateAttackPower(rolledFaces: DiceFace[]): number {
    return rolledFaces
      .filter((face) => face.type === 'attack')
      .reduce((sum, face) => sum + face.value, 0);
  }

  /**
   * Calculate total defense from rolled dice
   */
  static calculateDefense(rolledFaces: DiceFace[]): number {
    return rolledFaces
      .filter((face) => face.type === 'defend')
      .reduce((sum, face) => sum + face.value, 0);
  }

  /**
   * Calculate total healing from rolled dice
   */
  static calculateHealing(rolledFaces: DiceFace[]): number {
    return rolledFaces
      .filter((face) => face.type === 'heal')
      .reduce((sum, face) => sum + face.value, 0);
  }
}
