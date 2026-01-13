# Contributing Guide

## Getting Started

### First Time Setup

1. **Clone and Install**
```bash
cd C:\Setup\Projects\Personal\DungeonCrawlerDice
npm install
```

2. **Run Development Server**
```bash
npm run dev
```

3. **Open Browser**
Navigate to `http://localhost:3000`

## Development Workflow

### Daily Development

1. **Pull Latest Changes** (if using git)
```bash
git pull origin main
```

2. **Check TODO List**
Review `docs/TODO.md` for current tasks

3. **Create Feature Branch** (if using git)
```bash
git checkout -b feature/dice-rolling-system
```

4. **Write Code**
Follow the code conventions below

5. **Test Your Changes**
```bash
npm run dev
# Manually test in browser
npm run type-check
npm run lint
```

6. **Commit Changes**
```bash
git add .
git commit -m "feat: implement dice rolling system"
```

7. **Push and Review**
```bash
git push origin feature/dice-rolling-system
# Create PR if working with team
```

## Code Conventions

### TypeScript

**DO:**
```typescript
// ✅ Use interfaces for data structures
interface Hero {
  id: string;
  name: string;
}

// ✅ Use type for unions
type DiceType = 'attack' | 'defend' | 'heal';

// ✅ Use enums for fixed values
enum HeroClass {
  WARRIOR = 'WARRIOR',
  MAGE = 'MAGE',
}

// ✅ Use descriptive names
function calculateTotalDamage(rolls: DiceFace[]): number { }

// ✅ Use JSDoc for public APIs
/**
 * Rolls a random die face from the given dice
 * @param dice - Array of possible dice faces
 * @returns The randomly selected face
 */
function rollDice(dice: DiceFace[]): DiceFace { }
```

**DON'T:**
```typescript
// ❌ Don't use 'any'
function process(data: any) { }

// ❌ Don't use single-letter variables (except loops)
function calc(h: Hero, e: Enemy) { }

// ❌ Don't ignore TypeScript errors
// @ts-ignore
const result = someUnsafeOperation();
```

### File Organization

```typescript
// ✅ Order: imports, interfaces, class/functions
import Phaser from 'phaser';
import { Hero } from '@entities/types';

interface ComponentProps {
  hero: Hero;
}

export class HeroPanel extends Phaser.GameObjects.Container {
  // Implementation
}
```

### Naming Conventions

```typescript
// Classes: PascalCase
class CombatSystem { }
class HeroPanel { }

// Functions/Methods: camelCase
function rollDice() { }
function calculateDamage() { }

// Constants: UPPER_SNAKE_CASE
const MAX_HEROES = 5;
const DICE_FACES = 6;

// Variables: camelCase
const heroList = [];
const currentTurn = 1;

// Private members: prefix with underscore (optional)
private _internalState: number;
```

### Code Style

**Formatting:**
- 2 spaces for indentation
- Single quotes for strings
- Semicolons required
- Max line length: 100 characters
- Trailing commas in multi-line

**Run formatter:**
```bash
npm run format
```

### Comments

```typescript
// ✅ Explain WHY, not WHAT
// Clamp to 0 because negative health breaks UI
target.health = Math.max(0, target.health - damage);

// ✅ Document complex logic
/**
 * Calculate effective damage after defense
 * Defense reduces damage by its value, minimum 1 damage always dealt
 */
function calculateEffectiveDamage(attack: number, defense: number): number {
  return Math.max(1, attack - defense);
}

// ❌ Don't state the obvious
// Set health to 10
hero.health = 10;
```

## Project Structure Guidelines

### Adding New Files

**Scenes:**
```
src/scenes/NewScene.ts
```

**Entities:**
```
src/entities/NewEntity.ts
src/entities/types.ts (add interfaces)
```

**Systems:**
```
src/systems/NewSystem.ts
```

**UI Components:**
```
src/ui/NewComponent.ts
```

### File Templates

**New Scene Template:**
```typescript
import Phaser from 'phaser';

export class NewScene extends Phaser.Scene {
  constructor() {
    super({ key: 'NewScene' });
  }

  preload(): void {
    // Load assets
  }

  create(): void {
    // Initialize scene
  }

  update(time: number, delta: number): void {
    // Update logic
  }
}
```

