import Phaser from 'phaser';

// Stub — gameplay à implémenter dans la prochaine phase
export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.add.text(400, 150, '🎮 Gameplay — bientôt !', {
      fontFamily: '"Comic Sans MS", cursive',
      fontSize: '24px',
      color: '#ffffff',
      stroke: '#1a1a5e',
      strokeThickness: 5
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('MenuScene'));
    this.input.once('pointerdown', () => this.scene.start('MenuScene'));
  }
}
