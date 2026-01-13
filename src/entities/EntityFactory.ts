import { Hero, Enemy, HeroClass, DiceFace } from './types';
import { GameConstants } from '@config/gameConfig';
import { getUnlockedTier1Heroes, getAllTier1Heroes, getRandomHeroes, HeroData } from '@data/HeroDatabase';
import { getRandomMonsters, getAllTinyMonsters, MonsterData, generateRandomEnemyGroup } from '@data/MonsterDatabase';

/**
 * Factory for creating heroes and enemies - Slice & Dice style
 */
export class EntityFactory {
  /**
   * Map hero color to HeroClass
   */
  private static colorToClass(color: string): HeroClass {
    switch (color) {
      case 'Orange':
        return HeroClass.THIEF;
      case 'Yellow':
        return HeroClass.FIGHTER;
      case 'Grey':
        return HeroClass.DEFENDER;
      case 'Red':
        return HeroClass.CLERIC;
      case 'Blue':
        return HeroClass.MAGE;
      default:
        return HeroClass.FIGHTER;
    }
  }

  /**
   * Create a hero from HeroData
   */
	static createHeroFromData(heroData: HeroData, position: number): Hero {
	  const heroClass = this.colorToClass(heroData.color);

	  return {
		id: `hero_${heroData.name}_${position}`,
		name: heroData.name,
		class: heroClass,
		currentHealth: heroData.maxHealth,
		maxHealth: heroData.maxHealth,
		dice: heroData.dice, // ← UTILISE LES VRAIS DÉS !
		level: heroData.tier,
		position: position,
		incomingDamage: 0,
	  };
	}

  /**
   * Create a hero of the specified class (legacy method)
   */
  static createHero(heroClass: HeroClass, position: number): Hero {
    const baseHealth = GameConstants.STARTING_HEALTH;
    const dice = this.getHeroDiceByClass(heroClass);

    return {
      id: `hero_${heroClass}_${position}`,
      name: this.getHeroName(heroClass),
      class: heroClass,
      currentHealth: baseHealth,
      maxHealth: baseHealth,
      dice: dice,
      level: 1,
      position: position,
      incomingDamage: 0,
    };
  }

  /**
   * Create a basic enemy
   */
  static createEnemy(type: 'rat' | 'goblin' | 'archer' | 'orc', position: number): Enemy {
    const enemyData = this.getEnemyData(type);

    return {
      id: `enemy_${type}_${position}`,
      name: enemyData.name,
      currentHealth: enemyData.health,
      maxHealth: enemyData.health,
      dice: enemyData.dice,
      position: position,
      incomingDamage: 0,
    };
  }

  /**
   * Get dice configuration for hero class (6 faces with 1-3 damage)
   */
  private static getHeroDiceByClass(heroClass: HeroClass): DiceFace[] {
    switch (heroClass) {
      case HeroClass.FIGHTER:
        return [
          { type: 'attack', value: 2 },
          { type: 'attack', value: 3 },
          { type: 'attack', value: 2 },
          { type: 'defend', value: 2 },
          { type: 'defend', value: 1 },
          { type: 'attack', value: 3 },
        ];
      case HeroClass.THIEF:
        return [
          { type: 'attack', value: 3 },
          { type: 'attack', value: 2 },
          { type: 'attack', value: 2 },
          { type: 'attack', value: 1 },
          { type: 'defend', value: 1 },
          { type: 'special', value: 3 },
        ];
      case HeroClass.DEFENDER:
        return [
          { type: 'defend', value: 3 },
          { type: 'defend', value: 2 },
          { type: 'attack', value: 2 },
          { type: 'defend', value: 2 },
          { type: 'attack', value: 1 },
          { type: 'defend', value: 1 },
        ];
      case HeroClass.WARDEN:
        return [
          { type: 'heal', value: 2 },
          { type: 'defend', value: 2 },
          { type: 'attack', value: 2 },
          { type: 'heal', value: 1 },
          { type: 'defend', value: 1 },
          { type: 'attack', value: 1 },
        ];
      case HeroClass.CLERIC:
        return [
          { type: 'heal', value: 2 },
          { type: 'heal', value: 2 },
          { type: 'heal', value: 3 },
          { type: 'defend', value: 2 },
          { type: 'attack', value: 1 },
          { type: 'defend', value: 1 },
        ];
      case HeroClass.MAGE:
        return [
          { type: 'attack', value: 3 },
          { type: 'attack', value: 2 },
          { type: 'special', value: 2 },
          { type: 'attack', value: 2 },
          { type: 'defend', value: 1 },
          { type: 'special', value: 3 },
        ];
      default:
        return [];
    }
  }
  
