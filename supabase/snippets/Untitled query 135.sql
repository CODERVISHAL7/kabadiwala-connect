select
  t.transaction_code,
  t.status,
  t.final_weight,
  t.final_price,
  t.sold_at,
  ml.status as lot_status
from public.transactions t
join public.material_lots ml
  on ml.id = t.lot_id
where t.transaction_code = 'TXN-4854648AC05B';