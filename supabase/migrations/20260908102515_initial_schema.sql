-- ============================================================
-- Kabadiwala Connect
-- Initial Database Schema
-- ============================================================

-- ============================================================
-- 1. EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;


-- ============================================================
-- 2. ENUM TYPES
-- ============================================================

CREATE TYPE public.user_role AS ENUM (
    'collector',
    'recycler_user',
    'admin'
);

CREATE TYPE public.authorization_status AS ENUM (
    'pending',
    'verified',
    'suspended',
    'expired',
    'rejected'
);

CREATE TYPE public.lot_status AS ENUM (
    'draft',
    'available',
    'offer_received',
    'offer_accepted',
    'handover_pending',
    'handed_over',
    'sold',
    'cancelled'
);

CREATE TYPE public.offer_status AS ENUM (
    'pending',
    'accepted',
    'rejected',
    'expired',
    'withdrawn'
);

CREATE TYPE public.transaction_status AS ENUM (
    'pending',
    'confirmed',
    'handover_pending',
    'completed',
    'cancelled',
    'disputed'
);

CREATE TYPE public.payment_method AS ENUM (
    'cash',
    'upi',
    'bank_transfer',
    'other'
);

CREATE TYPE public.payment_status AS ENUM (
    'pending',
    'partial',
    'paid',
    'failed'
);

CREATE TYPE public.sync_status AS ENUM (
    'pending',
    'processing',
    'synced',
    'failed',
    'conflict'
);


-- ============================================================
-- 3. COMMON UPDATED_AT FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


-- ============================================================
-- 4. PROFILES
-- ============================================================

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

    role public.user_role NOT NULL DEFAULT 'collector',

    preferred_language TEXT NOT NULL DEFAULT 'hi'
        CHECK (preferred_language IN ('hi', 'mr', 'en')),

    operating_location extensions.geography(Point, 4326),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 5. COLLECTORS
-- ============================================================

CREATE TABLE public.collectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    profile_id UUID NOT NULL UNIQUE
        REFERENCES public.profiles(id) ON DELETE RESTRICT,

    collector_code TEXT NOT NULL UNIQUE,

    general_location extensions.geography(Point, 4326),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 6. RECYCLERS
-- ============================================================

CREATE TABLE public.recyclers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    recycler_code TEXT NOT NULL UNIQUE,

    name TEXT NOT NULL,

    authorization_number TEXT,

    authorization_status public.authorization_status
        NOT NULL DEFAULT 'pending',

    contact_phone TEXT,
    contact_email TEXT,
    website TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 7. RECYCLER USERS
-- ============================================================

CREATE TABLE public.recycler_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    profile_id UUID NOT NULL UNIQUE
        REFERENCES public.profiles(id) ON DELETE RESTRICT,

    recycler_id UUID NOT NULL
        REFERENCES public.recyclers(id) ON DELETE RESTRICT,

    name TEXT NOT NULL,

    designation TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 8. RECYCLER FACILITIES
-- ============================================================

CREATE TABLE public.recycler_facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    recycler_id UUID NOT NULL
        REFERENCES public.recyclers(id) ON DELETE RESTRICT,

    facility_code TEXT NOT NULL UNIQUE,

    name TEXT NOT NULL,

    address TEXT,

    location extensions.geography(Point, 4326) NOT NULL,

    service_radius_km NUMERIC(8,2) NOT NULL DEFAULT 25
        CHECK (service_radius_km > 0),

    pickup_available BOOLEAN NOT NULL DEFAULT FALSE,

    contact_phone TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 9. MATERIALS
-- ============================================================

CREATE TABLE public.materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    category TEXT NOT NULL,

    subcategory TEXT NOT NULL,

    name TEXT NOT NULL,

    description TEXT,

    default_unit TEXT NOT NULL DEFAULT 'kg',

    is_hazardous BOOLEAN NOT NULL DEFAULT FALSE,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(category, subcategory, name)
);


-- ============================================================
-- 10. MATERIAL LOTS
-- ============================================================

