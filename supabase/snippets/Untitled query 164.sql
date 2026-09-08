SELECT
    pr.id,
    pr.material_id,
    m.name AS material_name,
    pr.location_name,
    pr.buying_price,
    pr.selling_price,
    pr.market_min,
    pr.market_max,
    pr.unit,
    pr.is_verified,
    pr.recorded_at,
    pr.source_type
FROM public.price_records pr
JOIN public.materials m
    ON m.id = pr.material_id
ORDER BY pr.recorded_at DESC;