**New System Template:**
```typescript
import { Hero, Enemy } from '@entities/types';

/**
 * NewSystem - Brief description
 */
export class NewSystem {
  /**
   * Method description
   */
  static methodName(param: Type): ReturnType {
    // Implementation
  }
}
```

## Testing

### Manual Testing Checklist

Before committing:
- [ ] Feature works as expected
- [ ] No console errors
- [ ] UI looks correct
- [ ] Performance is acceptable
- [ ] Works in Chrome and Firefox
- [ ] No TypeScript errors
- [ ] ESLint passes

### Testing Commands

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Fix lint issues
npm run lint:fix

# Format code
npm run format
```

## Git Workflow (If Using Git)

### Commit Messages

Follow conventional commits:

```bash
# Format
<type>(<scope>): <subject>

# Types
feat: New feature
fix: Bug fix
docs: Documentation
style: Formatting
refactor: Code restructuring
test: Adding tests
chore: Build/config changes

# Examples
feat(combat): implement dice rolling system
fix(ui): correct health bar alignment
docs(readme): update installation steps
refactor(entities): simplify hero creation
```

### Branch Naming

```bash
# Format
<type>/<short-description>

# Examples
feature/dice-rolling
fix/health-bar-bug
docs/architecture-update
refactor/combat-system
```

### PR Process (If Working with Team)

1. Create descriptive PR title
2. Fill out PR template
3. Link related issues
4. Request review
5. Address feedback
6. Merge when approved

## Common Tasks

### Adding a New Hero Class

1. Add enum value to `HeroClass` in `entities/types.ts`
2. Add dice configuration in `EntityFactory.ts`
3. Update hero name mapping
4. Add sprite assets to `public/assets/sprites/`
5. Test in game
6. Update documentation

### Adding a New Enemy Type

1. Add enemy data to `EntityFactory.getEnemyData()`
2. Define stats and dice
3. Add sprite assets
4. Test in combat
5. Balance test
6. Update documentation

### Adding a New Scene

1. Create scene file in `src/scenes/`
2. Register in `main.ts`
3. Implement lifecycle methods
4. Test transitions
5. Update architecture docs

## Performance Best Practices

### Do's
- ✅ Use object pooling for frequently created/destroyed objects
- ✅ Batch sprite rendering when possible
- ✅ Limit particle systems
- ✅ Use sprite atlases
- ✅ Destroy unused assets
- ✅ Profile with browser dev tools

### Don'ts
- ❌ Don't create new objects in update loops
- ❌ Don't use too many individual sprites
- ❌ Don't forget to destroy event listeners
- ❌ Don't block the main thread
- ❌ Don't load all assets upfront

## Debugging Tips

### Common Issues

**"Cannot find module '@/...'**
- Check path aliases in `tsconfig.json` and `vite.config.ts`
- Restart dev server

**"Property does not exist on type"**
- Check your TypeScript interfaces
- Ensure proper imports
- Run `npm run type-check`

**Game not rendering**
- Check console for errors
- Verify Phaser config
- Check scene registration

**Performance issues**
- Use browser profiler
- Check for memory leaks
- Review update loops

### Useful Console Commands

```javascript
// In browser console
game.scene.scenes // List all scenes
game.scene.getScene('CombatScene') // Get specific scene
game.scene.start('MainMenuScene') // Switch scene
```

## Resources

### Documentation
- [Phaser 3 Docs](https://photonstorm.github.io/phaser3-docs/)
- [Phaser Examples](https://phaser.io/examples)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Tools
- [Aseprite](https://www.aseprite.org/) - Pixel art editor
- [Tiled](https://www.mapeditor.org/) - Map editor
- [BFXR](https://www.bfxr.net/) - Sound effect generator

### Learning
- [Game Programming Patterns](https://gameprogrammingpatterns.com/)
- [Red Blob Games](https://www.redblobgames.com/)

## Questions?

If you're stuck or have questions:
1. Check existing documentation
2. Review similar code in the project
3. Search Phaser forums/examples
4. Ask for help (team/community)

## License

This project is under MIT License - see LICENSE file.

---

**Happy Coding! 🎮**
