-- ============================================================
-- Kabadiwala Connect
-- Seed / Master Data
-- ============================================================

-- ============================================================
-- 1. MATERIAL MASTER DATA
-- ============================================================

INSERT INTO public.materials
    (id, category, subcategory, name, description, default_unit, is_hazardous)
VALUES

(
    '10000000-0000-0000-0000-000000000001',
    'e-waste',
    'pcb',
    'Printed Circuit Board',
    'Electronic circuit boards recovered from computers, appliances and other devices.',
    'kg',
    FALSE
),

(
    '10000000-0000-0000-0000-000000000002',
    'e-waste',
    'cable',
    'Copper Cable',
    'Insulated copper electrical and electronic cables.',
    'kg',
    FALSE
),

(
    '10000000-0000-0000-0000-000000000003',
    'e-waste',
    'display',
    'LCD Panel',
    'LCD display panels from televisions, monitors and other electronics.',
    'kg',
    FALSE
),

(
    '10000000-0000-0000-0000-000000000004',
    'e-waste',
    'display',
    'CRT',
    'Cathode ray tube from older televisions and computer monitors.',
    'kg',
    TRUE
),

(
    '10000000-0000-0000-0000-000000000005',
    'e-waste',
    'battery',
    'Lithium Battery',
    'Rechargeable lithium-ion battery packs from electronic devices.',
    'kg',
    TRUE
),

(
    '10000000-0000-0000-0000-000000000006',
    'e-waste',
    'motor',
    'Electric Motor',
    'Small electric motors recovered from electronic appliances.',
    'kg',
    FALSE
),

(
    '10000000-0000-0000-0000-000000000007',
    'e-waste',
    'magnet',
    'Magnet Bearing Assembly',
    'Magnet-containing assemblies recovered from electronic equipment.',
    'kg',
    FALSE
),

(
    '10000000-0000-0000-0000-000000000008',
    'e-waste',
    'plastic',
    'Mixed Electronic Plastic',
    'Mixed plastic components recovered from electronic equipment.',
    'kg',
    FALSE
),

(
    '10000000-0000-0000-0000-000000000009',
    'metal',
    'copper',
    'Copper Scrap',
    'Separated copper recovered from electronic scrap.',
    'kg',
    FALSE
)

ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 2. RECYCLER MASTER DATA
-- ============================================================

INSERT INTO public.recyclers
    (
        id,
        recycler_code,
        name,
        authorization_number,
        authorization_status,
        contact_phone,
        contact_email
    )
VALUES

(
    '20000000-0000-0000-0000-000000000001',
    'REC-MH-001',
    'GreenLoop E-Waste Recycling',
    'AUTH-MH-DEMO-001',
    'verified',
    '+919000000001',
    'demo1@greenloop.example'
),

(
    '20000000-0000-0000-0000-000000000002',
    'REC-MH-002',
    'EcoCycle Recovery Centre',
    'AUTH-MH-DEMO-002',
    'verified',
    '+919000000002',
    'demo2@ecocycle.example'
),

(
    '20000000-0000-0000-0000-000000000003',
    'REC-MH-003',
    'Circular Metals & E-Waste',
    'AUTH-MH-DEMO-003',
    'pending',
    '+919000000003',
    'demo3@circular.example'
)

ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 3. RECYCLER FACILITIES
-- ============================================================

INSERT INTO public.recycler_facilities
    (
        id,
        recycler_id,
        facility_code,
        name,
        address,
        location,
        service_radius_km,
        pickup_available,
        contact_phone
    )
VALUES

(
    '30000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'FAC-MH-001',
    'GreenLoop Pune Facility',
    'Pune, Maharashtra',
    ST_SetSRID(
        ST_MakePoint(73.8567, 18.5204),
        4326
    )::extensions.geography,
    40,
    TRUE,
    '+919000000001'
),

(
    '30000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000002',
    'FAC-MH-002',
    'EcoCycle Mumbai Facility',
    'Mumbai, Maharashtra',
    ST_SetSRID(
        ST_MakePoint(72.8777, 19.0760),
        4326
    )::extensions.geography,
    50,
    TRUE,
    '+919000000002'
),

(
    '30000000-0000-0000-0000-000000000003',
    '20000000-0000-0000-0000-000000000002',
    'FAC-MH-003',
    'EcoCycle Nashik Facility',
    'Nashik, Maharashtra',
    ST_SetSRID(
        ST_MakePoint(73.7898, 19.9975),
        4326
    )::extensions.geography,
    35,
    FALSE,
    '+919000000002'
),

(
    '30000000-0000-0000-0000-000000000004',
    '20000000-0000-0000-0000-000000000003',
    'FAC-MH-004',
    'Circular Metals Demo Facility',
    'Nagpur, Maharashtra',
    ST_SetSRID(
        ST_MakePoint(79.0882, 21.1458),
        4326
    )::extensions.geography,
    30,
    FALSE,
    '+919000000003'
)

ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 4. RECYCLER ACCEPTED MATERIALS + RATES
-- ============================================================

INSERT INTO public.recycler_materials
    (
        id,
        facility_id,
        material_id,
        offered_rate,
        unit,
        pickup_available,
        minimum_quantity
    )
VALUES

-- GreenLoop Pune
(
    '40000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    420,
    'kg',
    TRUE,
    5
),

(
    '40000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000002',
    350,
    'kg',
    TRUE,
    10
),

(
    '40000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000006',
    180,
    'kg',
    TRUE,
    10
),

(
    '40000000-0000-0000-0000-000000000004',
    '30000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000008',
    45,
    'kg',
    TRUE,
    20
),

-- EcoCycle Mumbai
(
    '40000000-0000-0000-0000-000000000005',
    '30000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    450,
    'kg',
    TRUE,
    5
),

