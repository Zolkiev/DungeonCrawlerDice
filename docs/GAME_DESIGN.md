# Game Design Document

## Core Concept

**Genre**: Tactical Roguelike, Dice-based Combat
**Platform**: Web Browser
**Target Audience**: Fans of tactical games, roguelikes, and Slice and Dice

## High-Level Overview

Dungeon Crawler Dice is a turn-based tactical game where players control a party of heroes, each represented by a die. Players roll their heroes' dice each turn and use the results to attack enemies, defend themselves, heal allies, or activate special abilities. The game features roguelike progression with permadeath, random encounters, and strategic decision-making.

## Core Gameplay Loop

```
1. Enter a room/encounter
2. See enemy composition and intentions
3. Roll all hero dice
4. (Optional) Reroll some dice
5. Assign targets and actions
6. Resolve turn simultaneously
7. Repeat until victory or defeat
8. Receive rewards (gold, upgrades, new heroes)
9. Choose next encounter type
10. Repeat until run ends (death or victory)
```

## Game Mechanics

### Dice System

#### Dice Faces
Each die has 6 faces showing one of these types:
- **Attack**: Deals damage to enemies (values: 1-6)
- **Defense**: Blocks incoming damage (values: 1-5)
- **Heal**: Restores HP to heroes (values: 1-4)
- **Special**: Unique effects per hero class (values: vary)

#### Rolling
- All hero dice are rolled simultaneously at turn start
- Players can see results before committing actions
- Limited rerolls available (1-2 per turn)
- Some abilities can manipulate dice results

### Hero Classes

#### Warrior
**Role**: Tank/Damage dealer
**Dice Distribution**:
- 4 Attack faces (2, 2, 3, 4)
- 2 Defense faces (2, 3)
**Strengths**: High damage, good survivability
**Weaknesses**: No healing, no utility

#### Rogue
**Role**: High damage, risky
**Dice Distribution**:
- 4 Attack faces (2, 3, 3, 4)
- 1 Defense face (1)
- 1 Special face (5 - Critical Strike)
**Strengths**: Highest potential damage
**Weaknesses**: Squishy, inconsistent

#### Cleric
**Role**: Healer/Support
**Dice Distribution**:
- 3 Heal faces (2, 3, 4)
- 2 Defense faces (2, 3)
- 1 Attack face (2)
**Strengths**: Party sustain, defensive
**Weaknesses**: Low damage

#### Mage
**Role**: Area damage, utility
**Dice Distribution**:
- 3 Attack faces (2, 3, 4)
- 1 Defense face (1)
- 2 Special faces (4, 6 - Fireball hits all enemies)
**Strengths**: Multi-target damage
**Weaknesses**: Fragile, RNG-dependent

### Combat System

#### Turn Structure
1. **Preparation Phase**: View enemy intentions
2. **Roll Phase**: All hero dice are rolled
3. **Reroll Phase** (optional): Reroll some dice
4. **Action Phase**: Assign targets and actions
5. **Resolution Phase**: All actions resolve simultaneously
6. **Cleanup Phase**: Check win/loss, prepare next turn

#### Damage Calculation
```
Actual Damage = Attack Value - Target's Defense
Minimum Damage = 1 (attacks always deal at least 1)
```

#### Death and Defeat
- Heroes: When HP reaches 0, hero dies permanently (for this run)
- Enemies: When HP reaches 0, enemy is removed from combat
- Party Wipe: If all heroes die, run ends
- Victory: All enemies defeated

### Progression System

#### Run Progression
- 15-20 encounters per run
- Act 1: Encounters 1-5 (Easy)
- Act 2: Encounters 6-10 (Medium)
- Act 3: Encounters 11-15 (Hard)
- Final Boss: Encounter 15-20

#### Between Encounters
Players choose from 3 options:
1. **Combat**: Fight enemies for gold and rewards
2. **Shop**: Spend gold on upgrades and items
3. **Rest**: Heal all heroes for 50% max HP
4. **Event**: Random encounter with choices

#### Rewards
After each combat:
- **Gold**: 10-30 gold (scales with difficulty)
- **Choice of 1 of 3**:
  - New hero
  - Upgrade existing hero's dice
  - Item/artifact

#### Hero Upgrades
Upgrades improve dice faces:
- Increase value (+1 to a face)
- Change type (Attack → Special)
- Add new effect (Attack also heals)
- Increase rerolls available

### Enemy Design

#### Basic Enemies

**Goblin**
- HP: 6
- Dice: [Attack 1, Attack 2, Attack 3, Defend 2]
- Behavior: Aggressive, low defense

**Orc Warrior**
- HP: 12
- Dice: [Attack 3, Attack 4, Attack 5, Defend 3]
- Behavior: High damage threat

**Skeleton Archer**
- HP: 8
- Dice: [Attack 2, Attack 2, Attack 3, Defend 2]
- Behavior: Targets lowest HP hero

**Dark Mage**
- HP: 10
- Dice: [Attack 4, Attack 3, Special 6, Defend 1]
- Behavior: AOE attacks, fragile

#### Elite Enemies
- 1.5x HP of basic version
- Better dice
- Special abilities
- Appear in Act 2+

#### Boss Enemies
- 3x HP of elite version
- Unique mechanics
- Multi-phase fights
- Guaranteed good rewards

### Meta-Progression

#### Unlockables (Future)
- New hero classes
- New starting loadouts
- Difficulty modifiers
- Challenge modes

