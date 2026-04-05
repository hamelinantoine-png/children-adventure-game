import Phaser from 'phaser';
import Player   from '../objects/Player.js';
import Obstacle from '../objects/Obstacle.js';
import {
  GAME_WIDTH, GAME_HEIGHT, GROUND_Y,
  INITIAL_SPEED, MAX_SPEED, SPEED_SCORE_FACTOR,
  OBSTACLE_MIN_INTERVAL, OBSTACLE_MAX_INTERVAL
} from '../constants.js';

export default class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  create() {
    this._score     = 0;
    this._speed     = INITIAL_SPEED;
    this._alive     = true;
    this._obstacles = [];

    this._buildBackground();
    this._buildGround();
    this._buildHUD();
    this._buildPlayer();
    this._buildObstacleGroup();
    this._setupInput();
    this._scheduleNextObstacle();
  }

  // ── Décor ──────────────────────────────────────────────────────────────────

  _buildBackground() {
    // Ciel dégradé
    const sky = this.add.graphics().setDepth(0);
    sky.fillGradientStyle(0x4db8d8, 0x4db8d8, 0x87ceeb, 0x87ceeb, 1);
    sky.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    this.add.image(GAME_WIDTH - 60, 46, 'sun').setAlpha(0.85).setDepth(1);

    const cloudData = [
      { x: 100, y: 28, s: 0.9, spd: 16 },
      { x: 320, y: 16, s: 1.2, spd: 22 },
      { x: 540, y: 34, s: 0.75, spd: 14 },
      { x: 720, y: 20, s: 1.0, spd: 20 },
    ];
    this._clouds = cloudData.map(d =>
      Object.assign(this.add.image(d.x, d.y, 'cloud').setScale(d.s).setAlpha(0.85).setDepth(1), { _spd: d.spd })
    );
  }

  _buildGround() {
    // Sol défilant
    this._groundTile = this.add.tileSprite(0, GROUND_Y, GAME_WIDTH * 2, 20, 'ground')
      .setOrigin(0, 0).setDepth(5);

    // Ligne de sol (limite visuelle nette)
    const ln = this.add.graphics().setDepth(4);
    ln.fillStyle(0x2e7d32); ln.fillRect(0, GROUND_Y - 1, GAME_WIDTH, 2);
  }

  // ── HUD ────────────────────────────────────────────────────────────────────

  _buildHUD() {
    const style = {
      fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive',
      fontSize: '16px', fontStyle: 'bold',
      color: '#1a1a5e', stroke: '#ffffff', strokeThickness: 4
    };
    this._scoreTxt = this.add.text(GAME_WIDTH - 12, 10, 'Score : 0', style)
      .setOrigin(1, 0).setDepth(20);

    const best = localStorage.getItem('panpan_best') || 0;
    this._bestTxt = this.add.text(GAME_WIDTH - 12, 30, `Meilleur : ${best}`, {
      ...style, fontSize: '13px', color: '#7a6000'
    }).setOrigin(1, 0).setDepth(20);

    // Indication duck pour vautour (disparaît après 5 s)
    this._hintTxt = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 16,
      '⬆ ESPACE = saut   ⬇ BAS = se baisser', {
        ...style, fontSize: '12px', color: '#ffffff', strokeThickness: 3
      }
    ).setOrigin(0.5, 1).setDepth(20);
    this.time.delayedCall(5000, () => this._hintTxt.setVisible(false));
  }

  // ── Joueur ─────────────────────────────────────────────────────────────────

  _buildPlayer() {
    this._player = new Player(this);
  }

  // ── Groupe d'obstacles ─────────────────────────────────────────────────────

  _buildObstacleGroup() {
    this._obsGroup = this.physics.add.group();

    this.physics.add.overlap(
      this._player.sprite,
      this._obsGroup,
      this._onCollision,
      null,
      this
    );
  }

  // ── Input ──────────────────────────────────────────────────────────────────

  _setupInput() {
    // Touch : tap haut = saut, tap bas = duck
    this.input.on('pointerdown', ptr => {
      if (ptr.y < GAME_HEIGHT * 0.55) this._player.jumpIfAble();
      else this._player.duckIfAble();
    });
    this.input.on('pointerup', () => this._player.releaseDuck());
  }

  // ── Spawn obstacles ────────────────────────────────────────────────────────

  _scheduleNextObstacle() {
    const delay = Phaser.Math.Between(OBSTACLE_MIN_INTERVAL, OBSTACLE_MAX_INTERVAL);
    this.time.delayedCall(delay, () => {
      if (!this._alive) return;
      const obs = new Obstacle(this, this._obsGroup, this._score);
      this._obstacles.push(obs);
      this._scheduleNextObstacle();
    });
  }

  // ── Collision ──────────────────────────────────────────────────────────────

  _onCollision() {
    if (!this._alive) return;
    this._alive = false;

    // Effets feedback
    this.cameras.main.shake(280, 0.012);
    this.cameras.main.flash(400, 255, 60, 60);

    // Sauvegarde meilleur score
    const sc   = Math.floor(this._score);
    const best = Math.max(parseInt(localStorage.getItem('panpan_best') || '0'), sc);
    localStorage.setItem('panpan_best', best);

    // Transition vers GameOver
    this.time.delayedCall(700, () =>
      this.scene.start('GameOverScene', { score: sc, best })
    );
  }

  // ── Update ─────────────────────────────────────────────────────────────────

  update(time, delta) {
    if (!this._alive) return;

    const dt = delta / 1000;

    // Vitesse progressive
    this._score  += dt * 12;
    this._speed   = Math.min(INITIAL_SPEED + this._score * SPEED_SCORE_FACTOR, MAX_SPEED);

    // Sol défilant
    this._groundTile.tilePositionX += this._speed * dt;

    // Nuages lents
    this._clouds.forEach(c => {
      c.x -= c._spd * dt;
      if (c.x < -80) c.x = GAME_WIDTH + 80;
    });

    // Déplacement obstacles + nettoyage hors-écran
    this._obstacles = this._obstacles.filter(obs => {
      const offScreen = obs.move(this._speed + 60, dt);
      if (offScreen) { obs.destroy(); return false; }
      return true;
    });

    // Mise à jour joueur (touches clavier)
    this._player.update();

    // HUD
    this._scoreTxt.setText(`Score : ${Math.floor(this._score)}`);
  }
}
