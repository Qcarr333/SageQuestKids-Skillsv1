export type GradeLevel = 'kindergarten' | '1st' | '2nd' | '3rd' | '4th' | '5th';

export type UserGameProgress = {
  id?: string;
  user_id: string;
  game_key: string;
  grade_level: GradeLevel;
  xp: number;
  level: number;
  best_score: number;
  total_sessions: number;
  total_correct: number;
  total_attempts: number;
  accuracy: number;
  current_difficulty: string;
  unlocked_badges: string[];
  settings: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
};

export const XP_LEVEL_THRESHOLDS = [0, 100, 250, 500, 850, 1300, 1850, 2500, 3250, 4100];

export function calculateLevelFromXP(xp: number): number {
  if (xp <= 0) return 1;

  for (let i = XP_LEVEL_THRESHOLDS.length - 1; i >= 0; i -= 1) {
    if (xp >= XP_LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }

  const baseThreshold = XP_LEVEL_THRESHOLDS[XP_LEVEL_THRESHOLDS.length - 1];
  const extraXP = xp - baseThreshold;
  const levelsBeyondDefinedThresholds = Math.floor(Math.max(0, extraXP) / 450);
  return XP_LEVEL_THRESHOLDS.length + levelsBeyondDefinedThresholds;
}

/**
 * TODO: Wire this helper to the project's configured Supabase client.
 * This safe fallback keeps the app functional before the DB table is deployed.
 */
export async function getUserGameProgress(userId: string, gameKey: string): Promise<UserGameProgress | null> {
  if (!userId || !gameKey) return null;

  // TODO: Replace with Supabase query:
  // supabase.from('user_game_progress').select('*').eq('user_id', userId).eq('game_key', gameKey).single();
  return null;
}

/**
 * Safe upsert pattern for user_game_progress table.
 */
export async function saveUserGameProgress(
  userId: string,
  gameKey: string,
  progressData: Partial<UserGameProgress>
): Promise<UserGameProgress | null> {
  if (!userId || !gameKey) return null;

  const merged: UserGameProgress = {
    user_id: userId,
    game_key: gameKey,
    grade_level: progressData.grade_level ?? '3rd',
    xp: Math.max(0, progressData.xp ?? 0),
    level: calculateLevelFromXP(progressData.xp ?? 0),
    best_score: progressData.best_score ?? 0,
    total_sessions: progressData.total_sessions ?? 0,
    total_correct: progressData.total_correct ?? 0,
    total_attempts: progressData.total_attempts ?? 0,
    accuracy: progressData.accuracy ?? 0,
    current_difficulty: progressData.current_difficulty ?? 'starter',
    unlocked_badges: progressData.unlocked_badges ?? [],
    settings: progressData.settings ?? {},
    ...progressData,
    updated_at: new Date().toISOString(),
  };

  // TODO: Replace with Supabase upsert once schema exists:
  // supabase.from('user_game_progress').upsert(merged, { onConflict: 'user_id,game_key' }).select().single();
  return merged;
}

export async function awardXP(
  userId: string,
  gameKey: string,
  amount: number,
  reason: 'round_complete' | 'accuracy_bonus' | 'improvement_bonus' | 'tracking_bonus' | 'streak_bonus'
): Promise<UserGameProgress | null> {
  if (amount <= 0) return getUserGameProgress(userId, gameKey);

  const existing = (await getUserGameProgress(userId, gameKey)) ?? {
    user_id: userId,
    game_key: gameKey,
    grade_level: '3rd' as GradeLevel,
    xp: 0,
    level: 1,
    best_score: 0,
    total_sessions: 0,
    total_correct: 0,
    total_attempts: 0,
    accuracy: 0,
    current_difficulty: 'starter',
    unlocked_badges: [],
    settings: {},
  };

  const nextXP = existing.xp + amount;
  const nextLevel = calculateLevelFromXP(nextXP);

  return saveUserGameProgress(userId, gameKey, {
    ...existing,
    xp: nextXP,
    level: nextLevel,
    settings: {
      ...existing.settings,
      last_xp_reason: reason,
    },
  });
}
