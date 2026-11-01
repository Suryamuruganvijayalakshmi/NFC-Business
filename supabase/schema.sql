-- ==============================================================================
-- SignBridge ID — Complete Supabase PostgreSQL Database Schema
-- Brand: SignBridge | Product: SignBridge ID (signbridge.click)
-- Tagline: Your Identity. One Tap Away.
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  profile_type TEXT NOT NULL DEFAULT 'personal' CHECK (profile_type IN ('personal', 'professional', 'creator', 'business')),
  title TEXT,
  bio TEXT,
  profile_image TEXT,
  cover_image TEXT,
  location TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  theme TEXT NOT NULL DEFAULT 'signature' CHECK (theme IN ('minimal', 'signature', 'creative')),
  accent_color TEXT NOT NULL DEFAULT '#087CF0',
  button_style TEXT NOT NULL DEFAULT 'rounded' CHECK (button_style IN ('rounded', 'pill', 'sharp', 'glow')),
  font_family TEXT NOT NULL DEFAULT 'sans' CHECK (font_family IN ('sans', 'serif', 'mono')),
  background_style TEXT NOT NULL DEFAULT 'clean' CHECK (background_style IN ('clean', 'gradient', 'mesh', 'navy_grid')),
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookup by username
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- ------------------------------------------------------------------------------
-- 2. PROFILE SECTIONS TABLE
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
-- 3. PORTFOLIO PROJECTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  project_url TEXT,
  technologies TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'Featured',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_projects_profile_id ON public.portfolio_projects(profile_id);

-- ------------------------------------------------------------------------------
-- 4. SOCIAL LINKS TABLE
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
-- 5. NFC CARDS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.nfc_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_uid TEXT UNIQUE NOT NULL,
  owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  card_name TEXT NOT NULL DEFAULT 'SignBridge Smart Card',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'unlinked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nfc_cards_uid ON public.nfc_cards(card_uid);
CREATE INDEX IF NOT EXISTS idx_nfc_cards_owner ON public.nfc_cards(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_nfc_cards_profile ON public.nfc_cards(profile_id);

-- ------------------------------------------------------------------------------
-- 6. ANALYTICS EVENTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('profile_view', 'nfc_tap', 'qr_visit', 'link_click')),
  link_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_profile_id ON public.analytics_events(profile_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at);

-- ------------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nfc_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
-- Public can read published profiles
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (published = true OR auth.uid() = user_id);

-- Authenticated users can insert their own profile
CREATE POLICY "Users can create their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users can update their own profile
CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = user_id);

-- Authenticated users can delete their own profile
CREATE POLICY "Users can delete their own profile" 
  ON public.profiles FOR DELETE 
  USING (auth.uid() = user_id);

-- PROFILE SECTIONS POLICIES
CREATE POLICY "Sections are viewable by everyone for published profiles" 
  ON public.profile_sections FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = profile_sections.profile_id 
      AND (profiles.published = true OR profiles.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage sections of their own profiles" 
  ON public.profile_sections FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = profile_sections.profile_id 
      AND profiles.user_id = auth.uid()
    )
  );

-- PORTFOLIO PROJECTS POLICIES
CREATE POLICY "Portfolio projects are viewable by everyone for published profiles" 
  ON public.portfolio_projects FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = portfolio_projects.profile_id 
      AND (profiles.published = true OR profiles.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage portfolio of their own profiles" 
  ON public.portfolio_projects FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = portfolio_projects.profile_id 
      AND profiles.user_id = auth.uid()
    )
  );

-- SOCIAL LINKS POLICIES
CREATE POLICY "Social links are viewable by everyone for published profiles" 
  ON public.social_links FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = social_links.profile_id 
      AND (profiles.published = true OR profiles.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage social links of their own profiles" 
  ON public.social_links FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = social_links.profile_id 
      AND profiles.user_id = auth.uid()
    )
  );

-- NFC CARDS POLICIES
-- Public can check active card by card_uid for redirect
CREATE POLICY "Public can view active card by card_uid" 
  ON public.nfc_cards FOR SELECT 
  USING (status = 'active');

-- Owners can manage their NFC cards
CREATE POLICY "Users can manage their own NFC cards" 
  ON public.nfc_cards FOR ALL 
  USING (auth.uid() = owner_user_id);

-- ANALYTICS EVENTS POLICIES
-- Anyone can insert an analytics event (rate-limited via API)
CREATE POLICY "Anyone can log analytics event" 
  ON public.analytics_events FOR INSERT 
  WITH CHECK (true);

-- Only profile owner can view their own analytics
CREATE POLICY "Users can view analytics for their own profiles" 
  ON public.analytics_events FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = analytics_events.profile_id 
      AND profiles.user_id = auth.uid()
    )
  );

-- ------------------------------------------------------------------------------
-- 8. AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_username text;
  v_full_name text;
  v_profile_type text;
BEGIN
  v_username := COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1));
  v_full_name := COALESCE(new.raw_user_meta_data->>'full_name', 'SignBridge User');
  v_profile_type := COALESCE(new.raw_user_meta_data->>'profile_type', 'personal');

  INSERT INTO public.profiles (user_id, username, full_name, email, profile_type, title, bio, theme, accent_color, published)
  VALUES (
    new.id,
    v_username,
    v_full_name,
    new.email,
    v_profile_type,
    'Digital Pioneer',
    'Welcome to my official SignBridge digital identity. Tap to connect.',
    'signature',
    '#087CF0',
    true
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_nfc_cards_updated_at
  BEFORE UPDATE ON public.nfc_cards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
