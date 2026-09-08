SELECT
    lot_code,
    approx_weight,
    weight_unit,
    estimated_value,
    currency,
    status,
    created_at
FROM public.material_lots
ORDER BY created_at DESC
LIMIT 5;