CREATE TABLE public.material_lots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    lot_code TEXT NOT NULL UNIQUE,

    collector_id UUID NOT NULL
        REFERENCES public.collectors(id) ON DELETE RESTRICT,

    material_id UUID NOT NULL
        REFERENCES public.materials(id) ON DELETE RESTRICT,

    description TEXT,

    approx_weight NUMERIC(10,3) NOT NULL
        CHECK (approx_weight > 0),

    weight_unit TEXT NOT NULL DEFAULT 'kg',

    condition TEXT,

    source_type TEXT,

    collection_location extensions.geography(Point, 4326),

    collection_address TEXT,

    estimated_value NUMERIC(12,2) NOT NULL DEFAULT 0
        CHECK (estimated_value >= 0),

    currency TEXT NOT NULL DEFAULT 'INR',

    status public.lot_status NOT NULL DEFAULT 'draft',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 11. LOT IMAGES
-- ============================================================

CREATE TABLE public.lot_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    lot_id UUID NOT NULL
        REFERENCES public.material_lots(id) ON DELETE CASCADE,

    storage_path TEXT NOT NULL,

    image_type TEXT NOT NULL DEFAULT 'material'
        CHECK (
            image_type IN (
                'material',
                'weight',
                'condition',
                'other'
            )
        ),

    captured_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 12. PRICE RECORDS
-- ============================================================

CREATE TABLE public.price_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    material_id UUID NOT NULL
        REFERENCES public.materials(id) ON DELETE RESTRICT,

    location extensions.geography(Point, 4326),

    location_name TEXT,

    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    buying_price NUMERIC(12,2)
        CHECK (buying_price >= 0),

    selling_price NUMERIC(12,2)
        CHECK (selling_price >= 0),

    market_min NUMERIC(12,2)
        CHECK (market_min >= 0),

    market_max NUMERIC(12,2)
        CHECK (market_max >= 0),

    unit TEXT NOT NULL DEFAULT 'kg',

    recycler_id UUID
        REFERENCES public.recyclers(id) ON DELETE SET NULL,

    facility_id UUID
        REFERENCES public.recycler_facilities(id) ON DELETE SET NULL,

    source_type TEXT NOT NULL DEFAULT 'field',

    is_verified BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CHECK (
        market_min IS NULL
        OR market_max IS NULL
        OR market_min <= market_max
    )
);


-- ============================================================
-- 13. RECYCLER MATERIALS
-- ============================================================

CREATE TABLE public.recycler_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    facility_id UUID NOT NULL
        REFERENCES public.recycler_facilities(id) ON DELETE CASCADE,

    material_id UUID NOT NULL
        REFERENCES public.materials(id) ON DELETE RESTRICT,

    offered_rate NUMERIC(12,2) NOT NULL
        CHECK (offered_rate >= 0),

    unit TEXT NOT NULL DEFAULT 'kg',

    pickup_available BOOLEAN NOT NULL DEFAULT FALSE,

    minimum_quantity NUMERIC(10,3)
        CHECK (
            minimum_quantity IS NULL
            OR minimum_quantity > 0
        ),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(facility_id, material_id)
);


-- ============================================================
-- 14. OFFERS
-- ============================================================

CREATE TABLE public.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    lot_id UUID NOT NULL
        REFERENCES public.material_lots(id) ON DELETE RESTRICT,

    facility_id UUID NOT NULL
        REFERENCES public.recycler_facilities(id) ON DELETE RESTRICT,

    offered_price NUMERIC(12,2) NOT NULL
        CHECK (offered_price >= 0),

    price_unit TEXT NOT NULL DEFAULT 'kg',

    estimated_total NUMERIC(12,2) NOT NULL DEFAULT 0
        CHECK (estimated_total >= 0),

    pickup_available BOOLEAN NOT NULL DEFAULT FALSE,

    valid_until TIMESTAMPTZ,

    status public.offer_status NOT NULL DEFAULT 'pending',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 15. TRANSACTIONS
-- ============================================================

CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    transaction_code TEXT NOT NULL UNIQUE,

    lot_id UUID NOT NULL
        REFERENCES public.material_lots(id) ON DELETE RESTRICT,

    collector_id UUID NOT NULL
        REFERENCES public.collectors(id) ON DELETE RESTRICT,

    facility_id UUID NOT NULL
        REFERENCES public.recycler_facilities(id) ON DELETE RESTRICT,

    offer_id UUID
        REFERENCES public.offers(id) ON DELETE RESTRICT,

    quoted_price NUMERIC(12,2) NOT NULL DEFAULT 0
        CHECK (quoted_price >= 0),

    final_price NUMERIC(12,2)
        CHECK (final_price IS NULL OR final_price >= 0),

    final_weight NUMERIC(10,3)
        CHECK (final_weight IS NULL OR final_weight > 0),

    currency TEXT NOT NULL DEFAULT 'INR',

    status public.transaction_status
        NOT NULL DEFAULT 'pending',

    sold_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 16. HANDOVERS
