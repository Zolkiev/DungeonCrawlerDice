# Development TODO List

## Phase 1: Core Prototype (CURRENT PHASE)

### Project Setup ✅
- [x] Initialize project structure
- [x] Configure TypeScript, Vite, ESLint, Prettier
- [x] Create base Phaser configuration
- [x] Set up scene management
- [x] Create entity type definitions
- [x] Create basic systems structure
- [x] Write documentation (README, ARCHITECTURE, GAME_DESIGN)

### Core Combat Mechanics (Priority 1)
- [ ] Implement DiceSystem
  - [ ] Random dice rolling logic
  - [ ] Roll animation
  - [ ] Display rolled results
  - [ ] Reroll functionality
- [ ] Basic Combat UI
  - [ ] Hero display component
  - [ ] Enemy display component
  - [ ] HP bars
  - [ ] Dice result display
- [ ] Combat Resolution
  - [ ] Implement turn-based flow
  - [ ] Apply damage/healing
  - [ ] Check death conditions
  - [ ] Victory/defeat screens

### Minimal Playable Prototype (Priority 2)
- [ ] Create test combat scenario (1 hero vs 1 enemy)
- [ ] Implement basic AI for enemies
- [ ] Add simple win/loss conditions
- [ ] Test and iterate on feel

### Testing & Polish (Priority 3)
- [ ] Fix any critical bugs
- [ ] Test on different browsers
- [ ] Get initial feedback
- [ ] Document learnings

---

## Phase 2: Tactical Depth

### Party System
- [ ] Multiple hero support (3-5 heroes)
- [ ] Hero selection screen
- [ ] Party composition UI
- [ ] Implement all 4 hero classes
  - [ ] Warrior dice and abilities
  - [ ] Rogue dice and abilities
  - [ ] Cleric dice and abilities
  - [ ] Mage dice and abilities

### Enemy Variety
- [ ] Create 5+ enemy types
- [ ] Implement enemy AI behaviors
- [ ] Enemy intention display
- [ ] Elite enemy variants

### Targeting & Strategy
- [ ] Targeting system (select enemy)
- [ ] Multi-target abilities
- [ ] AOE effects
- [ ] Status effects framework
- [ ] Hero synergies

### Enhanced Combat UI
- [ ] Better hero panels with all info
- [ ] Enemy panels with intentions
- [ ] Action buttons and controls
- [ ] Turn indicator
- [ ] Combat log/message area

---

## Phase 3: Roguelike Progression

### Run Structure
- [ ] Room/encounter system
- [ ] Map/path selection UI
- [ ] Different encounter types
  - [ ] Combat encounters
  - [ ] Shop
  - [ ] Rest site
  - [ ] Random events
- [ ] Boss fights
- [ ] Run victory condition

### Rewards System
- [ ] Gold currency
- [ ] Post-combat rewards screen
- [ ] Reward choices (3 options)
- [ ] Hero recruitment
- [ ] Dice upgrade system
- [ ] Item/artifact system

### Shop System
- [ ] Shop UI
- [ ] Purchasable upgrades
- [ ] Hero for sale
- [ ] Remove hero option
- [ ] Shop inventory generation

### Progression & Balance
- [ ] Difficulty scaling per act
- [ ] Enemy stat scaling
- [ ] Reward scaling
- [ ] Balance testing
- [ ] Difficulty modes

---

## Phase 4: Polish & Content

### Animations & VFX
- [ ] Smooth dice roll animations
- [ ] Attack animations
- [ ] Hit effects and particles
- [ ] Heal effects
- [ ] Death animations
- [ ] UI transitions
- [ ] Screen shake on big hits

### Audio
- [ ] Background music (3-4 tracks)
- [ ] Dice roll SFX
- [ ] Combat SFX (attack, heal, defend)
- [ ] UI SFX (button clicks)
- [ ] Victory/defeat jingles
- [ ] Ambient sounds

### Visual Polish
- [ ] Hero sprites (pixel art)
- [ ] Enemy sprites
- [ ] Dice sprites
- [ ] Background art
- [ ] UI improvements
- [ ] Particle effects
- [ ] Screen effects (vignette, etc.)

### UX Improvements
- [ ] Tutorial/how to play
- [ ] Tooltips everywhere
- [ ] Better feedback on actions
- [ ] Settings menu
  - [ ] Volume controls
  - [ ] Resolution options
  - [ ] Fullscreen toggle
- [ ] Keyboard shortcuts
- [ ] Mobile support (touch controls)

### Content Expansion
- [ ] 2+ more hero classes
- [ ] 10+ more enemy types
- [ ] 5+ boss fights
- [ ] Special encounters
- [ ] Achievements system

---

## Phase 5: Meta-Progression & Endgame

### Save System
- [ ] LocalStorage implementation
- [ ] Save/load run state
- [ ] Save game progress
- [ ] Cloud saves (optional)

### Meta-Progression
- [ ] Unlock system
- [ ] Permanent upgrades
- [ ] New starting options
- [ ] Challenge modes
- [ ] Daily runs

### Community Features
- [ ] Leaderboards
- [ ] Share runs/builds
- [ ] Statistics tracking
- [ ] Player feedback system

---

## Ongoing Tasks

### Code Quality
- [ ] Write unit tests
- [ ] Refactor as needed
- [ ] Code reviews
- [ ] Performance profiling
- [ ] Fix technical debt

### Documentation
- [ ] Keep README updated
- [ ] Document new systems
- [ ] API documentation
- [ ] Changelog maintenance

### Testing
- [ ] Cross-browser testing
- [ ] Mobile testing
- [ ] Accessibility testing
- [ ] Playtesting sessions
- [ ] Balance adjustments

### Community
- [ ] Gather feedback
- [ ] Bug reports
- [ ] Feature requests
- [ ] Discord/community setup (optional)

---

## Known Issues

### High Priority
- [ ] None yet (just started!)

### Medium Priority
- [ ] Need to add proper path resolution for Vite aliases
- [ ] Need to test on mobile devices

### Low Priority
- [ ] Consider adding WebGL fallback
- [ ] Optimize bundle size

---

## Ideas & Future Considerations

### Gameplay Ideas
- [ ] Co-op multiplayer mode
- [ ] PvP mode
- [ ] Custom hero creator
- [ ] Mod support
- [ ] Seasonal content

### Technical Ideas
- [ ] Analytics integration
- [ ] A/B testing framework
- [ ] Telemetry for balance
- [ ] Auto-updater

### Business Ideas
- [ ] Monetization strategy (if needed)
- [ ] Marketing plan
- [ ] Community building
- [ ] Tournaments

---

## Notes

### Current Focus
**Phase 1 - Core Combat Mechanics**
Working on implementing the basic dice rolling and combat system. Goal is to have a simple 1v1 combat prototype working.

### Next Milestone
Get a playable prototype where:
1. One hero can roll dice
2. Results are displayed
3. One enemy takes damage
4. Victory condition is met

### Blockers
- None currently

### Questions
- Should rerolls be limited per turn or per run?
- How to balance RNG vs skill?
- What's the minimum viable prototype scope?

---

**Last Updated**: 2025-01-07
**Current Phase**: Phase 1 - Core Prototype
**Completion**: ~10% (Project setup complete)
