import { supabase } from '../lib/supabase';


// ============================================
// RECYCLER REGISTRATION
// ============================================

export async function registerRecycler(
  email: string,
  password: string,
  preferredLanguage: string,
  operatingLocation: string
) {
  const {
    data: authData,
    error: authError,
  } = await supabase.auth.signUp({
    email: email.trim(),
    password,
  });

  if (authError) {
    console.error(
      'RECYCLER AUTH SIGNUP ERROR:',
      authError
    );

    throw new Error(authError.message);
  }

  if (!authData.user) {
    throw new Error(
      'Recycler account could not be created.'
    );
  }

  /*
   * Supabase may return a session immediately after
   * signup. Wait until the authenticated session is
   * available before calling the registration RPC.
   */
  if (!authData.session) {
    throw new Error(
      'Registration requires email confirmation. Please confirm your email and then log in.'
    );
  }

  const {
    data: recyclerData,
    error: recyclerError,
  } = await supabase.rpc(
    'register_recycler',
    {
      p_name: operatingLocation.trim(),
      p_email: email.trim(),
      p_preferred_language:
        preferredLanguage || 'hi',
    }
  );

  if (recyclerError) {
    console.error(
      'RECYCLER BUSINESS PROFILE ERROR:',
      recyclerError
    );

    throw new Error(
      `Recycler setup failed: ${recyclerError.message}`
    );
  }

  console.log(
    'RECYCLER REGISTRATION SUCCESS:',
    recyclerData
  );

  return authData.user;
}


// ============================================
// GET AVAILABLE MATERIAL LOTS
// ============================================

export async function getAvailableMaterialLots() {
  const {
    data,
    error,
  } = await supabase
    .from('material_lots')
    .select(`
      id,
      collector_id,
      approx_weight,
      weight_unit,
      estimated_value,
      status
    `)
    .eq('status', 'available')
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    console.error(
      'GET AVAILABLE MATERIAL LOTS ERROR:',
      error
    );

    throw new Error(
      `Failed to load available material: ${error.message}`
    );
  }

  return data ?? [];
}