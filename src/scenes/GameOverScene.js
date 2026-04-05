import Phaser from 'phaser';

// Stub — à implémenter dans la prochaine phase
export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create() {
    this.add.text(400, 150, 'Game Over', {
      fontFamily: '"Comic Sans MS", cursive',
      fontSize: '36px',
      color: '#ff4444',
      stroke: '#7b0000',
      strokeThickness: 6
    }).setOrigin(0.5);

    this.time.delayedCall(2000, () => this.scene.start('MenuScene'));
  }
}
