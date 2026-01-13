import Phaser from 'phaser';
import { Hero, Enemy, CombatPhase, DiceResult, HeroClass } from '@entities/types';
import { EntityFactory } from '@entities/EntityFactory';
import { DiceSystem } from '@systems/DiceSystem';
import { CombatSystem } from '@systems/CombatSystem';
import { GameConstants } from '@config/gameConfig';
import { HeroCard } from '@ui/HeroCard';
import { EnemyCard } from '@ui/EnemyCard';
import { Dice3D } from '@ui/Dice3D';
import { DiceTooltip } from '@ui/DiceTooltip';

/**
 * CombatScene - With separate dice cleanup for players/enemies
 */
export class CombatScene extends Phaser.Scene {
  private heroes: Hero[] = [];
  private enemies: Enemy[] = [];
  private phase: CombatPhase = CombatPhase.ENEMY_ROLL;

  private heroCards: HeroCard[] = [];
  private enemyCards: EnemyCard[] = [];
  private heroDiceMap: Map<string, Dice3D> = new Map();
  private enemyDiceMap: Map<string, Dice3D> = new Map();
  private centerDice: Dice3D[] = [];
  
  private messageText!: Phaser.GameObjects.Text;
  private rerollButton!: Phaser.GameObjects.Text;
  private doneButton!: Phaser.GameObjects.Text;
  private rerollCountText!: Phaser.GameObjects.Text;

  private rerollsRemaining = GameConstants.MAX_REROLLS;
  private playerDiceResults: DiceResult[] = [];
  private enemyDiceResults: DiceResult[] = [];
  private enemyActions: any[] = [];

  private selectedDice: Dice3D | null = null;
  private hoveredEnemyIndex: number | null = null;
  private hoveredHeroIndex: number | null = null;
  
  private diceTooltip!: DiceTooltip;
  private tooltipTimer?: Phaser.Time.TimerEvent;
  
  private endTurnButton!: Phaser.GameObjects.Text;
  private confirmationOverlay!: Phaser.GameObjects.Container;
  
  private currentMana: number = 0;
  private manaText!: Phaser.GameObjects.Text;
  private spell1Button!: Phaser.GameObjects.Text;
  private spell2Button!: Phaser.GameObjects.Text;
  private selectedSpell: 'fireball' | 'shield' | null = null;

  constructor() {
    super({ key: 'CombatScene' });
  }

  create(): void {
    this.initializeCombat();
    this.createUI();
	this.diceTooltip = new DiceTooltip(this);
    this.startTurn();
  }

  private cleanupScene(): void {
    // CRITICAL: Remove all timers FIRST
    this.time.removeAllEvents();
    
    // Stop all tweens
    this.tweens.killAll();

    // Destroy ALL center dice completely
    this.centerDice.forEach((dice) => {
      if (dice && dice.scene) {
        dice.removeAllListeners();
        dice.destroy(true);
      }
    });
    this.centerDice = [];

    // Destroy enemy dice in map
    this.enemyDiceMap.forEach((dice) => {
      if (dice && dice.scene) {
        dice.removeAllListeners();
        dice.destroy(true);
      }
    });
    this.enemyDiceMap.clear();

    // Destroy hero dice in map
    this.heroDiceMap.forEach((dice) => {
      if (dice && dice.scene) {
        dice.removeAllListeners();
        dice.destroy(true);
      }
    });
    this.heroDiceMap.clear();

    // Clean up cards
    this.heroCards.forEach(card => {
      if (card && card.scene) {
        card.removeAllListeners();
        card.destroy(true);
      }
    });
    this.heroCards = [];

    this.enemyCards.forEach(card => {
      if (card && card.scene) {
        card.removeAllListeners();
        card.destroy(true);
      }
    });
    this.enemyCards = [];
	
	// Clean up tooltip timer
	if (this.tooltipTimer) {
	  this.tooltipTimer.destroy();
	  this.tooltipTimer = undefined;
	}

	// Destroy tooltip
	if (this.diceTooltip) {
	  this.diceTooltip.destroy();
	}
	
	// Hide end turn button
	if (this.endTurnButton) {
	  this.endTurnButton.setVisible(false);
	}

	// Destroy confirmation overlay if exists
	if (this.confirmationOverlay) {
	  this.confirmationOverlay.destroy();
	}
  }

  private initializeCombat(): void {
    this.heroes = EntityFactory.createDefaultParty();
    this.enemies = EntityFactory.createDefaultEnemies();
    this.phase = CombatPhase.ENEMY_ROLL;
    this.rerollsRemaining = GameConstants.MAX_REROLLS;
    this.playerDiceResults = [];
    this.enemyDiceResults = [];
    this.enemyActions = [];
    this.selectedDice = null;
    this.hoveredEnemyIndex = null;
    this.hoveredHeroIndex = null;
    this.heroDiceMap.clear();
    this.enemyDiceMap.clear();
	this.currentMana = 0;
    this.selectedSpell = null;
  }

  private createUI(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add.rectangle(0, 0, width, height, 0x1a1a2a).setOrigin(0, 0);

    const title = this.add.text(width / 2, 20, 'COMBAT', {
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);

    this.createBackButton();
    this.createHeroCards();
    this.createEnemyCards();

    this.messageText = this.add.text(width / 2, 60, '', {
      fontSize: '20px',
      color: '#ffff44',
      align: 'center',
      fontStyle: 'bold',
    });
    this.messageText.setOrigin(0.5);

    this.createControlButtons();
  }

  private createHeroCards(): void {
    const startX = 125;
    const startY = 115;
    const spacing = 78;

    this.heroes.forEach((hero, index) => {
      const card = new HeroCard(this, startX, startY + index * spacing, hero);
      this.heroCards.push(card);

      card.setInteractive(
        new Phaser.Geom.Rectangle(-115, -35, 230, 70),
        Phaser.Geom.Rectangle.Contains
      );

      card.on('pointerover', () => this.handleHeroHover(index));
      card.on('pointerout', () => this.handleHeroHoverOut(index));
      card.on('pointerup', () => this.handleHeroCardClick(index));
    });
  }

  private createEnemyCards(): void {
    const width = this.cameras.main.width;
    const startX = width - 125;
    const startY = 130;
    const spacing = 85;

    this.enemies.forEach((enemy, index) => {
      const card = new EnemyCard(this, startX, startY + index * spacing, enemy);
      this.enemyCards.push(card);

      card.setInteractive(
        new Phaser.Geom.Rectangle(-115, -35, 230, 70),
        Phaser.Geom.Rectangle.Contains
      );

      card.on('pointerover', () => this.handleEnemyHover(index));
      card.on('pointerout', () => this.handleEnemyHoverOut(index));
      card.on('pointerup', () => this.handleEnemyClick(index));
    });
  }

  private createControlButtons(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const buttonY = height - 50;

    this.rerollButton = this.add.text(120, buttonY, '🎲 Reroll', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#ff5544',
      padding: { x: 24, y: 12 },
    });
    this.rerollButton.setOrigin(0.5);
    this.rerollButton.setInteractive({ useHandCursor: true });
    this.rerollButton.setVisible(false);

    this.rerollButton.on('pointerover', () => {
      if (this.rerollButton.alpha === 1) this.rerollButton.setBackgroundColor('#ff7766');
    });
    this.rerollButton.on('pointerout', () => {
      this.rerollButton.setBackgroundColor('#ff5544');
    });
    this.rerollButton.on('pointerup', () => {
      this.handleReroll();
    });

    this.rerollCountText = this.add.text(120, buttonY + 38, '', {
      fontSize: '16px',
      color: '#dddddd',
      fontStyle: 'bold',
    });
    this.rerollCountText.setOrigin(0.5);

    this.doneButton = this.add.text(width - 150, buttonY, '✓ Done Rolling', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#44aa44',
      padding: { x: 24, y: 12 },
    });
    this.doneButton.setOrigin(0.5);
    this.doneButton.setInteractive({ useHandCursor: true });
    this.doneButton.setVisible(false);

