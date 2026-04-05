import Phaser from 'phaser';

// ── Palettes ────────────────────────────────────────────────────────────────
const LAP = { fur: 0xA2A9B1, belly: 0xFCFBE3, pink: 0xF4C2C2, eye: 0x2D1B15, nose: 0xCC7788 };
const LIO = { fur: 0xE1A95F, belly: 0xF5DEB3, mane: 0x8B4513, dark: 0xCB8A3A, eye: 0xFFBF00, pupil: 0x1A1A2E };
const BLK = 0x1A1A1A;
const WHT = 0xFFFFFF;

export default class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }

  create() {
    this._genEnv();
    this._genPlayerRunFrames();
    this._genPlayerCrouchFrames();
    this._genPlayerJumpFrames();
    this._genEnemies();
    this._registerAnims();
    this.scene.start('MenuScene');
  }

  // ── Environnement ───────────────────────────────────────────────────────────

  _genEnv() {
    let g;
    g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x4caf50); g.fillRect(0, 0, 32, 12);
    g.fillStyle(0x2e7d32); g.fillRect(0, 11, 32, 9);
    g.fillStyle(0x68c068);
    g.fillRect(3, 0, 3, 5); g.fillRect(12, 0, 3, 4); g.fillRect(23, 0, 3, 6);
    g.generateTexture('ground', 32, 20); g.destroy();

    g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(WHT, 0.93);
    g.fillCircle(18, 26, 17); g.fillCircle(36, 18, 21); g.fillCircle(56, 26, 15);
    g.fillRect(18, 26, 38, 16);
    g.fillStyle(0xDCEAF7, 0.35); g.fillRect(20, 34, 36, 8);
    g.generateTexture('cloud', 72, 42); g.destroy();

    g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xFFD700, 0.5);
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4, c = Math.cos(a), s = Math.sin(a);
      g.fillTriangle(24+c*13, 24+s*13, 24+Math.cos(a+.22)*13, 24+Math.sin(a+.22)*13, 24+c*25, 24+s*25);
    }
    g.fillStyle(0xFFD700); g.fillCircle(24, 24, 12);
    g.fillStyle(0xFFF060); g.fillCircle(20, 20, 5);
    g.generateTexture('sun', 48, 48); g.destroy();
  }

  // ── Frames de course (4 frames — 112 × 106) ────────────────────────────────

  _genPlayerRunFrames() {
    const poses = [
      { by: 76, fL:[14,94], fR:[28,89], bL:[74,89], bR:[88,94] },
      { by: 72, fL:[18,91], fR:[30,91], bL:[76,91], bR:[90,91] },
      { by: 76, fL:[20,89], fR:[34,94], bL:[70,94], bR:[82,89] },
      { by: 78, fL:[16,94], fR:[28,94], bL:[72,94], bR:[86,94] },
    ];
    poses.forEach((pose, f) => {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      this._drawLion(g, pose);
      this._drawLapin(g, 46, pose.by - 8, f, 'run');
      g.generateTexture(`player_run_${f}`, 112, 106);
      g.destroy();
    });
  }

  // ── Frames accroupis (2 frames — 112 × 68) ─────────────────────────────────

  _genPlayerCrouchFrames() {
    [0, 1].forEach(f => {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      // Lion corps plus bas, pattes repliées
      const pose = { by: 52, fL:[16,62], fR:[28,62], bL:[72,62], bR:[84,62] };
      this._drawLionCrouch(g, pose);
      this._drawLapin(g, 46, 30, f, 'crouch');
      g.generateTexture(`player_crouch_${f}`, 112, 68);
      g.destroy();
    });
  }

  // ── Frames de saut (4 frames — 112 × 110) ──────────────────────────────────

  _genPlayerJumpFrames() {
    // Frames : élan → envol → apogée → descente
    const jumpPoses = [
      { by: 82, fL:[12,102], fR:[26,96], bL:[74,96], bR:[88,102], lapinBy: 62 }, // élan
      { by: 74, fL:[14,96], fR:[28,88], bL:[72,88], bR:[86,96], lapinBy: 54 },   // montée
      { by: 68, fL:[10,92], fR:[32,84], bL:[68,84], bR:[90,92], lapinBy: 48 },   // apogée
      { by: 76, fL:[16,98], fR:[28,92], bL:[74,92], bR:[86,98], lapinBy: 56 },   // descente
    ];
    jumpPoses.forEach((pose, f) => {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      this._drawLion(g, pose);
      this._drawLapin(g, 46, pose.lapinBy, f, 'jump');
      g.generateTexture(`player_jump_${f}`, 112, 110);
      g.destroy();
    });
  }

  // ── Dessin Lion ─────────────────────────────────────────────────────────────

  _drawLion(g, { by, fL, fR, bL, bR }) {
    const bx = 58;
    // Queue
    g.lineStyle(6, LIO.fur, 1);
    g.beginPath(); g.moveTo(102, by-8); g.bezierCurveTo(112, by-22, 110, by-36, 102, by-44); g.strokePath();
    g.lineStyle(0, 0, 0);
    g.fillStyle(LIO.mane); g.fillCircle(102, by-45, 9);
    // Corps + ventre
    g.fillStyle(LIO.fur); g.fillEllipse(bx, by, 88, 34);
    g.fillStyle(LIO.belly); g.fillEllipse(bx+4, by+9, 58, 18);
    // Pattes arrière
    this._drawLegLion(g, bR, bx+30, by+12);
    this._drawLegLion(g, bL, bx+26, by+12);
    // Tête
    const hx = 14, hy = by-20;
    g.fillStyle(LIO.mane); g.fillCircle(hx, hy, 22);
    for (let i = 0; i < 6; i++) {
      const a = -0.6 + i*0.35;
      g.fillTriangle(hx+Math.cos(a)*18, hy+Math.sin(a)*18, hx+Math.cos(a+0.2)*18, hy+Math.sin(a+0.2)*18, hx+Math.cos(a+0.1)*28, hy+Math.sin(a+0.1)*28);
    }
    g.fillStyle(LIO.fur); g.fillCircle(hx, hy, 17);
    // Oreille contour noir
    g.fillStyle(LIO.fur); g.fillTriangle(hx-7, hy-14, hx+2, hy-27, hx+9, hy-14);
    g.lineStyle(2, BLK, 1); g.strokeTriangle(hx-7, hy-14, hx+2, hy-27, hx+9, hy-14); g.lineStyle(0,0,0);
    // Œil ambre
    g.fillStyle(LIO.eye); g.fillCircle(hx-3, hy-4, 6);
    g.fillStyle(LIO.pupil); g.fillCircle(hx-3, hy-4, 4);
    g.fillStyle(WHT); g.fillCircle(hx-1, hy-5, 1.5);
    // Museau
    g.fillStyle(LIO.belly); g.fillEllipse(hx+8, hy+4, 16, 11);
    g.fillStyle(LIO.mane); g.fillEllipse(hx+8, hy+1, 7, 5);
    // Pattes avant
    this._drawLegLion(g, fR, bx-22, by+10);
    this._drawLegLion(g, fL, bx-26, by+10);
  }

  _drawLionCrouch(g, { by, fL, fR, bL, bR }) {
    const bx = 58;
    // Corps aplati
    g.fillStyle(LIO.fur); g.fillEllipse(bx, by, 88, 26);
    g.fillStyle(LIO.belly); g.fillEllipse(bx+4, by+6, 58, 14);
    // Pattes repliées
    [fL, fR, bL, bR].forEach(([px, py]) => {
      g.fillStyle(LIO.dark); g.fillEllipse(px, py-8, 14, 18);
      g.fillStyle(LIO.belly); g.fillEllipse(px, py, 18, 11);
    });
    // Tête abaissée
    const hx = 14, hy = by-14;
    g.fillStyle(LIO.mane); g.fillCircle(hx, hy, 20);
    g.fillStyle(LIO.fur); g.fillCircle(hx, hy, 15);
    g.fillStyle(LIO.eye); g.fillCircle(hx-3, hy-2, 5);
    g.fillStyle(LIO.pupil); g.fillCircle(hx-3, hy-2, 3.5);
    g.fillStyle(LIO.belly); g.fillEllipse(hx+7, hy+3, 14, 9);
    g.fillStyle(LIO.mane); g.fillEllipse(hx+7, hy, 6, 4);
  }

  _drawLegLion(g, [px, py], hipX, hipY) {
    const midX = (px+hipX)/2, midY = (py+hipY)/2;
    g.fillStyle(LIO.dark); g.fillEllipse(midX, midY, 14, Math.abs(py-hipY)+10);
    g.fillStyle(LIO.belly); g.fillEllipse(px, py, 18, 11);
  }

  // ── Dessin Lapin ────────────────────────────────────────────────────────────

  _drawLapin(g, cx, by, frame, mode) {
    const earTX  = mode === 'run' || mode === 'jump' ? 5 + (frame%2) : 0;
    const earH   = mode === 'crouch' ? 14 : 22;
    const smileOpen = mode !== 'crouch';

    // Grandes pattes arrière
    g.fillStyle(LAP.fur);
    g.fillEllipse(cx-11, by-9, 18, 14); g.fillEllipse(cx+11, by-9, 18, 14);
    g.fillEllipse(cx-15, by-2, 24, 11); g.fillEllipse(cx+15, by-2, 24, 11);

    // Corps poire
    g.fillStyle(LAP.fur); g.fillEllipse(cx, by-23, 30, 34);
    g.fillStyle(LAP.belly); g.fillEllipse(cx, by-19, 20, 26);

    // Bras
    if (mode !== 'crouch') {
      g.fillStyle(LAP.fur);
      g.fillEllipse(cx-18, by-33, 12, 9); g.fillEllipse(cx+18, by-33, 12, 9);
    }

    // Tête
    g.fillStyle(LAP.fur); g.fillCircle(cx, by-42, 17);

    // Oreilles inclinées vers l'arrière (course/saut) ou droites (crouch)
    g.fillStyle(LAP.fur);
    g.fillEllipse(cx-6+earTX, by-54, 11, earH);
    g.fillEllipse(cx+8+earTX, by-52, 11, earH);
    g.fillStyle(LAP.pink);
    g.fillEllipse(cx-6+earTX, by-54, 6, earH-6);
    g.fillEllipse(cx+8+earTX, by-52, 6, earH-6);

    // Visage crème
    g.fillStyle(LAP.belly); g.fillEllipse(cx, by-40, 22, 16);

    // Grands yeux (40 % du visage)
    g.fillStyle(WHT); g.fillCircle(cx-7, by-44, 7); g.fillCircle(cx+7, by-44, 7);
    g.fillStyle(LAP.eye); g.fillCircle(cx-7, by-44, 5); g.fillCircle(cx+7, by-44, 5);
    g.fillStyle(WHT); g.fillCircle(cx-5, by-45, 1.8); g.fillCircle(cx+9, by-45, 1.8);

    // Museau
    g.fillStyle(LAP.pink); g.fillEllipse(cx, by-37, 13, 9);
    g.fillStyle(LAP.nose); g.fillCircle(cx, by-39, 2.5);

    // Bouche
    if (smileOpen) {
      g.fillStyle(BLK); g.fillEllipse(cx, by-33, 10, 7);
      g.fillStyle(WHT); g.fillRect(cx-2, by-36, 5, 5); // incisive
    } else {
      g.fillStyle(BLK); g.fillRect(cx-4, by-34, 8, 2);
    }
  }

  // ── Ennemis ─────────────────────────────────────────────────────────────────

  _genEnemies() {
    let g;

    // ── Hyène (56 × 60) ─ posture voûtée, arrière-train bas
    g = this.make.graphics({ x: 0, y: 0, add: false });
    this._drawHyena(g, 28, 58);
    g.generateTexture('hyena', 56, 60); g.destroy();

    // ── Méchant Lion (58 × 72) ─ angulaire, cicatrice
    g = this.make.graphics({ x: 0, y: 0, add: false });
    this._drawEvilLion(g, 29, 70);
    g.generateTexture('evil_lion', 58, 72); g.destroy();

    // ── Zbob (58 × 74) ─ robot violet
    g = this.make.graphics({ x: 0, y: 0, add: false });
    this._drawZbob(g, 29, 72);
    g.generateTexture('zbob', 58, 74); g.destroy();

    // ── Vautour (70 × 52) ─ volatile volant, cou courbé
    g = this.make.graphics({ x: 0, y: 0, add: false });
    this._drawVulture(g, 35, 50);
    g.generateTexture('vulture', 70, 52); g.destroy();
  }

  _drawHyena(g, cx, by) {
    const FUR = 0x8B8589, SPOT = 0x1A1A1B, MANE = 0x1A1A1B, EYE_Y = 0xCCFF00;
    // Taches (avant corps)
    g.fillStyle(SPOT);
    g.fillEllipse(cx+2, by-22, 9, 7); g.fillEllipse(cx+8, by-32, 8, 6); g.fillEllipse(cx-4, by-38, 7, 6);
    // Corps voûté : avant haut, arrière bas
    g.fillStyle(FUR);
    g.fillEllipse(cx+12, by-16, 38, 24);  // arrière (bas)
    g.fillEllipse(cx-10, by-26, 34, 28);  // avant (haut)
    // Crinière dorsale hérissée
    g.fillStyle(MANE);
    for (let i = 0; i < 5; i++) {
      const rx = cx-8 + i*8;
      g.fillTriangle(rx-3, by-32, rx, by-44+i*2, rx+3, by-32);
    }
    // Tête (avant, inclinée vers le bas)
    const hx = cx-18, hy = by-38;
    g.fillStyle(FUR); g.fillCircle(hx, hy, 14);
    // Oreilles pointues
    g.fillTriangle(hx-6, hy-10, hx-10, hy-22, hx+2, hy-12);
    g.fillTriangle(hx+4, hy-10, hx+8, hy-22, hx+12, hy-12);
    // Yeux jaune acide + cernes
    g.fillStyle(BLK); g.fillCircle(hx, hy-3, 7);
    g.fillStyle(EYE_Y); g.fillCircle(hx, hy-3, 5);
    g.fillStyle(BLK); g.fillCircle(hx, hy-3, 3);
    // Museau allongé
    g.fillStyle(FUR); g.fillEllipse(hx+10, hy+4, 20, 11);
    g.fillStyle(0x666666); g.fillEllipse(hx+10, hy+1, 8, 6);
    // Dents
    g.fillStyle(WHT);
    g.fillTriangle(hx+4, hy+7, hx+7, hy+12, hx+8, hy+7);
    g.fillTriangle(hx+10, hy+7, hx+13, hy+12, hx+14, hy+7);
    // 4 pattes (arrière plus basses)
    g.fillStyle(FUR);
    [[cx-8,by-4,16],[cx+2,by-3,16],[cx+14,by-1,14],[cx+24,by,14]].forEach(([x,y,h]) => {
      g.fillEllipse(x, y-h/2, 12, h); g.fillEllipse(x, y, 15, 9);
    });
  }

  _drawEvilLion(g, cx, by) {
    const FUR = 0xA0522D, MAN = 0x000000, SCAR = 0xFF6B6B;
    // Corps mince
    g.fillStyle(FUR); g.fillEllipse(cx, by-32, 42, 40);
    // Longue crinière noire
    g.fillStyle(MAN); g.fillCircle(cx-6, by-54, 26);
    // Tête angulaire
    g.fillStyle(FUR); g.fillCircle(cx-6, by-54, 19);
    // Oreilles triangulaires saillantes
    g.fillTriangle(cx-20, by-64, cx-14, by-78, cx-4, by-64);
    g.fillTriangle(cx+4, by-62, cx+8, by-76, cx+16, by-62);
    // Œil gauche (avec cicatrice)
    g.fillStyle(0xFF8C00); g.fillCircle(cx-12, by-56, 5);
    g.fillStyle(BLK); g.fillCircle(cx-12, by-56, 4);
    // Cicatrice fine verticale
    g.lineStyle(2, SCAR, 1);
    g.beginPath(); g.moveTo(cx-12, by-63); g.lineTo(cx-10, by-49); g.strokePath();
    g.lineStyle(0, 0, 0);
    // Œil droit
    g.fillStyle(0xFF8C00); g.fillCircle(cx-2, by-58, 5);
    g.fillStyle(BLK); g.fillCircle(cx-2, by-58, 4);
    // Museau angulaire
    g.fillStyle(0xC06030); g.fillEllipse(cx+4, by-46, 16, 10);
    g.fillStyle(MAN); g.fillEllipse(cx+4, by-49, 7, 5);
    // Griffes toujours sorties
    g.lineStyle(2, BLK, 1);
    [cx-18, cx-14, cx-10].forEach(x => { g.beginPath(); g.moveTo(x, by-2); g.lineTo(x-2, by+5); g.strokePath(); });
    [cx+6, cx+10, cx+14].forEach(x => { g.beginPath(); g.moveTo(x, by-2); g.lineTo(x-2, by+5); g.strokePath(); });
    g.lineStyle(0, 0, 0);
    // Pattes minces
    g.fillStyle(FUR);
    [[cx-18,by],[cx-8,by],[cx+8,by],[cx+18,by]].forEach(([x,y]) => {
      g.fillEllipse(x, y-12, 12, 24); g.fillEllipse(x, y, 14, 10);
    });
  }

  _drawZbob(g, cx, by) {
    const ARM = 0x4B0082, MET = 0x808080, GLW = 0xFF0000, CAP = 0xCC0000;
    // Cape (derrière)
    g.fillStyle(CAP);
    g.fillTriangle(cx-18, by-44, cx+18, by-44, cx+26, by+2);
    g.fillTriangle(cx-18, by-44, cx-26, by+2, cx+2, by-44);
    // Corps armure (boîte arrondie)
    g.fillStyle(ARM); g.fillRoundedRect(cx-18, by-58, 36, 44, 4);
    // Panneaux métalliques
    g.fillStyle(MET);
    g.fillRoundedRect(cx-14, by-54, 11, 16, 2); g.fillRoundedRect(cx+3, by-54, 11, 16, 2);
    // Tête
    g.fillStyle(ARM); g.fillRoundedRect(cx-14, by-74, 28, 22, 3);
    // Yeux rouges lumineux
    g.fillStyle(GLW); g.fillRect(cx-10, by-68, 7, 4); g.fillRect(cx+3, by-68, 7, 4);
    // Bouche fente rouge
    g.fillRect(cx-8, by-60, 16, 3);
    // Bras-canon (droite)
    g.fillStyle(MET); g.fillRoundedRect(cx+18, by-52, 18, 12, 4);
    g.fillRoundedRect(cx+30, by-50, 16, 8, 3);
    // Balle ping-pong
    g.fillStyle(WHT); g.fillCircle(cx+48, by-46, 5);
    g.lineStyle(1, 0xCCCCCC, 1); g.strokeCircle(cx+48, by-46, 5); g.lineStyle(0,0,0);
    // Bras gauche
    g.fillStyle(ARM); g.fillRoundedRect(cx-28, by-52, 12, 18, 4);
    // Jambes
    g.fillStyle(MET);
    g.fillRoundedRect(cx-14, by-16, 12, 18, 3); g.fillRoundedRect(cx+2, by-16, 12, 18, 3);
    g.fillStyle(ARM);
    g.fillRoundedRect(cx-16, by+1, 14, 8, 2); g.fillRoundedRect(cx+2, by+1, 14, 8, 2);
  }

  _drawVulture(g, cx, by) {
    const BDY = 0x2A2020, FEAT = 0x1A1A1A, BALD = 0xC4957A, BEK = 0x9B8040;
    // Ailes déployées
    g.fillStyle(FEAT);
    g.fillEllipse(cx-24, by-18, 38, 14); g.fillEllipse(cx+24, by-18, 38, 14);
    // Plumes d'ailes
    [0,1,2,3].forEach(i => {
      g.fillStyle(BDY);
      g.fillTriangle(cx-42+i*5, by-16, cx-40+i*5, by-27, cx-36+i*5, by-16);
      g.fillTriangle(cx+22+i*6, by-16, cx+24+i*6, by-27, cx+28+i*6, by-16);
    });
    // Corps
    g.fillStyle(BDY); g.fillEllipse(cx, by-14, 22, 22);
    // Cou courbé (caractéristique vautour)
    g.fillEllipse(cx-4, by-26, 14, 20);
    // Tête chauve
    g.fillStyle(BALD); g.fillCircle(cx-4, by-37, 11);
    // Yeux rouges (méchants)
    g.fillStyle(0xFF2222); g.fillCircle(cx-10, by-39, 4); g.fillCircle(cx+2, by-39, 4);
    g.fillStyle(BLK); g.fillCircle(cx-10, by-39, 2.5); g.fillCircle(cx+2, by-39, 2.5);
    // Bec crochu
    g.fillStyle(BEK);
    g.fillTriangle(cx-4, by-37, cx+10, by-35, cx+6, by-29);
    g.lineStyle(1, 0x7A6030, 1); g.strokeTriangle(cx-4, by-37, cx+10, by-35, cx+6, by-29); g.lineStyle(0,0,0);
    // Serres
    g.fillStyle(BEK); g.fillEllipse(cx-4, by, 14, 8);
    g.lineStyle(2, BEK, 1);
    [-6,-2,2].forEach(dx => { g.beginPath(); g.moveTo(cx+dx, by+2); g.lineTo(cx+dx-2, by+9); g.strokePath(); });
    g.lineStyle(0,0,0);
  }

  // ── Animations ──────────────────────────────────────────────────────────────

  _registerAnims() {
    this.anims.create({
      key: 'player_run',
      frames: [0,1,2,3].map(f => ({ key: `player_run_${f}` })),
      frameRate: 10, repeat: -1
    });
    this.anims.create({
      key: 'player_crouch',
      frames: [0,1].map(f => ({ key: `player_crouch_${f}` })),
      frameRate: 8, repeat: -1
    });
    this.anims.create({
      key: 'player_jump',
      frames: [0,1,2,3].map(f => ({ key: `player_jump_${f}` })),
      frameRate: 10, repeat: 0
    });
  }
}
