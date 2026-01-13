import Phaser from 'phaser';
import { Hero, DiceFace, HeroClass } from '@entities/types';

/**
 * HeroCard - With death animation and avatar
 */
export class HeroCard extends Phaser.GameObjects.Container {
  private hero: Hero;
  private background!: Phaser.GameObjects.Rectangle;
  private highlightBorder!: Phaser.GameObjects.Rectangle;
  private nameText!: Phaser.GameObjects.Text;
  private hpPills: Phaser.GameObjects.Container;
  public diceBox!: Phaser.GameObjects.Rectangle;
  private diceContainer!: Phaser.GameObjects.Container;
  private pulseTween?: Phaser.Tweens.Tween;
  private isDead: boolean = false;
  private avatarContainer!: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, x: number, y: number, hero: Hero) {
    super(scene, x, y);
    this.hero = hero;
    this.hpPills = scene.add.container(0, 0);
    this.diceContainer = scene.add.container(0, 0);
    this.avatarContainer = scene.add.container(0, 0);

    this.createCard();
    scene.add.existing(this);
  }
  
  private getClassColor(): number {
    switch (this.hero.class) {
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
        return 0xffdd44; // Jaune par défaut
    }
  }

  private createCard(): void {
    const cardWidth = 230;  // 180 → 230 (+28% width only)
    const cardHeight = 70;  // 65 → 70 (+8% height)

    // Highlight border (initially invisible)
    this.highlightBorder = this.scene.add.rectangle(0, 0, cardWidth + 8, cardHeight + 8, 0xffff00, 0);
    this.highlightBorder.setStrokeStyle(4, 0xffff00);
    this.add(this.highlightBorder);

    // Background
    this.background = this.scene.add.rectangle(0, 0, cardWidth, cardHeight, 0x2a2a4a);
    this.add(this.background);

    // Avatar (left side)
    this.createAvatar();

    // Hero name
    this.nameText = this.scene.add.text(-55, -26, this.hero.name, {
      fontSize: '16px',  // 14px → 16px
      color: '#ffff88',
      fontStyle: 'bold',
    });
    this.add(this.nameText);

    // HP Pills
    this.add(this.hpPills);
    this.updateHPPills();

    // Dice box (right side)
    const diceBoxX = 75;  // 65 → 75
    this.diceBox = this.scene.add.rectangle(diceBoxX, 0, 52, 52, 0x1a1a2e);  // 48 → 52
    this.diceBox.setStrokeStyle(3, this.getClassColor());
    this.add(this.diceBox);

    // Dice container
    this.diceContainer.setPosition(diceBoxX, 0);
    this.add(this.diceContainer);
  }

  private createAvatar(): void {
    const avatarSize = 58;  // 50 → 58
    const avatarX = -90;    // -82 → -98
    const avatarY = 0;

    // Avatar background box
    const avatarBg = this.scene.add.rectangle(avatarX, avatarY, avatarSize, avatarSize, 0x1a1a2e);
    avatarBg.setStrokeStyle(2, this.getClassColor());
    this.avatarContainer.add(avatarBg);

    // Try to load hero avatar
    const avatarKey = `avatar_${this.hero.name.toLowerCase()}`;
    
    if (this.scene.textures.exists(avatarKey)) {
      // Avatar image exists
      const avatar = this.scene.add.image(avatarX, avatarY, avatarKey);
      avatar.setDisplaySize(avatarSize - 4, avatarSize - 4);
      this.avatarContainer.add(avatar);
    } else {
      // Placeholder: Show first letter of hero name
      const placeholderText = this.scene.add.text(avatarX, avatarY, this.hero.name[0], {
        fontSize: '36px',  // 32px → 36px
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

    const startX = -50;  // -55 → -65
    const y = 2;  // 0 → 2
    const spacing = 14;  // 13 → 14

    const currentHealth = this.hero.currentHealth;
    const maxHealth = this.hero.maxHealth;
    const incomingDamage = Math.min(this.hero.incomingDamage, currentHealth);

    const healthAfterDamage = currentHealth - incomingDamage;
    const redPills = healthAfterDamage;
    const yellowPills = incomingDamage;
    const grayPills = maxHealth - currentHealth;

    let index = 0;

    for (let i = 0; i < redPills; i++) {
      const pill = this.scene.add.ellipse(startX + index * spacing, y, 11, 14, 0xff3333);  // 10x13 → 11x14
      this.hpPills.add(pill);
      index++;
    }

    for (let i = 0; i < yellowPills; i++) {
      const pill = this.scene.add.ellipse(startX + index * spacing, y, 11, 14, 0xffdd44);
      this.hpPills.add(pill);
      index++;
    }

    for (let i = 0; i < grayPills; i++) {
      const pill = this.scene.add.ellipse(startX + index * spacing, y, 11, 14, 0x444444);
      this.hpPills.add(pill);
      index++;
    }
  }

  public setDiceSelected(selected: boolean, color: number = 0xffff00): void {
    if (selected) {
      this.highlightBorder.setStrokeStyle(4, color);
      this.highlightBorder.setAlpha(1);
      
      this.pulseTween = this.scene.tweens.add({
        targets: this.highlightBorder,
        alpha: 0.3,
        duration: 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    } else {
      this.highlightBorder.setAlpha(0);
      if (this.pulseTween) {
        this.pulseTween.stop();
        this.pulseTween = undefined;
      }
    }
  }

  public setTargetable(targetable: boolean, color: number = 0x44ff44): void {
    if (targetable) {
      this.background.setFillStyle(0x3a4a3a);
    } else {
      this.background.setFillStyle(0x2a2a4a);
    }
  }

  public setHoverEffect(hover: boolean, color: number = 0x44ff44): void {
    if (hover) {
      this.highlightBorder.setStrokeStyle(4, color);
      this.highlightBorder.setAlpha(0.8);
      this.scene.tweens.add({
        targets: this,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 150,
        ease: 'Back.easeOut',
      });
    } else {
      this.highlightBorder.setAlpha(0);
      this.scene.tweens.add({
        targets: this,
        scaleX: 1,
        scaleY: 1,
        duration: 150,
        ease: 'Back.easeOut',
      });
    }
  }

  /**
   * Play death animation and hide card
   */
  public playDeathAnimation(callback?: () => void): void {
    if (this.isDead) return;
    this.isDead = true;

    // Disable interactivity
    this.disableInteractive();

    // Flash background to gray
    this.scene.tweens.add({
      targets: this.background,
      fillColor: 0x1a1a1a,
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

  public getDiceBoxWorldPosition(): { x: number; y: number } {
    return { x: this.x + 75, y: this.y };  // 65 → 75
  }

  public addDiceToBox(dice: Phaser.GameObjects.Container): void {
    if (!this.diceContainer || !this.diceContainer.scene) {
      this.diceContainer = this.scene.add.container(0, 0);
      this.diceContainer.setPosition(75, 0);  // 65 → 75
      this.add(this.diceContainer);
    }

    // Remove old dice if any (and destroy them)
    this.removeDiceFromBox();
    
    this.diceContainer.add(dice);
    dice.setPosition(0, 0);
    dice.setScale(0.65);  // 0.6 → 0.65
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
  
  /**
   * Remove dice from box WITHOUT destroying it (for unlocking)
   */
  public removeDiceFromBoxWithoutDestroy(): void {
    if (this.diceContainer && this.diceContainer.scene) {
      // Just remove, don't destroy
      this.diceContainer.removeAll(false);
    }
  }

  public getHero(): Hero {
    return this.hero;
  }

  public updateHero(hero: Hero): void {
    this.hero = hero;
    this.updateHPPills();
  }

  destroy(fromScene?: boolean): void {
    if (this.pulseTween) {
      this.pulseTween.stop();
      this.pulseTween = undefined;
    }
    super.destroy(fromScene);
  }
}
