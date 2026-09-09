import { supabase } from '../lib/supabase';

export async function signUpCollector(
  email: string,
  password: string,
  preferredLanguage: string = 'hi'
) {
  // 1. Create Supabase Auth user
  const {
    data: authData,
    error: authError,
  } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    throw authError;
  }

  if (!authData.user) {
    throw new Error('Unable to create authentication user.');
  }

  const userId = authData.user.id;

  // 2. Create profile
  const { error: profileError } =
    await supabase
      .from('profiles')
      .insert({
        id: userId,
        role: 'collector',
        preferred_language: preferredLanguage,
        is_active: true,
      });

  if (profileError) {
    throw profileError;
  }

  // 3. Generate collector code
  const collectorCode =
    `KC-${userId.replace(/-/g, '').substring(0, 8).toUpperCase()}`;

  // 4. Create collector record
  const { data: collector, error: collectorError } =
    await supabase
      .from('collectors')
      .insert({
        profile_id: userId,
        collector_code: collectorCode,
      })
      .select()
      .single();

  if (collectorError) {
    throw collectorError;
  }

  return {
    user: authData.user,
    collector,
  };
}


export async function signIn(
  email: string,
  password: string
) {
  const {
    data,
    error,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}


export async function signOut() {
  const { error } =
    await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}


export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentUserStatus() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, role, is_active')
    .eq('id', user.id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}