    this.doneButton.on('pointerover', () => {
      this.doneButton.setBackgroundColor('#55cc55');
    });
    this.doneButton.on('pointerout', () => {
      this.doneButton.setBackgroundColor('#44aa44');
    });
    this.doneButton.on('pointerup', () => {
      this.handleDoneRolling();
    });
	
	this.endTurnButton = this.add.text(width / 2, buttonY, '⏭️ End Turn', {
    fontSize: '24px',
    color: '#ffffff',
    backgroundColor: '#ff8800',
    padding: { x: 24, y: 12 },
	  });
	  this.endTurnButton.setOrigin(0.5);
	  this.endTurnButton.setInteractive({ useHandCursor: true });
	  this.endTurnButton.setVisible(false);

	  this.endTurnButton.on('pointerover', () => {
		this.endTurnButton.setBackgroundColor('#ffaa22');
	  });
	  this.endTurnButton.on('pointerout', () => {
		this.endTurnButton.setBackgroundColor('#ff8800');
	  });
	  this.endTurnButton.on('pointerup', () => {
		this.handleEndTurn();
	  });
	  
	  // MANA DISPLAY
    this.manaText = this.add.text(width / 2, buttonY - 60, '💎 Mana: 0', {
      fontSize: '22px',
      color: '#88ddff',
      fontStyle: 'bold',
    });
    this.manaText.setOrigin(0.5);
    this.manaText.setVisible(false);

    // SPELL 1: FIREBALL
    this.spell1Button = this.add.text(width / 2 - 200, buttonY, '🔥 Fireball\n💎 2', {
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#cc3333',
      padding: { x: 16, y: 10 },
      align: 'center',
    });
    this.spell1Button.setOrigin(0.5);
    this.spell1Button.setInteractive({ useHandCursor: true });
    this.spell1Button.setVisible(false);
    this.spell1Button.setAlpha(0.5);

    this.spell1Button.on('pointerover', () => {
      if (this.spell1Button.alpha === 1) this.spell1Button.setBackgroundColor('#ee5555');
    });
    this.spell1Button.on('pointerout', () => {
      if (this.spell1Button.alpha === 1) this.spell1Button.setBackgroundColor('#cc3333');
    });
    this.spell1Button.on('pointerup', () => {
      if (this.currentMana >= 2) this.selectSpell('fireball');
    });

    // SPELL 2: SHIELD
    this.spell2Button = this.add.text(width / 2 + 190, buttonY, '🛡️ Shield\n💎 2', {
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#3366cc',
      padding: { x: 16, y: 10 },
      align: 'center',
    });
    this.spell2Button.setOrigin(0.5);
    this.spell2Button.setInteractive({ useHandCursor: true });
    this.spell2Button.setVisible(false);
    this.spell2Button.setAlpha(0.5);

    this.spell2Button.on('pointerover', () => {
      if (this.spell2Button.alpha === 1) this.spell2Button.setBackgroundColor('#5588ee');
    });
    this.spell2Button.on('pointerout', () => {
      if (this.spell2Button.alpha === 1) this.spell2Button.setBackgroundColor('#3366cc');
    });
    this.spell2Button.on('pointerup', () => {
      if (this.currentMana >= 2) this.selectSpell('shield');
    });
  }
  
  /**
 * Handle End Turn button click
 */
	private handleEndTurn(): void {
	  // Count unassigned dice
	  let unassignedCount = 0;
	  this.heroDiceMap.forEach((dice) => {
		if (!dice.isAssigned) {
		  unassignedCount++;
		}
	  });

	  if (unassignedCount > 0) {
		// Show confirmation popup
		this.showEndTurnConfirmation(unassignedCount);
	  } else {
		// All dice assigned, proceed directly
		this.proceedToResolution();
	  }
	}