#### Achievements
- First victory
- Win with each class
- Win without losing a hero
- Complete specific challenges

## Balance Guidelines

### Early Game (Act 1)
- Teach mechanics gradually
- Enemies have low HP
- Rewards are generous
- Forgiving RNG

### Mid Game (Act 2)
- Test player understanding
- Enemy synergies appear
- Choices become crucial
- Reward optimization matters

### Late Game (Act 3)
- Test mastery
- Tight resource management
- Punish mistakes
- Require optimal plays

### Difficulty Modes (Future)

**Normal**: Standard experience
**Hard**: +25% enemy HP, better enemy dice
**Nightmare**: +50% enemy HP, elite enemies appear earlier
**Custom**: Player-adjustable modifiers

## UI/UX Design

### Main Menu
- Start New Run
- Continue Run (if available)
- Settings
- How to Play
- Credits

### Combat UI Layout

```
┌─────────────────────────────────────┐
│  TURN: 5      GOLD: 127     ⚙️      │
├─────────────────────────────────────┤
│                                     │
│  [Enemy 1] [Enemy 2] [Enemy 3]     │
│   HP: 8/12  HP: 5/8   HP: 10/10    │
│   Intent:   Intent:   Intent:       │
│   ⚔️ 4      🛡️ 3     ⚔️ 2          │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  [ Rolled Dice Results ]            │
│  🎲 🎲 🎲                           │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  [Hero 1]  [Hero 2]   [Hero 3]     │
│  ♥️ 8/10   ♥️ 5/10   ♥️ 10/10      │
│  Warrior   Cleric    Mage          │
│  [Dice]    [Dice]    [Dice]        │
│                                     │
├─────────────────────────────────────┤
│  [Roll Dice] [Reroll] [End Turn]   │
└─────────────────────────────────────┘
```

### Visual Feedback

**Dice Roll Animation**
- Dice tumble on screen
- Each die shows all faces quickly
- Settles on result with bounce
- Duration: ~1 second

**Damage Numbers**
- Pop up above target
- Red for damage, green for healing
- Larger for critical hits
- Fade out after 0.5s

**Status Effects**
- Icons above characters
- Tooltip on hover
- Pulsing animation
- Color-coded by type

### Color Scheme

- **Background**: Dark gray (#2d2d2d)
- **UI Elements**: Medium gray (#444444)
- **Text**: White (#ffffff)
- **Attack**: Red (#ff4444)
- **Defense**: Blue (#4444ff)
- **Heal**: Green (#44ff44)
- **Special**: Purple (#ff44ff)
- **Gold**: Yellow (#ffdd44)

## Sound Design

### Music
- Main Menu: Mysterious, inviting
- Combat: Tense, rhythmic
- Victory: Triumphant fanfare
- Defeat: Somber, melancholic
- Shop: Calm, exploratory

### Sound Effects
- **Dice Roll**: Wooden dice clatter
- **Attack Hit**: Impact sound (varies by type)
- **Heal**: Magical sparkle
- **Button Click**: Satisfying click
- **Enemy Death**: Defeat sound
- **Hero Death**: Dramatic impact
- **Level Up**: Ascending chime
- **Gold Collect**: Coin jingle

## Technical Constraints

### Performance Targets
- 60 FPS on modern browsers
- Load time: <3 seconds
- Works on mobile (responsive)

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Accessibility
- Keyboard navigation
- Colorblind mode (future)
- Screen reader support (future)
- Adjustable text size

## Development Roadmap

### Phase 1: Core Prototype (Week 1-2)
- Basic dice rolling
- Simple combat (1v1)
- HP tracking
- Win/loss conditions

### Phase 2: Tactical Depth (Week 3-4)
- Multiple heroes (3-5)
- Different hero classes
- Enemy variety
- Targeting system

### Phase 3: Roguelike Loop (Week 5-6)
- Run progression
- Rewards system
- Shop
- Hero upgrades

### Phase 4: Polish (Week 7-8)
- Animations
- Sound effects
- Visual effects
- Balance tuning
- Bug fixes

### Phase 5: Content (Week 9+)
- More hero classes
- More enemies
- More encounters
- Meta-progression

## Success Metrics

### Fun Factor
- Players want to replay
- "One more run" syndrome
- Strategic depth satisfaction

### Balance
- No dominant strategy
- All hero classes viable
- Fair difficulty curve

### Technical
- No game-breaking bugs
- Smooth performance
- Quick iteration time

## Risks and Mitigations

### Risk: RNG Frustration
**Mitigation**: 
- Allow rerolls
- Balanced dice distributions
- Visible enemy intentions
- Multiple strategic options

### Risk: Too Simple
**Mitigation**:
- Deep synergies
- Meaningful upgrades
- Skill expression in choices

### Risk: Too Complex
**Mitigation**:
- Gradual tutorial
- Clear UI
- Tooltips everywhere
- Onboarding runs

### Risk: Poor Balance
**Mitigation**:
- Extensive playtesting
- Telemetry (future)
- Community feedback
- Regular updates

## References and Inspiration

- **Slice and Dice**: Core mechanic inspiration
- **Slay the Spire**: Roguelike structure
- **Into the Breach**: Tactical transparency
- **Dicey Dungeons**: Dice-based gameplay
- **FTL**: Event system, difficulty curve

---

**Document Version**: 1.0
**Last Updated**: 2025-01-07
**Author**: Jael
