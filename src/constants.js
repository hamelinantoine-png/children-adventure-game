export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 300;
export const GROUND_Y = 260;
export const PLAYER_X = 120;

export const GRAVITY = 1400;
export const JUMP_VELOCITY = -750;
export const DUCK_SCALE = 0.6;

export const INITIAL_SPEED = 280;
export const MAX_SPEED = 650;
export const SPEED_INCREMENT = 12;

export const OBSTACLE_MIN_INTERVAL = 900;
export const OBSTACLE_MAX_INTERVAL = 2400;

export const VILLAIN_TYPES = [
  { key: 'scar',       label: 'Scar',      color: 0x4a2040, w: 48, h: 64, flying: false },
  { key: 'ursula',     label: 'Ursula',    color: 0x6a0dad, w: 56, h: 72, flying: false },
  { key: 'jafar',      label: 'Jafar',     color: 0xcc2200, w: 36, h: 80, flying: false },
  { key: 'gaston',     label: 'Gaston',    color: 0x8b4513, w: 56, h: 68, flying: false },
  { key: 'maleficent', label: 'Maléfique', color: 0x1a6b1a, w: 48, h: 88, flying: true, flyY: 180 }
];

export const COLORS = {
  sky:        0x87ceeb,
  skyBottom:  0xb8e4ff,
  ground:     0x4caf50,
  groundDark: 0x2e7d32,
  cloud:      0xffffff,
  sun:        0xffd700
};
