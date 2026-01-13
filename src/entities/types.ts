/**
 * Core entity interfaces and types for Slice & Dice style game
 */

/**
 * Dice face represents a single side of a character's die
 */
export interface DiceFace {
  type: 'attack' | 'defend' | 'heal' | 'special' | 'empty';
  value: number;
  description?: string;
}

/**
 * Dice result with selection state
 */
export interface DiceResult {
  characterId: string;
  face: DiceFace;
  isLocked: boolean; // For player dice - locked dice won't reroll
}

/**
 * Hero class type enumeration
 */
export enum HeroClass {
  FIGHTER = 'FIGHTER',
  THIEF = 'THIEF',
  DEFENDER = 'DEFENDER',
  WARDEN = 'WARDEN',
  CLERIC = 'CLERIC',
  MAGE = 'MAGE',
}

/**
 * Hero entity - represents a party member
 */
export interface Hero {
  id: string;
  name: string;
  class: HeroClass;
  currentHealth: number;
  maxHealth: number;
  dice: DiceFace[];
  level: number;
  position: number; // Position in party (0-4)
  incomingDamage: number; // Yellow pills - damage that will be applied
}

/**
 * Enemy entity
 */
export interface Enemy {
  id: string;
  name: string;
  currentHealth: number;
  maxHealth: number;
  dice: DiceFace[];
  position: number;
  incomingDamage: number; // Yellow pills - damage that will be applied
}

/**
 * Combat phase enumeration
 */
export enum CombatPhase {
  ENEMY_ROLL = 'ENEMY_ROLL',
  ENEMY_ASSIGN = 'ENEMY_ASSIGN',
  PLAYER_ROLL = 'PLAYER_ROLL',
  PLAYER_ASSIGN = 'PLAYER_ASSIGN',
  RESOLUTION = 'RESOLUTION',
  GAME_OVER = 'GAME_OVER',
}

/**
 * Action represents an assigned dice action
 */
export interface Action {
  sourceId: string; // Who is performing the action
  targetId: string; // Who is the target (for attacks/heals/etc)
  face: DiceFace; // What dice face was rolled
}

/**
 * Combat state tracks the current battle
 */
export interface CombatState {
  heroes: Hero[];
  enemies: Enemy[];
  phase: CombatPhase;
  turn: number;
  rerollsRemaining: number;
  playerDiceResults: DiceResult[];
  enemyActions: Action[]; // Pre-assigned enemy actions
  playerActions: Action[]; // Player must assign these
}
