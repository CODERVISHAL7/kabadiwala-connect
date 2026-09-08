import { supabase } from '../lib/supabase';

export async function getCurrentCollector() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error('No authenticated user found.');
  }

  const {
    data,
    error,
  } = await supabase
    .from('collectors')
    .select(`
      id,
      profile_id,
      collector_code,
      general_location,
      created_at,
      updated_at
    `)
    .eq('profile_id', user.id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}