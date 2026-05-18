export type CoachMode = 'full' | 'simplified' | 'compact' | 'hidden';
export type CoachPosition = 'bottom-center' | 'bottom-right';
export type FingerId = 'left_pinky'|'left_ring'|'left_middle'|'left_index'|'right_index'|'right_middle'|'right_ring'|'right_pinky'|'thumb';

export type KeyboardTarget = { key: string; finger?: FingerId; hint?: string };

export type KeyboardCoachSettings = {
  keyboard_coach_enabled: boolean;
  keyboard_coach_mode: CoachMode;
  keyboard_coach_position: CoachPosition;
  keyboard_coach_opacity: number;
  keyboard_coach_size: 'small'|'medium'|'large';
  keyboard_coach_show_hands: boolean;
  keyboard_coach_show_home_row: boolean;
  keyboard_coach_reduced_motion: boolean;
  keyboard_coach_high_contrast: boolean;
};

export const DEFAULT_SETTINGS: KeyboardCoachSettings = {
  keyboard_coach_enabled: true,
  keyboard_coach_mode: 'full',
  keyboard_coach_position: 'bottom-right',
  keyboard_coach_opacity: 0.95,
  keyboard_coach_size: 'medium',
  keyboard_coach_show_hands: true,
  keyboard_coach_show_home_row: true,
  keyboard_coach_reduced_motion: false,
  keyboard_coach_high_contrast: false,
};
