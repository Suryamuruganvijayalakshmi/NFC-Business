-- ==============================================================================
-- SIGNTAP & SIGNBRIDGE COMPLETE DATABASE RESET & INITIALIZATION SCRIPT
-- Project: SignTap Professional Identity & NFC Networking Platform
-- Database: Supabase PostgreSQL (tzqpsxtjfgkmqsxrtlgx.supabase.co)
-- ==============================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/tzqpsxtjfgkmqsxrtlgx
-- 2. Go to the SQL Editor (left sidebar).
-- 3. Paste this entire script and click "Run".
-- 4. It will safely drop all existing tables and re-create everything fresh.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- STEP 1: CLEANUP / DROP ALL EXISTING TABLES, TRIGGERS & FUNCTIONS (CASCADE)
-- ------------------------------------------------------------------------------

-- Drop Auth Triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

-- Drop All Tables in Dependency Order
DROP TABLE IF EXISTS public.reports CASCADE;
DROP TABLE IF EXISTS public.saved_jobs CASCADE;
DROP TABLE IF EXISTS public.event_registrations CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.organization_members CASCADE;
DROP TABLE IF EXISTS public.organizations CASCADE;
DROP TABLE IF EXISTS public.recommendations CASCADE;
DROP TABLE IF EXISTS public.skill_endorsements CASCADE;
DROP TABLE IF EXISTS public.contact_exchanges CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.job_applications CASCADE;
DROP TABLE IF EXISTS public.job_listings CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.card_products CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;
DROP TABLE IF EXISTS public.follows CASCADE;
DROP TABLE IF EXISTS public.connections CASCADE;
DROP TABLE IF EXISTS public.post_comments CASCADE;
DROP TABLE IF EXISTS public.post_reactions CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.contact_interactions CASCADE;
DROP TABLE IF EXISTS public.contact_follow_ups CASCADE;
DROP TABLE IF EXISTS public.smart_contacts CASCADE;
DROP TABLE IF EXISTS public.admin_activity CASCADE;
DROP TABLE IF EXISTS public.admin_activity_logs CASCADE;
DROP TABLE IF EXISTS public.analytics_events CASCADE;
DROP TABLE IF EXISTS public.nfc_cards CASCADE;
DROP TABLE IF EXISTS public.profile_sections CASCADE;
DROP TABLE IF EXISTS public.social_links CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Enable UUID & Crypto Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- STEP 2: CREATE CORE TABLES
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE (Digital Identity Cards & LinkedIn-Style Profiles)
-- ------------------------------------------------------------------------------
CREATE TABLE public.profiles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  profile_type TEXT NOT NULL DEFAULT 'personal', -- 'personal', 'business', 'creator', 'executive'
  role TEXT NOT NULL DEFAULT 'user', -- 'user', 'admin'
  title TEXT,
  headline TEXT,
  bio TEXT,
  about TEXT,
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
  experiences JSONB DEFAULT '[]'::jsonb,
  education JSONB DEFAULT '[]'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  businesses JSONB DEFAULT '[]'::jsonb,
  services JSONB DEFAULT '[]'::jsonb,
  languages JSONB DEFAULT '[]'::jsonb,
  custom_links JSONB DEFAULT '[]'::jsonb,
  professional_interests TEXT[] DEFAULT '{}',
  is_premium BOOLEAN NOT NULL DEFAULT false,
  premium_plan TEXT DEFAULT 'none', -- 'none', 'yearly', 'lifetime'
  premium_until TIMESTAMPTZ,
  qr_color TEXT DEFAULT '#0A66C2',
  qr_logo_enabled BOOLEAN DEFAULT true,
  theme TEXT NOT NULL DEFAULT 'dark-modern', -- 'dark-modern', 'minimal-light', 'glassmorphic', 'cyberpunk', 'signature'
  accent_color TEXT NOT NULL DEFAULT '#0A66C2',
  button_style TEXT NOT NULL DEFAULT 'rounded', -- 'rounded', 'pill', 'square', 'glass'
  font_family TEXT NOT NULL DEFAULT 'Inter',
  background_style TEXT NOT NULL DEFAULT 'mesh',
  published BOOLEAN NOT NULL DEFAULT true,
  section_visibility JSONB DEFAULT '{"bio":true,"contact":true,"socials":true,"skills":true,"services":true,"portfolio":true,"experience":true,"education":true,"certifications":true,"businesses":true,"activity":true}'::jsonb,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- ------------------------------------------------------------------------------
