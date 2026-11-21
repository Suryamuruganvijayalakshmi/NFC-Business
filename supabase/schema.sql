-- ==============================================================================
-- SignTap NFC — Separate Digital Identity Tables
-- Project ID: tzqpsxtjfgkmqsxrtlgx
-- 
-- GUARANTEE: Does NOT touch, alter, or delete existing 'products', 'orders', or 'customers' tables.
-- Creates only the new separate tables required for Digital Profiles & NFC Cards.
-- ==============================================================================

-- 0. Enable UUID Extension
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
-- 4. NFC CARDS TABLE (Hardware Chip Mapping)
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

CREATE INDEX IF NOT EXISTS idx_nfc_cards_uid ON public.nfc_cards(card_uid);
CREATE INDEX IF NOT EXISTS idx_nfc_cards_activation ON public.nfc_cards(activation_code);
CREATE INDEX IF NOT EXISTS idx_nfc_cards_owner ON public.nfc_cards(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_nfc_cards_profile ON public.nfc_cards(profile_id);

-- ------------------------------------------------------------------------------
-- 5. ANALYTICS EVENTS TABLE (Real-time Tap & Scan Tracking)
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

CREATE INDEX IF NOT EXISTS idx_analytics_events_profile ON public.analytics_events(profile_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON public.analytics_events(created_at);

-- ------------------------------------------------------------------------------
-- 6. ADMIN ACTIVITY AUDIT LOG TABLE
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
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nfc_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Safe policy creation
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

DROP POLICY IF EXISTS "Public can view social links" ON public.social_links;
CREATE POLICY "Public can view social links" 
  ON public.social_links FOR SELECT 
  USING (
    visible = true AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = social_links.profile_id 
      AND (profiles.published = true OR profiles.user_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "Users can manage their social links" ON public.social_links;
CREATE POLICY "Users can manage their social links" 
  ON public.social_links FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = social_links.profile_id 
      AND (profiles.user_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "Public can view profile sections" ON public.profile_sections;
CREATE POLICY "Public can view profile sections" 
  ON public.profile_sections FOR SELECT 
  USING (
    visible = true AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = profile_sections.profile_id 
      AND (profiles.published = true OR profiles.user_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "Users can manage their profile sections" ON public.profile_sections;
CREATE POLICY "Users can manage their profile sections" 
  ON public.profile_sections FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = profile_sections.profile_id 
      AND (profiles.user_id = auth.uid() OR public.is_admin())
    )
  );

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
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = analytics_events.profile_id 
      AND (profiles.user_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "Admins can view admin activity" ON public.admin_activity;
CREATE POLICY "Admins can view admin activity" 
  ON public.admin_activity FOR SELECT 
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can log activity" ON public.admin_activity;
CREATE POLICY "Admins can log activity" 
  ON public.admin_activity FOR INSERT 
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 8. AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
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

-- ------------------------------------------------------------------------------
-- 9. SMART NETWORKING & PERSONAL CRM TABLES
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.smart_contacts (
  id text PRIMARY KEY,
  owner_user_id text NOT NULL,
  full_name text NOT NULL,
  headline text,
  company text,
  role text,
  email text,
  phone text,
  avatar_url text,
  location text,
  website text,
  linkedin_url text,
  twitter_url text,
  github_url text,
  category text DEFAULT 'Entrepreneurs',
  tags text[] DEFAULT '{}',
  is_important boolean DEFAULT false,
  met_at text,
  met_date text,
  discussion_notes text,
  interests text,
  opportunities text,
  collaboration_ideas text,
  private_notes text,
  signtap_username text,
  source text DEFAULT 'manual',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.smart_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own smart contacts"
  ON public.smart_contacts
  FOR ALL
  USING (auth.uid()::text = owner_user_id)
  WITH CHECK (auth.uid()::text = owner_user_id);

CREATE INDEX IF NOT EXISTS idx_smart_contacts_owner ON public.smart_contacts(owner_user_id);

CREATE TABLE IF NOT EXISTS public.contact_follow_ups (
  id text PRIMARY KEY,
  contact_id text NOT NULL,
  contact_name text NOT NULL,
  owner_user_id text NOT NULL,
  title text NOT NULL,
  description text,
  due_date text NOT NULL,
  priority text DEFAULT 'medium',
  status text DEFAULT 'pending',
  completed_at text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.contact_follow_ups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own follow-ups"
  ON public.contact_follow_ups
  FOR ALL
  USING (auth.uid()::text = owner_user_id)
  WITH CHECK (auth.uid()::text = owner_user_id);

CREATE INDEX IF NOT EXISTS idx_follow_ups_owner ON public.contact_follow_ups(owner_user_id);

CREATE TABLE IF NOT EXISTS public.contact_interactions (
  id text PRIMARY KEY,
  contact_id text NOT NULL,
  owner_user_id text NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  details text,
  location text,
  occurred_at text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.contact_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own contact interactions"
  ON public.contact_interactions
  FOR ALL
  USING (auth.uid()::text = owner_user_id)
  WITH CHECK (auth.uid()::text = owner_user_id);

CREATE INDEX IF NOT EXISTS idx_contact_interactions_owner ON public.contact_interactions(owner_user_id);
