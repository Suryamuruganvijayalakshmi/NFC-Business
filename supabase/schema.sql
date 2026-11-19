-- ==============================================================================
-- SignBridge NFC — Non-Destructive Supabase PostgreSQL Database Schema
-- Project ID: tzqpsxtjfgkmqsxrtlgx
-- Website: signbridge.click | Brand: SignTap NFC
-- Tagline: Your Identity. One Tap Away.
--
-- SAFETY GUARANTEE:
-- This script NEVER drops, truncates, or deletes any existing tables or data.
-- Every statement uses "IF NOT EXISTS" and safe column additions.
-- ==============================================================================

-- 0. Enable UUID Extension safely
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE (Digital Identity Cards)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  profile_type TEXT NOT NULL DEFAULT 'personal',
  role TEXT NOT NULL DEFAULT 'user',
  title TEXT,
  bio TEXT,
  profile_image TEXT,
  cover_image TEXT,
  location TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  company TEXT,
  business_name TEXT,
  business_description TEXT,
  whatsapp_number TEXT,
  portfolio_url TEXT,
  resume_url TEXT,
  skills TEXT[] DEFAULT '{}',
  theme TEXT NOT NULL DEFAULT 'signature',
  accent_color TEXT NOT NULL DEFAULT '#087CF0',
  button_style TEXT NOT NULL DEFAULT 'rounded',
  font_family TEXT NOT NULL DEFAULT 'sans',
  background_style TEXT NOT NULL DEFAULT 'clean',
  published BOOLEAN NOT NULL DEFAULT true,
  section_visibility JSONB DEFAULT '{"bio":true,"contact":true,"socials":true,"skills":true,"services":true,"portfolio":true,"experience":true}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Safe column additions if profiles table already exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_type TEXT DEFAULT 'personal';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_image TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cover_image TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS business_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS business_description TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS portfolio_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS resume_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'signature';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS accent_color TEXT DEFAULT '#087CF0';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS button_style TEXT DEFAULT 'rounded';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS font_family TEXT DEFAULT 'sans';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS background_style TEXT DEFAULT 'clean';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS section_visibility JSONB DEFAULT '{"bio":true,"contact":true,"socials":true,"skills":true,"services":true,"portfolio":true,"experience":true}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ------------------------------------------------------------------------------
-- 2. SOCIAL LINKS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  label TEXT,
  url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.social_links ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.social_links ADD COLUMN IF NOT EXISTS platform TEXT;
ALTER TABLE public.social_links ADD COLUMN IF NOT EXISTS label TEXT;
ALTER TABLE public.social_links ADD COLUMN IF NOT EXISTS url TEXT;
ALTER TABLE public.social_links ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.social_links ADD COLUMN IF NOT EXISTS visible BOOLEAN DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_social_links_profile_id ON public.social_links(profile_id);

-- ------------------------------------------------------------------------------
-- 3. PROFILE SECTIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profile_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL DEFAULT 'about',
  title TEXT NOT NULL,
  content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  display_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_sections_profile_id ON public.profile_sections(profile_id);

-- ------------------------------------------------------------------------------
-- 4. PRODUCTS TABLE (2 Exclusive SignTap Cards: Business & Personal)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  short_description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  features TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT NOT NULL,
  material TEXT NOT NULL,
  badge TEXT,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed products non-destructively
INSERT INTO public.products (id, name, category, short_description, price, currency, features, image_url, material, badge, in_stock, display_order)
VALUES 
  (
    'prod-business',
    'Business NFC Card',
    'business',
    'Tailored for founders, consultants, and corporate leaders. Showcase company catalog, instant WhatsApp business connection, and lead generation.',
    199.00,
    'INR',
    ARRAY[
      'High-grade NTAG216 contactless microchip (888 bytes)',
      '1-tap instant phonebook contact save (.vcf vCard)',
      'Direct WhatsApp 1-click business chat button',
      'High-contrast dynamic backup QR code on back',
      'Zero monthly subscriptions — Lifetime cloud hosting'
    ],
    '/images/nfc-smart-card.webp',
    'Matte Jet Black Acrylic · NTAG216',
    'Most Popular',
    true,
    1
  ),
  (
    'prod-personal',
    'Personal NFC Card',
    'personal',
    'Sleek, minimalist NFC card designed for creators, developers, and modern professionals. Share your portfolio, socials, and contact in a single tap.',
    199.00,
    'INR',
    ARRAY[
      'High-grade NTAG216 contactless microchip (888 bytes)',
      'Personal portfolio, socials & custom links hub',
      'Dynamic backup QR code for universal compatibility',
      'No app or battery needed for visitors',
      'Instant real-time profile updates from cloud'
    ],
    '/images/nfc-smart-card.webp',
    'Minimalist Matte Ceramic White · NTAG216',
    'Special Edition',
    true,
    2
  )
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  currency = EXCLUDED.currency,
  features = EXCLUDED.features,
  material = EXCLUDED.material,
  badge = EXCLUDED.badge,
  updated_at = NOW();

-- ------------------------------------------------------------------------------
-- 5. ORDERS TABLE (Razorpay & Hardware Orders)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
  total_amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'order_received',
  payment_method TEXT NOT NULL DEFAULT 'Razorpay / UPI',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_address JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_amount NUMERIC(10, 2);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'INR';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'order_received';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'Razorpay / UPI';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS notes TEXT;

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- ------------------------------------------------------------------------------
-- 6. ORDER ITEMS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10, 2) NOT NULL,
  custom_name_to_print TEXT,
  custom_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- ------------------------------------------------------------------------------
