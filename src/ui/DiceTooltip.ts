import Phaser from 'phaser';
import { DiceFace } from '@entities/types';

/**
 * DiceTooltip - Shows information about a die when hovering
 */
export class DiceTooltip extends Phaser.GameObjects.Container {
  private background!: Phaser.GameObjects.Rectangle;
  private titleText!: Phaser.GameObjects.Text;
  private descriptionText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    this.createTooltip();
    this.setVisible(false);
    this.setDepth(1000); // Always on top
    scene.add.existing(this);
  }

  private createTooltip(): void {
    // Background with border
    this.background = this.scene.add.rectangle(0, 0, 250, 80, 0x1a1a2a, 0.95);
    this.background.setStrokeStyle(2, 0xffdd44);
    this.background.setOrigin(0, 0);
    this.add(this.background);

    // Title (dice type and value)
    this.titleText = this.scene.add.text(10, 10, '', {
      fontSize: '18px',
      color: '#ffdd44',
      fontStyle: 'bold',
    });
    this.add(this.titleText);

    // Description
    this.descriptionText = this.scene.add.text(10, 35, '', {
      fontSize: '14px',
      color: '#ffffff',
      wordWrap: { width: 230 },
    });
    this.add(this.descriptionText);
  }

  /**
   * Show tooltip with die information
   */
  public show(x: number, y: number, face: DiceFace, ownerName: string): void {
    const typeInfo = this.getDiceTypeInfo(face);
    
    // Set title
    this.titleText.setText(`${typeInfo.icon} ${typeInfo.name} ${face.value > 0 ? face.value : ''}`);
    this.titleText.setColor(typeInfo.color);

    // Set description
    this.descriptionText.setText(`${typeInfo.description}\n→ ${ownerName}`);

    // Adjust background height based on text
    const totalHeight = Math.max(80, this.descriptionText.height + 50);
    this.background.setSize(250, totalHeight);

    // Position tooltip (avoid going off-screen)
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;
    
    let tooltipX = x + 50;
    let tooltipY = y - 40;

    // Keep within bounds
    if (tooltipX + 250 > width) tooltipX = x - 260;
    if (tooltipY + totalHeight > height) tooltipY = height - totalHeight - 10;
    if (tooltipY < 10) tooltipY = 10;

    this.setPosition(tooltipX, tooltipY);
    this.setVisible(true);
  }

  /**
   * Hide tooltip
   */
  public hide(): void {
    this.setVisible(false);
  }

  /**
   * Get display info for each dice type
   */
  private getDiceTypeInfo(face: DiceFace): { name: string; icon: string; color: string; description: string } {
    switch (face.type) {
      case 'attack':
        if (face.description?.includes('poison')) {
			return {
			  name: 'Poison Attack',
			  icon: '☠️',
			  color: '#88ff88',
			  description: `Deals ${face.value} damage + ${face.value} poison to target`,
			};
		  }
		  return {
			name: 'Attack',
			icon: '⚔️',
			color: '#ff4444',
			description: `Deals ${face.value} damage to a target enemy`,
		  };
      case 'defend':
        return {
          name: 'Defend',
          icon: '🛡️',
          color: '#4444ff',
          description: `Reduces incoming damage by ${face.value}`,
        };
      case 'heal':
        return {
          name: 'Heal',
          icon: '❤️',
          color: '#44ff44',
          description: `Restores ${face.value} health to an ally`,
        };
      case 'special':
        // Handle different special types
        if (face.description?.includes('mana')) {
          return {
            name: 'Mana',
            icon: '💎',
            color: '#88ddff',
            description: `Generates ${face.value} mana for casting spells`,
          };
        } else if (face.description?.includes('stun')) {
          return {
            name: 'Stun',
            icon: '💫',
            color: '#ffaa44',
            description: 'Stuns an enemy (prevents their action)',
          };
        } else {
          return {
            name: 'Special',
            icon: '✨',
            color: '#ff44ff',
            description: face.description || `Special ability (${face.value} power)`,
          };
        }
      case 'empty':
        return {
          name: 'Empty',
          icon: '⚪',
          color: '#888888',
          description: 'Does nothing. Reroll or assign to skip.',
        };
      default:
        return {
          name: 'Unknown',
          icon: '❓',
          color: '#ffffff',
          description: 'Unknown effect',
        };
    }
  }
}
