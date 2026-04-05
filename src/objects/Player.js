import { GROUND_Y, JUMP_VELOCITY, GRAVITY } from '../constants.js';

export default class Player {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this._scene = scene;

    // Sprite physique
    this.sprite = scene.physics.add.sprite(120, GROUND_Y, 'player_run_0')
      .setOrigin(0.5, 1)
      .setDepth(10);

    this.sprite.body.setGravityY(GRAVITY);
    this.sprite.body.setMaxVelocityY(900);
    // Hitbox plus petite que le sprite (112×106) pour la tolérance de jeu
    this.sprite.body.setSize(62, 68, true);
    this.sprite.body.setOffset(25, 30);

    this.sprite.anims.play('player_run');

    // État
    this._ducking  = false;
    this._airborne = false;

    // Touches clavier
    const kb = scene.input.keyboard;
    this._spaceKey = kb.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this._upKey    = kb.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this._downKey  = kb.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
  }

  // ── Appelé à chaque frame ──────────────────────────────────────────────────

  update() {
    const onGround = this.sprite.body.blocked.down || this.sprite.y >= GROUND_Y;

    // Correction plancher (physique peut glisser d'1 px)
    if (onGround && this.sprite.y > GROUND_Y) {
      this.sprite.y = GROUND_Y;
      this.sprite.body.velocity.y = 0;
    }

    // Atterrissage
    if (this._airborne && onGround) {
      this._airborne = false;
      if (!this._ducking) {
        this.sprite.anims.play('player_run', true);
        this.sprite.setScale(1, 1);
        this._resetHitbox();
      }
    }

    // ── Saut ──
    if (onGround && !this._airborne && !this._ducking) {
      if (Phaser.Input.Keyboard.JustDown(this._spaceKey) ||
          Phaser.Input.Keyboard.JustDown(this._upKey)) {
        this._jump();
      }
    }

    // ── Duck ──
    if (onGround && !this._airborne) {
      if (this._downKey.isDown) {
        if (!this._ducking) this._duck();
      } else {
        if (this._ducking) this._standUp();
      }
    }
  }

  // ── Saut déclenché de l'extérieur (mobile tap) ─────────────────────────────

  jumpIfAble() {
    const onGround = this.sprite.body.blocked.down || this.sprite.y >= GROUND_Y;
    if (onGround && !this._airborne && !this._ducking) this._jump();
  }

  duckIfAble() {
    const onGround = this.sprite.body.blocked.down || this.sprite.y >= GROUND_Y;
    if (onGround && !this._airborne) this._duck();
  }

  releaseDuck() {
    if (this._ducking) this._standUp();
  }

  // ── Getters ────────────────────────────────────────────────────────────────

  get isDucking()  { return this._ducking;  }
  get isAirborne() { return this._airborne; }

  // ── Privé ──────────────────────────────────────────────────────────────────

  _jump() {
    this._airborne = true;
    this.sprite.body.setVelocityY(JUMP_VELOCITY);
    this.sprite.anims.play('player_jump', true);
    this.sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      if (this._airborne) this.sprite.anims.play('player_run', true);
    });
  }

  _duck() {
    this._ducking = true;
    // Sprite écrasé + hitbox basse
    this.sprite.setScale(1, 0.62);
    this.sprite.anims.play('player_crouch', true);
    this.sprite.body.setSize(70, 44, true);
    this.sprite.body.setOffset(21, 54);
  }

  _standUp() {
    this._ducking = false;
    this.sprite.setScale(1, 1);
    this.sprite.anims.play('player_run', true);
    this._resetHitbox();
  }

  _resetHitbox() {
    this.sprite.body.setSize(62, 68, true);
    this.sprite.body.setOffset(25, 30);
  }
}