-- 7. NFC CARDS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.nfc_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_uid TEXT UNIQUE NOT NULL,
  activation_code TEXT UNIQUE NOT NULL,
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  card_name TEXT NOT NULL DEFAULT 'SignTap NFC Smart Card',
  status TEXT NOT NULL DEFAULT 'in_production',
  order_reference TEXT,
  tap_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.nfc_cards ADD COLUMN IF NOT EXISTS card_uid TEXT;
ALTER TABLE public.nfc_cards ADD COLUMN IF NOT EXISTS activation_code TEXT;
ALTER TABLE public.nfc_cards ADD COLUMN IF NOT EXISTS owner_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.nfc_cards ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.nfc_cards ADD COLUMN IF NOT EXISTS card_name TEXT DEFAULT 'SignTap NFC Smart Card';
ALTER TABLE public.nfc_cards ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'in_production';
ALTER TABLE public.nfc_cards ADD COLUMN IF NOT EXISTS order_reference TEXT;
ALTER TABLE public.nfc_cards ADD COLUMN IF NOT EXISTS tap_count INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_nfc_cards_uid ON public.nfc_cards(card_uid);
CREATE INDEX IF NOT EXISTS idx_nfc_cards_activation ON public.nfc_cards(activation_code);
CREATE INDEX IF NOT EXISTS idx_nfc_cards_owner ON public.nfc_cards(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_nfc_cards_profile ON public.nfc_cards(profile_id);

-- ------------------------------------------------------------------------------
-- 8. ANALYTICS EVENTS TABLE (Real-time NFC Tap & QR Tracking)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  link_id TEXT,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS profile_id TEXT;
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS event_type TEXT;
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS link_id TEXT;
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS ip_hash TEXT;
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_analytics_events_profile ON public.analytics_events(profile_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON public.analytics_events(created_at);

-- Compatibility alias for profile_analytics
CREATE TABLE IF NOT EXISTS public.profile_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  link_id TEXT,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. ADMIN ACTIVITY AUDIT LOG TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_activity_created ON public.admin_activity(created_at);

-- ------------------------------------------------------------------------------
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nfc_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity ENABLE ROW LEVEL SECURITY;

-- Helper function: is current user an admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Safe Policy Configuration (Does NOT delete tables or data)
DROP POLICY IF EXISTS "Public profiles are viewable by anyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by anyone" 
  ON public.profiles FOR SELECT 
  USING (published = true OR auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
CREATE POLICY "Users can create their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
CREATE POLICY "Anyone can view products" 
  ON public.products FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" 
  ON public.products FOR ALL 
  USING (public.is_admin());

DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders" 
  ON public.orders FOR SELECT 
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
CREATE POLICY "Users can create orders" 
  ON public.orders FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders" 
  ON public.orders FOR UPDATE 
  USING (public.is_admin());

DROP POLICY IF EXISTS "Public can lookup active card for redirection" ON public.nfc_cards;
CREATE POLICY "Public can lookup active card for redirection" 
  ON public.nfc_cards FOR SELECT 
  USING (status IN ('activated', 'active') OR auth.uid() = owner_user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can manage their own NFC cards" ON public.nfc_cards;
CREATE POLICY "Users can manage their own NFC cards" 
  ON public.nfc_cards FOR UPDATE 
  USING (auth.uid() = owner_user_id OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage all cards" ON public.nfc_cards;
CREATE POLICY "Admins can manage all cards" 
  ON public.nfc_cards FOR ALL 
  USING (public.is_admin());

DROP POLICY IF EXISTS "Anyone can insert analytics events" ON public.analytics_events;
CREATE POLICY "Anyone can insert analytics events" 
  ON public.analytics_events FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Profile owners can view analytics events" ON public.analytics_events;
CREATE POLICY "Profile owners can view analytics events" 
  ON public.analytics_events FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Anyone can insert profile analytics" ON public.profile_analytics;
CREATE POLICY "Anyone can insert profile analytics" 
  ON public.profile_analytics FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view admin activity" ON public.admin_activity;
CREATE POLICY "Admins can view admin activity" 
  ON public.admin_activity FOR SELECT 
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can log activity" ON public.admin_activity;
CREATE POLICY "Admins can log activity" 
  ON public.admin_activity FOR INSERT 
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 11. AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_username text;
  v_full_name text;
  v_profile_type text;
  v_role text;
BEGIN
  v_username := COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1));
  v_full_name := COALESCE(new.raw_user_meta_data->>'full_name', 'SignTap Member');
  v_profile_type := COALESCE(new.raw_user_meta_data->>'profile_type', 'personal');
  v_role := CASE WHEN new.email ILIKE '%admin@%' THEN 'admin' ELSE 'user' END;

  INSERT INTO public.profiles (
    user_id, 
    username, 
    full_name, 
    email, 
    role,
    profile_type, 
    title, 
    bio, 
    theme, 
    accent_color, 
    published
  )
  VALUES (
    new.id,
    v_username,
    v_full_name,
    new.email,
    v_role,
    v_profile_type,
    'Digital Pioneer',
    'Welcome to my official SignTap digital identity. Tap my card to connect.',
    'signature',
    '#087CF0',
    true
  )
  ON CONFLICT (username) DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Safe trigger installation
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;
