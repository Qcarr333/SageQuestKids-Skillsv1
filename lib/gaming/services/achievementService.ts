// TODO: replace with project Supabase client import
const supabase: any = null;

export async function unlockAchievement(userId: string, achievementKey: string, achievementName: string, description?: string, metadata: Record<string, unknown> = {}) {
  const payload = { user_id: userId, achievement_key: achievementKey, achievement_name: achievementName, description: description ?? null, metadata };
  if (!supabase) return payload;
  const { data, error } = await supabase.from('user_achievements').upsert(payload, { onConflict: 'user_id,achievement_key' }).select().single();
  if (error) throw error;
  return data;
}
