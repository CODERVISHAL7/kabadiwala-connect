SELECT
    au.id AS auth_user_id,
    au.email,
    p.id AS profile_id,
    p.role,
    p.preferred_language,
    p.is_active,
    c.id AS collector_id,
    c.profile_id,
    c.collector_code
FROM auth.users au
LEFT JOIN public.profiles p
    ON p.id = au.id
LEFT JOIN public.collectors c
    ON c.profile_id = p.id
WHERE au.email = 'collector1@test.com';