/**
 * Show confirmation popup for ending turn with unassigned dice
 */
	private showEndTurnConfirmation(unassignedCount: number): void {
	  const width = this.cameras.main.width;
	  const height = this.cameras.main.height;

	  // Create overlay container
	  this.confirmationOverlay = this.add.container(0, 0);
	  this.confirmationOverlay.setDepth(1000);

	  // Semi-transparent background
	  const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
	  overlay.setOrigin(0, 0);
	  this.confirmationOverlay.add(overlay);

	  // Popup box
	  const boxWidth = 400;
	  const boxHeight = 200;
	  const box = this.add.rectangle(width / 2, height / 2, boxWidth, boxHeight, 0x2a2a4a);
	  box.setStrokeStyle(4, 0xffaa44);
	  this.confirmationOverlay.add(box);

	  // Warning icon
	  const warningIcon = this.add.text(width / 2, height / 2 - 60, '⚠️', {
		fontSize: '48px',
	  });
	  warningIcon.setOrigin(0.5);
	  this.confirmationOverlay.add(warningIcon);

	  // Warning text
	  const warningText = this.add.text(
		width / 2,
		height / 2 - 10,
		`You have ${unassignedCount} unassigned ${unassignedCount === 1 ? 'die' : 'dice'}!\nEnd turn anyway?`,
		{
		  fontSize: '20px',
		  color: '#ffdd44',
		  align: 'center',
		  fontStyle: 'bold',
		}
	  );
	  warningText.setOrigin(0.5);
	  this.confirmationOverlay.add(warningText);

	  // Cancel button
	  const cancelButton = this.add.text(width / 2 - 80, height / 2 + 60, 'Cancel', {
		fontSize: '22px',
		color: '#ffffff',
		backgroundColor: '#666666',
		padding: { x: 20, y: 10 },
	  });
	  cancelButton.setOrigin(0.5);
	  cancelButton.setInteractive({ useHandCursor: true });
	  this.confirmationOverlay.add(cancelButton);

	  cancelButton.on('pointerover', () => {
		cancelButton.setBackgroundColor('#888888');
	  });
	  cancelButton.on('pointerout', () => {
		cancelButton.setBackgroundColor('#666666');
	  });
	  cancelButton.on('pointerup', () => {
		this.confirmationOverlay.destroy();
	  });

	  // Confirm button
	  const confirmButton = this.add.text(width / 2 + 80, height / 2 + 60, 'End Turn', {
		fontSize: '22px',
		color: '#ffffff',
		backgroundColor: '#ff4444',
		padding: { x: 20, y: 10 },
	  });
	  confirmButton.setOrigin(0.5);
	  confirmButton.setInteractive({ useHandCursor: true });
	  this.confirmationOverlay.add(confirmButton);

	  confirmButton.on('pointerover', () => {
		confirmButton.setBackgroundColor('#ff6666');
	  });
	  confirmButton.on('pointerout', () => {
		confirmButton.setBackgroundColor('#ff4444');
	  });
	  confirmButton.on('pointerup', () => {
		this.confirmationOverlay.destroy();
		this.proceedToResolution();
	  });
	}

  private createBackButton(): void {
    const backButton = this.add.text(20, 20, '← Back', {
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#333333',
      padding: { x: 12, y: 8 },
    });
    backButton.setInteractive({ useHandCursor: true });

    backButton.on('pointerover', () => {
      backButton.setBackgroundColor('#555555');
    });
    backButton.on('pointerout', () => {
      backButton.setBackgroundColor('#333333');
    });
    backButton.on('pointerup', () => {
      // Clean up BEFORE changing scene
      this.cleanupScene();
      
      // Now switch to menu
      this.scene.start('MainMenuScene');
    });
  }

  private startTurn(): void {
    this.phase = CombatPhase.ENEMY_ROLL;
    this.rerollsRemaining = GameConstants.MAX_REROLLS;
    this.playerDiceResults = [];
    this.enemyDiceResults = [];
    this.enemyActions = [];
    this.selectedDice = null;
    this.hoveredEnemyIndex = null;
    this.hoveredHeroIndex = null;
    this.heroDiceMap.clear();
    this.enemyDiceMap.clear();
    this.selectedSpell = null;

    this.heroes.forEach((h) => (h.incomingDamage = 0));
    this.enemies.forEach((e) => (e.incomingDamage = 0));
    this.updateAllCards();

    this.clearAllDice();
    this.clearAllHighlights();

    this.messageText.setText('Enemies are rolling...');

    this.time.delayedCall(500, () => {
      this.enemyRollPhase();
    });
  }

  private enemyRollPhase(): void {
    this.phase = CombatPhase.ENEMY_ROLL;

    this.enemyDiceResults = [];
    this.enemies.forEach((enemy) => {
      if (!CombatSystem.isDead(enemy)) {
        const roll = DiceSystem.rollDice(enemy.dice);
        this.enemyDiceResults.push({
          characterId: enemy.id,
          face: roll,
          isLocked: false,
        });
      }
    });

    this.displayEnemyDiceRandom();

    this.time.delayedCall(1500, () => {
      this.autoAssignEnemyDice();
    });
  }

  /**
   * Position dice randomly but SAFELY within center zone
   */
  private displayEnemyDiceRandom(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const centerZone = {
      x: 250,
      y: 100,
      width: width - 500,
      height: height - 200,
    };

    const diceSize = 90;
    const diceRadius = diceSize / 2;
    const positions: { x: number; y: number }[] = [];

    this.enemyDiceResults.forEach((result, index) => {
      let position: { x: number; y: number } | null = null;
      let attempts = 0;
      const maxAttempts = 100;

      while (!position && attempts < maxAttempts) {
        const testX = centerZone.x + diceRadius + Math.random() * (centerZone.width - diceSize);
        const testY = centerZone.y + diceRadius + Math.random() * (centerZone.height - diceSize);

        const overlaps = positions.some((pos) => {
          const dx = pos.x - testX;
          const dy = pos.y - testY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < diceSize;
        });

        if (!overlaps) {
          position = { x: testX, y: testY };
        }
        attempts++;
      }

      if (!position) {
        const gridCols = Math.ceil(Math.sqrt(this.enemyDiceResults.length));
        const row = Math.floor(index / gridCols);
        const col = index % gridCols;
        position = {
          x: centerZone.x + diceRadius + col * diceSize + diceSize / 2,
          y: centerZone.y + diceRadius + row * diceSize + diceSize / 2,
        };
      }

      positions.push(position);

      const dice = new Dice3D(
        this,
        position.x,
        position.y,
        result.face,
        result.characterId,
        false
      );

      dice.animateRoll();
	  this.setupDiceTooltip(dice, this.enemies.find(e => e.id === result.characterId)?.name || 'Enemy');
      this.centerDice.push(dice);
      this.enemyDiceMap.set(result.characterId, dice);
    });
  }

  private autoAssignEnemyDice(): void {
    this.phase = CombatPhase.ENEMY_ASSIGN;
    this.messageText.setText('Enemies assigning actions...');

    this.enemyDiceResults.forEach((result, index) => {
      const enemyIndex = this.enemies.findIndex((e) => e.id === result.characterId);
      if (enemyIndex >= 0) {
        const card = this.enemyCards[enemyIndex];
        const dice = this.enemyDiceMap.get(result.characterId);
        
        if (dice) {
          this.time.delayedCall(index * 150, () => {
            const targetPos = { x: card.x - 75, y: card.y };
            dice.animateToPosition(targetPos.x, targetPos.y, 0.6, () => {
              this.centerDice = this.centerDice.filter((d) => d !== dice);
              card.addDiceToBox(dice);
            });
          });
        }

        if (result.face.type === 'attack') {
          const aliveHeroes = this.heroes.filter((h) => !CombatSystem.isDead(h));
          if (aliveHeroes.length > 0) {
            const targetHero = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
            targetHero.incomingDamage += result.face.value;

            this.enemyActions.push({
              sourceId: result.characterId,
              targetId: targetHero.id,
              face: result.face,
            });
          }
        }
      }
    });

    this.time.delayedCall(this.enemyDiceResults.length * 150 + 800, () => {
      this.updateAllCards();
      this.messageText.setText('Enemy actions assigned. Your turn!');

      this.time.delayedCall(1000, () => {
        this.playerRollPhase();
      });
    });
  }

  private playerRollPhase(): void {
    this.phase = CombatPhase.PLAYER_ROLL;

    this.playerDiceResults = [];
    this.heroes.forEach((hero) => {
      if (!CombatSystem.isDead(hero)) {
        const roll = DiceSystem.rollDice(hero.dice);
        this.playerDiceResults.push({
          characterId: hero.id,
          face: roll,
          isLocked: false,
        });
      }
    });

    this.displayCenterDiceRandom();
    this.showPlayerControls();
    this.messageText.setText('Your roll! Lock dice or reroll');
  }

  /**
   * Position player dice - only clears PLAYER dice, not enemy dice
   */
  private displayCenterDiceRandom(): void {
    // IMPORTANT: Only clear player dice, NOT enemy dice!
    this.clearPlayerDice();

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const centerZone = {
      x: 250,
      y: 100,
      width: width - 500,
      height: height - 200,
    };

    const diceSize = 90;
    const diceRadius = diceSize / 2;
    const positions: { x: number; y: number }[] = [];

    this.playerDiceResults.forEach((result, index) => {
      let position: { x: number; y: number } | null = null;
      let attempts = 0;
      const maxAttempts = 100;

      while (!position && attempts < maxAttempts) {
        const testX = centerZone.x + diceRadius + Math.random() * (centerZone.width - diceSize);
        const testY = centerZone.y + diceRadius + Math.random() * (centerZone.height - diceSize);

        const overlaps = positions.some((pos) => {
          const dx = pos.x - testX;
          const dy = pos.y - testY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < diceSize;
        });

        if (!overlaps) {
          position = { x: testX, y: testY };
        }
        attempts++;
      }

      if (!position) {
        const gridCols = Math.ceil(Math.sqrt(this.playerDiceResults.length));
        const row = Math.floor(index / gridCols);
        const col = index % gridCols;
        position = {
          x: centerZone.x + diceRadius + col * diceSize + diceSize / 2,
          y: centerZone.y + diceRadius + row * diceSize + diceSize / 2,
        };
      }

      positions.push(position);

      const hero = this.heroes.find(h => h.id === result.characterId);
		const heroColor = hero ? this.getHeroClassColor(hero.class) : 0xffffff;

		const dice = new Dice3D(
		  this,
		  position.x,
		  position.y,
		  result.face,
		  result.characterId,
		  result.isLocked,
		  heroColor  // ← AJOUTE LA COULEUR
		);

      dice.on('clicked', (clickedDice: Dice3D) => {
        this.handleDiceClick(clickedDice);
      });

      dice.animateRoll();
	  // Add tooltip on hover
	  this.setupDiceTooltip(dice, this.heroes.find(h => h.id === result.characterId)?.name || 'Hero');
      this.centerDice.push(dice);
    });
  }
  
  private getHeroClassColor(heroClass: HeroClass): number {
	  switch (heroClass) {
		case HeroClass.THIEF:
		  return 0xff8844; // Orange
		case HeroClass.FIGHTER:
		  return 0xffdd44; // Jaune
		case HeroClass.DEFENDER:
		  return 0xaaaaaa; // Gris
		case HeroClass.CLERIC:
		case HeroClass.WARDEN:
		  return 0xff4444; // Rouge
		case HeroClass.MAGE:
		  return 0x4488ff; // Bleu
		default:
		  return 0xffffff;
	  }
	}

  private handleDiceClick(dice: Dice3D): void {
    if (this.phase !== CombatPhase.PLAYER_ROLL) return;

    const result = this.playerDiceResults.find((r) => r.characterId === dice.characterId);
    if (!result) return;
	
	// Cannot unlock permanently locked dice
	  if (result.isLocked && dice.isPermanentlyLocked()) {
		this.messageText.setText('This dice is locked! Reroll to change it');
		this.cameras.main.shake(100, 0.002);
		return;
	  }

    result.isLocked = !result.isLocked;
    dice.setLocked(result.isLocked);

    if (result.isLocked) {
      const heroIndex = this.heroes.findIndex((h) => h.id === dice.characterId);
      if (heroIndex >= 0) {
        const card = this.heroCards[heroIndex];
        const targetPos = card.getDiceBoxWorldPosition();
        
        dice.animateToPosition(targetPos.x, targetPos.y, 0.6, () => {
          this.centerDice = this.centerDice.filter((d) => d !== dice);
          card.addDiceToBox(dice);
          this.heroDiceMap.set(dice.characterId, dice);
        });
      }

      this.cameras.main.flash(100, 100, 255, 100, false);
    } else {
	  // Unlocking the dice - return it to center
	  const heroIndex = this.heroes.findIndex((h) => h.id === dice.characterId);
	  if (heroIndex >= 0) {
		this.heroCards[heroIndex].removeDiceFromBoxWithoutDestroy();
		this.heroDiceMap.delete(dice.characterId);
	  }

	  // Remove from card container and add back to scene
	  if (dice.parentContainer) {
		dice.parentContainer.remove(dice);
	  }
	  this.add.existing(dice);
	  
	  // Reset scale before animating
	  dice.setScale(1);

	  // ← REMPLACE TOUT LE BLOC DE CALCUL DE POSITION PAR CECI :
	  // Find a safe position that doesn't overlap with other center dice
	  const safePosition = this.findSafePositionForDice(this.centerDice);

	  // Animate to safe position
	  dice.animateToPosition(safePosition.x, safePosition.y, 1, () => {
		if (!this.centerDice.includes(dice)) {
		  this.centerDice.push(dice);
		}
	  });
    }
  }

  private showPlayerControls(): void {
    this.rerollButton.setVisible(true);
    this.doneButton.setVisible(true);

    if (this.rerollsRemaining > 0) {
      this.rerollButton.setAlpha(1);
      this.rerollButton.setInteractive();
      this.rerollCountText.setText(`${this.rerollsRemaining}/${GameConstants.MAX_REROLLS}`);
    } else {
      this.rerollButton.setAlpha(0.4);
      this.rerollButton.disableInteractive();
      this.rerollCountText.setText('No rerolls');
    }
  }

  private hidePlayerControls(): void {
    this.rerollButton.setVisible(false);
    this.doneButton.setVisible(false);
    this.rerollCountText.setText('');
  }

  private handleReroll(): void {
    if (this.rerollsRemaining <= 0) return;

    this.rerollsRemaining--;
    this.messageText.setText('Rerolling unlocked dice...');
	
	this.heroDiceMap.forEach((dice) => {
    if (dice.isLocked) {
		  dice.setPermanentlyLocked(true);
		}
	  });

    this.playerDiceResults.forEach((result) => {
      if (!result.isLocked) {
        const hero = this.heroes.find((h) => h.id === result.characterId);
        if (hero) {
          const newFace = DiceSystem.rollDice(hero.dice);
          result.face = newFace;

          const dice = this.centerDice.find((d) => d.characterId === result.characterId);
          if (dice) {
            dice.updateFace(newFace);
            dice.animateRoll();
          }
        }
      }
    });

    this.time.delayedCall(800, () => {
	if (this.rerollsRemaining === 0) {
		  // Last reroll used - auto-assign all dice
		  this.messageText.setText('No rerolls left! Assigning dice...');
		  this.centerDice.forEach(dice => {
			  dice.disableInteractive();
			});
		  this.time.delayedCall(1000, () => {
			this.handleDoneRolling();
		  });
		} else {
		  // Still have rerolls - show controls
		  this.showPlayerControls();
		  this.messageText.setText('New roll! Lock dice or reroll');
		}
	  });
  }

  private handleDoneRolling(): void {
    this.phase = CombatPhase.PLAYER_ASSIGN;
    this.hidePlayerControls();

    this.centerDice.forEach((dice) => {
	  dice.setInteractive();
      const heroIndex = this.heroes.findIndex((h) => h.id === dice.characterId);
      if (heroIndex >= 0) {
        const card = this.heroCards[heroIndex];
        const targetPos = card.getDiceBoxWorldPosition();
        dice.animateToPosition(targetPos.x, targetPos.y, 0.6, () => {
		  dice.setLocked(true);
          card.addDiceToBox(dice);
          this.heroDiceMap.set(dice.characterId, dice);
        });
      }
    });

    this.time.delayedCall(1000, () => {
      this.startManualAssignment();
    });
  }

	private startManualAssignment(): void {
	  this.selectedDice = null;
	  this.messageText.setText('Click on a dice to assign its action');

	  // Show end turn button
	  this.endTurnButton.setVisible(true);
	  this.manaText.setVisible(true);
	  this.spell1Button.setVisible(true);
	  this.spell2Button.setVisible(true);
	  this.updateManaUI();

	  // ← AJOUTE CECI : Remove old 'clicked' listeners and add 'diceSelected' listeners
	  this.heroDiceMap.forEach((dice) => {
		// Remove all previous listeners to avoid conflicts
		dice.removeAllListeners('clicked');
		dice.removeAllListeners('diceSelected');
		
		// Add new listener for dice selection during assignment phase
		dice.on('diceSelected', (selectedDice: Dice3D) => {
		  if (!selectedDice.isAssigned) {
			this.handleDiceSelected(selectedDice);
		  }
		});
	  });
	}

	private handleDiceSelected(dice: Dice3D): void {
	  console.log('🎯 handleDiceSelected appelé!', dice.characterId, dice.getFace().type);
	  const face = dice.getFace();
	  
	  // Empty face
	  if (face.type === 'empty') {
		this.messageText.setText('Empty face assigned (does nothing)');
		dice.setAssigned(true);
		this.clearAllHighlights();
		this.checkAllDiceAssigned();
		return;
	  }
	  
	  // Mana face
	  if (face.type === 'special' && face.description?.includes('mana')) {
		this.messageText.setText('💎 Mana generated! +' + face.value);
		this.currentMana += face.value;
		this.updateManaUI();
		dice.setAssigned(true);
		this.clearAllHighlights();
		this.cameras.main.flash(100, 100, 200, 255, false);
		this.checkAllDiceAssigned();
		return; // ⭐ IMPORTANT : Arrête ici !
	  }

	  // Select dice for targeting
	  this.clearAllHighlights();
	  this.selectedDice = dice;

	  const heroIndex = this.heroes.findIndex((h) => h.id === dice.characterId);
	  if (heroIndex >= 0) {
		this.heroCards[heroIndex].setDiceSelected(true, 0xffff00);
	  }

	  // Attack
	  if (face.type === 'attack') {
		this.messageText.setText('Select an enemy to attack');
	  } 
	  // Defend
	  else if (face.type === 'defend') {
		this.messageText.setText('Select an ally to defend (with yellow pills)');
		this.heroes.forEach((hero, index) => {
		  if (hero.incomingDamage > 0 && !CombatSystem.isDead(hero)) {
			this.heroCards[index].setTargetable(true, 0x4444ff);
			// ⭐ Force card to be FULLY interactive with explicit hit area
			this.heroCards[index].setInteractive(
			  new Phaser.Geom.Rectangle(-115, -35, 230, 70),
			  Phaser.Geom.Rectangle.Contains
			);
		  }
		});
	  } 
	  // Heal
	  else if (face.type === 'heal') {
		this.messageText.setText('Select an ally to heal');
		this.heroes.forEach((hero, index) => {
		  if (hero.currentHealth < hero.maxHealth && !CombatSystem.isDead(hero)) {
			this.heroCards[index].setTargetable(true, 0x44ff44);
			// ⭐ Force card to be interactive
			this.heroCards[index].setInteractive(
			  new Phaser.Geom.Rectangle(-115, -35, 230, 70),
			  Phaser.Geom.Rectangle.Contains
			);
		  }
		});
	  }
	}

	private handleEnemyHover(enemyIndex: number): void {
	  if (this.phase !== CombatPhase.PLAYER_ASSIGN) return;
	  
	  // Handle spell hover
	  if (this.selectedSpell === 'fireball') {
		this.hoveredEnemyIndex = enemyIndex;
		const enemy = this.enemies[enemyIndex];
		
		if (!CombatSystem.isDead(enemy)) {
		  this.enemyCards[enemyIndex].setHoverEffect(true);
		  
		  // Preview 2 damage
		  enemy.incomingDamage = 2;
		  this.updateAllCards();
		}
		return;
	  }
	  
	  // Handle dice hover
	  if (!this.selectedDice) return;
	  if (this.selectedDice.getFace().type !== 'attack') return;

	  this.hoveredEnemyIndex = enemyIndex;
	  const enemy = this.enemies[enemyIndex];
	  
	  this.enemyCards[enemyIndex].setHoverEffect(true);
	  
	  enemy.incomingDamage = this.selectedDice.getFace().value;
	  this.updateAllCards();
	}

	private handleEnemyHoverOut(enemyIndex: number): void {
	  if (this.hoveredEnemyIndex === enemyIndex) {
		this.enemyCards[enemyIndex].setHoverEffect(false);
		
		const enemy = this.enemies[enemyIndex];
		enemy.incomingDamage = 0;
		this.hoveredEnemyIndex = null;
		this.updateAllCards();
	  }
	}

	private handleEnemyClick(enemyIndex: number): void {
	  console.log('👹 handleEnemyClick appelé!', enemyIndex, 'Phase:', this.phase, 'SelectedDice:', this.selectedDice);
	  
	  // Handle spell casting
	  if (this.selectedSpell === 'fireball') {
		this.castSpell(enemyIndex, true);
		return;
	  }

	  if (this.phase !== CombatPhase.PLAYER_ASSIGN) return;
	  if (!this.selectedDice) return;
	  if (this.selectedDice.getFace().type !== 'attack') return;

	  // ⭐ Get face and damage
	  const enemy = this.enemies[enemyIndex];
		if (CombatSystem.isDead(enemy)) return;

		// Get face and damage
		const face = this.selectedDice.getFace();
		const damage = face.value;

		// ⭐ CHECK FOR POISON FIRST
		if (face.description?.includes('poison')) {
		  // Option B: Poison damage only at end of turn (no immediate damage)
		  enemy.poisonCounter += damage;
		  this.messageText.setText(`☠️ ${damage} poison applied! (damage at end of turn)`);
		  this.cameras.main.flash(100, 150, 50, 150, false); // Green flash
		} else {
		  // Normal attack: immediate damage
		  CombatSystem.applyDamage(enemy, damage);
		  enemy.incomingDamage = 0;
		  this.cameras.main.flash(100, 255, 100, 100, false);
		  
		  // Check if enemy died from immediate damage
		  if (CombatSystem.isDead(enemy)) {
			this.enemyCards[enemyIndex].playDeathAnimation();
			this.cameras.main.shake(200, 0.005);
			
			if (this.checkGameOver()) {
			  return;
			}
		  }
		}

		this.enemyCards[enemyIndex].flashDamage();

		// Mark dice as used
		this.selectedDice.setAssigned(true);
		this.selectedDice = null;

		// Clean up
		this.clearAllHighlights();
		this.updateAllCards();
		this.checkAllDiceAssigned();
	}

