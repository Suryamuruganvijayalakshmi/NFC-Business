-- ==============================================================================
-- SignBridge NFC — Complete Supabase PostgreSQL Database Schema
-- Brand: SignBridge | Product: SignBridge NFC (signbridge.click)
-- Tagline: Your Identity. One Tap Away.
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. USERS & PROFILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  profile_type TEXT NOT NULL DEFAULT 'personal' CHECK (profile_type IN ('personal', 'professional', 'creator', 'business')),
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
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
  theme TEXT NOT NULL DEFAULT 'signature' CHECK (theme IN ('minimal', 'signature', 'creative')),
  accent_color TEXT NOT NULL DEFAULT '#087CF0',
  button_style TEXT NOT NULL DEFAULT 'rounded' CHECK (button_style IN ('rounded', 'pill', 'sharp', 'glow')),
  font_family TEXT NOT NULL DEFAULT 'sans' CHECK (font_family IN ('sans', 'serif', 'mono')),
  background_style TEXT NOT NULL DEFAULT 'clean' CHECK (background_style IN ('clean', 'gradient', 'mesh', 'navy_grid')),
  published BOOLEAN NOT NULL DEFAULT true,
  section_visibility JSONB DEFAULT '{"bio":true,"contact":true,"socials":true,"skills":true,"services":true,"portfolio":true,"experience":true}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ------------------------------------------------------------------------------
-- 2. DIGITAL PROFILES VIEW / ALIAS (Supports public read queries for profiles)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.digital_profiles AS
SELECT 
  id,
  user_id,
  username,
  full_name,
  profile_type,
  title,
  bio,
  profile_image,
  cover_image,
  location,
  email,
  phone,
  website,
  company,
  business_name,
  business_description,
  whatsapp_number,
  portfolio_url,
  resume_url,
  skills,
  theme,
  accent_color,
  button_style,
  font_family,
  background_style,
  published,
  section_visibility,
  created_at,
  updated_at
FROM public.profiles
WHERE published = true;

-- ------------------------------------------------------------------------------
-- 3. SOCIAL LINKS TABLE
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

CREATE INDEX IF NOT EXISTS idx_social_links_profile_id ON public.social_links(profile_id);

-- ------------------------------------------------------------------------------
-- 4. PROFILE SECTIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profile_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL CHECK (section_type IN ('about', 'experience', 'education', 'skills', 'certifications', 'services', 'products', 'featured_media', 'custom')),
  title TEXT NOT NULL,
  content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  display_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_sections_profile_id ON public.profile_sections(profile_id);

-- ------------------------------------------------------------------------------
-- 5. PRODUCTS TABLE (Configurable by Admin)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('personal', 'business', 'professional', 'custom')),
  short_description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  features TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT NOT NULL,
  material TEXT NOT NULL,
  badge TEXT,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed initial products