	  /**
	 * Create an enemy from MonsterData
	 */
	static createEnemyFromData(monsterData: MonsterData, position: number): Enemy {
	  const dice = this.getEnemyDiceBySize(monsterData.size); // ← Change here

	  return {
		id: `enemy_${monsterData.name}_${position}`,
		name: monsterData.name,
		currentHealth: monsterData.hp,
		maxHealth: monsterData.hp,
		dice: dice,
		position: position,
		incomingDamage: 0,
		poisonCounter: 0,
	  };
	}

	/**
	 * Get enemy dice based on size
	 */
	private static getEnemyDiceBySize(size: string): DiceFace[] {
	  if (size === 'Tiny') {
		// Tiny: 4 dice, 1-2 damage
		return [
		  { type: 'attack', value: 1 },
		  { type: 'attack', value: 1 },
		  { type: 'attack', value: 2 },
		  { type: 'attack', value: 2 },
		];
	  } else {
		// Hero-sized: 6 dice, 1-3 damage
		return [
		  { type: 'attack', value: 2 },
		  { type: 'attack', value: 2 },
		  { type: 'attack', value: 3 },
		  { type: 'attack', value: 1 },
		  { type: 'defend', value: 1 },
		  { type: 'attack', value: 2 },
		];
	  }
	}

  /**
   * Get enemy data (5 HP, 1-3 damage)
   */
  private static getEnemyData(type: string) {
    switch (type) {
      case 'rat':
        return {
          name: 'Rat',
          health: 3,
          dice: [
            { type: 'attack' as const, value: 1 },
            { type: 'attack' as const, value: 1 },
            { type: 'attack' as const, value: 1 },
            { type: 'attack' as const, value: 2 },
          ],
        };
      case 'goblin':
        return {
          name: 'Goblin',
          health: GameConstants.STARTING_HEALTH,
          dice: [
            { type: 'attack' as const, value: 1 },
            { type: 'attack' as const, value: 2 },
            { type: 'attack' as const, value: 2 },
            { type: 'attack' as const, value: 2 },
            { type: 'defend' as const, value: 1 },
            { type: 'attack' as const, value: 3 },
          ],
        };
      case 'archer':
        return {
          name: 'Archer',
          health: 4,
          dice: [
            { type: 'attack' as const, value: 2 },
            { type: 'attack' as const, value: 2 },
            { type: 'attack' as const, value: 1 },
            { type: 'attack' as const, value: 3 },
            { type: 'defend' as const, value: 1 },
            { type: 'attack' as const, value: 2 },
          ],
        };
      case 'orc':
        return {
          name: 'Orc',
          health: 6,
          dice: [
            { type: 'attack' as const, value: 3 },
            { type: 'attack' as const, value: 2 },
            { type: 'attack' as const, value: 3 },
            { type: 'defend' as const, value: 2 },
            { type: 'attack' as const, value: 2 },
            { type: 'defend' as const, value: 1 },
          ],
        };
      default:
        return {
          name: 'Unknown',
          health: GameConstants.STARTING_HEALTH,
          dice: [{ type: 'attack' as const, value: 1 }],
        };
    }
  }

  /**
   * Get hero name by class
   */
  private static getHeroName(heroClass: HeroClass): string {
    const names = {
      [HeroClass.FIGHTER]: 'Fighter',
      [HeroClass.THIEF]: 'Thief',
      [HeroClass.DEFENDER]: 'Defender',
      [HeroClass.WARDEN]: 'Warden',
      [HeroClass.CLERIC]: 'Cleric',
      [HeroClass.MAGE]: 'Mage',
    };
    return names[heroClass];
  }

  /**
   * Create a default party - 5 random Tier 1 heroes
   * Uses unlocked heroes only (or all for testing)
   */
  static createDefaultParty(): Hero[] {
    // For now, use ALL tier 1 heroes for testing variety
    // Later, change to getUnlockedTier1Heroes() to only use unlocked ones
    const availableHeroes = getAllTier1Heroes();
    
    // Select 5 random heroes
    const selectedHeroes = getRandomHeroes(availableHeroes, 5);
    
    // Create Hero entities
    return selectedHeroes.map((heroData, index) => 
      this.createHeroFromData(heroData, index)
    );
  }

	/**
	 * Create a random enemy group using Tiny monsters
	 */
	static createDefaultEnemies(): Enemy[] {
	  const monsterGroup = generateRandomEnemyGroup(); // 2-4 random monsters
	  
	  return monsterGroup.map((monsterData, index) => 
		this.createEnemyFromData(monsterData, index)
	  );
	}
}