private handleHeroHover(heroIndex: number): void {
  if (this.phase !== CombatPhase.PLAYER_ASSIGN) return;
  
  // Handle spell hover
  if (this.selectedSpell === 'shield') {
    this.hoveredHeroIndex = heroIndex;
    const hero = this.heroes[heroIndex];
    
    if (!CombatSystem.isDead(hero) && hero.incomingDamage > 0) {
      this.heroCards[heroIndex].setHoverEffect(true, 0x6699ff);
      
      // Preview: reduce incoming damage by 1
      const originalDamage = hero.incomingDamage;
      hero.incomingDamage = Math.max(0, originalDamage - 1);
      this.updateAllCards();
      
      // Store original for restoring on hover out
      (hero as any)._tempOriginalDamage = originalDamage;
    }
    return;
  }
  
  // Handle dice hover
  if (!this.selectedDice) return;

  const face = this.selectedDice.getFace();
  const hero = this.heroes[heroIndex];

  if (face.type === 'defend' && hero.incomingDamage > 0) {
	  this.hoveredHeroIndex = heroIndex;
	  this.heroCards[heroIndex].setHoverEffect(true, 0x4444ff);
	  
	  console.log('🔵 HOVER DEFEND - Hero:', hero.name, 'Before:', hero.incomingDamage, 'Shield:', face.value);
	  
	  // Preview: reduce incoming damage by shield value
	  const originalDamage = hero.incomingDamage;
	  hero.incomingDamage = Math.max(0, originalDamage - face.value);
	  this.updateAllCards();
	  
	  console.log('🔵 HOVER DEFEND - After preview:', hero.incomingDamage, 'Stored:', originalDamage);
	  
	  // Store original for restoring on hover out
	  (hero as any)._tempOriginalDamage = originalDamage;
	} else if (face.type === 'heal' && hero.currentHealth < hero.maxHealth && !CombatSystem.isDead(hero)) {
    this.hoveredHeroIndex = heroIndex;
    this.heroCards[heroIndex].setHoverEffect(true, 0x44ff44);
    
    // ⭐ AJOUTE LE PREVIEW DU HEAL
    const originalHealth = hero.currentHealth;
    hero.currentHealth = Math.min(hero.maxHealth, originalHealth + face.value);
    this.updateAllCards();
    
    // Store original for restoring on hover out
    (hero as any)._tempOriginalHealth = originalHealth;
  }
}

	private handleHeroHoverOut(heroIndex: number): void {
	  if (this.hoveredHeroIndex === heroIndex) {
		this.heroCards[heroIndex].setHoverEffect(false);
		
		// Restore original damage if shield was previewed
		const hero = this.heroes[heroIndex];
		if ((hero as any)._tempOriginalDamage !== undefined) {
		  hero.incomingDamage = (hero as any)._tempOriginalDamage;
		  delete (hero as any)._tempOriginalDamage;
		  this.updateAllCards();
		}
		
		this.hoveredHeroIndex = null;
	  }
	}

