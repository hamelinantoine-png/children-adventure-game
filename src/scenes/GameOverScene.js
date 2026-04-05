import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../constants.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOverScene'); }

  init(data) {
    this._score = data.score || 0;
    this._best  = data.best  || parseInt(localStorage.getItem('panpan_best') || '0');
  }

  create() {
    // Fond semi-opaque
    const bg = this.add.graphics();
    bg.fillStyle(0x1a0a2e, 0.88);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Panneau central
    const px = GAME_WIDTH / 2, py = GAME_HEIGHT / 2;
    const panel = this.add.graphics();
    panel.fillStyle(0x000000, 0.45);
    panel.fillRoundedRect(px - 240, py - 90, 480, 188, 20);

    // ── Textes ──
    this.add.text(px, py - 72, '💥 Oh non !', {
      fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive',
      fontSize: '34px', fontStyle: 'bold',
      color: '#ff4444', stroke: '#7b0000', strokeThickness: 6,
      shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 4, fill: true }
    }).setOrigin(0.5);

    this.add.text(px, py - 24, `Score : ${this._score}`, {
      fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive',
      fontSize: '24px', fontStyle: 'bold',
      color: '#ffffff', stroke: '#1a1a5e', strokeThickness: 5
    }).setOrigin(0.5);

    const isNewBest = this._score >= this._best && this._score > 0;
    const bestLabel = isNewBest
      ? `🏆 Nouveau record : ${this._best} !`
      : `Meilleur score : ${this._best}`;
    const bestColor = isNewBest ? '#ffd700' : '#aaaacc';

    this.add.text(px, py + 14, bestLabel, {
      fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive',
      fontSize: '15px',
      color: bestColor, stroke: '#1a1a2e', strokeThickness: 4
    }).setOrigin(0.5);

    // ── Bouton Rejouer ──
    this._makeButton(px, py + 60, '▶  Rejouer !', () => {
      this.scene.start('GameScene');
    });

    // ── Bouton Menu ──
    this._makeButton(px, py + 96, '🏠  Menu', () => {
      this.scene.start('MenuScene');
    }, 0x224488);

    // Raccourci clavier
    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('GameScene'));
    this.input.keyboard.once('keydown-ENTER', () => this.scene.start('GameScene'));
  }

  _makeButton(x, y, label, callback, bgColor = 0x228b22) {
    const btn = this.add.graphics();
    btn.fillStyle(bgColor, 1);
    btn.fillRoundedRect(x - 130, y - 16, 260, 32, 12);

    const txt = this.add.text(x, y, label, {
      fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive',
      fontSize: '16px', fontStyle: 'bold',
      color: '#ffffff', stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    txt.on('pointerover',  () => btn.setAlpha(0.75));
    txt.on('pointerout',   () => btn.setAlpha(1));
    txt.on('pointerdown',  callback);
  }
}
