SELECT
    COUNT(*) AS total_materials,
    COUNT(*) FILTER (WHERE is_active = true) AS active_materials,
    COUNT(*) FILTER (WHERE is_active = false) AS inactive_materials
FROM public.materials;