private handleHeroCardClick(heroIndex: number): void {
	console.log('🎯 HERO CARD CLICKED!', heroIndex, 'Phase:', this.phase, 'SelectedDice:', this.selectedDice);
  if (this.phase !== CombatPhase.PLAYER_ASSIGN) return;
  
  const hero = this.heroes[heroIndex];
  console.log('🎯 Hero data:', hero.name, 'IncomingDamage:', hero.incomingDamage, 'Dead:', CombatSystem.isDead(hero));
  console.log('🎯 SelectedDice face:', this.selectedDice?.getFace());  // ⭐ AJOUTE AUSSI CELUI-CI
  
  // ⭐ HANDLE SPELL CASTING FIRST (before any other checks)
  if (this.selectedSpell === 'shield') {
    if (CombatSystem.isDead(hero)) {
      this.messageText.setText('Cannot cast on dead hero!');
      return;
    }
    if (hero.incomingDamage <= 0) {
      this.messageText.setText('This hero has no incoming damage!');
      return;
    }
    this.castSpell(heroIndex, false);
    return;
  }
  
  // Handle dice actions
  if (!this.selectedDice) return;
  if (CombatSystem.isDead(hero)) return;
  
  const face = this.selectedDice.getFace();
  
  if (face.type === 'defend') {
  // ⭐ RESTAURE LE PREVIEW D'ABORD !
  if ((hero as any)._tempOriginalDamage !== undefined) {
    hero.incomingDamage = (hero as any)._tempOriginalDamage;
    delete (hero as any)._tempOriginalDamage;
  }
  
  console.log('🛡️ DEFEND - Hero:', hero.name, 'IncomingDamage:', hero.incomingDamage, 'Shield:', face.value);
  
  if (hero.incomingDamage <= 0) {
    this.messageText.setText('Select an ally with yellow pills!');
    return;
  }

  // Apply defense
  hero.incomingDamage = Math.max(0, hero.incomingDamage - face.value);
  this.selectedDice.setAssigned(true);
  this.selectedDice = null;
  
  this.clearAllHighlights();
  this.updateAllCards();
  this.cameras.main.flash(100, 100, 100, 255, false);
  this.checkAllDiceAssigned();
} else if (face.type === 'heal') {
    // ⭐ AJOUTE TOUTE CETTE SECTION POUR LE HEAL
    if (hero.currentHealth >= hero.maxHealth) {
      this.messageText.setText('Select a wounded ally!');
      return;
    }

    // ⭐ Clean up temporary hover preview BEFORE applying heal
    if ((hero as any)._tempOriginalHealth !== undefined) {
      hero.currentHealth = (hero as any)._tempOriginalHealth;
      delete (hero as any)._tempOriginalHealth;
    }

    // Apply heal
    CombatSystem.applyHealing(hero, face.value);
    this.selectedDice.setAssigned(true);
    this.selectedDice = null;

    this.clearAllHighlights();
    this.updateAllCards();
    this.cameras.main.flash(100, 255, 100, 100, false);
    this.checkAllDiceAssigned();
  }
}

	private clearAllHighlights(): void {
	  // ⭐ Safety check: Only run if arrays are initialized
	  if (!this.heroCards || !this.enemyCards || !this.heroes || !this.enemies) {
		return;
	  }

	  this.heroCards.forEach((card, index) => {
		if (!card || !card.scene) return; // Skip destroyed cards
		
		card.setDiceSelected(false);
		card.setTargetable(false);
		card.setHoverEffect(false);
		
		// Restore any temporary preview values
		const hero = this.heroes[index];
		if (hero && (hero as any)._tempOriginalDamage !== undefined) {
		  hero.incomingDamage = (hero as any)._tempOriginalDamage;
		  delete (hero as any)._tempOriginalDamage;
		}
		if (hero && (hero as any)._tempOriginalHealth !== undefined) {
		  hero.currentHealth = (hero as any)._tempOriginalHealth;
		  delete (hero as any)._tempOriginalHealth;
		}
	  });

	  this.enemyCards.forEach((card, index) => {
		if (!card || !card.scene) return; // Skip destroyed cards
		
		card.setHoverEffect(false);
		
		// Restore enemy preview damage too
		const enemy = this.enemies[index];
		if (enemy && enemy.incomingDamage > 0 && !this.selectedDice) {
		  enemy.incomingDamage = 0;
		}
	  });
	  
	}
  
	/**
	 * Find a safe position in the center zone that doesn't overlap with existing dice
	 */
	private findSafePositionForDice(existingDice: Dice3D[]): { x: number; y: number } {
	  const width = this.cameras.main.width;
	  const height = this.cameras.main.height;
	  
	  const centerZone = {
		x: 250,
		y: 100,
		width: width - 500,
		height: height - 200,
	  };

	  const diceSize = 90;
	  const diceRadius = diceSize / 2;

	  // Get positions of existing dice
	  const occupiedPositions = existingDice.map(dice => ({ x: dice.x, y: dice.y }));

	  // Try to find a free spot
	  let position: { x: number; y: number } | null = null;
	  let attempts = 0;
	  const maxAttempts = 100;

	  while (!position && attempts < maxAttempts) {
		const testX = centerZone.x + diceRadius + Math.random() * (centerZone.width - diceSize);
		const testY = centerZone.y + diceRadius + Math.random() * (centerZone.height - diceSize);

		const overlaps = occupiedPositions.some((pos) => {
		  const dx = pos.x - testX;
		  const dy = pos.y - testY;
		  const distance = Math.sqrt(dx * dx + dy * dy);
		  return distance < diceSize; // Too close
		});

		if (!overlaps) {
		  position = { x: testX, y: testY };
		}
		attempts++;
	  }

	  // Fallback: if no free spot found after 100 attempts, place at edge
	  if (!position) {
		position = {
		  x: centerZone.x + diceRadius,
		  y: centerZone.y + diceRadius + Math.random() * (centerZone.height - diceSize),
		};
	  }

	  return position;
	}