-- ============================================================

CREATE TABLE public.handovers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    handover_code TEXT NOT NULL UNIQUE,

    transaction_id UUID NOT NULL UNIQUE
        REFERENCES public.transactions(id) ON DELETE RESTRICT,

    handover_location extensions.geography(Point, 4326),

    handover_address TEXT,

    handover_weight NUMERIC(10,3)
        CHECK (
            handover_weight IS NULL
            OR handover_weight > 0
        ),

    collector_confirmed BOOLEAN NOT NULL DEFAULT FALSE,

    recycler_confirmed BOOLEAN NOT NULL DEFAULT FALSE,

    collector_confirmed_at TIMESTAMPTZ,

    recycler_confirmed_at TIMESTAMPTZ,

    handed_over_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 17. HANDOVER IMAGES
-- ============================================================

CREATE TABLE public.handover_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    handover_id UUID NOT NULL
        REFERENCES public.handovers(id) ON DELETE CASCADE,

    storage_path TEXT NOT NULL,

    image_type TEXT NOT NULL DEFAULT 'handover',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 18. PAYMENTS
-- ============================================================

CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    transaction_id UUID NOT NULL
        REFERENCES public.transactions(id) ON DELETE RESTRICT,

    amount NUMERIC(12,2) NOT NULL
        CHECK (amount > 0),

    currency TEXT NOT NULL DEFAULT 'INR',

    method public.payment_method NOT NULL,

    status public.payment_status NOT NULL DEFAULT 'pending',

    reference_number TEXT,

    paid_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 19. SYNC OPERATIONS
-- ============================================================

CREATE TABLE public.sync_operations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    device_id TEXT NOT NULL,

    entity_type TEXT NOT NULL,

    entity_id UUID,

    operation TEXT NOT NULL,

    payload JSONB NOT NULL DEFAULT '{}'::JSONB,

    status public.sync_status NOT NULL DEFAULT 'pending',

    retry_count INTEGER NOT NULL DEFAULT 0
        CHECK (retry_count >= 0),

    last_attempt_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 20. SAFETY GUIDANCE
-- ============================================================

CREATE TABLE public.safety_guidance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    material_id UUID
        REFERENCES public.materials(id) ON DELETE SET NULL,

    language TEXT NOT NULL
        CHECK (language IN ('hi', 'mr', 'en')),

    title TEXT NOT NULL,

    description TEXT NOT NULL,

    severity TEXT NOT NULL DEFAULT 'warning'
        CHECK (
            severity IN (
                'info',
                'warning',
                'danger'
            )
        ),

    image_path TEXT,

    audio_path TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 21. ML PREDICTIONS
-- ============================================================

CREATE TABLE public.ml_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    lot_id UUID NOT NULL
        REFERENCES public.material_lots(id) ON DELETE CASCADE,

    model_name TEXT NOT NULL,

    model_version TEXT NOT NULL,

    predicted_category TEXT,

    confidence NUMERIC(5,4)
        CHECK (
            confidence IS NULL
            OR (
                confidence >= 0
                AND confidence <= 1
            )
        ),

    predicted_value NUMERIC(12,2)
        CHECK (
            predicted_value IS NULL
            OR predicted_value >= 0
        ),

    prediction_payload JSONB NOT NULL DEFAULT '{}'::JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 22. UPDATED_AT TRIGGERS
-- ============================================================

CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_collectors_updated_at
BEFORE UPDATE ON public.collectors
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_recyclers_updated_at
BEFORE UPDATE ON public.recyclers
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_recycler_facilities_updated_at
BEFORE UPDATE ON public.recycler_facilities
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_material_lots_updated_at
BEFORE UPDATE ON public.material_lots
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_offers_updated_at
BEFORE UPDATE ON public.offers
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_recycler_materials_updated_at
BEFORE UPDATE ON public.recycler_materials
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- 23. INDEXES
-- ============================================================

CREATE INDEX idx_collectors_profile_id
ON public.collectors(profile_id);

CREATE INDEX idx_recycler_users_recycler_id
ON public.recycler_users(recycler_id);

CREATE INDEX idx_recycler_facilities_recycler_id
ON public.recycler_facilities(recycler_id);

