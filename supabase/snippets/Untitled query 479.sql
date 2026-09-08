SELECT
    name,
    ST_Y(location::geometry) AS latitude,
    ST_X(location::geometry) AS longitude
FROM public.recycler_facilities;