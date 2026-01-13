/**
 * MonsterDatabase - All monsters from Slice & Dice
 */

export interface MonsterData {
  name: string;
  size: 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge' | 'Boss' | 'Hero-Sized';
  hp: number;
  rarity?: string;
  trait?: string;
  unlocked: boolean;
  unlockRequirement?: string;
}

/**
 * All Tiny Monsters (13 total, 7 unlocked by default)
 */
export const TINY_MONSTERS: MonsterData[] = [
  // Unlocked monsters
  { name: 'Bones', size: 'Tiny', hp: 1, trait: 'Bone-shards: 1 damage to adjacent allies upon death', unlocked: true },
  { name: 'Slimelet', size: 'Tiny', hp: 1, unlocked: true },
  { name: 'Imp', size: 'Tiny', hp: 1, trait: 'Spiky 1: On-hit: damage the attacker for 1', unlocked: true },
  { name: 'Sniper', size: 'Tiny', hp: 1, trait: 'Back-row: Starts at the back', unlocked: true },
  { name: 'Rat', size: 'Tiny', hp: 1, unlocked: true },
  { name: 'Archer', size: 'Tiny', hp: 1, trait: 'Back-row: Starts at the back', unlocked: true },
  { name: 'Spider', size: 'Tiny', hp: 1, unlocked: true },
  
  // Locked monsters (require achievements)
  { name: 'Illusion', size: 'Tiny', hp: 1, rarity: '1/3', unlocked: false, unlockRequirement: 'Achieve "Fading" to unlock' },
  { name: 'Wisp', size: 'Tiny', hp: 1, trait: 'Infused (HP 3): +1 mana', unlocked: false, unlockRequirement: 'Achieve "Caster++" to unlock' },
  { name: 'Thorn', size: 'Tiny', hp: 1, trait: 'Refractive: Immune to spells\nSpiky 5: On-hit: damage the attacker for 5', unlocked: false, unlockRequirement: 'Achieve "Spines" to unlock' },
  { name: 'Grave', size: 'Tiny', hp: 1, trait: 'Tough (HP 1,2,3): these hp must be removed individually', unlocked: false, unlockRequirement: 'Achieve "Pile of Bones" to unlock' },
  { name: 'Caw Egg', size: 'Tiny', hp: 1, rarity: '1/5', unlocked: false, unlockRequirement: 'Achieve "Caw Eggs" to unlock' },
  { name: 'Chest', size: 'Tiny', hp: 1, unlocked: false, unlockRequirement: 'Achieve "Challenger" to unlock' },
];

export const HERO_SIZED_MONSTERS: MonsterData[] = [
  // Unlocked monsters
  { name: 'Wolf', size: 'Hero-Sized', hp: 5, unlocked: true },
  { name: 'Snake', size: 'Hero-Sized', hp: 5, unlocked: true },
  { name: 'Fanatic', size: 'Hero-Sized', hp: 5, unlocked: true },
  { name: 'Gnoll', size: 'Hero-Sized', hp: 5, trait: 'Armour 1: Reduce damage taken from spells and dice by 1', unlocked: true },
  { name: 'Goblin', size: 'Hero-Sized', hp: 5, trait: "I'm outta here: Flees if alone", unlocked: true },
  { name: 'Saber', size: 'Hero-Sized', hp: 5, unlocked: true },
  { name: 'Warchief', size: 'Hero-Sized', hp: 5, trait: 'Commander: All monsters: +1 to all sides', unlocked: true },
  { name: 'Bandit', size: 'Hero-Sized', hp: 5, trait: 'Mercenary: Flees if an adjacent monster is overkilled by 2 or more', unlocked: true },
  { name: 'Barrel', size: 'Hero-Sized', hp: 5, trait: 'Explode: 5 damage to adjacent allies upon death', unlocked: true },
  { name: 'Zombie', size: 'Hero-Sized', hp: 5, trait: 'Rotting: Dies if takes 4 or more damage in a single attack', unlocked: true },
  { name: 'Z0mbie', size: 'Hero-Sized', hp: 5, trait: 'Tr0lled: Attacker dies if I take 4 or more damage in a single attack', unlocked: true },
  
  // Locked monsters
  { name: 'Quartz', size: 'Hero-Sized', hp: 5, unlocked: false, unlockRequirement: 'Achieve "Stone Revenge" to unlock' },
  { name: 'Sudul', size: 'Hero-Sized', hp: 5, unlocked: false, unlockRequirement: 'Achieve "Ludus-pick" to unlock' },
  { name: 'Dragon Egg', size: 'Hero-Sized', hp: 5, unlocked: false, unlockRequirement: 'Achieve "Dragon Eggs" to unlock' },
];

/**
 * Get all unlocked Tiny monsters
 */
export function getUnlockedTinyMonsters(): MonsterData[] {
  return TINY_MONSTERS.filter(m => m.unlocked);
}

/**
 * Get all Tiny monsters (for testing)
 */
export function getAllTinyMonsters(): MonsterData[] {
  return TINY_MONSTERS;
}

/**
 * Get all unlocked Hero-sized monsters
 */
export function getUnlockedHeroSizedMonsters(): MonsterData[] {
  return HERO_SIZED_MONSTERS.filter(m => m.unlocked);
}

/**
 * Get all Hero-sized monsters (for testing)
 */
export function getAllHeroSizedMonsters(): MonsterData[] {
  return HERO_SIZED_MONSTERS;
}

/**
 * Get all available monsters (Tiny + Hero-sized)
 */
export function getAllAvailableMonsters(): MonsterData[] {
  return [...TINY_MONSTERS, ...HERO_SIZED_MONSTERS];
}

/**
 * Get all unlocked monsters (Tiny + Hero-sized)
 */
export function getUnlockedMonsters(): MonsterData[] {
  return [...getUnlockedTinyMonsters(), ...getUnlockedHeroSizedMonsters()];
}

/**
 * Get random monsters from a pool
 */
export function getRandomMonsters(pool: MonsterData[], count: number): MonsterData[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Generate a random enemy group (2-4 enemies, mix of Tiny and Hero-sized)
 */
export function generateRandomEnemyGroup(): MonsterData[] {
  const allMonsters = getAllAvailableMonsters(); // Use all for testing
  const groupSize = 2 + Math.floor(Math.random() * 3); // 2-4 enemies
  return getRandomMonsters(allMonsters, groupSize);
}
