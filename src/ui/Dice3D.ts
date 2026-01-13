import Phaser from 'phaser';
import { DiceFace } from '@entities/types';
import { DiceSystem } from '@systems/DiceSystem';

/**
 * Dice3D - Clickable dice for manual targeting
 */
export class Dice3D extends Phaser.GameObjects.Container {
  private face: DiceFace;
  public isLocked: boolean;
  public characterId: string;
  public isAssigned: boolean = false; // Track if this die has been assigned
  private borderColor: number;
  private permanentlyLocked: boolean = false;
  
  private diceBody!: Phaser.GameObjects.Rectangle;
  private faceIcon!: Phaser.GameObjects.Text;
  private valueText!: Phaser.GameObjects.Text;
  private lockIcon!: Phaser.GameObjects.Text;
  private glowEffect!: Phaser.GameObjects.Rectangle;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    face: DiceFace,
    characterId: string,
    isLocked: boolean = false,
	borderColor: number = 0xffffff
  ) {
    super(scene, x, y);
    this.face = face;
    this.characterId = characterId;
    this.isLocked = isLocked;
	this.borderColor = borderColor;

    this.createDice();
    this.setSize(80, 80);
    this.setInteractive();
    this.setupInteractivity();
    
    scene.add.existing(this);
  }

  private createDice(): void {
    // Glow effect (for locked state)
    this.glowEffect = this.scene.add.rectangle(0, 0, 90, 90, 0x44ff44, 0);
    this.add(this.glowEffect);

    // Main dice body (NO STROKE - clean look)
    this.diceBody = this.scene.add.rectangle(0, 0, 80, 80, 0x2a2a2a);
	this.diceBody.setStrokeStyle(3, this.borderColor);
    this.add(this.diceBody);

	// Face icon
	this.faceIcon = this.scene.add.text(0, -10, '', {
	  fontSize: '36px',
	});
	this.faceIcon.setOrigin(0.5);
	this.add(this.faceIcon);

	// Value number
	this.valueText = this.scene.add.text(0, 15, '', {
	  fontSize: '24px',
	  color: this.getTextColor(),
	  fontStyle: 'bold',
	});
	this.valueText.setOrigin(0.5);
	this.add(this.valueText);

	// Update face display
	this.updateFace(this.face);

	// Update face display
	this.updateFace(this.face);

    // Lock icon
    this.lockIcon = this.scene.add.text(30, -30, '🔒', {
      fontSize: '18px',
    });
    this.lockIcon.setOrigin(0.5);
    this.lockIcon.setVisible(false);
    this.add(this.lockIcon);

    this.updateVisuals();
  }

	private setupInteractivity(): void {
	  this.on('pointerover', () => {
		  console.log('👆 HOVER sur dé', this.characterId, 'Locked:', this.isLocked, 'Assigned:', this.isAssigned);
		if (!this.isLocked && this.scale === 1) {
		  this.setScale(1.1);
		  this.scene.tweens.add({
			targets: this,
			angle: 5,
			duration: 100,
			yoyo: true,
		  });
		} else if (this.isLocked && !this.isAssigned) {
		  // When in card, show it can be clicked
		  this.setScale(0.65);
		}
	  });

	  this.on('pointerout', () => {
		if (this.scale > 1 && !this.isLocked) {
		  this.setScale(1);
		  this.setAngle(0);
		} else if (this.isLocked && !this.isAssigned) {
		  this.setScale(0.6);
		}
	  });

	  this.on('pointerdown', () => {
		if (!this.isLocked) {
		  this.setScale(0.95);
		} else if (!this.isAssigned) {
		  this.setScale(0.55);
		}
	  });

	  this.on('pointerup', () => {
		  console.log('🖱️ POINTERUP sur dé', this.characterId, 'Locked:', this.isLocked, 'Assigned:', this.isAssigned);
    
		if (!this.isLocked) {
		  this.setScale(1.1);
		  this.emit('clicked', this);
		} else if (!this.isAssigned) {
		  // In card - emit BOTH events on CLICK
		  this.setScale(0.6);
		  this.emit('clicked', this);        // ← POUR UNLOCK
		  this.emit('diceSelected', this);   // ← POUR TARGETING
		}
	  });
	}

	/**
	 * Mark this die as permanently locked (cannot be unlocked)
	 */
	public setPermanentlyLocked(permanent: boolean): void {
	  this.permanentlyLocked = permanent;
	  if (permanent) {
		this.isLocked = true;  // ← CORRIGÉ
		this.updateVisuals();  // ← CORRIGÉ
	  }
	}

	/**
	 * Check if die is permanently locked
	 */
	public isPermanentlyLocked(): boolean {
	  return this.permanentlyLocked;
	}

  private getTextColor(): string {
    switch (this.face.type) {
      case 'attack':
        return '#ff4444';
      case 'defend':
        return '#4444ff';
      case 'heal':
        return '#44ff44';
      case 'special':
        return '#ff44ff';
	  case 'empty':
		return '#666666';
      default:
        return '#ffffff';
    }
  }

  public setLocked(locked: boolean): void {
    this.isLocked = locked;
    this.updateVisuals();
  }

  public setAssigned(assigned: boolean): void {
    this.isAssigned = assigned;
    this.updateVisuals();
  }

  private updateVisuals(): void {
    if (this.isAssigned) {
      // Assigned state - grayed out
      this.glowEffect.setAlpha(0);
      this.lockIcon.setVisible(false);
      this.diceBody.setFillStyle(0x1a1a1a);
      this.setAlpha(0.5);
    } else if (this.isLocked) {
      // Locked state - green glow and subtle green tint
      this.glowEffect.setAlpha(0.4);
      this.lockIcon.setVisible(true);
      this.diceBody.setFillStyle(0x2a3a2a);
      this.setAlpha(1);
    } else {
      // Unlocked state - normal dark background
      this.glowEffect.setAlpha(0);
      this.lockIcon.setVisible(false);
      this.diceBody.setFillStyle(0x2a2a2a);
      this.setAlpha(1);
    }
  }

  public getFace(): DiceFace {
    return this.face;
  }