/**
 * Proceed to turn resolution
 */
	private proceedToResolution(): void {
	  this.endTurnButton.setVisible(false);
	  this.manaText.setVisible(false);
      this.spell1Button.setVisible(false);
      this.spell2Button.setVisible(false);
	  this.messageText.setText('Resolving turn...');
	  this.time.delayedCall(1000, () => {
		this.resolveTurn();
	  });
	}


	private checkAllDiceAssigned(): void {
	  let allAssigned = true;
	  this.heroDiceMap.forEach((dice) => {
		if (!dice.isAssigned) {
		  allAssigned = false;
		}
	  });

	  if (allAssigned) {
		this.proceedToResolution();  // ← UTILISE LA NOUVELLE MÉTHODE
	  } else {
		this.messageText.setText('Click on a dice to assign its action');
	  }
	}
  
  /**
 * Check if game is over (all enemies or all heroes dead)
 * Returns true if game over, false otherwise
 */
	private checkGameOver(): boolean {
	  const heroesAlive = this.heroes.filter((h) => !CombatSystem.isDead(h));
	  const enemiesAlive = this.enemies.filter((e) => !CombatSystem.isDead(e));

	  if (enemiesAlive.length === 0) {
		// Victory!
		this.messageText.setText('Victory!');
		this.cameras.main.flash(500, 100, 255, 100);
		this.time.delayedCall(1500, () => this.showVictory());
		return true;
	  }

	  if (heroesAlive.length === 0) {
		// Defeat!
		this.messageText.setText('Defeat...');
		this.cameras.main.fade(500, 100, 0, 0);
		this.time.delayedCall(1500, () => this.showDefeat());
		return true;
	  }

	  return false;
	}

	private resolveTurn(): void {
	  this.phase = CombatPhase.RESOLUTION;

	  // Apply damage to heroes
	  this.heroes.forEach((hero) => {
		if (hero.incomingDamage > 0) {
		  CombatSystem.applyDamage(hero, hero.incomingDamage);
		  hero.incomingDamage = 0;
		}
	  });

	  this.updateAllCards();
	  this.cameras.main.shake(150, 0.003);
	  
	  this.enemies.forEach((enemy, index) => {
		if (enemy.poisonCounter > 0 && !CombatSystem.isDead(enemy)) {
		  this.messageText.setText(`💀 Poison deals ${enemy.poisonCounter} damage!`);
		  CombatSystem.applyDamage(enemy, enemy.poisonCounter);
		  this.enemyCards[index].flashDamage();
		  this.cameras.main.flash(100, 100, 200, 100, false); // Purple flash
		  
		  // Check if poison killed the enemy
		  if (CombatSystem.isDead(enemy)) {
			this.enemyCards[index].playDeathAnimation();
		  }
		}
	  });

	  this.updateAllCards();

	  // Detect deaths and play animations (only for newly dead)
	  const deadHeroes: number[] = [];
	  const deadEnemies: number[] = [];

	  this.heroes.forEach((hero, index) => {
		if (CombatSystem.isDead(hero) && this.heroCards[index].visible) {
		  deadHeroes.push(index);
		}
	  });

	  this.enemies.forEach((enemy, index) => {
		if (CombatSystem.isDead(enemy) && this.enemyCards[index].visible) {
		  deadEnemies.push(index);
		}
	  });

	  // Play death animations
	  deadHeroes.forEach(index => {
		this.heroCards[index].playDeathAnimation();
	  });

	  deadEnemies.forEach(index => {
		this.enemyCards[index].playDeathAnimation();
	  });

	  // Wait for animations, then check game over
	  this.time.delayedCall(500, () => {
		// ← UTILISE LA NOUVELLE MÉTHODE
		if (this.checkGameOver()) {
		  return; // Game over
		}

		// Game continues
		this.messageText.setText('Turn complete!');
		this.time.delayedCall(2000, () => this.startTurn());
	  });
	}
	
	private setupDiceTooltip(dice: Dice3D, ownerName: string): void {
	  dice.on('pointerover', () => {
		// Clear any existing timer
		if (this.tooltipTimer) {
		  this.tooltipTimer.destroy();
		}
		// Show tooltip after 2 seconds
		this.tooltipTimer = this.time.delayedCall(2000, () => {
		  const face = dice.getFace();
		  this.diceTooltip.show(dice.x, dice.y, face, ownerName);
		});
	  });

	  dice.on('pointerout', () => {
		// Cancel tooltip if mouse leaves before 2 seconds
		if (this.tooltipTimer) {
		  this.tooltipTimer.destroy();
		  this.tooltipTimer = undefined;
		}
		this.diceTooltip.hide();
	  });
	}

  /**
   * Clear ONLY player dice (not enemy dice!)
   */
	private clearPlayerDice(): void {
	  // Only destroy center dice
	  this.centerDice.forEach((dice) => {
		if (dice && dice.scene) {
		  dice.removeAllListeners();
		  dice.destroy(true);
		}
	  });
	  this.centerDice = [];
	  
	  // Only remove dice from HERO cards
	  this.heroCards.forEach((card) => {
		if (card && card.scene) {
		  card.removeDiceFromBox();
		}
	  });
	  
	  // Clear hero map only
	  this.heroDiceMap.clear();
	}

  /**
   * Clear ALL dice (used at start of new turn)
   */
  private clearAllDice(): void {
    // Destroy all center dice
    this.centerDice.forEach((dice) => {
      if (dice && dice.scene) {
        dice.removeAllListeners();
        dice.destroy(true);
      }
    });
    this.centerDice = [];
    
    // Remove dice from ALL cards
    this.heroCards.forEach((card) => {
      if (card && card.scene) {
        card.removeDiceFromBox();
      }
    });
    
    this.enemyCards.forEach((card) => {
      if (card && card.scene) {
        card.removeDiceFromBox();
      }
    });
    
    // Clear all maps
    this.heroDiceMap.clear();
    this.enemyDiceMap.clear();
  }

  private updateAllCards(): void {
    this.heroCards.forEach((card, index) => {
      if (card && card.scene) {
        card.updateHero(this.heroes[index]);
      }
    });
    this.enemyCards.forEach((card, index) => {
      if (card && card.scene) {
        card.updateEnemy(this.enemies[index]);
      }
    });
  }
  
