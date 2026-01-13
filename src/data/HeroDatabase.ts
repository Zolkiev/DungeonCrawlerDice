/**
 * HeroDatabase - All heroes from Slice & Dice
 */
import { HeroClass } from '@entities/types';

export interface DiceFaceData {
  type: 'attack' | 'defend' | 'heal' | 'special' | 'empty';
  value: number;
  description?: string;
}

export interface HeroData {
  name: string;
  color: string;
  tier: number;
  maxHealth: number;
  unlocked: boolean;
  unlockRequirement?: string;
  dice: DiceFaceData[]; // Always 6 faces
}

/**
 * All Tier 1 Heroes (20 total, 5 unlocked by default - one per color)
 */
export const TIER_1_HEROES: HeroData[] = [
  // ===== ORANGE (THIEF) =====
  {
    name: 'Thief',
    color: 'Orange',
    tier: 1,
    maxHealth: 4,
    unlocked: true,
    dice: [
      { type: 'attack', value: 2, description: 'bow' },
      { type: 'attack', value: 2, description: 'sword' },
      { type: 'empty', value: 0 },
      { type: 'empty', value: 0 },
      { type: 'attack', value: 2, description: 'sword' },
      { type: 'empty', value: 0 },
    ]
  },
  {
    name: 'Scoundrel',
    color: 'Orange',
    tier: 1,
    maxHealth: 6,
    unlocked: false,
    unlockRequirement: 'Achieve "Light Fingers" to unlock',
    dice: [
      { type: 'attack', value: 1, description: 'scythe' },
      { type: 'attack', value: 1, description: 'trident' },
      { type: 'empty', value: 0 },
      { type: 'empty', value: 0 },
      { type: 'empty', value: 0 },
      { type: 'empty', value: 0 },
    ]
  },
  {
    name: 'Lost',
    color: 'Orange',
    tier: 1,
    maxHealth: 3,
    unlocked: false,
    unlockRequirement: 'Achieve "Wanderer" to unlock',
    dice: [
      { type: 'attack', value: 1, description: 'poison bow' },
      { type: 'attack', value: 2, description: 'poison bow' },
      { type: 'attack', value: 1, description: 'poison bow' },
      { type: 'attack', value: 1, description: 'poison bow' },
      { type: 'attack', value: 1, description: 'poison bow' },
      { type: 'attack', value: 1, description: 'poison bow' },
    ]
  },
  {
    name: 'Dabble',
    color: 'Orange',
    tier: 1,
    maxHealth: 5,
    unlocked: false,
    unlockRequirement: 'Achieve "Jack of All" to unlock',
    dice: [
      { type: 'heal', value: 5 },
      { type: 'defend', value: 2, description: 'shield' },
      { type: 'special', value: 1, description: 'mana' },
      { type: 'special', value: 1, description: 'mana' },
      { type: 'attack', value: 2, description: 'sword' },
      { type: 'attack', value: 1, description: 'sword' },
    ]
  },

  // ===== YELLOW (FIGHTER) =====
  {
    name: 'Fighter',
    color: 'Yellow',
    tier: 1,
    maxHealth: 5,
    unlocked: true,
    dice: [
      { type: 'attack', value: 2, description: 'sword' },
      { type: 'attack', value: 2, description: 'sword' },
      { type: 'attack', value: 1, description: 'sword' },
      { type: 'attack', value: 1, description: 'sword' },
      { type: 'defend', value: 1, description: 'shield' },
      { type: 'defend', value: 1, description: 'shield' },
    ]
  },
  {
    name: 'Brigand',
    color: 'Yellow',
    tier: 1,
    maxHealth: 5,
    unlocked: false,
    unlockRequirement: 'Achieve "Highwayman" to unlock',
    dice: [
      { type: 'attack', value: 3, description: '2-handed sword' },
      { type: 'attack', value: 3, description: '2-handed sword' },
      { type: 'special', value: 1, description: '1 dmg + 1 shield' },
      { type: 'special', value: 1, description: '1 dmg + 1 shield' },
      { type: 'attack', value: 1, description: 'sword' },
      { type: 'attack', value: 1, description: 'sword' },
    ]
  },
  {
    name: 'Ruffian',
    color: 'Yellow',
    tier: 1,
    maxHealth: 4,
    unlocked: false,
    unlockRequirement: 'Achieve "Brawler" to unlock',
    dice: [
      { type: 'attack', value: 5, description: '2-handed sword' },
      { type: 'attack', value: 1, description: 'trident' },
      { type: 'attack', value: 1, description: 'sword' },
      { type: 'attack', value: 1, description: 'sword' },
      { type: 'defend', value: 2, description: 'shield' },
      { type: 'empty', value: 0 },
    ]
  },
  {
    name: 'Hoarder',
    color: 'Yellow',
    tier: 1,
    maxHealth: 6,
    unlocked: false,
    unlockRequirement: 'Achieve "Treasure Hunter" to unlock',
    dice: [
      { type: 'attack', value: 2, description: '2-handed axe' },
      { type: 'attack', value: 1, description: 'sword' },
      { type: 'attack', value: 1, description: 'sword' },
      { type: 'attack', value: 1, description: 'sword' },
      { type: 'attack', value: 2, description: 'sword' },
      { type: 'attack', value: 2, description: 'sword' },
    ]
  },

  // ===== GREY (DEFENDER) =====
  {
    name: 'Defender',
    color: 'Grey',
    tier: 1,
    maxHealth: 7,
    unlocked: true,
    dice: [
      { type: 'defend', value: 3, description: 'shield' },
      { type: 'defend', value: 2, description: 'shield' },
      { type: 'attack', value: 1, description: 'sword' },
      { type: 'attack', value: 1, description: 'sword' },
      { type: 'defend', value: 1, description: 'shield' },
      { type: 'empty', value: 0 },
    ]
  },
  {
    name: 'Buckle',
    color: 'Grey',
    tier: 1,
    maxHealth: 6,
    unlocked: false,
    unlockRequirement: 'Achieve "Unbreakable" to unlock',
    dice: [
      { type: 'defend', value: 2, description: 'shield' },
      { type: 'attack', value: 2, description: '2-handed axe' },
      { type: 'defend', value: 2, description: 'shield' },
      { type: 'defend', value: 2, description: 'shield' },
      { type: 'empty', value: 0 },
      { type: 'empty', value: 0 },
    ]
  },
  {
    name: 'Squire',
    color: 'Grey',
    tier: 1,
    maxHealth: 5,
    unlocked: false,
    unlockRequirement: 'Achieve "Loyal Guard" to unlock',
    dice: [
      { type: 'defend', value: 2, description: 'shield' },
      { type: 'attack', value: 1, description: 'sword' },
      { type: 'defend', value: 2, description: 'shield' },
      { type: 'defend', value: 2, description: 'shield' },
      { type: 'defend', value: 1, description: 'shield' },
      { type: 'defend', value: 1, description: 'shield' },
    ]
  },
  {
    name: 'Alloy',
    color: 'Grey',
    tier: 1,
    maxHealth: 4,
    unlocked: false,
    unlockRequirement: 'Achieve "Steel Wall" to unlock',
    dice: [
      { type: 'special', value: 1, description: '1 shield to all team' },
      { type: 'special', value: 1, description: '1 shield to self + target' },
      { type: 'defend', value: 1, description: 'shield' },
      { type: 'defend', value: 1, description: 'shield' },
      { type: 'defend', value: 1, description: 'shield' },
      { type: 'defend', value: 1, description: 'shield' },
    ]
  },

  // ===== RED (CLERIC) =====
  {
    name: 'Healer',
    color: 'Red',
    tier: 1,
    maxHealth: 5,
    unlocked: true,
    dice: [
      { type: 'special', value: 2, description: 'mana' },
      { type: 'special', value: 1, description: 'mana' },
      { type: 'heal', value: 3 },
      { type: 'heal', value: 3 },
      { type: 'special', value: 1, description: 'mana' },
      { type: 'empty', value: 0 },
    ]
  },
  {
    name: 'Acolyte',
    color: 'Red',
    tier: 1,
    maxHealth: 5,
    unlocked: false,
    unlockRequirement: 'Achieve "Divine Light" to unlock',
    dice: [
      { type: 'heal', value: 2 },
      { type: 'heal', value: 2 },
      { type: 'special', value: 1, description: '1 heal to all team' },
      { type: 'special', value: 1, description: '1 heal to all team' },
      { type: 'special', value: 1, description: 'mana' },
      { type: 'special', value: 1, description: 'mana' },
    ]
  },
  {
    name: 'Mystic',
    color: 'Red',
    tier: 1,
    maxHealth: 5,
    unlocked: false,
    unlockRequirement: 'Achieve "Spiritual" to unlock',
    dice: [
      { type: 'heal', value: 1 },
      { type: 'heal', value: 1 },
      { type: 'special', value: 1, description: 'mana' },
      { type: 'heal', value: 1 },
      { type: 'empty', value: 0 },
      { type: 'empty', value: 0 },
    ]
  },
  {
    name: 'Splint',
    color: 'Red',
    tier: 1,
    maxHealth: 4,
    unlocked: false,
    unlockRequirement: 'Achieve "Blessed" to unlock',
    dice: [
      { type: 'special', value: 3, description: 'mana' },
      { type: 'special', value: 2, description: 'mana' },
      { type: 'heal', value: 5 },
      { type: 'heal', value: 5 },
      { type: 'special', value: 1, description: 'mana' },
      { type: 'empty', value: 0 },
    ]
  },

  // ===== BLUE (MAGE) =====
  {
    name: 'Mage',
    color: 'Blue',
    tier: 1,
    maxHealth: 4,
    unlocked: true,
    dice: [
      { type: 'special', value: 2, description: 'mana' },
      { type: 'special', value: 2, description: 'mana' },
      { type: 'special', value: 1, description: 'mana' },
      { type: 'special', value: 1, description: 'mana' },
      { type: 'empty', value: 0 },
      { type: 'empty', value: 0 },
    ]
  },
  {
    name: 'Student',
    color: 'Blue',
    tier: 1,
    maxHealth: 5,
    unlocked: false,
    unlockRequirement: 'Achieve "Apprentice" to unlock',
    dice: [
      { type: 'special', value: 0, description: 'stun enemy' },
      { type: 'defend', value: 1, description: 'shield' },
      { type: 'empty', value: 0 },
      { type: 'empty', value: 0 },
      { type: 'defend', value: 1, description: 'shield' },
      { type: 'empty', value: 0 },
    ]
  },
  {
    name: 'Initiate',
    color: 'Blue',
    tier: 1,
    maxHealth: 4,
    unlocked: false,
    unlockRequirement: 'Achieve "Arcane" to unlock',
    dice: [
      { type: 'special', value: 1, description: 'mana' },
      { type: 'special', value: 1, description: 'mana' },
      { type: 'special', value: 1, description: 'mana' },
      { type: 'special', value: 1, description: 'mana' },
      { type: 'special', value: 1, description: 'mana' },
      { type: 'empty', value: 0 },
    ]
  },
  {
    name: 'Cultist',
    color: 'Blue',
    tier: 1,
    maxHealth: 5,
    unlocked: false,
    unlockRequirement: 'Achieve "Dark Arts" to unlock',
    dice: [
      { type: 'special', value: 4, description: 'mana (self: -2 HP)' },
      { type: 'special', value: 3, description: 'mana (self: -2 HP)' },
      { type: 'attack', value: 1, description: 'staff' },
      { type: 'attack', value: 1, description: 'staff' },
      { type: 'special', value: 2, description: 'mana (self: -2 HP)' },
      { type: 'special', value: 1, description: 'mana (self: -1 HP)' },
    ]
  },
];

/**
 * Get all unlocked Tier 1 heroes
 */
export function getUnlockedTier1Heroes(): HeroData[] {
  return TIER_1_HEROES.filter(h => h.unlocked);
}

/**
 * Get all Tier 1 heroes (for testing with all heroes)
 */
export function getAllTier1Heroes(): HeroData[] {
  return TIER_1_HEROES;
}

/**
 * Get random heroes from a pool
 */
export function getRandomHeroes(pool: HeroData[], count: number): HeroData[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
