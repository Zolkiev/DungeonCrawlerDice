# Dungeon Crawler Dice

A tactical roguelike dice game inspired by Slice and Dice. Control a party of heroes represented as dice, engage in turn-based combat, and progress through increasingly difficult encounters.

## 🎮 Game Concept

Each hero in your party is represented by a die with different faces showing various abilities (attack, defense, heal, special). Combat is turn-based where you roll your heroes' dice and strategically use the results to defeat enemies.

## 🏗️ Project Structure

```
dungeon-crawler-dice/
├── src/
│   ├── scenes/           # Phaser scenes (Boot, Preload, MainMenu, Combat)
│   ├── entities/         # Game entities (Hero, Enemy, types)
│   ├── systems/          # Game systems (Combat, Dice, Progression)
│   ├── ui/              # UI components and managers
│   ├── config/          # Game configuration and constants
│   ├── utils/           # Utility functions and helpers
│   └── main.ts          # Entry point
├── public/
│   └── assets/          # Game assets (sprites, audio, fonts)
├── docs/                # Additional documentation
├── index.html           # HTML entry point
└── package.json         # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Commands

```bash
npm run dev          # Start dev server on localhost:3000
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript type checking
```

## 🎯 Development Phases

### Phase 1: Core Prototype (CURRENT)
- [x] Project structure setup
- [x] Basic Phaser configuration
- [x] Scene management (Boot, Preload, MainMenu, Combat)
- [x] Entity types and interfaces
- [x] Basic combat system structure
- [ ] Simple dice rolling mechanic
- [ ] Basic combat UI (1 hero vs 1 enemy)
- [ ] HP tracking and death

### Phase 2: Tactical Depth
- [ ] Multiple heroes in party (3-5)
- [ ] Different hero classes with unique dice
- [ ] Varied enemy types
- [ ] Targeting system
- [ ] Status effects
- [ ] Hero synergies

### Phase 3: Roguelike Progression
- [ ] Room/encounter system
- [ ] Reward choices (gold, upgrades, new heroes)
- [ ] Shop system
- [ ] Hero upgrades and customization
- [ ] Permadeath and run restart
- [ ] Meta-progression

### Phase 4: Polish & Content
- [ ] Animations and visual effects
- [ ] Sound effects and music
- [ ] Particle effects
- [ ] Multiple difficulty modes
- [ ] Achievement system
- [ ] Balance tuning

## 🛠️ Technology Stack

- **Engine**: Phaser 3.80+
- **Language**: TypeScript 5.3+
- **Build Tool**: Vite 5+
- **Code Quality**: ESLint + Prettier
- **Rendering**: WebGL/Canvas (via Phaser)

## 📁 Key Files

- `src/main.ts` - Game initialization
- `src/config/gameConfig.ts` - Game constants and configuration
- `src/entities/types.ts` - Core type definitions
- `src/entities/EntityFactory.ts` - Factory for creating heroes/enemies
- `src/systems/CombatSystem.ts` - Combat logic and calculations
- `src/scenes/CombatScene.ts` - Main gameplay scene

## 🎨 Design Principles

1. **Simple but Deep**: Easy to learn, difficult to master
2. **Strategic Choices**: Every decision matters
3. **Fair RNG**: Randomness that feels good
4. **Clear Feedback**: Player always knows what's happening
5. **Roguelike Loop**: High replayability through variety

## 🔧 Code Conventions

- Use TypeScript strict mode
- Follow ESLint and Prettier rules
- Prefer composition over inheritance
- Keep functions small and focused
- Document public APIs with JSDoc
- Use absolute imports with path aliases (@/)

## 📝 Development Notes

### Dice System
Each hero has a 6-sided die (can be expanded). Dice faces can show:
- **Attack**: Deals damage to enemies
- **Defense**: Blocks incoming damage
- **Heal**: Restores HP to heroes
- **Special**: Unique effects per hero class

### Combat Flow
1. Player rolls all hero dice
2. Player can choose to reroll (limited)
3. Player assigns actions/targets
4. Enemies reveal their intentions
5. Resolution phase (simultaneous)
6. Check victory/defeat conditions

### Balance Guidelines
- Early game: Focus on learning mechanics
- Mid game: Introduce synergies and complexity
- Late game: Test mastery and optimization

## 🤝 Contributing

This is a personal project, but feedback and suggestions are welcome!

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- Inspired by **Slice and Dice** by titeuf
- Built with **Phaser** game framework
- Developed by Jael

---

**Current Version**: 0.1.0 (Phase 1 - Core Prototype)
**Last Updated**: 2025-01-07