(
    '40000000-0000-0000-0000-000000000006',
    '30000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    370,
    'kg',
    TRUE,
    10
),

(
    '40000000-0000-0000-0000-000000000007',
    '30000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000003',
    70,
    'kg',
    TRUE,
    20
),

(
    '40000000-0000-0000-0000-000000000008',
    '30000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000005',
    180,
    'kg',
    TRUE,
    5
),

-- EcoCycle Nashik
(
    '40000000-0000-0000-0000-000000000009',
    '30000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000002',
    330,
    'kg',
    FALSE,
    10
),

(
    '40000000-0000-0000-0000-000000000010',
    '30000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000006',
    165,
    'kg',
    FALSE,
    10
)

ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 5. HISTORICAL PRICE DATA
-- ============================================================

INSERT INTO public.price_records
    (
        id,
        material_id,
        location_name,
        recorded_at,
        buying_price,
        selling_price,
        market_min,
        market_max,
        unit,
        recycler_id,
        facility_id,
        source_type,
        is_verified
    )
VALUES

(
    '50000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Pune',
    NOW() - INTERVAL '30 days',
    390,
    420,
    360,
    450,
    'kg',
    '20000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    'field_demo',
    TRUE
),

(
    '50000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    'Pune',
    NOW() - INTERVAL '15 days',
    405,
    430,
    370,
    460,
    'kg',
    '20000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    'field_demo',
    TRUE
),

(
    '50000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000001',
    'Pune',
    NOW(),
    420,
    450,
    380,
    470,
    'kg',
    '20000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    'field_demo',
    TRUE
),

(
    '50000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000002',
    'Pune',
    NOW() - INTERVAL '30 days',
    310,
    340,
    280,
    360,
    'kg',
    '20000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    'field_demo',
    TRUE
),

(
    '50000000-0000-0000-0000-000000000005',
    '10000000-0000-0000-0000-000000000002',
    'Pune',
    NOW() - INTERVAL '15 days',
    330,
    355,
    300,
    380,
    'kg',
    '20000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    'field_demo',
    TRUE
),

(
    '50000000-0000-0000-0000-000000000006',
    '10000000-0000-0000-0000-000000000002',
    'Pune',
    NOW(),
    350,
    375,
    320,
    390,
    'kg',
    '20000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    'field_demo',
    TRUE
),

(
    '50000000-0000-0000-0000-000000000007',
    '10000000-0000-0000-0000-000000000003',
    'Mumbai',
    NOW() - INTERVAL '20 days',
    55,
    65,
    45,
    75,
    'kg',
    '20000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000002',    'field_demo',
    TRUE
),

(
    '50000000-0000-0000-0000-000000000008',
    '10000000-0000-0000-0000-000000000003',
    'Mumbai',
    NOW(),
    65,
    72,
    50,
    80,
    'kg',
    '20000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000002',
    'field_demo',
    TRUE
)

ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 6. SAFETY GUIDANCE
-- ============================================================

INSERT INTO public.safety_guidance
    (
        id,
        material_id,
        language,
        title,
        description,
        severity
    )
VALUES

(
    '60000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000002',
    'hi',
    'केबल न जलाएं',
    'केबल जलाने से जहरीला धुआं निकल सकता है। तांबा निकालने के लिए खुले में केबल न जलाएं।',
    'danger'
),

(
    '60000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    'mr',
    'केबल जाळू नका',
    'केबल जाळल्यामुळे विषारी धूर निर्माण होऊ शकतो. तांबे काढण्यासाठी केबल उघड्यावर जाळू नका.',
    'danger'
),

(
    '60000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000002',
    'en',
    'Do not burn cables',
    'Burning cables can release toxic smoke. Do not burn cables in the open to recover copper.',
    'danger'
),

(
    '60000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000005',
    'hi',
    'बैटरी सुरक्षित रखें',
    'लिथियम बैटरी को काटें, कुचलें या आग के पास न रखें। क्षतिग्रस्त बैटरी को अलग रखें।',
    'danger'
),

(
    '60000000-0000-0000-0000-000000000005',
    '10000000-0000-0000-0000-000000000005',
    'mr',
    'बॅटरी सुरक्षित ठेवा',
    'लिथियम बॅटरी कापू, चिरडू किंवा आगीजवळ ठेवू नका. खराब बॅटरी वेगळी ठेवा.',
    'danger'
),

(
    '60000000-0000-0000-0000-000000000006',
    '10000000-0000-0000-0000-000000000005',
    'en',
    'Handle batteries safely',
    'Do not cut, crush or expose lithium batteries to fire. Keep damaged batteries isolated.',
    'danger'
),

(
    '60000000-0000-0000-0000-000000000007',
    '10000000-0000-0000-0000-000000000004',
    'hi',
    'CRT को सावधानी से संभालें',
    'CRT स्क्रीन को तोड़ने या खोलने से बचें। इसे सुरक्षित तरीके से अधिकृत रिसाइकलर को दें।',
    'warning'
),

(
    '60000000-0000-0000-0000-000000000008',
    '10000000-0000-0000-0000-000000000004',
    'mr',
    'CRT काळजीपूर्वक हाताळा',
    'CRT स्क्रीन फोडणे किंवा उघडणे टाळा. ती अधिकृत रिसायकलरकडे सुरक्षितपणे द्या.',
    'warning'
),

(
    '60000000-0000-0000-0000-000000000009',
    '10000000-0000-0000-0000-000000000004',
    'en',
    'Handle CRTs carefully',
    'Avoid breaking or opening CRT screens. Hand them over safely to an authorized recycler.',
    'warning'
)

ON CONFLICT (id) DO NOTHING;