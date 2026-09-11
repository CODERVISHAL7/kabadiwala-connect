create or replace function public.complete_handover(
  p_transaction_id uuid,
  p_final_weight numeric,
  p_final_price numeric
)
returns public.transactions
language plpgsql
security definer
set search_path = public
as $$
declare
  v_transaction public.transactions;
  v_lot public.material_lots;
  v_is_authorized boolean;
begin

  -- Validate input
  if p_final_weight is null or p_final_weight <= 0 then
    raise exception 'Final weight must be greater than 0.';
  end if;

  if p_final_price is null or p_final_price < 0 then
    raise exception 'Final price cannot be negative.';
  end if;

  -- Get transaction
  select *
  into v_transaction
  from public.transactions
  where id = p_transaction_id
  for update;

  if not found then
    raise exception 'Transaction not found.';
  end if;

  -- Verify recycler owns the transaction facility
  select exists (
    select 1
    from public.recycler_users ru
    join public.recycler_facilities rf
      on rf.recycler_id = ru.recycler_id
    where ru.profile_id = auth.uid()
      and rf.id = v_transaction.facility_id
  )
  into v_is_authorized;

  if not v_is_authorized then
    raise exception 'You are not authorized to complete this handover.';
  end if;

  -- Transaction must be waiting for handover completion
  if v_transaction.status <> 'handover_pending' then
    raise exception
      'Transaction is not ready for handover completion. Current status: %',
      v_transaction.status;
  end if;

  -- Lock and verify material lot
  select *
  into v_lot
  from public.material_lots
  where id = v_transaction.lot_id
  for update;

  if not found then
    raise exception 'Material lot not found.';
  end if;

  if v_lot.status <> 'handover_pending' then
    raise exception
      'Material lot is not ready for handover completion. Current status: %',
      v_lot.status;
  end if;

  -- Complete transaction
  update public.transactions
  set
    status = 'completed',
    final_weight = p_final_weight,
    final_price = p_final_price,
    sold_at = now(),
    updated_at = now()
  where id = p_transaction_id
  returning *
  into v_transaction;

  -- Mark lot as sold
  update public.material_lots
  set
    status = 'sold',
    updated_at = now()
  where id = v_transaction.lot_id;

  return v_transaction;

end;
$$;