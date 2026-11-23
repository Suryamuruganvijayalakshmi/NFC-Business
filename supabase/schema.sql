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

-- Safe column extensions for existing profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS headline TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_premium BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS premium_until TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS experiences JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS achievements JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS businesses JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS services JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS custom_links JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS qr_color TEXT DEFAULT '#0A66C2';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS qr_logo_enabled BOOLEAN DEFAULT true;

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
  v_role := CASE 
    WHEN LOWER(new.email) IN ('vmsurya2007@gmail.com', 'vmsuurya2007@gmail.com', 'signbridge.aiauto@gmail.com') 
    THEN 'admin' 
    ELSE 'user' 
  END;

  INSERT INTO public.profiles (
    user_id, 
    username, 
    full_name, 
    email, 
    role,
    profile_type, 
    title,
    headline,
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
    'SignTap Professional & Creator',
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


-- ==============================================================================
-- 10. SOCIAL FEED, POSTS, REACTIONS & COMMENTS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.posts (
  id TEXT PRIMARY KEY,
  author_user_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_username TEXT NOT NULL,
  author_avatar TEXT,
  author_headline TEXT,
  content TEXT NOT NULL,
  media_url TEXT,
  media_type TEXT DEFAULT 'text', -- 'image', 'video', 'document', 'text'
  visibility TEXT NOT NULL DEFAULT 'public', -- 'public', 'connections'
  likes_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  shares_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_author ON public.posts(author_user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created ON public.posts(created_at DESC);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public posts are viewable by everyone"
  ON public.posts FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own posts"
  ON public.posts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own posts"
  ON public.posts FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete their own posts"
  ON public.posts FOR DELETE
  USING (true);

-- POST REACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.post_reactions (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  type TEXT NOT NULL DEFAULT 'like', -- 'like', 'celebrate', 'support', 'love', 'insightful', 'funny'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_post_user_reaction UNIQUE (post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_post_reactions_post ON public.post_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_post_reactions_user ON public.post_reactions(user_id);

ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reactions are viewable by everyone"
  ON public.post_reactions FOR SELECT USING (true);

CREATE POLICY "Users can manage their own reactions"
  ON public.post_reactions FOR ALL USING (true) WITH CHECK (true);

-- POST COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.post_comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_user_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_username TEXT NOT NULL,
  author_avatar TEXT,
  content TEXT NOT NULL,
  parent_id TEXT REFERENCES public.post_comments(id) ON DELETE CASCADE,
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_post_comments_post ON public.post_comments(post_id);

ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone"
  ON public.post_comments FOR SELECT USING (true);

CREATE POLICY "Users can manage comments"
  ON public.post_comments FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 11. CONNECTIONS & FOLLOWS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.connections (
  id TEXT PRIMARY KEY,
  requester_id TEXT NOT NULL,
  receiver_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_connection_pair UNIQUE (requester_id, receiver_id)
);

CREATE INDEX IF NOT EXISTS idx_connections_requester ON public.connections(requester_id);
CREATE INDEX IF NOT EXISTS idx_connections_receiver ON public.connections(receiver_id);
CREATE INDEX IF NOT EXISTS idx_connections_status ON public.connections(status);

ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Connections viewable by involved users" ON public.connections FOR SELECT USING (true);
CREATE POLICY "Users can manage connections" ON public.connections FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.follows (
  id TEXT PRIMARY KEY,
  follower_id TEXT NOT NULL,
  followed_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_follow_pair UNIQUE (follower_id, followed_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_follower ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_followed ON public.follows(followed_id);

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Follows are viewable by everyone" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users can manage follows" ON public.follows FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 12. MESSAGING (1-ON-1 CONVERSATIONS & CHAT)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.conversations (
  id TEXT PRIMARY KEY,
  participant_ids TEXT[] NOT NULL DEFAULT '{}',
  last_message TEXT,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_participants ON public.conversations USING GIN (participant_ids);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their conversations" ON public.conversations FOR SELECT USING (true);
CREATE POLICY "Users can update conversations" ON public.conversations FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_avatar TEXT,
  sender_username TEXT,
  receiver_id TEXT,
  receiver_name TEXT,
  receiver_username TEXT,
  content TEXT NOT NULL,
  media_url TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS sender_username TEXT;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS receiver_id TEXT;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS receiver_name TEXT;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS receiver_username TEXT;

CREATE INDEX IF NOT EXISTS idx_messages_conv ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.messages(created_at ASC);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Messages readable by participants" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Users can post messages" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update messages" ON public.messages FOR UPDATE USING (true) WITH CHECK (true);

-- ==============================================================================
-- 13. NOTIFICATIONS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  recipient_id TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  actor_username TEXT NOT NULL,
  actor_avatar TEXT,
  type TEXT NOT NULL, -- 'connection_request', 'connection_accepted', 'post_reaction', 'comment', 'follow', 'job_alert', 'order_status'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "System and users manage notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 14. SIGNTAP CARDS & RAZORPAY ORDERS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.card_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  material TEXT NOT NULL, -- 'Matte Black NFC', 'Metal Executive NFC', 'Eco Bamboo NFC', 'Clear Holographic NFC'
  description TEXT NOT NULL,
  price INTEGER NOT NULL, -- in INR
  currency TEXT NOT NULL DEFAULT 'INR',
  features TEXT[] DEFAULT '{}',
  image_url TEXT,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.card_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Card products viewable by all" ON public.card_products FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'engraving', 'shipped', 'delivered', 'cancelled'
  total_amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  shipping_name TEXT NOT NULL,
  shipping_email TEXT NOT NULL,
  shipping_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_pincode TEXT NOT NULL,
  engraving_name TEXT,
  engraving_company TEXT,
  card_product_id TEXT REFERENCES public.card_products(id),
  card_product_name TEXT NOT NULL,
  card_chip_uid TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay ON public.orders(razorpay_order_id);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Users create orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 15. JOBS & OPPORTUNITIES PORTAL
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.job_listings (
  id TEXT PRIMARY KEY,
  poster_user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  company_logo TEXT,
  location TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Full-time', -- 'Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'
  workplace_type TEXT NOT NULL DEFAULT 'Remote', -- 'Remote', 'On-site', 'Hybrid'
  description TEXT NOT NULL,
  requirements TEXT[] DEFAULT '{}',
  salary_range TEXT,
  experience_level TEXT DEFAULT 'Mid-Senior level',
  applicants_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'closed'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.job_listings(status);
CREATE INDEX IF NOT EXISTS idx_jobs_poster ON public.job_listings(poster_user_id);

ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active jobs viewable by all" ON public.job_listings FOR SELECT USING (true);
CREATE POLICY "Posters manage their jobs" ON public.job_listings FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.job_applications (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES public.job_listings(id) ON DELETE CASCADE,
  applicant_user_id TEXT NOT NULL,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_headline TEXT,
  resume_url TEXT,
  cover_note TEXT,
  status TEXT NOT NULL DEFAULT 'applied', -- 'applied', 'reviewing', 'shortlisted', 'rejected'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_apps_job ON public.job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_apps_user ON public.job_applications(applicant_user_id);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Applications viewable by applicant and poster" ON public.job_applications FOR SELECT USING (true);
CREATE POLICY "Applicants can submit" ON public.job_applications FOR INSERT WITH CHECK (true);