/**
   * Update mana display and spell button states
   */
  private updateManaUI(): void {
    this.manaText.setText(`💎 Mana: ${this.currentMana}`);
    
    // Enable/disable spell buttons based on mana
    if (this.currentMana >= 2) {
      this.spell1Button.setAlpha(1);
      this.spell2Button.setAlpha(1);
    } else {
      this.spell1Button.setAlpha(0.5);
      this.spell2Button.setAlpha(0.5);
    }
  }

  /**
   * Select a spell to cast
   */
	private selectSpell(spell: 'fireball' | 'shield'): void {
	  if (this.currentMana < 2) return;
	  
	  this.selectedSpell = spell;
	  this.selectedDice = null; // Deselect any dice
	  this.clearAllHighlights();
	  
	  // Highlight the selected spell button
	  if (spell === 'fireball') {
		this.spell1Button.setBackgroundColor('#ff6666');
		this.spell2Button.setBackgroundColor('#3366cc');
		this.messageText.setText('🔥 Select an enemy to damage (2 dmg)');
		// Enemies are already interactive, hover will handle preview
	  } else {
		this.spell1Button.setBackgroundColor('#cc3333');
		this.spell2Button.setBackgroundColor('#6699ff');
		this.messageText.setText('🛡️ Select a hero with incoming damage');
		
		// Highlight heroes with incoming damage
		this.heroes.forEach((hero, index) => {
		  if (!CombatSystem.isDead(hero) && hero.incomingDamage > 0) {
			this.heroCards[index].setTargetable(true, 0x6699ff);
			// ⭐ Force card to be interactive
			this.heroCards[index].setInteractive();
		  }
		});
	  }
	}

  /**
   * Cast the selected spell on target
   */
  private castSpell(targetIndex: number, isEnemy: boolean): void {
    if (!this.selectedSpell) return;
    if (this.currentMana < 2) return;
    
    this.currentMana -= 2; // Spend mana
    
    if (this.selectedSpell === 'fireball' && isEnemy) {
      const enemy = this.enemies[targetIndex];
      if (!CombatSystem.isDead(enemy)) {
        CombatSystem.applyDamage(enemy, 2);
        this.enemyCards[targetIndex].flashDamage();
        this.cameras.main.flash(100, 255, 100, 50, false);
        
        // Check if enemy died
        if (CombatSystem.isDead(enemy)) {
          this.enemyCards[targetIndex].playDeathAnimation();
          this.cameras.main.shake(200, 0.005);
          this.checkGameOver();
        }
      }
    } else if (this.selectedSpell === 'shield' && !isEnemy) {
	  const hero = this.heroes[targetIndex];
	  if (!CombatSystem.isDead(hero)) {
		// Remove temporary damage preview
		if ((hero as any)._tempOriginalDamage !== undefined) {
		  hero.incomingDamage = (hero as any)._tempOriginalDamage;
		  delete (hero as any)._tempOriginalDamage;
		}
		
		// Add 1 armor (reduce incoming damage by 1)
		hero.incomingDamage = Math.max(0, hero.incomingDamage - 1);
		this.cameras.main.flash(100, 100, 150, 255, false);
	  }
	}
    
    this.selectedSpell = null;
    this.spell1Button.setBackgroundColor('#cc3333');
    this.spell2Button.setBackgroundColor('#3366cc');
    this.clearAllHighlights();
    this.updateAllCards();
    this.updateManaUI();
    this.messageText.setText('Spell cast! Click a dice to continue');
  }

  private showVictory(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add.rectangle(0, 0, width, height, 0x000000, 0.85).setOrigin(0, 0);

    const victoryText = this.add.text(width / 2, height / 2 - 50, '🎉 VICTORY! 🎉', {
      fontSize: '54px',
      color: '#44ff44',
      fontStyle: 'bold',
    });
    victoryText.setOrigin(0.5);

    const restartButton = this.add.text(width / 2, height / 2 + 50, 'FIGHT AGAIN', {
      fontSize: '26px',
      color: '#ffffff',
      backgroundColor: '#44aa44',
      padding: { x: 26, y: 14 },
    });
    restartButton.setOrigin(0.5);
    restartButton.setInteractive({ useHandCursor: true });

    restartButton.on('pointerover', () => restartButton.setBackgroundColor('#55cc55'));
    restartButton.on('pointerout', () => restartButton.setBackgroundColor('#44aa44'));
	restartButton.on('pointerup', () => {
	  this.cleanupScene();
	  this.scene.restart();
	});
  }

  private showDefeat(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add.rectangle(0, 0, width, height, 0x000000, 0.85).setOrigin(0, 0);

    const defeatText = this.add.text(width / 2, height / 2 - 50, '💀 DEFEAT 💀', {
      fontSize: '54px',
      color: '#ff4444',
      fontStyle: 'bold',
    });
    defeatText.setOrigin(0.5);

    const retryButton = this.add.text(width / 2, height / 2 + 50, 'TRY AGAIN', {
      fontSize: '26px',
      color: '#ffffff',
      backgroundColor: '#aa4444',
      padding: { x: 26, y: 14 },
    });
    retryButton.setOrigin(0.5);
    retryButton.setInteractive({ useHandCursor: true });

    retryButton.on('pointerover', () => retryButton.setBackgroundColor('#cc5555'));
    retryButton.on('pointerout', () => retryButton.setBackgroundColor('#aa4444'));
	retryButton.on('pointerup', () => {
	  this.cleanupScene();
	  this.scene.restart();
	});
  }
}