CREATE INDEX idx_recycler_facilities_location
ON public.recycler_facilities
USING GIST(location);

CREATE INDEX idx_recycler_facilities_active
ON public.recycler_facilities(is_active);

CREATE INDEX idx_material_lots_collector_id
ON public.material_lots(collector_id);

CREATE INDEX idx_material_lots_material_id
ON public.material_lots(material_id);

CREATE INDEX idx_material_lots_status
ON public.material_lots(status);

CREATE INDEX idx_material_lots_created_at
ON public.material_lots(created_at DESC);

CREATE INDEX idx_material_lots_collection_location
ON public.material_lots
USING GIST(collection_location);

CREATE INDEX idx_lot_images_lot_id
ON public.lot_images(lot_id);

CREATE INDEX idx_price_records_material_id
ON public.price_records(material_id);

CREATE INDEX idx_price_records_recorded_at
ON public.price_records(recorded_at DESC);

CREATE INDEX idx_price_records_location
ON public.price_records
USING GIST(location);

CREATE INDEX idx_price_records_facility_id
ON public.price_records(facility_id);

CREATE INDEX idx_recycler_materials_material_id
ON public.recycler_materials(material_id);

CREATE INDEX idx_offers_lot_id
ON public.offers(lot_id);

CREATE INDEX idx_offers_facility_id
ON public.offers(facility_id);

CREATE INDEX idx_offers_status
ON public.offers(status);

CREATE INDEX idx_offers_created_at
ON public.offers(created_at DESC);

CREATE INDEX idx_transactions_collector_id
ON public.transactions(collector_id);

CREATE INDEX idx_transactions_facility_id
ON public.transactions(facility_id);

CREATE INDEX idx_transactions_lot_id
ON public.transactions(lot_id);

CREATE INDEX idx_transactions_status
ON public.transactions(status);

CREATE INDEX idx_transactions_created_at
ON public.transactions(created_at DESC);

CREATE INDEX idx_handovers_transaction_id
ON public.handovers(transaction_id);

CREATE INDEX idx_handovers_location
ON public.handovers
USING GIST(handover_location);

CREATE INDEX idx_payments_transaction_id
ON public.payments(transaction_id);

CREATE INDEX idx_payments_status
ON public.payments(status);

CREATE INDEX idx_payments_paid_at
ON public.payments(paid_at DESC);

CREATE INDEX idx_sync_operations_status
ON public.sync_operations(status);

CREATE INDEX idx_sync_operations_entity
ON public.sync_operations(entity_type, entity_id);

CREATE INDEX idx_safety_guidance_material_language
ON public.safety_guidance(material_id, language);

CREATE INDEX idx_ml_predictions_lot_id
ON public.ml_predictions(lot_id);


-- ============================================================
-- 24. ENABLE ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recyclers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recycler_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recycler_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lot_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recycler_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.handovers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.handover_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_guidance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_predictions ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 25. BASIC RLS POLICIES
-- ============================================================

-- ------------------------------------------------------------
-- Profiles
-- ------------------------------------------------------------

CREATE POLICY "users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());


-- ------------------------------------------------------------
-- Collectors
-- ------------------------------------------------------------

CREATE POLICY "collectors can view own record"
ON public.collectors
FOR SELECT
TO authenticated
USING (profile_id = auth.uid());


-- ------------------------------------------------------------
-- Materials
-- ------------------------------------------------------------

CREATE POLICY "authenticated users can view active materials"
ON public.materials
FOR SELECT
TO authenticated
USING (is_active = TRUE);


-- ------------------------------------------------------------
-- Safety Guidance
-- ------------------------------------------------------------

CREATE POLICY "authenticated users can view active safety guidance"
ON public.safety_guidance
FOR SELECT
TO authenticated
USING (is_active = TRUE);


-- ------------------------------------------------------------
-- Recycler Facilities
-- ------------------------------------------------------------

CREATE POLICY "authenticated users can view active facilities"
ON public.recycler_facilities
FOR SELECT
TO authenticated
USING (is_active = TRUE);


-- ------------------------------------------------------------
-- Price Records
-- ------------------------------------------------------------

CREATE POLICY "authenticated users can view verified prices"
ON public.price_records
FOR SELECT
TO authenticated
USING (is_verified = TRUE);


-- ============================================================
-- END OF INITIAL SCHEMA
-- ============================================================