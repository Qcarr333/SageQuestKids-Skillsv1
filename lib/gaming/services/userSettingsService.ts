// TODO: replace with project Supabase client import
const supabase: any = null;

export async function getUserSettings(userId: string) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('user_settings').select('*').eq('user_id', userId).single();
  if (error) throw error;
  return data;
}

export async function saveUserSettings(userId: string, settings: Record<string, unknown>) {
  const payload = { user_id: userId, ...settings, updated_at: new Date().toISOString() };
  if (!supabase) return payload;
  const { data, error } = await supabase.from('user_settings').upsert(payload, { onConflict: 'user_id' }).select().single();
  if (error) throw error;
  return data;
}
