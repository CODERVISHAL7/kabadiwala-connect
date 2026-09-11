import { supabase } from '../lib/supabase';

export async function getMyRecyclerTransactions() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
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
        weight_unit
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
      'GET RECYCLER TRANSACTIONS ERROR:',
      error
    );

    throw new Error(
      `Failed to load transactions: ${error.message}`
    );
  }

  return data ?? [];
}


export async function confirmTransaction(
  transactionId: string
) {
  if (!transactionId) {
    throw new Error(
      'Transaction ID is required.'
    );
  }

  const {
    data,
    error,
  } = await supabase.rpc(
    'confirm_transaction',
    {
      p_transaction_id: transactionId,
    }
  );

  if (error) {
    console.error(
      'CONFIRM TRANSACTION ERROR:',
      error
    );

    throw new Error(error.message);
  }

  console.log(
    'TRANSACTION CONFIRMED:',
    data
  );

  return data;
}

export async function startHandover(
  transactionId: string
) {
  if (!transactionId) {
    throw new Error(
      'Transaction ID is required.'
    );
  }

  const {
    data,
    error,
  } = await supabase.rpc(
    'start_handover',
    {
      p_transaction_id: transactionId,
    }
  );

  if (error) {
    console.error(
      'START HANDOVER ERROR:',
      error
    );

    throw new Error(error.message);
  }

  console.log(
    'HANDOVER STARTED:',
    data
  );

  return data;
}

export async function completeHandover(
  transactionId: string,
  finalWeight: number,
  finalPrice: number
) {
  if (!transactionId) {
    throw new Error(
      'Transaction ID is required.'
    );
  }

  if (
    !Number.isFinite(finalWeight) ||
    finalWeight <= 0
  ) {
    throw new Error(
      'Final weight must be greater than 0.'
    );
  }

  if (
    !Number.isFinite(finalPrice) ||
    finalPrice < 0
  ) {
    throw new Error(
      'Final price cannot be negative.'
    );
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