# Game Architecture Documentation

## Overview

Dungeon Crawler Dice uses a **Scene-Entity-System** architecture built on top of Phaser 3. This document details the architectural decisions and patterns used throughout the codebase.

## Architecture Patterns

### 1. Scene Management

Phaser's scene system is used to separate different game states:

```
BootScene → PreloadScene → MainMenuScene → CombatScene
```

Each scene is responsible for:
- Its own lifecycle (preload, create, update)
- UI rendering for that state
- Transitioning to other scenes

**Best Practices:**
- Keep scenes focused on presentation logic
- Delegate game logic to Systems
- Use scene data to pass state between scenes

### 2. Entity-Component Pattern

Entities (Heroes, Enemies) are defined as TypeScript interfaces with all their data:

```typescript
interface Hero {
  id: string;
  name: string;
  currentHealth: number;
  dice: DiceFace[];
  // ... more properties
}
```

**Benefits:**
- Clear data structure
- Easy to serialize/deserialize
- Type-safe
- Separation of data and behavior

### 3. System Pattern

Systems contain the game logic and operate on entities:

```typescript
class CombatSystem {
  static rollDice(dice: DiceFace[]): DiceFace { }
  static applyDamage(target: Entity, damage: number): void { }
}
```

**Design Rules:**
- Systems are stateless (pure functions when possible)
- Systems don't store entity data
- Systems can call other systems
- Use dependency injection for testability

### 4. Factory Pattern

EntityFactory creates heroes and enemies with proper initialization:

```typescript
EntityFactory.createHero(HeroClass.WARRIOR, 0);
EntityFactory.createEnemy('goblin', 0);
```

**Purpose:**
- Centralize entity creation logic
- Ensure proper initialization
- Easy to modify entity templates
- Support for procedural generation

## Directory Structure Explained

```
src/
├── scenes/          # Phaser scenes - manage game states and UI
│   ├── BootScene.ts
│   ├── PreloadScene.ts
│   ├── MainMenuScene.ts
│   └── CombatScene.ts
│
├── entities/        # Data structures for game objects
│   ├── types.ts           # TypeScript interfaces/types
│   └── EntityFactory.ts   # Entity creation
│
├── systems/         # Game logic and rules
│   ├── CombatSystem.ts    # Combat calculations
│   ├── DiceSystem.ts      # Dice mechanics (TODO)
│   └── ProgressionSystem.ts # Leveling, rewards (TODO)
│
├── ui/              # UI components and managers
│   ├── HeroPanel.ts       # Hero display (TODO)
│   ├── EnemyPanel.ts      # Enemy display (TODO)
│   └── DiceRoller.ts      # Dice UI (TODO)
│
├── config/          # Configuration and constants
│   └── gameConfig.ts
│
├── utils/           # Helper functions
│   ├── random.ts          # RNG utilities (TODO)
│   └── animation.ts       # Animation helpers (TODO)
│
└── main.ts          # Entry point
```

## Data Flow

### Combat Turn Flow

```
1. CombatScene.create()
   ↓
2. Initialize combat state (heroes, enemies)
   ↓
3. User clicks "Roll Dice"
   ↓
4. DiceSystem.rollAll(heroes)
   ↓
5. Display rolled results
   ↓
6. User selects targets/actions
   ↓
7. CombatSystem.resolveTurn(state)
   ↓
8. Update entity states
   ↓
9. Render new state
   ↓
10. Check win/loss conditions
```

### State Management

Combat state is managed in `CombatScene`:

```typescript
interface CombatState {
  heroes: Hero[];
  enemies: Enemy[];
  turn: number;
  phase: 'player' | 'enemy' | 'resolution';
}
```

**State Updates:**
- Immutable updates preferred (create new objects)
- Use TypeScript's `readonly` for safety
- Validate state transitions

## System Design Details

### CombatSystem

**Responsibilities:**
- Damage calculation
- Healing application
- Death checking
- Combat resolution