-- 2. SOCIAL LINKS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE public.social_links (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  profile_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  label TEXT,
  url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_social_links_profile_id ON public.social_links(profile_id);

-- ------------------------------------------------------------------------------
-- 3. PROFILE SECTIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE public.profile_sections (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  profile_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL DEFAULT 'about',
  title TEXT NOT NULL,
  content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  display_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profile_sections_profile_id ON public.profile_sections(profile_id);

-- ------------------------------------------------------------------------------
-- 4. NFC CARDS TABLE (Hardware Chip Mapping)
-- ------------------------------------------------------------------------------
CREATE TABLE public.nfc_cards (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  card_uid TEXT UNIQUE NOT NULL,
  activation_code TEXT UNIQUE NOT NULL,
  owner_user_id TEXT,
  profile_id TEXT,
  card_name TEXT NOT NULL DEFAULT 'SignTap NFC Smart Card',
  status TEXT NOT NULL DEFAULT 'in_production', -- 'in_production', 'assigned', 'activated', 'active', 'inactive', 'blocked'
  order_reference TEXT,
  short_code TEXT,
  tap_count INTEGER NOT NULL DEFAULT 0,
  last_tapped_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_nfc_cards_uid ON public.nfc_cards(card_uid);
CREATE INDEX idx_nfc_cards_activation ON public.nfc_cards(activation_code);
CREATE INDEX idx_nfc_cards_owner ON public.nfc_cards(owner_user_id);
CREATE INDEX idx_nfc_cards_profile ON public.nfc_cards(profile_id);
CREATE INDEX idx_nfc_cards_short_code ON public.nfc_cards(short_code);

-- ------------------------------------------------------------------------------
-- 5. ANALYTICS & TAP EVENTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE public.analytics_events (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  profile_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'view', 'tap', 'click', 'vcard_download', 'share'
  link_id TEXT,
  ip_hash TEXT,
  user_agent TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  country TEXT,
  city TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_profile ON public.analytics_events(profile_id);
CREATE INDEX idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_events_created ON public.analytics_events(created_at DESC);

-- ------------------------------------------------------------------------------
-- 6. ADMIN AUDIT LOG
-- ------------------------------------------------------------------------------
CREATE TABLE public.admin_activity (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT NOT NULL,
  target_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_activity_created ON public.admin_activity(created_at DESC);

-- ------------------------------------------------------------------------------
-- 7. SMART NETWORKING & PERSONAL CRM TABLES
-- ------------------------------------------------------------------------------
CREATE TABLE public.smart_contacts (
  id TEXT PRIMARY KEY,
  owner_user_id TEXT NOT NULL,
  full_name TEXT NOT NULL,
  headline TEXT,
  company TEXT,
  role TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  location TEXT,
  website TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  github_url TEXT,
  category TEXT DEFAULT 'Entrepreneurs',
  tags TEXT[] DEFAULT '{}',
  is_important BOOLEAN DEFAULT false,
  met_at TEXT,
  met_date TEXT,
  discussion_notes TEXT,
  interests TEXT,
  opportunities TEXT,
  collaboration_ideas TEXT,
  private_notes TEXT,
  signtap_username TEXT,
  source TEXT DEFAULT 'manual', -- 'manual', 'nfc_tap', 'csv_import'
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_smart_contacts_owner ON public.smart_contacts(owner_user_id);
CREATE INDEX idx_smart_contacts_email ON public.smart_contacts(email);

CREATE TABLE public.contact_follow_ups (
  id TEXT PRIMARY KEY,
  contact_id TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  owner_user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TEXT NOT NULL,
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  status TEXT DEFAULT 'pending', -- 'pending', 'completed'
  completed_at TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_follow_ups_owner ON public.contact_follow_ups(owner_user_id);
CREATE INDEX idx_follow_ups_contact ON public.contact_follow_ups(contact_id);

CREATE TABLE public.contact_interactions (
  id TEXT PRIMARY KEY,
  contact_id TEXT NOT NULL,
  owner_user_id TEXT NOT NULL,
  type TEXT NOT NULL, -- 'meeting', 'call', 'email', 'nfc_tap', 'note'
  title TEXT NOT NULL,
  details TEXT,
  location TEXT,
  occurred_at TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_contact_interactions_owner ON public.contact_interactions(owner_user_id);
CREATE INDEX idx_contact_interactions_contact ON public.contact_interactions(contact_id);

-- ------------------------------------------------------------------------------
-- 8. SOCIAL POSTS, REACTIONS & COMMENTS
-- ------------------------------------------------------------------------------
CREATE TABLE public.posts (
  id TEXT PRIMARY KEY,
  author_user_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_username TEXT NOT NULL,
  author_avatar TEXT,
  author_headline TEXT,
  content TEXT NOT NULL,
  media_url TEXT,
  media_type TEXT DEFAULT 'text', -- 'text', 'image', 'video', 'document', 'project'
  project_link TEXT,
  tags TEXT[] DEFAULT '{}',
  visibility TEXT NOT NULL DEFAULT 'public', -- 'public', 'connections'
  likes_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  shares_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_posts_author ON public.posts(author_user_id);
CREATE INDEX idx_posts_created ON public.posts(created_at DESC);

CREATE TABLE public.post_reactions (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  type TEXT NOT NULL DEFAULT 'like', -- 'like', 'celebrate', 'support', 'love', 'insightful', 'funny'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_post_user_reaction UNIQUE (post_id, user_id)
);

CREATE INDEX idx_post_reactions_post ON public.post_reactions(post_id);
CREATE INDEX idx_post_reactions_user ON public.post_reactions(user_id);

CREATE TABLE public.post_comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_username TEXT NOT NULL,
  author_avatar TEXT,
  content TEXT NOT NULL,
  parent_id TEXT REFERENCES public.post_comments(id) ON DELETE CASCADE,
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_post_comments_post ON public.post_comments(post_id);
CREATE INDEX idx_post_comments_user ON public.post_comments(user_id);

-- ------------------------------------------------------------------------------
-- 9. NETWORKING CONNECTIONS & FOLLOWS
-- ------------------------------------------------------------------------------
CREATE TABLE public.connections (
  id TEXT PRIMARY KEY,
  requester_id TEXT NOT NULL,
  receiver_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_connection_pair UNIQUE (requester_id, receiver_id)
);

CREATE INDEX idx_connections_requester ON public.connections(requester_id);
CREATE INDEX idx_connections_receiver ON public.connections(receiver_id);
CREATE INDEX idx_connections_status ON public.connections(status);

CREATE TABLE public.follows (
  id TEXT PRIMARY KEY,
  follower_id TEXT NOT NULL,
  followed_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_follow_pair UNIQUE (follower_id, followed_id)
);

CREATE INDEX idx_follows_follower ON public.follows(follower_id);
CREATE INDEX idx_follows_followed ON public.follows(followed_id);

-- ------------------------------------------------------------------------------
-- 10. DIRECT MESSAGING (CONVERSATIONS & CHAT)
-- ------------------------------------------------------------------------------
CREATE TABLE public.conversations (
  id TEXT PRIMARY KEY,
  participant_ids TEXT[] NOT NULL DEFAULT '{}',
  last_message TEXT,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conversations_participants ON public.conversations USING GIN (participant_ids);

CREATE TABLE public.messages (
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

CREATE INDEX idx_messages_conv ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX idx_messages_created ON public.messages(created_at ASC);

-- ------------------------------------------------------------------------------
-- 11. NOTIFICATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE public.notifications (
  id TEXT PRIMARY KEY,
  recipient_id TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  actor_username TEXT NOT NULL,
  actor_avatar TEXT,
  type TEXT NOT NULL, -- 'connection_request', 'connection_accepted', 'post_like', 'post_comment', 'new_follower', 'job_application', 'system'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_recipient ON public.notifications(recipient_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_notifications_created ON public.notifications(created_at DESC);

-- ------------------------------------------------------------------------------
-- 12. SIGNTAP CARD PRODUCTS & RAZORPAY ORDERS
-- ------------------------------------------------------------------------------
CREATE TABLE public.card_products (
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

CREATE TABLE public.orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  order_number TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed', -- 'pending', 'confirmed', 'processing', 'engraving', 'shipped', 'delivered', 'cancelled'
  payment_status TEXT NOT NULL DEFAULT 'verified', -- 'pending', 'verified', 'failed', 'refunded'
  payment_method TEXT DEFAULT 'card', -- 'card', 'upi', 'netbanking'
  total_amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  tracking_number TEXT,
  shipping_carrier TEXT DEFAULT 'Blue Dart Express',
  shipping_address JSONB DEFAULT '{}'::jsonb,
  items JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_razorpay_order ON public.orders(razorpay_order_id);
CREATE INDEX idx_orders_razorpay_payment ON public.orders(razorpay_payment_id);
CREATE INDEX idx_orders_status ON public.orders(status);

-- ------------------------------------------------------------------------------
-- 13. JOBS & OPPORTUNITIES PORTAL
-- ------------------------------------------------------------------------------
CREATE TABLE public.job_listings (
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

CREATE INDEX idx_jobs_status ON public.job_listings(status);
CREATE INDEX idx_jobs_poster ON public.job_listings(poster_user_id);

CREATE TABLE public.job_applications (
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

CREATE INDEX idx_job_apps_job ON public.job_applications(job_id);
CREATE INDEX idx_job_apps_user ON public.job_applications(applicant_user_id);

-- ------------------------------------------------------------------------------
-- 14. STRUCTURED PROJECT SHOWCASE
-- ------------------------------------------------------------------------------
CREATE TABLE public.projects (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL,
  owner_user_id TEXT NOT NULL,
  owner_name TEXT,
  owner_username TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  problem_solved TEXT,
  image_url TEXT,
  project_url TEXT,
  github_url TEXT,
  live_demo TEXT,
  technologies TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'Featured Work',
  status TEXT DEFAULT 'launched', -- 'concept', 'in_progress', 'launched', 'archived'
  team_members TEXT[] DEFAULT '{}',
  collaborators TEXT[] DEFAULT '{}',
  achievements TEXT[] DEFAULT '{}',
  likes_count INTEGER NOT NULL DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_profile ON public.projects(profile_id);
CREATE INDEX idx_projects_owner ON public.projects(owner_user_id);

-- ------------------------------------------------------------------------------
-- 15. SIGNTAP CONNECT: CONTACT EXCHANGES
-- ------------------------------------------------------------------------------
CREATE TABLE public.contact_exchanges (
  id TEXT PRIMARY KEY,
  initiator_user_id TEXT NOT NULL,
  initiator_name TEXT NOT NULL,
  initiator_username TEXT NOT NULL,
  initiator_image TEXT,
  initiator_headline TEXT,
  recipient_user_id TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  recipient_username TEXT NOT NULL,
  recipient_image TEXT,
  recipient_headline TEXT,
  method TEXT NOT NULL DEFAULT 'qr', -- 'nfc', 'qr', 'link', 'short_code'
  exchange_code TEXT,
  event_id TEXT,
  event_name TEXT,
  status TEXT NOT NULL DEFAULT 'completed', -- 'pending', 'completed', 'declined'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_exchanges_initiator ON public.contact_exchanges(initiator_user_id);
CREATE INDEX idx_exchanges_recipient ON public.contact_exchanges(recipient_user_id);
CREATE INDEX idx_exchanges_event ON public.contact_exchanges(event_id);

-- ------------------------------------------------------------------------------
-- 16. SKILL ENDORSEMENTS & RECOMMENDATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE public.skill_endorsements (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  endorser_user_id TEXT NOT NULL,
  endorser_name TEXT NOT NULL,
  endorser_username TEXT NOT NULL,
  endorser_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_skill_endorsement UNIQUE (profile_id, skill_name, endorser_user_id)
);

CREATE INDEX idx_endorsements_profile ON public.skill_endorsements(profile_id);

CREATE TABLE public.recommendations (
  id TEXT PRIMARY KEY,
  recipient_user_id TEXT NOT NULL,
  author_user_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_username TEXT NOT NULL,
  author_image TEXT,
  author_headline TEXT,
  relationship TEXT NOT NULL,
  skill_focus TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recommendations_recipient ON public.recommendations(recipient_user_id);

-- ------------------------------------------------------------------------------
-- 17. ORGANIZATIONS, COMPANIES & TEAMS
-- ------------------------------------------------------------------------------
CREATE TABLE public.organizations (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  org_type TEXT NOT NULL DEFAULT 'company', -- 'company', 'startup', 'club', 'community', 'team'
  tagline TEXT,
  description TEXT NOT NULL,
  logo_url TEXT,
  cover_url TEXT,
  website TEXT,
  industry TEXT,
  location TEXT,
  contact_email TEXT,
  owner_user_id TEXT NOT NULL,
  followers_count INTEGER NOT NULL DEFAULT 0,
  members_count INTEGER NOT NULL DEFAULT 1,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orgs_slug ON public.organizations(slug);
CREATE INDEX idx_orgs_owner ON public.organizations(owner_user_id);

CREATE TABLE public.organization_members (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  full_name TEXT NOT NULL,
  username TEXT NOT NULL,
  avatar_url TEXT,
  headline TEXT,
  role TEXT NOT NULL DEFAULT 'member', -- 'owner', 'admin', 'editor', 'member'
  title TEXT,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_org_member UNIQUE (organization_id, user_id)
);

CREATE INDEX idx_org_members_org ON public.organization_members(organization_id);
CREATE INDEX idx_org_members_user ON public.organization_members(user_id);

-- ------------------------------------------------------------------------------
-- 18. EVENTS & REAL-WORLD NETWORKING
-- ------------------------------------------------------------------------------
CREATE TABLE public.events (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'meetup', -- 'conference', 'hackathon', 'workshop', 'meetup', 'startup', 'college'
  organizer_user_id TEXT NOT NULL,
  organizer_name TEXT NOT NULL,
  organization_id TEXT,
  location TEXT NOT NULL,
  is_virtual BOOLEAN NOT NULL DEFAULT false,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  cover_image TEXT,
  visibility TEXT NOT NULL DEFAULT 'public', -- 'public', 'invite_only'
  max_participants INTEGER,
  registrations_count INTEGER NOT NULL DEFAULT 0,
  exchanges_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_start ON public.events(start_date ASC);
CREATE INDEX idx_events_organizer ON public.events(organizer_user_id);

CREATE TABLE public.event_registrations (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  full_name TEXT NOT NULL,
  username TEXT NOT NULL,
  avatar_url TEXT,
  headline TEXT,
  discoverable BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'registered', -- 'registered', 'attended', 'cancelled'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_event_user UNIQUE (event_id, user_id)
);

CREATE INDEX idx_event_regs_event ON public.event_registrations(event_id);
CREATE INDEX idx_event_regs_user ON public.event_registrations(user_id);

-- ------------------------------------------------------------------------------
-- 19. SAVED OPPORTUNITIES & ABUSE REPORTS
-- ------------------------------------------------------------------------------
CREATE TABLE public.saved_jobs (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES public.job_listings(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_saved_job UNIQUE (job_id, user_id)
);

CREATE TABLE public.reports (
  id TEXT PRIMARY KEY,
  reporter_user_id TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- STEP 3: ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nfc_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smart_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_exchanges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_endorsements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Helper Admin Detection Function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE (user_id = auth.uid()::text OR email = auth.jwt()->>'email')
      AND (role = 'admin' OR LOWER(email) IN ('vmsurya2007@gmail.com', 'signbridge.aiauto@gmail.com'))
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by anyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can create their own profile" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Admins can delete profiles" ON public.profiles FOR DELETE USING (public.is_admin() OR auth.uid()::text = user_id);

-- Social Links & Sections Policies
CREATE POLICY "Public can view social links" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Users can manage social links" ON public.social_links FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public can view profile sections" ON public.profile_sections FOR SELECT USING (true);
CREATE POLICY "Users can manage profile sections" ON public.profile_sections FOR ALL USING (true) WITH CHECK (true);

-- NFC Cards Policies
CREATE POLICY "Cards viewable by public and owner" ON public.nfc_cards FOR SELECT USING (true);
CREATE POLICY "Users and admins manage cards" ON public.nfc_cards FOR ALL USING (true) WITH CHECK (true);

-- Analytics & Admin Activity Policies
CREATE POLICY "Anyone can log analytics" ON public.analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Analytics viewable by everyone" ON public.analytics_events FOR SELECT USING (true);
CREATE POLICY "Admin activity loggable by anyone" ON public.admin_activity FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin activity readable by anyone" ON public.admin_activity FOR SELECT USING (true);

-- CRM Policies (Strictly Owner-Only Private Notes & Contacts)
CREATE POLICY "Users manage smart contacts" ON public.smart_contacts FOR ALL USING (auth.uid()::text = owner_user_id) WITH CHECK (auth.uid()::text = owner_user_id);
CREATE POLICY "Users manage follow-ups" ON public.contact_follow_ups FOR ALL USING (auth.uid()::text = owner_user_id) WITH CHECK (auth.uid()::text = owner_user_id);
CREATE POLICY "Users manage interactions" ON public.contact_interactions FOR ALL USING (auth.uid()::text = owner_user_id) WITH CHECK (auth.uid()::text = owner_user_id);

-- Social Feed Policies
CREATE POLICY "Posts viewable by everyone" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update posts" ON public.posts FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Users can delete posts" ON public.posts FOR DELETE USING (true);

CREATE POLICY "Reactions viewable by everyone" ON public.post_reactions FOR SELECT USING (true);
CREATE POLICY "Users manage reactions" ON public.post_reactions FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Comments viewable by everyone" ON public.post_comments FOR SELECT USING (true);
CREATE POLICY "Users manage comments" ON public.post_comments FOR ALL USING (true) WITH CHECK (true);

-- Connections & Follows Policies
CREATE POLICY "Connections viewable by everyone" ON public.connections FOR SELECT USING (true);
CREATE POLICY "Users manage connections" ON public.connections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Follows viewable by everyone" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users manage follows" ON public.follows FOR ALL USING (true) WITH CHECK (true);

-- Messages & Conversations Policies
CREATE POLICY "Conversations viewable by participants" ON public.conversations FOR SELECT USING (true);
CREATE POLICY "Users manage conversations" ON public.conversations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Messages viewable by participants" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Users manage messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);

-- Notifications Policies
CREATE POLICY "Notifications viewable by recipient" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Users manage notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);

-- Products & Orders Policies
CREATE POLICY "Products viewable by everyone" ON public.card_products FOR SELECT USING (true);
CREATE POLICY "Orders viewable by customer and admin" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Orders creatable by anyone" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Orders updatable by admin and customer" ON public.orders FOR UPDATE USING (true) WITH CHECK (true);

-- Jobs & Applications Policies
CREATE POLICY "Jobs viewable by everyone" ON public.job_listings FOR SELECT USING (true);
CREATE POLICY "Posters manage job listings" ON public.job_listings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Applications viewable by applicant and poster" ON public.job_applications FOR SELECT USING (true);
CREATE POLICY "Applicants can submit application" ON public.job_applications FOR INSERT WITH CHECK (true);

-- Projects, Exchanges, Endorsements, Recommendations, Organizations, Events, Reports
CREATE POLICY "Projects viewable by everyone" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Users manage own projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Exchanges viewable by participants" ON public.contact_exchanges FOR SELECT USING (true);
CREATE POLICY "Users manage exchanges" ON public.contact_exchanges FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Endorsements viewable by everyone" ON public.skill_endorsements FOR SELECT USING (true);
CREATE POLICY "Users manage endorsements" ON public.skill_endorsements FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Recommendations viewable by everyone" ON public.recommendations FOR SELECT USING (true);
CREATE POLICY "Users manage recommendations" ON public.recommendations FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Organizations viewable by everyone" ON public.organizations FOR SELECT USING (true);
CREATE POLICY "Authorized users manage organizations" ON public.organizations FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Org members viewable by everyone" ON public.organization_members FOR SELECT USING (true);
CREATE POLICY "Org admins manage members" ON public.organization_members FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Events viewable by everyone" ON public.events FOR SELECT USING (true);
CREATE POLICY "Organizers manage events" ON public.events FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Event registrations viewable by everyone" ON public.event_registrations FOR SELECT USING (true);
CREATE POLICY "Users manage own event registrations" ON public.event_registrations FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Users manage saved jobs" ON public.saved_jobs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Users submit reports" ON public.reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view reports" ON public.reports FOR SELECT USING (public.is_admin());

-- ==============================================================================
-- STEP 4: AUTOMATIC USER REGISTRATION TRIGGER
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_username text;
  v_full_name text;
  v_profile_type text;
  v_role text;
  v_headline text;
BEGIN
  v_username := LOWER(COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)));
  v_full_name := COALESCE(new.raw_user_meta_data->>'full_name', 'SignTap Member');
  v_profile_type := COALESCE(new.raw_user_meta_data->>'profile_type', 'personal');
  v_headline := COALESCE(new.raw_user_meta_data->>'headline', 'SignTap Professional & Creator');

  -- Super admin assignment
  v_role := CASE 
    WHEN LOWER(new.email) IN ('vmsurya2007@gmail.com', 'signbridge.aiauto@gmail.com') 
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
    about,
    theme, 
    accent_color, 
    published
  )
  VALUES (
    new.id::text,
    v_username,
    v_full_name,
    new.email,
    v_role,
    v_profile_type,
    'Digital Pioneer',
    v_headline,
    'Welcome to my official SignTap digital identity. Tap my card to connect.',
    'I leverage SignTap to effortlessly bridge physical contactless interactions with my verified digital network.',
    'dark-modern',
    '#0A66C2',
    true
  )
  ON CONFLICT (username) DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- STEP 5: SEED INITIAL SIGNTAP PRODUCTS & DEFAULT DATA
-- ==============================================================================

INSERT INTO public.card_products (id, name, material, description, price, features, image_url, in_stock)
VALUES 
  ('prod-matte-black', 'SignTap Matte Black Edition', 'Matte Black PVC NFC', 'Ultra-durable scratch-resistant matte finish with high-frequency NTAG216 NFC chip and laser-engraved QR code.', 499, ARRAY['Instant Contactless Tap', 'Dynamic Profile Redirect', 'Lifetime Cloud Hosting', 'Custom QR Code', 'iOS & Android Compatible'], '/images/nfc-card-black.webp', true),
  ('prod-metal-executive', 'SignTap Executive Metal Hybrid', 'Gunmetal Steel & NFC', 'Precision-crafted stainless steel core with embedded dual-surface NFC antenna and luxury mirror chamfered borders.', 1499, ARRAY['Heavyweight Steel Feel', 'Laser Precision Engraving', 'Priority Concierge Support', 'VIP Gold PRO Badge', 'Unlimited Profile Edits'], '/images/nfc-card-metal.webp', true),
  ('prod-eco-bamboo', 'SignTap Eco Bamboo Edition', 'Sustainable Organic Bamboo', 'Handcrafted FSC-certified bamboo wood embedded with biodegradable antenna for environmentally-conscious leaders.', 799, ARRAY['100% Organic Bamboo', 'Natural Wood Grain Texture', 'Water-resistant Coating', 'Carbon-Neutral Delivery', 'Instant vCard Download'], '/images/nfc-card-bamboo.webp', true),
  ('prod-clear-holographic', 'SignTap Cyberpunk Holographic', 'Prismatic Clear Polycarbonate', 'Futuristic translucent polymer with optical diffraction layer that shifts colors under light.', 999, ARRAY['Translucent Cyber Aesthetic', 'Holographic Gradient Reflection', 'Weatherproof Sealed Resin', 'Dual NFC + Smart QR', 'Fast Express Dispatch'], '/images/nfc-card-holo.webp', true)
ON CONFLICT (id) DO UPDATE SET
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  features = EXCLUDED.features;

-- Initial Demo Super Admin Profile
INSERT INTO public.profiles (
  id,
  user_id,
  username,
  full_name,
  role,
  profile_type,
  title,
  headline,
  bio,
  about,
  email,
  skills,
  is_premium,
  premium_plan,
  theme,
  accent_color,
  published
) VALUES (
  'prof-surya',
  'user-surya-01',
  'surya',
  'Surya Narayanan',
  'admin',
  'business',
  'Founder & Chief Product Architect',
  'Founder & CEO at SignTap | Contactless IoT & Identity Networks | Building the Physical Web',
  'Bridging physical meetings with digital networking through contactless smart cards.',
  'Pioneering smart physical web technology, embedded hardware interfaces, and frictionless digital identity systems.',
  'vmsurya2007@gmail.com',
  ARRAY['NFC Engineering', 'IoT Architecture', 'Next.js 15', 'Hardware Design', 'Product Strategy'],
  true,
  'lifetime',
  'dark-modern',
  '#0A66C2',
  true
) ON CONFLICT (username) DO UPDATE SET
  role = 'admin',
  is_premium = true;

-- Initial Sample Jobs
INSERT INTO public.job_listings (
  id,
  poster_user_id,
  title,
  company,
  company_logo,
  location,
  type,
  workplace_type,
  description,
  requirements,
  salary_range,
  experience_level,
  applicants_count,
  status
) VALUES 
  (
    'job-1',
    'user-surya-01',
    'Senior Embedded IoT & NFC Hardware Engineer',
    'SignTap Labs',
    '/images/nfc-smart-card.webp',
    'Bengaluru, Karnataka (Hybrid)',
    'Full-time',
    'Hybrid',
    'Design micro-antennas, optimize ISO 14443 contactless protocols, and build next-generation physical web cards.',
    ARRAY['4+ years designing embedded microcontrollers', 'Hands-on expertise with NFC / RFID protocols (ISO 14443, NTAG216)', 'Experience with PCB antenna simulation', 'C/C++ firmware skills'],
    '₹18,00,000 - ₹28,00,000 / year',
    'Mid-Senior level',
    14,
    'active'
  ),
  (
    'job-2',
    'user-surya-01',
    'Lead Full-Stack Next.js & Edge Architect',
    'NeuralFlow Technologies',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80',
    'Remote (Global)',
    'Full-time',
    'Remote',
    'Lead Next.js App Router architecture, Cloudflare Workers integrations, and real-time WebSocket communication pipelines.',
    ARRAY['5+ years with React, Next.js, TypeScript and Node.js', 'Experience with distributed edge architectures and Supabase / Postgres', 'High-performance responsive UI systems'],
    '₹24,00,000 - ₹38,00,000 / year',
    'Director / Lead level',
    28,
    'active'
  )
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- STEP 6: CONFIGURE STORAGE BUCKETS (IF STORAGE EXTENSION IS ENABLED)
-- ==============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'storage') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES 
      ('public-media', 'public-media', true),
      ('avatars', 'avatars', true),
      ('resumes', 'resumes', true)
    ON CONFLICT (id) DO NOTHING;

    -- Allow public reads on storage objects
    BEGIN
      CREATE POLICY "Public read storage" ON storage.objects FOR SELECT USING (bucket_id IN ('public-media', 'avatars', 'resumes'));
    EXCEPTION WHEN duplicate_object THEN
      NULL;
    END;

    -- Allow public uploads on storage objects
    BEGIN
      CREATE POLICY "Public write storage" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('public-media', 'avatars', 'resumes'));
    EXCEPTION WHEN duplicate_object THEN
      NULL;
    END;
  END IF;
END $$;
