import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    this._drawPanpan();
    this._drawSimba();
    this._drawCloud();
    this._drawGround();
    this._drawSun();
    this.scene.start('MenuScene');
  }

  // ── Panpan : lapin beige avec grandes oreilles roses ──────────────────────
  _drawPanpan() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    // Oreilles (derrière le corps)
    g.fillStyle(0xffe0bd); // beige clair
    g.fillEllipse(18, 10, 14, 30);
    g.fillEllipse(42, 10, 14, 30);
    // Intérieur oreilles rose
    g.fillStyle(0xff9eb5);
    g.fillEllipse(18, 11, 8, 22);
    g.fillEllipse(42, 11, 8, 22);

    // Corps
    g.fillStyle(0xf5deb3); // wheat
    g.fillEllipse(30, 46, 36, 34);

    // Tête
    g.fillStyle(0xf5deb3);
    g.fillCircle(30, 28, 18);

    // Yeux
    g.fillStyle(0x1a1a2e);
    g.fillCircle(24, 25, 3);
    g.fillCircle(36, 25, 3);
    // Reflet dans les yeux
    g.fillStyle(0xffffff);
    g.fillCircle(25.5, 23.5, 1);
    g.fillCircle(37.5, 23.5, 1);

    // Museau
    g.fillStyle(0xffb6c1);
    g.fillEllipse(30, 32, 10, 7);
    // Nez
    g.fillStyle(0xff6b8a);
    g.fillCircle(30, 30, 2.5);

    // Queue
    g.fillStyle(0xffffff);
    g.fillCircle(50, 50, 7);

    // Pattes avant
    g.fillStyle(0xf5deb3);
    g.fillEllipse(20, 62, 14, 10);
    g.fillEllipse(40, 62, 14, 10);

    g.generateTexture('panpan', 60, 70);
    g.destroy();
  }

  // ── Simba : lionceau orange avec crinière jaune ────────────────────────────
  _drawSimba() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    // Corps
    g.fillStyle(0xe8872a); // orange
    g.fillEllipse(40, 36, 60, 36);

    // Tête
    g.fillStyle(0xe8872a);
    g.fillCircle(18, 22, 18);

    // Crinière (cercle jaune derrière la tête)
    g.fillStyle(0xf9c74f);
    g.fillCircle(18, 22, 22);
    // Re-dessiner la tête par-dessus
    g.fillStyle(0xe8872a);
    g.fillCircle(18, 22, 16);

    // Oreilles
    g.fillStyle(0xe8872a);
    g.fillTriangle(6, 8, 14, 0, 18, 10);
    g.fillTriangle(24, 8, 28, 0, 32, 10);
    // Intérieur oreilles
    g.fillStyle(0xff9eb5);
    g.fillTriangle(8, 8, 13, 2, 16, 9);
    g.fillTriangle(25, 8, 28, 2, 30, 9);

    // Yeux
    g.fillStyle(0x2d6a2d); // vert
    g.fillCircle(13, 20, 4);
    g.fillCircle(23, 20, 4);
    g.fillStyle(0x1a1a2e);
    g.fillCircle(13, 20, 2.5);
    g.fillCircle(23, 20, 2.5);
    g.fillStyle(0xffffff);
    g.fillCircle(14, 19, 1);
    g.fillCircle(24, 19, 1);

    // Museau
    g.fillStyle(0xf9c0a0);
    g.fillEllipse(18, 26, 12, 8);
    g.fillStyle(0xcc5522);
    g.fillCircle(18, 24, 2);

    // Pattes
    g.fillStyle(0xe8872a);
    g.fillEllipse(10, 52, 18, 12);
    g.fillEllipse(34, 52, 18, 12);
    g.fillEllipse(52, 52, 18, 12);
    g.fillEllipse(70, 52, 18, 12);

    // Queue (courbe simulée)
    g.fillStyle(0xe8872a);
    g.fillEllipse(74, 28, 10, 30);
    // Bout de queue touffu
    g.fillStyle(0xf9c74f);
    g.fillCircle(74, 14, 8);

    g.generateTexture('simba', 84, 60);
    g.destroy();
  }

  // ── Nuage ──────────────────────────────────────────────────────────────────
  _drawCloud() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    g.fillStyle(0xffffff, 0.95);
    g.fillCircle(20, 20, 18);
    g.fillCircle(40, 16, 22);
    g.fillCircle(62, 20, 16);
    g.fillRect(20, 20, 42, 14);

    // Ombre légère
    g.fillStyle(0xe8e8f0, 0.5);
    g.fillRect(20, 28, 42, 6);

    g.generateTexture('cloud', 80, 36);
    g.destroy();
  }

  // ── Sol ────────────────────────────────────────────────────────────────────
  _drawGround() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    // Bande verte
    g.fillStyle(0x4caf50);
    g.fillRect(0, 0, 32, 14);
    // Ligne sombre en bas
    g.fillStyle(0x2e7d32);
    g.fillRect(0, 12, 32, 8);
    // Petites herbes (décoratives)
    g.fillStyle(0x66bb6a);
    g.fillRect(4, 0, 3, 5);
    g.fillRect(14, 0, 3, 4);
    g.fillRect(24, 0, 3, 6);

    g.generateTexture('ground', 32, 20);
    g.destroy();
  }

  // ── Soleil ─────────────────────────────────────────────────────────────────
  _drawSun() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    // Rayons
    g.fillStyle(0xffd700, 0.6);
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x1 = 24 + Math.cos(angle) * 16;
      const y1 = 24 + Math.sin(angle) * 16;
      const x2 = 24 + Math.cos(angle) * 28;
      const y2 = 24 + Math.sin(angle) * 28;
      g.fillTriangle(
        x1 + Math.cos(angle + Math.PI / 2) * 4,
        y1 + Math.sin(angle + Math.PI / 2) * 4,
        x1 + Math.cos(angle - Math.PI / 2) * 4,
        y1 + Math.sin(angle - Math.PI / 2) * 4,
        x2, y2
      );
    }
    // Cercle central
    g.fillStyle(0xffd700);
    g.fillCircle(24, 24, 14);
    g.fillStyle(0xffec6e);
    g.fillCircle(20, 20, 6);

    g.generateTexture('sun', 48, 48);
    g.destroy();
  }
}
