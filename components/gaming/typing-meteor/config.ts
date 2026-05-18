import { GradeOption, MeteorPrompt } from './types';

export const ROUND_DURATION_SECONDS = 60;

export const HOME_ROW_KEYS = ['A', 'S', 'D', 'F', 'J', 'K', 'L', ';'];

export const FINGER_MAP: Record<string, string> = {
  A: 'left pinky',
  S: 'left ring finger',
  D: 'left middle finger',
  F: 'left index finger',
  G: 'left index finger',
  H: 'right index finger',
  J: 'right index finger',
  K: 'right middle finger',
  L: 'right ring finger',
  ';': 'right pinky',
  Q: 'left pinky',
  W: 'left ring finger',
  E: 'left middle finger',
  R: 'left index finger',
  T: 'left index finger',
  Y: 'right index finger',
  U: 'right index finger',
  I: 'right middle finger',
  O: 'right ring finger',
  P: 'right pinky',
  Z: 'left pinky',
  X: 'left ring finger',
  C: 'left middle finger',
  V: 'left index finger',
  B: 'left index finger',
  N: 'right index finger',
  M: 'right index finger',
};

export const GRADE_PROMPTS: Record<GradeOption, MeteorPrompt[]> = {
  Kindergarten: ['A', 'S', 'M', 'T', 'P', 'L', 'F'].map((text, i) => ({ id: `k-${i}`, text, kind: 'letter' })),
  '1st': ['cat', 'sun', 'map', 'red', 'big', 'tap', 'sit', 'A'].map((text, i) => ({ id: `1-${i}`, text, kind: text.length === 1 ? 'letter' : 'word' })),
  '2nd': ['because', 'friend', 'jump', '12', '18', 'plant', 'light'].map((text, i) => ({ id: `2-${i}`, text, kind: /^\d/.test(text) ? 'math' : 'word' })),
  '3rd': ['multiply', 'planet', 'divide', '24', '36', 'noun phrase'].map((text, i) => ({ id: `3-${i}`, text, kind: text.includes(' ') ? 'phrase' : /^\d/.test(text) ? 'math' : 'word' })),
  '4th': ['adjective', 'estimate', 'fraction', '144', 'grammar term', 'numerator'].map((text, i) => ({ id: `4-${i}`, text, kind: text.includes(' ') ? 'phrase' : /^\d/.test(text) ? 'math' : 'word' })),
  '5th': ['variable', 'inference', 'decimal', 'evidence', '3.75', 'ecosystem'].map((text, i) => ({ id: `5-${i}`, text, kind: /^\d/.test(text) ? 'math' : 'word' })),
};

export const GRADE_SETTINGS: Record<GradeOption, { spawnMs: number; baseSpeed: number; maxMeteors: number; meteorSize: string; keyboardDefault: boolean }> = {
  Kindergarten: { spawnMs: 2200, baseSpeed: 11, maxMeteors: 1, meteorSize: 'text-3xl', keyboardDefault: true },
  '1st': { spawnMs: 1800, baseSpeed: 14, maxMeteors: 1, meteorSize: 'text-2xl', keyboardDefault: true },
  '2nd': { spawnMs: 1600, baseSpeed: 20, maxMeteors: 2, meteorSize: 'text-2xl', keyboardDefault: true },
  '3rd': { spawnMs: 1400, baseSpeed: 24, maxMeteors: 2, meteorSize: 'text-xl', keyboardDefault: true },
  '4th': { spawnMs: 1200, baseSpeed: 28, maxMeteors: 3, meteorSize: 'text-lg', keyboardDefault: false },
  '5th': { spawnMs: 1050, baseSpeed: 32, maxMeteors: 3, meteorSize: 'text-lg', keyboardDefault: false },
};
