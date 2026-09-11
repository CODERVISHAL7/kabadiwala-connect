import { supabase } from '../lib/supabase';

export async function getMyTransactions() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error(
      'GET TRANSACTIONS AUTH ERROR:',
      userError
    );

    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error(
      'You must be logged in to view transactions.'
    );
  }

  const { data, error } = await supabase
    .from('transactions')
    .select(`
      id,
      transaction_code,
      lot_id,
      collector_id,
      facility_id,
      offer_id,
      quoted_price,
      final_price,
      final_weight,
      currency,
      status,
      sold_at,
      created_at,
      updated_at,
      material_lots (
        lot_code,
        approx_weight,
        weight_unit,
        description
      ),
      recycler_facilities (
        facility_code,
        name,
        address
      )
    `)
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    console.error(
      'GET TRANSACTIONS ERROR:',
      error
    );

    throw new Error(
      `Failed to load transactions: ${error.message}`
    );
  }

  console.log(
    'MY TRANSACTIONS:',
    data
  );

  return data ?? [];
}

export async function completeHandover(
  transactionId: string,
  finalWeight: number,
  finalPrice: number
) {
  if (!transactionId) {
    throw new Error('Transaction ID is required.');
  }

  if (!Number.isFinite(finalWeight) || finalWeight <= 0) {
    throw new Error('Please enter a valid final weight.');
  }

  if (!Number.isFinite(finalPrice) || finalPrice < 0) {
    throw new Error('Please enter a valid final price.');
  }

  const {
    data,
    error,
  } = await supabase.rpc(
    'complete_handover',
    {
      p_transaction_id: transactionId,
      p_final_weight: finalWeight,
      p_final_price: finalPrice,
    }
  );

  if (error) {
    console.error(
      'COMPLETE HANDOVER ERROR:',
      error
    );

    throw new Error(error.message);
  }

  console.log(
    'HANDOVER COMPLETED:',
    data
  );

  return data;
}