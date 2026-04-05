import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, GROUND_Y } from '../constants.js';

const TITLE_COLOR   = '#ff6b35';
const TITLE_STROKE  = '#7b2d00';
const SUBTITLE_COLOR = '#fff700';
const SUBTITLE_STROKE = '#7a6000';
const HINT_COLOR    = '#ffffff';
const HINT_STROKE   = '#1a3a6b';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
    this._clouds = [];
    this._simba  = null;
    this._panpan = null;
    this._hint   = null;
    this._groundTile = null;
  }

  create() {
    this._buildBackground();
    this._buildGround();
    this._buildTitle();
    this._buildCharacters();
    this._buildHint();
    this._setupInput();
  }

  // ── Décor ──────────────────────────────────────────────────────────────────

  _buildBackground() {
    // Dégradé ciel simulé avec 2 rectangles
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x4db8d8, 0x4db8d8, 0x87ceeb, 0x87ceeb, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Soleil en haut à droite
    this.add.image(GAME_WIDTH - 60, 46, 'sun').setAlpha(0.9);

    // 4 nuages à des positions variées
    const cloudData = [
      { x: 80,  y: 30,  scale: 0.9, speed: 18 },
      { x: 260, y: 18,  scale: 1.2, speed: 22 },
      { x: 480, y: 36,  scale: 0.7, speed: 15 },
      { x: 680, y: 22,  scale: 1.0, speed: 20 }
    ];
    this._clouds = cloudData.map(d => {
      const c = this.add.image(d.x, d.y, 'cloud').setScale(d.scale).setAlpha(0.88);
      c._speed = d.speed;
      return c;
    });
  }

  _buildGround() {
    // Sol défilant
    this._groundTile = this.add.tileSprite(0, GROUND_Y, GAME_WIDTH * 2, 20, 'ground')
      .setOrigin(0, 0);
  }

  // ── Titre ──────────────────────────────────────────────────────────────────

  _buildTitle() {
    // Bandeau semi-transparent derrière le titre
    const panel = this.add.graphics();
    panel.fillStyle(0x000000, 0.22);
    panel.fillRoundedRect(GAME_WIDTH / 2 - 280, 14, 560, 72, 20);

    // Titre principal
    const title = this.add.text(GAME_WIDTH / 2, 34, 'Panpan & Simba', {
      fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive',
      fontSize: '36px',
      fontStyle: 'bold',
      color: TITLE_COLOR,
      stroke: TITLE_STROKE,
      strokeThickness: 6,
      shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 4, fill: true }
    }).setOrigin(0.5, 0);

    // Sous-titre
    this.add.text(GAME_WIDTH / 2, 72, '✨ La Grande Aventure ✨', {
      fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive',
      fontSize: '17px',
      fontStyle: 'bold italic',
      color: SUBTITLE_COLOR,
      stroke: SUBTITLE_STROKE,
      strokeThickness: 4
    }).setOrigin(0.5, 0);

    // Petite animation du titre (bob)
    this.tweens.add({
      targets: title,
      y: 30,
      duration: 1200,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });
  }

  // ── Personnages ────────────────────────────────────────────────────────────

  _buildCharacters() {
    const groundTop = GROUND_Y;

    // Simba : base du corps alignée sur le sol
    this._simba = this.add.image(200, groundTop - 30, 'simba')
      .setOrigin(0.5, 1);

    // Panpan : assis sur le dos de Simba
    this._panpan = this.add.image(180, groundTop - 55, 'panpan')
      .setOrigin(0.5, 1);

    // Animation course (bob vertical)
    this.tweens.add({
      targets: [this._simba, this._panpan],
      y: `-=5`,
      duration: 300,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });

    // Légère oscillation gauche/droite (galop)
    this.tweens.add({
      targets: this._simba,
      scaleX: 1.04,
      duration: 280,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });
  }

  // ── Texte d'instruction ────────────────────────────────────────────────────

  _buildHint() {
    this._hint = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 28, '⎵ ESPACE pour commencer  •  TAP sur mobile', {
      fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive',
      fontSize: '14px',
      color: HINT_COLOR,
      stroke: HINT_STROKE,
      strokeThickness: 4
    }).setOrigin(0.5, 1);

    // Clignotement
    this.tweens.add({
      targets: this._hint,
      alpha: 0.2,
      duration: 600,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });

    // Meilleur score
    const best = localStorage.getItem('panpan_best') || 0;
    if (best > 0) {
      this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 46, `Meilleur score : ${best}`, {
        fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive',
        fontSize: '13px',
        color: SUBTITLE_COLOR,
        stroke: SUBTITLE_STROKE,
        strokeThickness: 3
      }).setOrigin(0.5, 1);
    }
  }

  // ── Input ──────────────────────────────────────────────────────────────────

  _setupInput() {
    // Clavier
    this.input.keyboard.once('keydown-SPACE', () => this._startGame());
    this.input.keyboard.once('keydown-ENTER', () => this._startGame());

    // Touch / clic
    this.input.once('pointerdown', () => this._startGame());
  }

  _startGame() {
    // Flash blanc avant transition
    this.cameras.main.flash(300, 255, 255, 255);
    this.time.delayedCall(280, () => this.scene.start('GameScene'));
  }

  // ── Update ─────────────────────────────────────────────────────────────────

  update(time, delta) {
    const dt = delta / 1000;

    // Défilement sol
    this._groundTile.tilePositionX += 120 * dt;

    // Déplacement nuages
    this._clouds.forEach(c => {
      c.x -= c._speed * dt;
      if (c.x < -50) c.x = GAME_WIDTH + 60;
    });
  }
}