public updateFace(face: DiceFace): void {
  this.face = face;
  
  // Handle different face types
	if (face.type === 'empty') {
	  // Empty face - show RED CROSS
	  this.faceIcon.setText('❌');
	  this.faceIcon.setFontSize('48px');
	  this.faceIcon.setAlpha(1);  // ← Pleine opacité pour la croix rouge
	  this.valueText.setText('');
	} else if (face.type === 'special' && face.description?.includes('mana')) {
    // Mana face
    this.faceIcon.setText('💎');
    this.faceIcon.setFontSize('36px');
    this.faceIcon.setAlpha(1);
    this.valueText.setText(face.value.toString());
  } else if (face.type === 'special' && face.description?.includes('stun')) {
    // Stun face
    this.faceIcon.setText('💫');
    this.faceIcon.setFontSize('36px');
    this.faceIcon.setAlpha(1);
    this.valueText.setText('');
  }else if (face.type === 'attack' && face.description?.includes('poison')) {
	  // ⭐ POISON ATTACK - special icon
	  this.faceIcon.setText('☠️');
	  this.faceIcon.setFontSize('36px');
	  this.faceIcon.setAlpha(1);
	  this.valueText.setText(face.value.toString());
  } else {
    // Normal faces (attack, defend, heal, other special)
    this.faceIcon.setText(DiceSystem.getDiceSymbol(face.type));
    this.faceIcon.setFontSize('36px');
    this.faceIcon.setAlpha(1);
    this.valueText.setText(face.value.toString());
  }
  
  this.valueText.setColor(this.getTextColor());
}

  public animateRoll(callback?: () => void): void {
    this.isLocked = false;
    this.updateVisuals();

    // Rotation + scale
    this.scene.tweens.add({
      targets: this,
      angle: 360 * 2,
      scale: 1.3,
      duration: 600,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        this.setAngle(0);
        this.setScale(1);
        if (callback) callback();
      },
    });

    // Bounce
    this.scene.tweens.add({
      targets: this,
      y: this.y - 30,
      duration: 300,
      yoyo: true,
      ease: 'Quad.easeOut',
    });
  }

  public animateToPosition(targetX: number, targetY: number, targetScale: number = 0.7, callback?: () => void): void {
    this.scene.tweens.add({
      targets: this,
      x: targetX,
      y: targetY,
      scale: targetScale,
      duration: 400,
      ease: 'Back.easeOut',
      onComplete: () => {
        if (callback) callback();
      },
    });
  }
}
