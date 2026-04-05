import { VILLAIN_TYPES, GROUND_Y, GAME_WIDTH, FLYING_UNLOCK_SCORE } from '../constants.js';

export default class Obstacle {
  /**
   * Crée un obstacle physique et l'ajoute à la scène.
   * @param {Phaser.Scene} scene
   * @param {Phaser.Physics.Arcade.Group} group  — groupe auquel ajouter l'obstacle
   * @param {number} currentScore               — pour décider si les volants sont dispo
   */
  constructor(scene, group, currentScore = 0) {
    // Sélection d'un type aléatoire (volants débloqués après FLYING_UNLOCK_SCORE)
    const available = VILLAIN_TYPES.filter(v => !v.flying || currentScore >= FLYING_UNLOCK_SCORE);
    const type = Phaser.Utils.Array.GetRandom(available);

    // Position de spawn : hors écran à droite
    const x = GAME_WIDTH + 60;
    const y = type.flying ? type.flyY : GROUND_Y;

    // Sprite physique statique (on le déplace manuellement via velocity)
    this.sprite = scene.physics.add.sprite(x, y, type.key)
      .setOrigin(0.5, 1)
      .setDepth(8);

    this.sprite.body.allowGravity = false;
    this.sprite.body.setImmovable(true);
    this.sprite.body.setSize(type.w, type.h);
    this.sprite.body.setOffset(
      (this.sprite.width  - type.w) / 2,
      (this.sprite.height - type.h)
    );

    this.type = type;
    group.add(this.sprite);
  }

  /**
   * Déplace l'obstacle vers la gauche et retourne true si hors écran.
   */
  move(speed, dt) {
    this.sprite.x -= speed * dt;
    return this.sprite.x < -80;
  }

  destroy() {
    this.sprite.destroy();
  }
}
