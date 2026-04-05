export const GAME_WIDTH  = 800;
export const GAME_HEIGHT = 300;
export const GROUND_Y    = 262;
export const PLAYER_X    = 120;

export const GRAVITY        = 1400;
export const JUMP_VELOCITY  = -760;

export const INITIAL_SPEED         = 280;
export const MAX_SPEED             = 640;
export const SPEED_SCORE_FACTOR    = 0.55;  // vitesse = INITIAL + score * factor

export const OBSTACLE_MIN_INTERVAL = 950;   // ms
export const OBSTACLE_MAX_INTERVAL = 2500;  // ms

// ─── Ennemis ────────────────────────────────────────────────────────────────
//  flying:true  → le joueur doit se baisser (duck) pour les éviter
//  flyY         → position y (origin bottom) de l'obstacle volant
export const VILLAIN_TYPES = [
  { key: 'hyena',     label: 'Hyène',         w: 50, h: 56, flying: false },
  { key: 'evil_lion', label: 'Méchant Lion',  w: 46, h: 68, flying: false },
  { key: 'zbob',      label: 'Zbob',          w: 46, h: 70, flying: false },
  { key: 'vulture',   label: 'Vautour',       w: 60, h: 46, flying: true,  flyY: GROUND_Y - 72 },
];

// Les volants n'apparaissent qu'après ce score
export const FLYING_UNLOCK_SCORE = 300;