INSERT INTO public.products (id, name, category, short_description, price, currency, features, image_url, material, badge, in_stock, display_order)
VALUES 
  ('prod-personal', 'Personal NFC Card', 'personal', 'Sleek, minimalist NFC smart card designed for individuals, creators, and students.', 29.00, 'USD', ARRAY['One-tap instant digital profile sharing', 'High-grade matte PVC with embedded NTAG216 chip', 'Dynamic backup QR code on back', 'No app or battery needed for visitors', 'Unlimited real-time profile updates'], 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&w=600&q=80', 'Matte Jet Black Polymer', 'Popular Choice', true, 1),
  ('prod-professional', 'Professional NFC Card', 'professional', 'Engineered for executives, founders, and consultants who demand an unforgettable first impression.', 49.00, 'USD', ARRAY['High-sensitivity directional NFC antenna', 'Direct 1-tap phonebook vCard contact save', 'Custom laser-etched cardholder name', 'Portfolio & verified resume linking', 'Advanced profile analytics dashboard'], 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80', 'Brushed Titanium / Ceramic Hybrid', 'Executive Best Seller', true, 2),
  ('prod-business', 'Business NFC Card', 'business', 'Tailored for agencies, sales teams, and corporate representatives. Seamless WhatsApp, catalog, and team branding.', 69.00, 'USD', ARRAY['Instant WhatsApp 1-click business chat button', 'Showcase company catalog, pricing & services', 'Custom corporate logo printing', 'Team member profile re-assignment', 'Team analytics & lead tracking'], 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80', 'Midnight Obsidian & Gold Accents', 'Enterprise Choice', true, 3),
  ('prod-custom', 'Custom NFC Card', 'custom', 'Bespoke full-bleed artwork, custom brand typography, metallic edges, and enterprise bulk provisioning.', 89.00, 'USD', ARRAY['100% bespoke edge-to-edge UV custom print', 'Custom NFC chip encoding & redirect token', 'Material options: Carbon Fiber, Titanium, Bamboo', 'Admin fleet management & bulk card controls', 'Custom brand color match'], 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80', 'Aerospace Carbon Fiber / Bespoke Metal', 'Bespoke Luxury', true, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, features = EXCLUDED.features;

-- ------------------------------------------------------------------------------
-- 6. ORDERS TABLE
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
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'order_received' CHECK (status IN ('order_received', 'payment_pending', 'confirmed', 'processing', 'in_production', 'shipped', 'delivered', 'cancelled')),
  payment_method TEXT NOT NULL DEFAULT 'Manual Bank / UPI Verification',
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'verified', 'failed', 'refunded')),
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- ------------------------------------------------------------------------------
-- 7. ORDER ITEMS TABLE
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
-- 8. NFC CARDS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.nfc_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_uid TEXT UNIQUE NOT NULL,
  activation_code TEXT UNIQUE NOT NULL,
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  card_name TEXT NOT NULL DEFAULT 'SignBridge NFC Smart Card',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_production', 'shipped', 'delivered', 'activated', 'blocked', 'active', 'inactive')),
  order_reference TEXT,
  tap_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nfc_cards_uid ON public.nfc_cards(card_uid);
CREATE INDEX IF NOT EXISTS idx_nfc_cards_activation ON public.nfc_cards(activation_code);
CREATE INDEX IF NOT EXISTS idx_nfc_cards_owner ON public.nfc_cards(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_nfc_cards_profile ON public.nfc_cards(profile_id);

-- ------------------------------------------------------------------------------
-- 9. PROFILE ANALYTICS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profile_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('profile_view', 'nfc_tap', 'qr_visit', 'link_click', 'contact_save', 'whatsapp_click')),
  link_id TEXT,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_analytics_profile_id ON public.profile_analytics(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_analytics_type ON public.profile_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_profile_analytics_created ON public.profile_analytics(created_at);

-- ------------------------------------------------------------------------------
-- 10. ADMIN ACTIVITY AUDIT LOG TABLE
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
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nfc_cards ENABLE ROW LEVEL SECURITY;
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

-- PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by anyone" 
  ON public.profiles FOR SELECT 
  USING (published = true OR auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can create their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = user_id OR public.is_admin());

-- PRODUCTS POLICIES (Public can view, only Admin can edit)
CREATE POLICY "Anyone can view products" 
  ON public.products FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage products" 
  ON public.products FOR ALL 
  USING (public.is_admin());

-- ORDERS POLICIES
CREATE POLICY "Users can view their own orders" 
  ON public.orders FOR SELECT 
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can create orders" 
  ON public.orders FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can update orders" 
  ON public.orders FOR UPDATE 
  USING (public.is_admin());

-- NFC CARDS POLICIES
CREATE POLICY "Public can lookup active card for redirection" 
  ON public.nfc_cards FOR SELECT 
  USING (status IN ('activated', 'active') OR auth.uid() = owner_user_id OR public.is_admin());

CREATE POLICY "Users can manage their own NFC cards" 
  ON public.nfc_cards FOR UPDATE 
  USING (auth.uid() = owner_user_id OR public.is_admin());

CREATE POLICY "Admins can manage all cards" 
  ON public.nfc_cards FOR ALL 
  USING (public.is_admin());

-- ANALYTICS POLICIES
CREATE POLICY "Anyone can insert analytics events" 
  ON public.profile_analytics FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Profile owners can view their analytics" 
  ON public.profile_analytics FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = profile_analytics.profile_id 
      AND (profiles.user_id = auth.uid() OR public.is_admin())
    )
  );

-- ADMIN ACTIVITY POLICIES
CREATE POLICY "Only admins can view admin activity" 
  ON public.admin_activity FOR SELECT 
  USING (public.is_admin());

CREATE POLICY "Admins can log activity" 
  ON public.admin_activity FOR INSERT 
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 12. AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
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
  v_full_name := COALESCE(new.raw_user_meta_data->>'full_name', 'SignBridge Member');
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
    'Welcome to my official SignBridge digital identity. Tap my card to connect.',
    'signature',
    '#087CF0',
    true
  )
  ON CONFLICT (username) DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
