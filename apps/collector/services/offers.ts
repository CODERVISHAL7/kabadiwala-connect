import { supabase } from '../lib/supabase';

export type CreateOfferInput = {
  lotId: string;
  facilityId: string;
  offeredPrice: number;
  priceUnit?: string;
  pickupAvailable?: boolean;
  validUntil?: string | null;
};

export async function createOffer({
  lotId,
  facilityId,
  offeredPrice,
  priceUnit = 'kg',
  pickupAvailable = false,
  validUntil = null,
}: CreateOfferInput) {
  // Make sure a user is logged in
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error('CREATE OFFER AUTH ERROR:', userError);
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error('You must be logged in to make an offer.');
  }

  // Validate input
  if (!lotId) {
    throw new Error('Material lot is required.');
  }

  if (!facilityId) {
    throw new Error('Recycler facility is required.');
  }

  if (!Number.isFinite(offeredPrice) || offeredPrice <= 0) {
    throw new Error('Please enter a valid offer price.');
  }

  // Insert offer
  // RLS will verify that facilityId belongs to the
  // currently authenticated Recycler.
  const { data, error } = await supabase
    .from('offers')
    .insert({
      lot_id: lotId,
      facility_id: facilityId,
      offered_price: offeredPrice,
      price_unit: priceUnit,
      pickup_available: pickupAvailable,
      valid_until: validUntil,
    })
    .select()
    .single();

  if (error) {
    console.error('CREATE OFFER ERROR:', error);
    throw new Error(`Offer creation failed: ${error.message}`);
  }

  console.log('OFFER CREATED:', data.id);

  return data;
}

export async function getMyFacilities() {
  console.log('========== GET MY FACILITIES ==========');

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log('AUTH USER:', user?.id);
  console.log('AUTH ERROR:', userError);

  if (userError) {
    console.error('GET FACILITIES AUTH ERROR:', userError);
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error('You must be logged in.');
  }

  console.log(
    'QUERYING recycler_users FOR profile_id:',
    user.id
  );

  const {
    data: recyclerUser,
    error: recyclerUserError,
  } = await supabase
    .from('recycler_users')
    .select('recycler_id, profile_id')
    .eq('profile_id', user.id)
    .maybeSingle();

  console.log('RECYCLER USER RESULT:', recyclerUser);
  console.log('RECYCLER USER ERROR:', recyclerUserError);

  if (recyclerUserError) {
    console.error(
      'GET RECYCLER USER ERROR:',
      recyclerUserError
    );

    throw new Error(
      `Recycler lookup failed: ${recyclerUserError.message}`
    );
  }

  if (!recyclerUser) {
    console.error(
      'NO recycler_users ROW FOUND FOR USER:',
      user.id
    );

    throw new Error(
      `No recycler account found for authenticated user: ${user.id}`
    );
  }

  console.log(
    'RECYCLER ID:',
    recyclerUser.recycler_id
  );

  const {
    data: facilities,
    error: facilityError,
  } = await supabase
    .from('recycler_facilities')
    .select('*')
    .eq('recycler_id', recyclerUser.recycler_id);

  console.log('FACILITIES:', facilities);
  console.log('FACILITY ERROR:', facilityError);

  if (facilityError) {
    console.error(
      'GET FACILITIES ERROR:',
      facilityError
    );

    throw new Error(
      `Facility lookup failed: ${facilityError.message}`
    );
  }

  console.log(
    'FACILITY COUNT:',
    facilities?.length ?? 0
  );

  return facilities ?? [];
}