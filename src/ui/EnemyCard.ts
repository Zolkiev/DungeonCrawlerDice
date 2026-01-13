import Phaser from 'phaser';
import { Enemy, DiceFace } from '@entities/types';

/**
 * EnemyCard - With death animation and avatar
 */
export class EnemyCard extends Phaser.GameObjects.Container {
  private enemy: Enemy;
  private background!: Phaser.GameObjects.Rectangle;
  private highlightBorder!: Phaser.GameObjects.Rectangle;
  private nameText!: Phaser.GameObjects.Text;
  private hpPills: Phaser.GameObjects.Container;
  public diceBox!: Phaser.GameObjects.Rectangle;
  private diceContainer!: Phaser.GameObjects.Container;
  private pulseTween?: Phaser.Tweens.Tween;
  private isDead: boolean = false;
  private avatarContainer!: Phaser.GameObjects.Container;
  private poisonText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, enemy: Enemy) {
    super(scene, x, y);
    this.enemy = enemy;
    this.hpPills = scene.add.container(0, 0);
    this.diceContainer = scene.add.container(0, 0);
    this.avatarContainer = scene.add.container(0, 0);

    this.createCard();
    scene.add.existing(this);
  }

  private createCard(): void {
    const cardWidth = 230;
    const cardHeight = 70;

    // Highlight border (initially invisible)
    this.highlightBorder = this.scene.add.rectangle(0, 0, cardWidth + 8, cardHeight + 8, 0xff4444, 0);
    this.highlightBorder.setStrokeStyle(4, 0xff4444);
    this.add(this.highlightBorder);

    // Background
    this.background = this.scene.add.rectangle(0, 0, cardWidth, cardHeight, 0x4a2a2a);
    this.add(this.background);

    // Dice box (left side for enemies)
    const diceBoxX = -75;
    this.diceBox = this.scene.add.rectangle(diceBoxX, 0, 52, 52, 0x2e1a1a);
    this.diceBox.setStrokeStyle(3, 0xdd88ff);
    this.add(this.diceBox);

    // Dice container
    this.diceContainer.setPosition(diceBoxX, 0);
    this.add(this.diceContainer);

    // Avatar (right side - mirror of heroes)
    this.createAvatar();

    // Enemy name (moved left to make room for avatar)
    this.nameText = this.scene.add.text(50, -26, this.enemy.name, {  // 98 → 30
      fontSize: '16px',
      color: '#ffaaaa',
      fontStyle: 'bold',
    });
    this.nameText.setOrigin(1, 0);
    this.add(this.nameText);
	
	// Poison counter (initially hidden)
	this.poisonText = this.scene.add.text(-30, 25, '', {
	  fontSize: '16px',
	  color: '#88ff88',
	  fontStyle: 'bold',
	  backgroundColor: '#223322',
	  padding: { x: 4, y: 2 },
	});
	this.poisonText.setOrigin(0, 0.5);
	this.poisonText.setVisible(false);
	this.add(this.poisonText);

    // HP Pills
    this.add(this.hpPills);
    this.updateHPPills();
  }

  private createAvatar(): void {
    const avatarSize = 58;
    const avatarX = 88;   // Right side (positive, mirror of heroes)
    const avatarY = 0;

    // Avatar background box with purple/pink border for enemies
    const avatarBg = this.scene.add.rectangle(avatarX, avatarY, avatarSize, avatarSize, 0x2e1a1a);
    avatarBg.setStrokeStyle(2, 0xdd88ff);  // Purple/pink border
    this.avatarContainer.add(avatarBg);

    // Try to load enemy avatar
    const avatarKey = `avatar_enemy_${this.enemy.name.toLowerCase().replace(/\s+/g, '_')}`;
    
    if (this.scene.textures.exists(avatarKey)) {
      // Avatar image exists
      const avatar = this.scene.add.image(avatarX, avatarY, avatarKey);
      avatar.setDisplaySize(avatarSize - 4, avatarSize - 4);
      this.avatarContainer.add(avatar);
    } else {
      // Placeholder: Show first letter of enemy name
      const placeholderText = this.scene.add.text(avatarX, avatarY, this.enemy.name[0], {
        fontSize: '36px',
        color: '#ffffff',
        fontStyle: 'bold',
      });
      placeholderText.setOrigin(0.5);
      this.avatarContainer.add(placeholderText);
    }

    this.add(this.avatarContainer);
  }

	public updateHPPills(): void {
	  // Safety check: recreate container if destroyed
	  if (!this.hpPills || !this.hpPills.scene) {
		this.hpPills = this.scene.add.container(0, 0);
		this.add(this.hpPills);
	  }

	  this.hpPills.removeAll(true);

	  const startX = 30;
	  const y = 2;
	  const spacing = -14;  // negative for right-to-left

	  const currentHealth = this.enemy.currentHealth;
	  const maxHealth = this.enemy.maxHealth;
	  const incomingDamage = Math.min(this.enemy.incomingDamage, currentHealth);
	  const poisonDamage = this.enemy.poisonCounter; // ⭐ Get poison counter

	  // Calculate pill counts
	  const healthAfterDamage = currentHealth - incomingDamage;
	  const healthAfterPoison = Math.max(0, healthAfterDamage - poisonDamage); // ⭐ Health after poison
	  
	  const redPills = healthAfterPoison; // ⭐ Red = health remaining after all damage
	  const greenPills = Math.min(poisonDamage, healthAfterDamage); // ⭐ Green = poison damage (capped)
	  const yellowPills = incomingDamage; // Yellow = incoming damage this turn
	  const grayPills = maxHealth - currentHealth; // Gray = missing HP

	  let index = 0;

	  // Red pills (health remaining after everything)
	  for (let i = 0; i < redPills; i++) {
		const pill = this.scene.add.ellipse(startX + index * spacing, y, 11, 14, 0xff3333);
		this.hpPills.add(pill);
		index++;
	  }

	  // ⭐ Green pills (poison damage at end of turn)
	  for (let i = 0; i < greenPills; i++) {
		const pill = this.scene.add.ellipse(startX + index * spacing, y, 11, 14, 0x44ff44);
		this.hpPills.add(pill);
		index++;
	  }

	  // Yellow pills (incoming damage this turn)
	  for (let i = 0; i < yellowPills; i++) {
		const pill = this.scene.add.ellipse(startX + index * spacing, y, 11, 14, 0xffdd44);
		this.hpPills.add(pill);
		index++;
	  }

	  // Gray pills (missing HP)
	  for (let i = 0; i < grayPills; i++) {
		const pill = this.scene.add.ellipse(startX + index * spacing, y, 11, 14, 0x444444);
		this.hpPills.add(pill);
		index++;
	  }
	}

  public setHoverEffect(hover: boolean): void {
    if (hover) {
      this.highlightBorder.setStrokeStyle(5, 0xff4444);
      this.highlightBorder.setAlpha(1);
      
      this.pulseTween = this.scene.tweens.add({
        targets: this.highlightBorder,
        alpha: 0.4,
        duration: 300,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      this.scene.tweens.add({
        targets: this,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 150,
        ease: 'Back.easeOut',
      });

      this.background.setFillStyle(0x5a3a3a);
    } else {
      this.highlightBorder.setAlpha(0);
      if (this.pulseTween) {
        this.pulseTween.stop();
        this.pulseTween = undefined;
      }

      this.scene.tweens.add({
        targets: this,
        scaleX: 1,
        scaleY: 1,
        duration: 150,
        ease: 'Back.easeOut',
      });

      this.background.setFillStyle(0x4a2a2a);
    }
  }

  public flashDamage(): void {
    this.scene.tweens.add({
      targets: this.background,
      fillAlpha: 0.5,
      duration: 100,
      yoyo: true,
      repeat: 1,
    });
  }

  /**
   * Play death animation and hide card
   */
  public playDeathAnimation(callback?: () => void): void {
    if (this.isDead) return;
    this.isDead = true;

    // Disable interactivity
    this.disableInteractive();

    // Flash background to dark red/gray
    this.scene.tweens.add({
      targets: this.background,
      fillColor: 0x2a1a1a,
      duration: 200,
    });

    // Fade out and scale down
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleX: 0.5,
      scaleY: 0.5,
      duration: 400,
      ease: 'Back.easeIn',
      onComplete: () => {
        this.setVisible(false);
        if (callback) callback();
      },
    });
  }

  /**
   * Reset card for new game
   */
  public revive(): void {
    this.isDead = false;
    this.setVisible(true);
    this.setAlpha(1);
    this.setScale(1);
    this.setInteractive();
  }

  public addDiceToBox(dice: Phaser.GameObjects.Container): void {
    if (!this.diceContainer || !this.diceContainer.scene) {
      this.diceContainer = this.scene.add.container(0, 0);
      this.diceContainer.setPosition(-75, 0);
      this.add(this.diceContainer);
    }

    // Remove old dice if any (and destroy them)
    this.removeDiceFromBox();
    
    this.diceContainer.add(dice);
    dice.setPosition(0, 0);
    dice.setScale(0.65);
  }

  public removeDiceFromBox(): void {
    if (this.diceContainer && this.diceContainer.scene) {
      // IMPORTANT: Destroy dice instead of just removing them
      this.diceContainer.each((child: Phaser.GameObjects.GameObject) => {
        if (child && (child as any).scene) {
          child.destroy(true);
        }
      });
      this.diceContainer.removeAll(true);
    }
  }

  public getEnemy(): Enemy {
    return this.enemy;
  }

  public updateEnemy(enemy: Enemy): void {
    this.enemy = enemy;
    this.updateHPPills();
	if (enemy.poisonCounter > 0) {
		this.poisonText.setText(`💀 ${enemy.poisonCounter}`);
		this.poisonText.setVisible(true);
	  } else {
		this.poisonText.setVisible(false);
	  }
  }

  destroy(fromScene?: boolean): void {
    if (this.pulseTween) {
      this.pulseTween.stop();
      this.pulseTween = undefined;
    }
    super.destroy(fromScene);
  }
}