**Key Methods:**
```typescript
static rollDice(dice: DiceFace[]): DiceFace
static applyDamage(target: Entity, damage: number): void
static applyHealing(target: Hero, healing: number): void
static isDead(entity: Entity): boolean
static resolveCombat(heroes: Hero[], enemies: Enemy[]): void
```

### DiceSystem (TODO)

**Responsibilities:**
- Dice rolling mechanics
- Reroll logic
- Special dice effects
- Dice pool management

### ProgressionSystem (TODO)

**Responsibilities:**
- Experience and leveling
- Reward generation
- Hero upgrades
- Difficulty scaling

## UI Architecture

### Component Hierarchy (Planned)

```
CombatScene
├── HeroPanel (per hero)
│   ├── HealthBar
│   ├── DiceDisplay
│   └── StatusIcons
├── EnemyPanel (per enemy)
│   ├── HealthBar
│   ├── IntentionIcon
│   └── DiceDisplay
├── ActionPanel
│   ├── RollButton
│   ├── EndTurnButton
│   └── AbilityButtons
└── InfoPanel
    ├── TurnCounter
    ├── GoldDisplay
    └── MessageLog
```

### UI Best Practices

1. **Separation**: UI components don't contain game logic
2. **Events**: Use Phaser's event system for communication
3. **Reusability**: Create generic components (HealthBar, Button)
4. **Responsive**: Support different screen sizes
5. **Accessibility**: Clear visual feedback, readable text

## Performance Considerations

### Optimization Strategies

1. **Object Pooling**: Reuse game objects (dice, particles)
2. **Batch Rendering**: Group similar sprites
3. **Lazy Loading**: Load assets on-demand
4. **State Diffing**: Only update changed UI elements
5. **Profiling**: Use browser dev tools to identify bottlenecks

### Memory Management

- Clean up event listeners in scene shutdown
- Destroy unused textures and sounds
- Limit particle systems
- Use sprite atlases for multiple small images

## Testing Strategy

### Unit Tests (Future)

- Test Systems in isolation
- Mock entity data
- Test edge cases (0 health, negative values)
- Test calculations (damage, healing)

### Integration Tests (Future)

- Test scene transitions
- Test combat rounds
- Test state persistence

### Playtesting Focus

- Balance (hero power levels)
- Difficulty curve
- UI clarity
- Fun factor

## Extensibility

### Adding New Hero Classes

1. Add enum value to `HeroClass`
2. Define dice configuration in `EntityFactory`
3. Add sprite assets
4. Update UI to display class
5. Balance test

### Adding New Enemy Types

1. Add enemy data to `EntityFactory.getEnemyData()`
2. Define dice and stats
3. Add AI behavior if needed
4. Create sprite assets
5. Balance test

### Adding New Dice Face Types

1. Add type to `DiceFace` interface
2. Update `CombatSystem` resolution logic
3. Add UI representation
4. Test interactions with existing types

## Code Quality Guidelines

### TypeScript Usage

- Use `interface` for data structures
- Use `type` for unions and complex types
- Prefer `enum` for fixed sets of values
- Use generics for reusable code
- Enable strict mode

### Function Design

- Keep functions small (<50 lines)
- Single responsibility principle
- Prefer pure functions
- Use descriptive names
- Document with JSDoc for public APIs

### Error Handling

- Validate inputs at system boundaries
- Use TypeScript types to prevent errors
- Log errors to console in development
- Fail gracefully in production

## Future Considerations

### Planned Features

1. **Save System**: Persist runs and meta-progression
2. **Multiplayer**: Co-op or PvP modes
3. **Modding**: Allow custom heroes/enemies
4. **Analytics**: Track player metrics
5. **Accessibility**: Colorblind modes, controls

### Technical Debt

- Need comprehensive error handling
- Need animation system
- Need sound manager
- Need proper state machine for combat phases
- Need tutorial system

## Resources

- [Phaser 3 Documentation](https://photonstorm.github.io/phaser3-docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Game Programming Patterns](https://gameprogrammingpatterns.com/)

---

**Document Version**: 1.0
**Last Updated**: 2025-01-07
