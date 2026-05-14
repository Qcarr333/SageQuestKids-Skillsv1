import { calculateLevelFromXP } from '@/lib/gaming/progress';
import { GameProgressPatch, GameSessionInput, XPReason } from './types';

// TODO: replace with project Supabase client import
const supabase: any = null;

export async function getUserGameProgress(userId: string, gameKey: string) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('user_game_progress').select('*').eq('user_id', userId).eq('game_key', gameKey).single();
  if (error) throw error;
  return data;
}

export async function saveUserGameProgress(userId: string, gameKey: string, patch: GameProgressPatch) {
  const payload = { user_id: userId, game_key: gameKey, ...patch, level: calculateLevelFromXP(patch.xp ?? 0), updated_at: new Date().toISOString() };
  if (!supabase) return payload;
  const { data, error } = await supabase.from('user_game_progress').upsert(payload, { onConflict: 'user_id,game_key' }).select().single();
  if (error) throw error;
  return data;
}

export async function createGameSession(sessionData: GameSessionInput) {
  if (!supabase) return sessionData;
  const { data, error } = await supabase.from('user_game_sessions').insert(sessionData).select().single();
  if (error) throw error;
  return data;
}

export async function awardXP(userId: string, gameKey: string, amount: number, reason: XPReason) {
  const existing = (await getUserGameProgress(userId, gameKey)) ?? { xp: 0 };
  const xp = Math.max(0, (existing.xp ?? 0) + Math.max(0, amount));
  return saveUserGameProgress(userId, gameKey, { ...existing, xp, game_specific_stats: { ...(existing.game_specific_stats ?? {}), last_xp_reason: reason } });
}
