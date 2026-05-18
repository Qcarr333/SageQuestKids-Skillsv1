export type XPReason = 'round_complete' | 'accuracy_bonus' | 'improvement_bonus' | 'tracking_bonus' | 'streak_bonus';

export type GameProgressPatch = {
  grade_level?: string;
  xp?: number;
  level?: number;
  best_score?: number;
  total_sessions?: number;
  total_correct?: number;
  total_attempts?: number;
  accuracy?: number;
  current_difficulty?: string;
  best_streak?: number;
  unlocked_badges?: string[];
  mastered_skills?: string[];
  game_specific_stats?: Record<string, unknown>;
};

export type GameSessionInput = {
  user_id: string;
  game_key: string;
  grade_level?: string;
  score?: number;
  xp_earned?: number;
  accuracy?: number;
  duration_seconds?: number;
  session_data?: Record<string, unknown>;
};
