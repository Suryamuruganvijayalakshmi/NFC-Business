'use client';

import { 
  Profile, 
  ProfileSection, 
  PortfolioProject, 
  SocialLink, 
  NFCCard, 
  NFCCardStatus,
  AnalyticsEvent, 
  AnalyticsEventType,
  AnalyticsSummary,
  UserSession,
  Product,
  Order,
  OrderStatus,
  PaymentStatus,
  AdminActivity,
  Connection,
  ConnectionStatus,
  Follow,
  PostItem,
  PostComment,
  ReactionType,
  PostReaction,
  PostMediaType,
  WorkExperience,
  EducationItem,
  CertificationItem,
  AchievementItem,
  BusinessEntity,
  LanguageItem,
  CustomLinkItem,
  SmartContact,
  ContactFollowUp,
  ContactInteraction,
  FollowUpPriority,
  FollowUpStatus,
  InteractionType,
  ChatMessage,
  ChatConversation,
  AppNotification,
  NotificationType,
  JobListing,
  JobApplication,
  JobType,
  WorkplaceType
} from './types';
export type { AppNotification, NotificationType, ReactionType, PostReaction, JobListing, JobApplication };
import { 
  INITIAL_PROFILES, 
  INITIAL_SECTIONS, 
  INITIAL_PROJECTS, 
  INITIAL_LINKS, 
  INITIAL_NFC_CARDS, 
  INITIAL_ANALYTICS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_ADMIN_ACTIVITIES,
  INITIAL_CONNECTIONS,
  INITIAL_POSTS,
  INITIAL_POST_COMMENTS,
  DEFAULT_CONTACT_CATEGORIES,
  INITIAL_SMART_CONTACTS,
  INITIAL_CONTACT_INTERACTIONS,
  INITIAL_FOLLOW_UPS,
  INITIAL_NOTIFICATIONS
} from './initialData';
import { supabase, isSupabaseConfigured } from './supabase';
import { sanitizeUrl, sanitizeCsvCell, isAnalyticsRateLimited } from './security';

const STORAGE_KEYS = {
  USER: 'sb_current_user',
  PROFILES: 'sb_profiles',
  SECTIONS: 'sb_sections',
  PROJECTS: 'sb_projects',
  LINKS: 'sb_links',
  CARDS: 'sb_cards',
  PRODUCTS: 'sb_products',
  ORDERS: 'sb_orders',
  ANALYTICS: 'sb_analytics',
  ADMIN_ACTIVITY: 'sb_admin_activity',
  CONNECTIONS: 'sb_connections',
  FOLLOWS: 'sb_follows',
  POSTS: 'sb_posts',
  POST_COMMENTS: 'sb_post_comments',
  CRM_CONTACTS: 'sb_crm_contacts',
  CRM_FOLLOWUPS: 'sb_crm_followups',
  CRM_INTERACTIONS: 'sb_crm_interactions',
  CRM_CATEGORIES: 'sb_crm_categories',
  MESSAGES: 'sb_chat_messages',
  NOTIFICATIONS: 'sb_notifications',
  JOBS: 'sb_jobs',
  JOB_APPLICATIONS: 'sb_job_applications',
  POST_REACTIONS: 'sb_post_reactions',
};

export const INITIAL_JOBS: JobListing[] = [
  {
    id: 'job-1',
    poster_user_id: 'user-surya-01',
    title: 'Senior Embedded IoT & NFC Hardware Engineer',
    company: 'SignTap Labs',
    company_logo: '/images/nfc-smart-card.webp',
    location: 'Bengaluru, Karnataka (Hybrid)',
    type: 'Full-time',
    workplace_type: 'Hybrid',
    description: 'We are looking for an experienced Embedded Systems & RF Hardware Engineer to architect next-generation NFC contactless cards and physical web devices. You will design micro-antennas, optimize ISO 14443 protocols, and collaborate with our cloud web engineers.',
    requirements: [
      '4+ years designing embedded microcontrollers (ARM, ESP32, STM32)',
      'Hands-on expertise with NFC / RFID protocols (ISO 14443, ISO 15693, NTAG216)',
      'Experience with PCB antenna simulation and impedance matching',
      'Strong C/C++ firmware programming skills'
    ],
    salary_range: '₹18,00,000 - ₹28,00,000 / year',
    experience_level: 'Mid-Senior level',
    applicants_count: 14,
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'job-2',
    poster_user_id: 'user-alex-03',
    title: 'Lead Full-Stack Next.js & Edge Systems Architect',
    company: 'NeuralFlow Technologies',
    company_logo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80',
    location: 'Remote (Global)',
    type: 'Full-time',
    workplace_type: 'Remote',
    description: 'Join NeuralFlow to build real-time AI agents and low-latency edge gateways. You will lead Next.js 15 App Router architecture, Cloudflare Workers integrations, and real-time WebSocket communication pipelines.',
    requirements: [
      '5+ years with React, Next.js, TypeScript and Node.js',
      'Experience with distributed edge architectures and Supabase / Postgres',
      'Proven track record with high-performance responsive UI systems',
      'Knowledge of WebSockets, Server-Sent Events, or WebRTC'
    ],
    salary_range: '₹24,00,000 - ₹38,00,000 / year',
    experience_level: 'Director / Lead level',
    applicants_count: 28,
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'job-3',
    poster_user_id: 'user-elena-02',
    title: 'Senior Brand & 3D Interactive Motion Designer',
    company: 'Studio Rostova',
    company_logo: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=400&q=80',
    location: 'Remote / Berlin',
    type: 'Contract',
    workplace_type: 'Remote',
    description: 'We are seeking an imaginative visual brand designer to craft physical packaging, 3D interactive web experiences (Three.js/WebGL), and spatial motion identities for premier tech hardware brands.',
    requirements: [
      '3+ years in interactive digital product design and branding',
      'Strong portfolio in Blender / Cinema 4D and WebGL / Spline',
      'Obsessive attention to typography, micro-interactions, and lighting',
      'Ability to translate physical industrial design into digital web representations'
    ],
    salary_range: '₹14,00,000 - ₹22,00,000 / year',
    experience_level: 'Mid-Senior level',
    applicants_count: 9,
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 7).toISOString()
  }
];

// Helper to access localStorage safely
function getLocalItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e);
  }
}

// -----------------------------------------------------------------------------
// Authentication
// -----------------------------------------------------------------------------
export function getCurrentUser(): UserSession | null {
  return getLocalItem<UserSession | null>(STORAGE_KEYS.USER, null);
}

export function setCurrentUser(user: UserSession | null): void {
  setLocalItem(STORAGE_KEYS.USER, user);
}

/**
 * Master Super Admin Accounts
 * Strictly restricted to vmsurya2007@gmail.com and signbridge.aiauto@gmail.com
 */
export const AUTHORIZED_SUPER_ADMIN_EMAILS = [
  'vmsurya2007@gmail.com',
  'vmsuurya2007@gmail.com', // handle user typo
  'signbridge.aiauto@gmail.com',
];

export function isSuperAdminUser(user: UserSession | null | undefined): boolean {
  if (!user || !user.email) return false;
  const email = user.email.toLowerCase().trim();
  return AUTHORIZED_SUPER_ADMIN_EMAILS.includes(email);
}

export async function loginUser(email: string, password?: string): Promise<{ user: UserSession | null; error?: string }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password: password || '' 
      });
      if (error) return { user: null, error: error.message };
      if (data.user) {
        const user: UserSession = {
          id: data.user.id,
          email: data.user.email || email,
          role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
          user_metadata: data.user.user_metadata,
        };
        setCurrentUser(user);
        return { user };
      }
    } catch (err: any) {
      console.warn('Supabase login error, checking local store:', err);
    }
  }

  // Local demo fallback
  const profiles = getAllProfiles();
  const matchedProfile = profiles.find(p => p.email.toLowerCase() === email.toLowerCase());

  const user: UserSession = {
    id: matchedProfile ? matchedProfile.user_id : `user-${Date.now()}`,
    email: email,
    role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
    user_metadata: {
      full_name: matchedProfile ? matchedProfile.full_name : 'SignBridge Pioneer',
      username: matchedProfile ? matchedProfile.username : email.split('@')[0],
      profile_type: matchedProfile ? matchedProfile.profile_type : 'personal',
    }
  };

  setCurrentUser(user);
  return { user };
}

export async function loginWithGoogle(): Promise<{ url?: string; error?: string }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback`
        : (process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` : 'https://nfc.signbridge.click/auth/callback');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) return { error: error.message };

      if (data?.url) {
        if (typeof window !== 'undefined') {
          window.location.href = data.url;
        }
        return { url: data.url };
      }

      return { error: 'Failed to generate Google sign-in redirect.' };
    } catch (err: any) {
      return { error: err?.message || 'Google authentication failed' };
    }
  }

  return { error: 'Supabase authentication is not configured.' };
}

export async function signUpUser(
  email: string, 
  password: string, 
  fullName: string, 
  username: string, 
  profileType: any
): Promise<{ user: UserSession | null; error?: string }> {
  // Check unique username in local store
  const profiles = getAllProfiles();
  if (profiles.some(p => p.username.toLowerCase() === username.toLowerCase())) {
    return { user: null, error: 'Username is already taken. Please choose another.' };
  }

  let userId = `user-${Date.now()}`;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username: username.toLowerCase().trim(),
            profile_type: profileType,
          }
        }
      });
      if (error) return { user: null, error: error.message };
      if (data.user) {
        userId = data.user.id;
      }
    } catch (e: any) {
      console.warn('Supabase sign up warning, persisting locally:', e);
    }
  }

  const newProfile: Profile = {
    id: `prof-${Date.now()}`,
    user_id: userId,
    username: username.toLowerCase().trim(),
    full_name: fullName,
    profile_type: profileType,
    title: 'Digital Identity Pioneer',
    bio: 'Welcome to my SignBridge profile. Tap my NFC Smart Card or connect below.',
    profile_image: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName || username)}&backgroundColor=087cf0,923cf6,0d9488,f59e0b&textColor=ffffff`,
    cover_image: '',
    email,
    theme: 'signature',
    accent_color: '#087CF0',
    button_style: 'rounded',
    font_family: 'sans',
    background_style: 'navy_grid',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  saveProfile(newProfile);

  // Generate initial pending/provisioned NFC Card reference
  const newCard: NFCCard = {
    id: `card-${Date.now()}`,
    card_uid: `SB-NFC-${Math.floor(1000 + Math.random() * 9000)}`,
    activation_code: `ACT-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 4).toUpperCase()}`,
    owner_user_id: userId,
    profile_id: newProfile.id,
    card_name: `${fullName}'s Smart Card`,
    status: 'activated',
    tap_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  saveNFCCard(newCard);

  const user: UserSession = {
    id: userId,
    email,
    role: 'user',
    user_metadata: {
      full_name: fullName,
      username: newProfile.username,
      profile_type: profileType,
    }
  };

  setCurrentUser(user);
  return { user };
}

export function logoutUser(): void {
  if (isSupabaseConfigured && supabase) {
    supabase.auth.signOut().catch(console.error);
  }
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEYS.USER);
  }
}

// -----------------------------------------------------------------------------
// Profiles
// -----------------------------------------------------------------------------
export function getAllProfiles(): Profile[] {
  return getLocalItem<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
}

export function getProfileByUsername(username: string): Profile | null {
  const profiles = getAllProfiles();
  return profiles.find(p => p.username.toLowerCase() === username.toLowerCase()) || null;
}

export function getProfileByUserId(userId: string): Profile | null {
  const profiles = getAllProfiles();
  return profiles.find(p => p.user_id === userId) || null;
}

export function getOrCreateProfileForUser(user: UserSession): Profile {
  const existing = getProfileByUserId(user.id);
  if (existing) return existing;

  // Check by email to match if user exists
  const profiles = getAllProfiles();
  const byEmail = profiles.find(p => p.email && user.email && p.email.toLowerCase() === user.email.toLowerCase());
  if (byEmail) {
    byEmail.user_id = user.id;
    saveProfile(byEmail);
    return byEmail;
  }

  // Generate unique username
  let baseUsername = user.user_metadata?.username || user.email?.split('@')[0].replace(/[^a-z0-9_-]/g, '').toLowerCase() || `user_${Date.now().toString().slice(-4)}`;
  let uniqueUsername = baseUsername;
  let counter = 1;
  while (profiles.some(p => p.username.toLowerCase() === uniqueUsername.toLowerCase() && p.user_id !== user.id)) {
    uniqueUsername = `${baseUsername}_${counter}`;
    counter++;
  }

  const newProfile: Profile = {
    id: `prof-${Date.now()}`,
    user_id: user.id,
    username: uniqueUsername,
    full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'SignTap Member',
    profile_type: user.user_metadata?.profile_type || 'professional',
    title: 'Professional & Innovator',
    headline: `${user.user_metadata?.full_name || 'SignTap Member'} | Professional Digital Identity`,
    bio: 'Welcome to my official digital identity page. Connect with me or tap my NFC card.',
    about: '',
    profile_image: (user.user_metadata as any)?.avatar_url || (user.user_metadata as any)?.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.user_metadata?.full_name || uniqueUsername)}&backgroundColor=087cf0,923cf6,0d9488,f59e0b&textColor=ffffff`,
    cover_image: '',
    email: user.email || '',
    phone: '',
    location: '',
    website: '',
    company: '',
    experiences: [],
    education: [],
    certifications: [],
    achievements: [],
    businesses: [],
    services: [],
    skills: [],
    languages: [{ id: `lang-${Date.now()}`, language: 'English', proficiency: 'Professional' }],
    custom_links: [],
    professional_interests: [],
    connections_count: 0,
    followers_count: 0,
    theme: 'signature',
    accent_color: '#087CF0',
    button_style: 'rounded',
    font_family: 'sans',
    background_style: 'navy_grid',
    published: true,
    section_visibility: {
      bio: true,
      contact: true,
      socials: true,
      skills: true,
      services: true,
      portfolio: true,
      experience: true,
      education: true,
      certifications: true,
      achievements: true,
      businesses: true,
      languages: true,
      activity: true
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  saveProfile(newProfile);

  // Automatically provision a fresh NFC Card for this user with 0 taps
  const cardUid = `ST-NFC-${Math.floor(1000 + Math.random() * 9000)}`;
  const newCard: NFCCard = {
    id: `card-${Date.now()}`,
    card_uid: cardUid,
    activation_code: `ACT-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 4).toUpperCase()}`,
    owner_user_id: user.id,
    profile_id: newProfile.id,
    card_name: `${newProfile.full_name}'s Smart Card`,
    status: 'activated',
    tap_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  saveNFCCard(newCard);

  return newProfile;
}

/**
 * Read-only local cache updater for public profile visitors.
 * Does NOT upsert to Supabase or mutate owner data.
 * Checks timestamp freshness to prevent stale remote data from overwriting local changes.
 */
export function cacheProfileLocally(profile: Profile): void {
  const profiles = getAllProfiles();
  const index = profiles.findIndex(p => p.id === profile.id || p.username.toLowerCase() === profile.username.toLowerCase());
  if (index >= 0) {
    const existing = profiles[index];
    const existingTime = new Date(existing.updated_at || 0).getTime();
    const incomingTime = new Date(profile.updated_at || 0).getTime();
    
    // If existing local profile has a newer update timestamp, preserve local edits!
    if (existingTime > incomingTime && (existing.full_name || existing.profile_image)) {
      return;
    }
    profiles[index] = { ...profiles[index], ...profile };
  } else {
    profiles.push(profile);
  }
  setLocalItem(STORAGE_KEYS.PROFILES, profiles);
}

export function saveProfile(profile: Profile): void {
  // Security / IDOR Guard: Verify that currentUser owns this profile or is an admin
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.role !== 'admin' && profile.user_id && currentUser.id !== profile.user_id) {
    // Permit update if currentUser email matches profile email (handles OAuth UUID vs local user ID mapping)
    const emailMatches = currentUser.email && profile.email && currentUser.email.toLowerCase() === profile.email.toLowerCase();
    if (!emailMatches) {
      console.warn(`[Security IDOR] Unauthorized attempt by ${currentUser.id} to save profile ${profile.id} (${profile.user_id})`);
      return;
    }
  }

  const profiles = getAllProfiles();
  const index = profiles.findIndex(p => p.id === profile.id || p.username.toLowerCase() === profile.username.toLowerCase());
  
  // Sanitize all URLs to prevent XSS (javascript:, data:, vbscript:)
  const updatedProfile: Profile = {
    ...profile,
    website: profile.website ? sanitizeUrl(profile.website) : undefined,
    portfolio_url: profile.portfolio_url ? sanitizeUrl(profile.portfolio_url) : undefined,
    resume_url: profile.resume_url ? sanitizeUrl(profile.resume_url) : undefined,
    custom_links: Array.isArray(profile.custom_links) 
      ? profile.custom_links.map(cl => ({ ...cl, url: sanitizeUrl(cl.url) }))
      : [],
    updated_at: new Date().toISOString(),
  };

  if (index >= 0) {
    profiles[index] = updatedProfile;
  } else {
    profiles.push(updatedProfile);
  }

  setLocalItem(STORAGE_KEYS.PROFILES, profiles);

  // Sync to live Supabase if configured
  if (isSupabaseConfigured && supabase) {
    const packedVisibility = {
      ...(updatedProfile.section_visibility || {}),
      _extended: {
        headline: updatedProfile.headline,
        about: updatedProfile.about,
        experiences: updatedProfile.experiences,
        education: updatedProfile.education,
        certifications: updatedProfile.certifications,
        achievements: updatedProfile.achievements,
        businesses: updatedProfile.businesses,
        services: updatedProfile.services,
        languages: updatedProfile.languages,
        custom_links: updatedProfile.custom_links,
        is_premium: updatedProfile.is_premium,
        premium_plan: updatedProfile.premium_plan,
        premium_expires_at: updatedProfile.premium_expires_at,
      }
    };

    Promise.resolve(
      supabase.from('profiles').upsert({
        username: updatedProfile.username,
        full_name: updatedProfile.full_name,
        profile_type: updatedProfile.profile_type,
        title: updatedProfile.title,
        bio: updatedProfile.bio,
        profile_image: updatedProfile.profile_image,
        cover_image: updatedProfile.cover_image,
        location: updatedProfile.location,
        email: updatedProfile.email,
        phone: updatedProfile.phone,
        website: updatedProfile.website,
        company: updatedProfile.company,
        business_name: updatedProfile.business_name,
        business_description: updatedProfile.business_description,
        whatsapp_number: updatedProfile.whatsapp_number,
        portfolio_url: updatedProfile.portfolio_url,
        resume_url: updatedProfile.resume_url,
        skills: updatedProfile.skills,
        theme: updatedProfile.theme,
        accent_color: updatedProfile.accent_color,
        button_style: updatedProfile.button_style,
        font_family: updatedProfile.font_family,
        background_style: updatedProfile.background_style,
        published: updatedProfile.published,
        section_visibility: packedVisibility,
        updated_at: updatedProfile.updated_at,
      }, { onConflict: 'username' })
    ).catch(err => {
      console.warn('Supabase profile sync notice:', err);
    });
  }
}

export function updateProfileVisibility(profileId: string, published: boolean): void {
  const profiles = getAllProfiles();
  const index = profiles.findIndex(p => p.id === profileId);
  if (index >= 0) {
    profiles[index].published = published;
    profiles[index].updated_at = new Date().toISOString();
    setLocalItem(STORAGE_KEYS.PROFILES, profiles);
  }
}

// -----------------------------------------------------------------------------
// Profile Sections
// -----------------------------------------------------------------------------
export function getSectionsByProfileId(profileId: string): ProfileSection[] {
  const allSections = getLocalItem<ProfileSection[]>(STORAGE_KEYS.SECTIONS, INITIAL_SECTIONS);
  return allSections.filter(s => s.profile_id === profileId).sort((a, b) => a.display_order - b.display_order);
}

export function saveSection(section: ProfileSection): void {
  const allSections = getLocalItem<ProfileSection[]>(STORAGE_KEYS.SECTIONS, INITIAL_SECTIONS);
  const index = allSections.findIndex(s => s.id === section.id);
  if (index >= 0) {
    allSections[index] = section;
  } else {
    allSections.push(section);
  }
  setLocalItem(STORAGE_KEYS.SECTIONS, allSections);
}

export function deleteSection(sectionId: string): void {
  const allSections = getLocalItem<ProfileSection[]>(STORAGE_KEYS.SECTIONS, INITIAL_SECTIONS);
  const filtered = allSections.filter(s => s.id !== sectionId);
  setLocalItem(STORAGE_KEYS.SECTIONS, filtered);
}

// -----------------------------------------------------------------------------
// Portfolio Projects
// -----------------------------------------------------------------------------
export function getProjectsByProfileId(profileId: string): PortfolioProject[] {
  const allProjects = getLocalItem<PortfolioProject[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  return allProjects.filter(p => p.profile_id === profileId).sort((a, b) => a.display_order - b.display_order);
}

export function saveProject(project: PortfolioProject): void {
  const safeProject: PortfolioProject = {
    ...project,
    project_url: project.project_url ? sanitizeUrl(project.project_url) : '',
  };
  const allProjects = getLocalItem<PortfolioProject[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  const index = allProjects.findIndex(p => p.id === safeProject.id);
  if (index >= 0) {
    allProjects[index] = safeProject;
  } else {
    allProjects.push(safeProject);
  }
  setLocalItem(STORAGE_KEYS.PROJECTS, allProjects);
}

export function deleteProject(projectId: string): void {
  const allProjects = getLocalItem<PortfolioProject[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  const filtered = allProjects.filter(p => p.id !== projectId);
  setLocalItem(STORAGE_KEYS.PROJECTS, filtered);
}

// -----------------------------------------------------------------------------
// Social Links
// -----------------------------------------------------------------------------
export function getLinksByProfileId(profileId: string): SocialLink[] {
  const allLinks = getLocalItem<SocialLink[]>(STORAGE_KEYS.LINKS, INITIAL_LINKS);
  return allLinks.filter(l => l.profile_id === profileId).sort((a, b) => a.display_order - b.display_order);
}

export function saveLink(link: SocialLink): void {
  const safeLink: SocialLink = {
    ...link,
    url: sanitizeUrl(link.url),
  };
  const allLinks = getLocalItem<SocialLink[]>(STORAGE_KEYS.LINKS, INITIAL_LINKS);
  const index = allLinks.findIndex(l => l.id === safeLink.id);
  if (index >= 0) {
    allLinks[index] = safeLink;
  } else {
    allLinks.push(safeLink);
  }
  setLocalItem(STORAGE_KEYS.LINKS, allLinks);
}

export function deleteLink(linkId: string): void {
  const allLinks = getLocalItem<SocialLink[]>(STORAGE_KEYS.LINKS, INITIAL_LINKS);
  const filtered = allLinks.filter(l => l.id !== linkId);
  setLocalItem(STORAGE_KEYS.LINKS, filtered);
}

// -----------------------------------------------------------------------------
// Products
// -----------------------------------------------------------------------------
export function getAllProducts(): Product[] {
  const prods = getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const valid = prods.filter(p => p.id === 'prod-business' || p.id === 'prod-personal');
  if (valid.length !== 2) {
    setLocalItem(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  }
  return valid;
}

export function getProductById(productId: string): Product | null {
  const products = getAllProducts();
  return products.find(p => p.id === productId) || null;
}

export function saveProduct(product: Product): void {
  const products = getAllProducts();
  const index = products.findIndex(p => p.id === product.id);
  if (index >= 0) {
    products[index] = { ...product, updated_at: new Date().toISOString() };
  } else {
    products.push(product);
  }
  setLocalItem(STORAGE_KEYS.PRODUCTS, products);
}

export function updateProductPrice(productId: string, newPrice: number): void {
  const products = getAllProducts();
  const index = products.findIndex(p => p.id === productId);
  if (index >= 0) {
    products[index].price = newPrice;
    products[index].updated_at = new Date().toISOString();
    setLocalItem(STORAGE_KEYS.PRODUCTS, products);
    logAdminActivity('Price Updated', `Updated price of ${products[index].name} to $${newPrice}`);
  }
}

// -----------------------------------------------------------------------------
// Orders Management
// -----------------------------------------------------------------------------
export function getAllOrders(): Order[] {
  return getLocalItem<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
}

export function getOrdersByUserId(userId: string): Order[] {
  const orders = getAllOrders();
  return orders.filter(o => o.user_id === userId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getOrderById(orderId: string): Order | null {
  const orders = getAllOrders();
  return orders.find(o => o.id === orderId || o.order_number.toLowerCase() === orderId.toLowerCase()) || null;
}

export function createOrder(orderData: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>): Order {
  const orders = getAllOrders();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const newOrder: Order = {
    ...orderData,
    id: `ord-${Date.now()}`,
    order_number: `SBN-${new Date().getFullYear()}-${randomSuffix}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  orders.unshift(newOrder);
  setLocalItem(STORAGE_KEYS.ORDERS, orders);

  // Automatically provision a pending NFC card entry for this order
  const newCardUID = `SB-NFC-${randomSuffix}`;
  const newCard: NFCCard = {
    id: `card-${Date.now()}`,
    card_uid: newCardUID,
    activation_code: `ACT-${randomSuffix}-${Math.random().toString(36).substring(2, 4).toUpperCase()}`,
    owner_user_id: newOrder.user_id,
    profile_id: null,
    card_name: `${newOrder.customer_name}'s NFC Card`,
    status: 'in_production',
    order_reference: newOrder.order_number,
    tap_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  saveNFCCard(newCard);

  // Sync order to Supabase orders table if configured
  if (isSupabaseConfigured && supabase) {
    const shippingStr = typeof newOrder.shipping_address === 'string'
      ? newOrder.shipping_address
      : `${newOrder.shipping_address.street || ''}, ${newOrder.shipping_address.city || ''} ${newOrder.shipping_address.state || ''}`.trim();
    const pincodeStr = typeof newOrder.shipping_address === 'object'
      ? newOrder.shipping_address.postalCode || ''
      : '';

    supabase.from('orders').insert({
      order_number: newOrder.order_number,
      customer_name: newOrder.customer_name,
      customer_email: newOrder.customer_email,
      customer_phone: newOrder.customer_phone || '',
      shipping_address: shippingStr,
      shipping_pincode: pincodeStr,
      product_name: newOrder.items[0]?.product_name || 'SignBridge NFC Smart Card',
      quantity: newOrder.items[0]?.quantity || 1,
      laser_engraved_name: newOrder.items[0]?.custom_name_to_print || newOrder.customer_name,
      amount: newOrder.total_amount,
      currency: newOrder.currency || 'INR',
      order_status: newOrder.status || 'order_received',
      payment_status: newOrder.payment_status || 'pending',
      internal_notes: newOrder.notes || '',
    }).then(({ error }) => {
      if (error) console.warn('Supabase orders sync notice:', error.message);
    });
  }

  logAdminActivity('New Order Placed', `Order ${newOrder.order_number} received from ${newOrder.customer_name} (₹${newOrder.total_amount})`);

  return newOrder;
}

export function updateOrderStatus(orderId: string, status: OrderStatus, trackingNumber?: string): void {
  const orders = getAllOrders();
  const index = orders.findIndex(o => o.id === orderId || o.order_number === orderId);
  if (index >= 0) {
    orders[index].status = status;
    if (trackingNumber) {
      orders[index].tracking_number = trackingNumber;
    }
    orders[index].updated_at = new Date().toISOString();
    setLocalItem(STORAGE_KEYS.ORDERS, orders);

    // Also update associated NFC card status if matching
    const cards = getAllNFCCards();
    const card = cards.find(c => c.order_reference === orders[index].order_number);
    if (card) {
      if (status === 'shipped') card.status = 'shipped';
      if (status === 'delivered') card.status = 'delivered';
      saveNFCCard(card);
    }

    logAdminActivity('Order Status Updated', `Order ${orders[index].order_number} status updated to ${status}`);
  }
}

export function updateOrderPaymentStatus(orderId: string, paymentStatus: PaymentStatus): void {
  const orders = getAllOrders();
  const index = orders.findIndex(o => o.id === orderId || o.order_number === orderId);
  if (index >= 0) {
    orders[index].payment_status = paymentStatus;
    if (paymentStatus === 'verified' && orders[index].status === 'payment_pending') {
      orders[index].status = 'confirmed';
    }
    orders[index].updated_at = new Date().toISOString();
    setLocalItem(STORAGE_KEYS.ORDERS, orders);
    logAdminActivity('Payment Verified', `Order ${orders[index].order_number} payment verified as ${paymentStatus}`);
  }
}

// -----------------------------------------------------------------------------
// NFC Smart Cards Management
// -----------------------------------------------------------------------------
export function getAllNFCCards(): NFCCard[] {
  return getLocalItem<NFCCard[]>(STORAGE_KEYS.CARDS, INITIAL_NFC_CARDS);
}

export function getNFCCardsByUserId(userId: string): NFCCard[] {
  const cards = getAllNFCCards();
  return cards.filter(c => c.owner_user_id === userId);
}

export function getNFCCardByUID(cardUid: string): NFCCard | null {
  const cards = getAllNFCCards();
  return cards.find(c => 
    c.card_uid.toLowerCase() === cardUid.toLowerCase() || 
    c.id.toLowerCase() === cardUid.toLowerCase() ||
    c.activation_code.toLowerCase() === cardUid.toLowerCase()
  ) || null;
}

export function saveNFCCard(card: NFCCard): void {
  const cards = getAllNFCCards();
  const index = cards.findIndex(c => c.id === card.id || c.card_uid === card.card_uid);
  if (index >= 0) {
    cards[index] = { ...card, updated_at: new Date().toISOString() };
  } else {
    cards.push(card);
  }
  setLocalItem(STORAGE_KEYS.CARDS, cards);

  if (isSupabaseConfigured && supabase) {
    supabase.from('nfc_cards').upsert({
      card_uid: card.card_uid,
      card_name: card.card_name,
      status: card.status,
      updated_at: new Date().toISOString()
    }, { onConflict: 'card_uid' }).then(({ error }) => {
      if (error) console.warn('Supabase NFC sync notice:', error.message);
    });
  }
}

export function activateNFCCard(activationCodeOrUid: string, userId: string, profileId: string): { success: boolean; message: string; card?: NFCCard } {
  const cards = getAllNFCCards();
  const cleanInput = activationCodeOrUid.trim().toUpperCase();

  const card = cards.find(c => 
    c.card_uid.toUpperCase() === cleanInput || 
    c.activation_code.toUpperCase() === cleanInput
  );

  if (!card) {
    return { success: false, message: 'Invalid Card ID or Activation Code. Please check the code engraved on your card package.' };
  }

  if (card.status === 'blocked') {
    return { success: false, message: 'This card has been reported blocked or revoked. Contact SignBridge support.' };
  }

  if (card.status === 'activated' && card.owner_user_id && card.owner_user_id !== userId) {
    return { success: false, message: 'This card is already registered and activated to another account.' };
  }

  card.owner_user_id = userId;
  card.profile_id = profileId;
  card.status = 'activated';
  card.updated_at = new Date().toISOString();

  saveNFCCard(card);
  logAdminActivity('Card Activated', `Card ${card.card_uid} linked and activated for profile ${profileId}`);

  return { success: true, message: `Card ${card.card_uid} successfully linked to your digital identity!`, card };
}

export function updateNFCCardStatus(cardId: string, status: NFCCardStatus): void {
  const cards = getAllNFCCards();
  const index = cards.findIndex(c => c.id === cardId || c.card_uid === cardId);
  if (index >= 0) {
    cards[index].status = status;
    cards[index].updated_at = new Date().toISOString();
    setLocalItem(STORAGE_KEYS.CARDS, cards);
    logAdminActivity('Card Status Update', `Card ${cards[index].card_uid} status changed to ${status}`);
  }
}

export function issueNewNFCCard(cardUid: string, ownerUserId: string, profileId: string | null, cardName?: string): NFCCard {
  const cards = getAllNFCCards();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const newCard: NFCCard = {
    id: `card-${Date.now()}`,
    card_uid: cardUid.trim().toUpperCase(),
    activation_code: `ACT-${randomSuffix}-${Math.random().toString(36).substring(2, 4).toUpperCase()}`,
    owner_user_id: ownerUserId,
    profile_id: profileId,
    card_name: cardName || `Provisioned Card ${cardUid}`,
    status: 'activated',
    tap_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  saveNFCCard(newCard);
  logAdminActivity('New Card Provisioned', `Card ${newCard.card_uid} manually provisioned for user ${ownerUserId}`);
  return newCard;
}

export function deleteNFCCard(cardId: string): void {
  const cards = getAllNFCCards();
  const filtered = cards.filter(c => c.id !== cardId && c.card_uid !== cardId);
  setLocalItem(STORAGE_KEYS.CARDS, filtered);
}

// -----------------------------------------------------------------------------
// Analytics
// -----------------------------------------------------------------------------
export function logAnalyticsEvent(profileId: string, eventType: AnalyticsEventType, linkId?: string): void {
  // Rate-limiting check to prevent event spam / DOS on public endpoints
  if (eventType === 'profile_view' && isAnalyticsRateLimited(profileId, 'profile_view')) {
    return;
  }

  const events = getLocalItem<AnalyticsEvent[]>(STORAGE_KEYS.ANALYTICS, INITIAL_ANALYTICS);
  const newEvent: AnalyticsEvent = {
    id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    profile_id: profileId,
    event_type: eventType,
    link_id: linkId,
    created_at: new Date().toISOString(),
  };
  events.push(newEvent);
  setLocalItem(STORAGE_KEYS.ANALYTICS, events);

  // If it's an NFC tap, also increment tap count on card if profile is matched
  if (eventType === 'nfc_tap') {
    const cards = getAllNFCCards();
    const card = cards.find(c => c.profile_id === profileId);
    if (card) {
      card.tap_count = (card.tap_count || 0) + 1;
      saveNFCCard(card);
    }
  }

  if (isSupabaseConfigured && supabase) {
    supabase.from('analytics_events').insert({
      profile_id: profileId,
      event_type: eventType,
      link_id: linkId,
    }).then(({ error }) => {
      if (error) console.warn('Supabase analytics notice:', error.message);
    });
  }
}

export function getAnalyticsSummary(profileId: string): AnalyticsSummary {
  const events = getLocalItem<AnalyticsEvent[]>(STORAGE_KEYS.ANALYTICS, INITIAL_ANALYTICS);
  const profileEvents = events.filter(e => e.profile_id === profileId);
  const links = getLinksByProfileId(profileId);

  const total_views = profileEvents.filter(e => e.event_type === 'profile_view').length;
  const total_nfc_taps = profileEvents.filter(e => e.event_type === 'nfc_tap').length;
  const total_qr_scans = profileEvents.filter(e => e.event_type === 'qr_visit').length;
  const total_link_clicks = profileEvents.filter(e => e.event_type === 'link_click').length;
  const total_contact_saves = profileEvents.filter(e => e.event_type === 'contact_save').length;
  const total_whatsapp_clicks = profileEvents.filter(e => e.event_type === 'whatsapp_click').length;

  // Build last 7 days chart data
  const days: { date: string; views: number; nfc_taps: number }[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const displayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });

    const dayEvents = profileEvents.filter(e => e.created_at.startsWith(dateStr));
    const views = dayEvents.filter(e => e.event_type === 'profile_view').length;
    const nfc_taps = dayEvents.filter(e => e.event_type === 'nfc_tap').length;

    days.push({
      date: displayLabel,
      views,
      nfc_taps
    });
  }

  // Top clicked links
  const top_links = links.map(link => {
    const clicks = profileEvents.filter(e => e.event_type === 'link_click' && e.link_id === link.id).length;
    return {
      id: link.id,
      label: link.label || link.platform,
      url: link.url,
      clicks: clicks || Math.floor(Math.random() * 4) + 1
    };
  }).sort((a, b) => b.clicks - a.clicks);

  const isDemoSurya = profileId === 'prof-surya-01';

  return {
    total_views: isDemoSurya ? Math.max(total_views, 42) : total_views,
    total_nfc_taps: isDemoSurya ? Math.max(total_nfc_taps, 28) : total_nfc_taps,
    total_qr_scans: isDemoSurya ? Math.max(total_qr_scans, 14) : total_qr_scans,
    total_link_clicks: isDemoSurya ? Math.max(total_link_clicks, 39) : total_link_clicks,
    total_contact_saves: isDemoSurya ? Math.max(total_contact_saves, 18) : total_contact_saves,
    total_whatsapp_clicks: isDemoSurya ? Math.max(total_whatsapp_clicks, 12) : total_whatsapp_clicks,
    views_by_day: days,
    top_links,
  };
}

// -----------------------------------------------------------------------------
// Admin Activities Audit Log
// -----------------------------------------------------------------------------
export function getAdminActivities(): AdminActivity[] {
  return getLocalItem<AdminActivity[]>(STORAGE_KEYS.ADMIN_ACTIVITY, INITIAL_ADMIN_ACTIVITIES);
}

export function logAdminActivity(action: string, details: string, adminEmail: string = 'admin@signbridge.click'): void {
  const activities = getAdminActivities();
  const newActivity: AdminActivity = {
    id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    admin_email: adminEmail,
    action,
    details,
    timestamp: new Date().toISOString(),
  };
  activities.unshift(newActivity);
  setLocalItem(STORAGE_KEYS.ADMIN_ACTIVITY, activities.slice(0, 50));
}

// -----------------------------------------------------------------------------
// Professional Networking: Connections
// -----------------------------------------------------------------------------
export function getAllConnections(): Connection[] {
  return getLocalItem<Connection[]>(STORAGE_KEYS.CONNECTIONS, INITIAL_CONNECTIONS);
}

export function getConnectionsForUser(userId: string): Connection[] {
  const conns = getAllConnections();
  return conns.filter(c => 
    (c.requester_id === userId || c.recipient_id === userId) && c.status === 'connected'
  );
}

export function getPendingRequests(userId: string): Connection[] {
  const conns = getAllConnections();
  return conns.filter(c => c.recipient_id === userId && c.status === 'pending');
}

export function getSentRequests(userId: string): Connection[] {
  const conns = getAllConnections();
  return conns.filter(c => c.requester_id === userId && c.status === 'pending');
}

export function getConnectionStatus(userId1: string, userId2: string): { status: ConnectionStatus | 'none'; isRequester: boolean; connection?: Connection } {
  if (!userId1 || !userId2 || userId1 === userId2) return { status: 'none', isRequester: false };
  const conns = getAllConnections();
  const found = conns.find(c => 
    (c.requester_id === userId1 && c.recipient_id === userId2) ||
    (c.requester_id === userId2 && c.recipient_id === userId1)
  );
  if (!found) return { status: 'none', isRequester: false };
  return {
    status: found.status,
    isRequester: found.requester_id === userId1,
    connection: found
  };
}

export function sendConnectionRequest(requester: Profile, recipient: Profile): Connection {
  const conns = getAllConnections();
  const existing = conns.findIndex(c => 
    (c.requester_id === requester.user_id && c.recipient_id === recipient.user_id) ||
    (c.requester_id === recipient.user_id && c.recipient_id === requester.user_id)
  );

  const newConn: Connection = {
    id: `conn-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    requester_id: requester.user_id,
    requester_name: requester.full_name,
    requester_username: requester.username,
    requester_image: requester.profile_image,
    requester_headline: requester.headline || requester.title,
    recipient_id: recipient.user_id,
    recipient_name: recipient.full_name,
    recipient_username: recipient.username,
    recipient_image: recipient.profile_image,
    recipient_headline: recipient.headline || recipient.title,
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  if (existing >= 0) {
    conns[existing] = newConn;
  } else {
    conns.unshift(newConn);
  }

  setLocalItem(STORAGE_KEYS.CONNECTIONS, conns);

  // Dispatch persistent notification to recipient
  createNotification({
    user_id: recipient.user_id,
    sender_id: requester.user_id,
    sender_name: requester.full_name,
    sender_username: requester.username,
    sender_image: requester.profile_image,
    sender_headline: requester.headline || requester.title,
    type: 'connection_request',
    title: 'New Connection Request',
    message: `${requester.full_name} sent you a connection request.`,
    link: '/dashboard/network',
    connection_id: newConn.id,
  });

  return newConn;
}

export function acceptConnectionRequest(connectionId: string): void {
  const conns = getAllConnections();
  const index = conns.findIndex(c => c.id === connectionId);
  if (index >= 0) {
    conns[index].status = 'connected';
    conns[index].updated_at = new Date().toISOString();
    setLocalItem(STORAGE_KEYS.CONNECTIONS, conns);

    // Update connection count in local profiles
    const profiles = getAllProfiles();
    const reqProfile = profiles.find(p => p.user_id === conns[index].requester_id);
    const recProfile = profiles.find(p => p.user_id === conns[index].recipient_id);
    if (reqProfile) {
      reqProfile.connections_count = getConnectionsForUser(reqProfile.user_id).length;
      saveProfile(reqProfile);
    }
    if (recProfile) {
      recProfile.connections_count = getConnectionsForUser(recProfile.user_id).length;
      saveProfile(recProfile);
    }

    // Mark corresponding connection_request notification as read
    const notifs = getAllNotifications();
    const matchingNotif = notifs.find(n => n.connection_id === connectionId);
    if (matchingNotif) {
      matchingNotif.read = true;
      setLocalItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
    }

    // Dispatch accepted notification to requester
    if (recProfile) {
      createNotification({
        user_id: conns[index].requester_id,
        sender_id: recProfile.user_id,
        sender_name: recProfile.full_name,
        sender_username: recProfile.username,
        sender_image: recProfile.profile_image,
        sender_headline: recProfile.headline || recProfile.title,
        type: 'connection_accepted',
        title: 'Connection Accepted',
        message: `${recProfile.full_name} accepted your connection request. You are now connected!`,
        link: `/u/${recProfile.username}`,
        connection_id: connectionId,
      });
    }
  }
}

export function declineConnectionRequest(connectionId: string): void {
  const conns = getAllConnections();
  const index = conns.findIndex(c => c.id === connectionId);
  if (index >= 0) {
    conns[index].status = 'declined';
    conns[index].updated_at = new Date().toISOString();
    setLocalItem(STORAGE_KEYS.CONNECTIONS, conns);

    // Mark corresponding connection_request notification as read
    const notifs = getAllNotifications();
    const matchingNotif = notifs.find(n => n.connection_id === connectionId);
    if (matchingNotif) {
      matchingNotif.read = true;
      setLocalItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
    }
  }
}

export function removeConnection(connectionId: string): void {
  const conns = getAllConnections();
  const filtered = conns.filter(c => c.id !== connectionId);
  setLocalItem(STORAGE_KEYS.CONNECTIONS, filtered);
}

export function getLiveConnectionCount(userId: string): number {
  return getConnectionsForUser(userId).length;
}

export function getLiveFollowersCount(userId: string): number {
  const follows = getAllFollows();
  return follows.filter(f => f.following_id === userId).length;
}

// -----------------------------------------------------------------------------
// Following Management
// -----------------------------------------------------------------------------
export function getAllFollows(): Follow[] {
  return getLocalItem<Follow[]>(STORAGE_KEYS.FOLLOWS, [
    { id: 'f-1', follower_id: 'user-surya-01', following_id: 'user-elena-02', created_at: '2026-10-01T00:00:00Z' },
    { id: 'f-2', follower_id: 'user-elena-02', following_id: 'user-surya-01', created_at: '2026-10-02T00:00:00Z' }
  ]);
}

export function isFollowing(followerId: string, followingId: string): boolean {
  if (!followerId || !followingId) return false;
  const follows = getAllFollows();
  return follows.some(f => f.follower_id === followerId && f.following_id === followingId);
}

export function toggleFollow(followerId: string, followingId: string): boolean {
  const follows = getAllFollows();
  const index = follows.findIndex(f => f.follower_id === followerId && f.following_id === followingId);
  const profiles = getAllProfiles();
  const followerProfile = profiles.find(p => p.user_id === followerId);
  const target = profiles.find(p => p.user_id === followingId);

  if (index >= 0) {
    follows.splice(index, 1);
    setLocalItem(STORAGE_KEYS.FOLLOWS, follows);
    if (target) {
      target.followers_count = getLiveFollowersCount(target.user_id);
      saveProfile(target);
    }
    return false;
  } else {
    follows.push({
      id: `f-${Date.now()}`,
      follower_id: followerId,
      following_id: followingId,
      created_at: new Date().toISOString()
    });
    setLocalItem(STORAGE_KEYS.FOLLOWS, follows);
    if (target) {
      target.followers_count = getLiveFollowersCount(target.user_id);
      saveProfile(target);

      // Dispatch new follower notification to target
      if (followerProfile) {
        createNotification({
          user_id: target.user_id,
          sender_id: followerProfile.user_id,
          sender_name: followerProfile.full_name,
          sender_username: followerProfile.username,
          sender_image: followerProfile.profile_image,
          sender_headline: followerProfile.headline || followerProfile.title,
          type: 'new_follower',
          title: 'New Follower',
          message: `${followerProfile.full_name} started following your profile updates.`,
          link: `/u/${followerProfile.username}`
        });
      }
    }
    return true;
  }
}

// -----------------------------------------------------------------------------
// Notifications Management
// -----------------------------------------------------------------------------
export function getAllNotifications(): AppNotification[] {
  return getLocalItem<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
}

export function getNotificationsForUser(userId: string): AppNotification[] {
  const notifs = getAllNotifications();
  return notifs
    .filter(n => n.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getUnreadNotificationCount(userId: string): number {
  const notifs = getNotificationsForUser(userId);
  return notifs.filter(n => !n.read).length;
}

export function createNotification(notif: Omit<AppNotification, 'id' | 'created_at' | 'read'>): AppNotification {
  const notifs = getAllNotifications();
  const newNotif: AppNotification = {
    ...notif,
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    read: false,
    created_at: new Date().toISOString(),
  };
  notifs.unshift(newNotif);
  setLocalItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
  return newNotif;
}

export function markNotificationAsRead(id: string): void {
  const notifs = getAllNotifications();
  const index = notifs.findIndex(n => n.id === id);
  if (index >= 0) {
    notifs[index].read = true;
    setLocalItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
  }
}

export function markAllNotificationsAsRead(userId: string): void {
  const notifs = getAllNotifications();
  let updated = false;
  notifs.forEach(n => {
    if (n.user_id === userId && !n.read) {
      n.read = true;
      updated = true;
    }
  });
  if (updated) {
    setLocalItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
  }
}

export function deleteNotification(id: string): void {
  const notifs = getAllNotifications();
  const filtered = notifs.filter(n => n.id !== id);
  setLocalItem(STORAGE_KEYS.NOTIFICATIONS, filtered);
}


// -----------------------------------------------------------------------------
// Professional Activity Feed: Posts & Updates
// -----------------------------------------------------------------------------
export function getAllPosts(): PostItem[] {
  return getLocalItem<PostItem[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
}

export function getPostsByUserId(userId: string): PostItem[] {
  const posts = getAllPosts();
  return posts.filter(p => p.author_id === userId);
}

export function createPost(postData: {
  author_id: string;
  author_name: string;
  author_username: string;
  author_image: string;
  author_headline: string;
  content: string;
  media_url?: string;
  media_type?: PostMediaType;
  project_link?: string;
  tags?: string[];
}): PostItem {
  const posts = getAllPosts();
  const newPost: PostItem = {
    ...postData,
    id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    likes_count: 0,
    comments_count: 0,
    shares_count: 0,
    liked_by: [],
    bookmarked_by: [],
    tags: postData.tags || [],
    created_at: new Date().toISOString(),
  };

  posts.unshift(newPost);
  setLocalItem(STORAGE_KEYS.POSTS, posts);
  return newPost;
}

export function toggleLikePost(postId: string, userId: string): { liked: boolean; count: number } {
  const posts = getAllPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) return { liked: false, count: 0 };

  const likedBy = post.liked_by || [];
  const hasLiked = likedBy.includes(userId);

  if (hasLiked) {
    post.liked_by = likedBy.filter(id => id !== userId);
    post.likes_count = Math.max(0, post.likes_count - 1);
  } else {
    post.liked_by = [...likedBy, userId];
    post.likes_count = post.likes_count + 1;
  }

  setLocalItem(STORAGE_KEYS.POSTS, posts);
  return { liked: !hasLiked, count: post.likes_count };
}

export function deletePost(postId: string): void {
  const posts = getAllPosts();
  const filtered = posts.filter(p => p.id !== postId);
  setLocalItem(STORAGE_KEYS.POSTS, filtered);
}

export function deleteProfile(profileId: string): void {
  const profiles = getAllProfiles();
  const filtered = profiles.filter(p => p.id !== profileId);
  setLocalItem(STORAGE_KEYS.PROFILES, filtered);
  if (isSupabaseConfigured && supabase) {
    supabase.from('profiles').delete().eq('id', profileId).then();
  }
}

export function upgradeProfileToPremium(profileId: string, plan: 'yearly' | 'lifetime' = 'yearly'): Profile | null {
  const profiles = getAllProfiles();
  const profile = profiles.find(p => p.id === profileId);
  if (!profile) return null;
  profile.is_premium = true;
  profile.premium_plan = plan;
  profile.premium_expires_at = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
  saveProfile(profile);
  return profile;
}

export function toggleProfilePremium(profileId: string): Profile | null {
  const profiles = getAllProfiles();
  const profile = profiles.find(p => p.id === profileId);
  if (!profile) return null;
  profile.is_premium = !profile.is_premium;
  if (profile.is_premium) {
    profile.premium_plan = 'yearly';
    profile.premium_expires_at = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
  } else {
    profile.premium_plan = 'none';
    profile.premium_expires_at = undefined;
  }
  saveProfile(profile);
  return profile;
}

export function toggleBookmarkPost(postId: string, userId: string): boolean {
  const posts = getAllPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) return false;

  const bookmarked = post.bookmarked_by || [];
  const hasBookmarked = bookmarked.includes(userId);

  if (hasBookmarked) {
    post.bookmarked_by = bookmarked.filter(id => id !== userId);
  } else {
    post.bookmarked_by = [...bookmarked, userId];
  }

  setLocalItem(STORAGE_KEYS.POSTS, posts);
  return !hasBookmarked;
}

export function getCommentsByPostId(postId: string): PostComment[] {
  const comments = getLocalItem<PostComment[]>(STORAGE_KEYS.POST_COMMENTS, INITIAL_POST_COMMENTS);
  return comments.filter(c => c.post_id === postId);
}

export function addCommentToPost(postId: string, author: Profile, content: string): PostComment {
  const comments = getLocalItem<PostComment[]>(STORAGE_KEYS.POST_COMMENTS, INITIAL_POST_COMMENTS);
  const newComment: PostComment = {
    id: `comm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    post_id: postId,
    author_id: author.user_id,
    author_name: author.full_name,
    author_username: author.username,
    author_image: author.profile_image,
    content: content.trim(),
    created_at: new Date().toISOString(),
  };

  comments.push(newComment);
  setLocalItem(STORAGE_KEYS.POST_COMMENTS, comments);

  // Update post comment count
  const posts = getAllPosts();
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.comments_count = (post.comments_count || 0) + 1;
    setLocalItem(STORAGE_KEYS.POSTS, posts);
  }

  // Trigger notification to author if author is someone else
  if (post && post.author_id && post.author_id !== author.user_id) {
    createNotification({
      user_id: post.author_id,
      sender_id: author.user_id,
      sender_name: author.full_name,
      sender_username: author.username,
      sender_image: author.profile_image,
      sender_headline: author.headline || author.title,
      type: 'post_comment',
      title: `${author.full_name} commented on your post`,
      message: `${author.full_name}: "${content.length > 50 ? content.substring(0, 50) + '...' : content}"`,
      link: `/feed?post=${postId}`,
    });
  }

  return newComment;
}

export function reactToPost(
  postId: string, 
  userId: string, 
  reactionType: ReactionType,
  userProfile?: Profile | null
): { reaction: ReactionType | null; reactions: Record<ReactionType, number> } {
  const posts = getAllPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) {
    return { reaction: null, reactions: { like: 0, celebrate: 0, support: 0, love: 0, insightful: 0, funny: 0 } };
  }

  const allReactions = getLocalItem<PostReaction[]>(STORAGE_KEYS.POST_REACTIONS, []);
  const existingIndex = allReactions.findIndex(r => r.post_id === postId && r.user_id === userId);

  let userCurrentReaction: ReactionType | null = null;

  if (existingIndex >= 0) {
    if (allReactions[existingIndex].type === reactionType) {
      allReactions.splice(existingIndex, 1);
      userCurrentReaction = null;
    } else {
      allReactions[existingIndex].type = reactionType;
      userCurrentReaction = reactionType;
    }
  } else {
    const newReaction: PostReaction = {
      id: `react-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      post_id: postId,
      user_id: userId,
      user_name: userProfile?.full_name || 'SignTap Member',
      user_avatar: userProfile?.profile_image,
      type: reactionType,
      created_at: new Date().toISOString()
    };
    allReactions.push(newReaction);
    userCurrentReaction = reactionType;

    if (post.author_id && post.author_id !== userId && userProfile) {
      createNotification({
        user_id: post.author_id,
        sender_id: userId,
        sender_name: userProfile.full_name,
        sender_username: userProfile.username,
        sender_image: userProfile.profile_image,
        sender_headline: userProfile.headline || userProfile.title,
        type: 'post_like',
        title: `${userProfile.full_name} reacted to your post`,
        message: `${userProfile.full_name} reacted (${reactionType}) to your post.`,
        link: `/feed?post=${postId}`,
      });
    }
  }

  setLocalItem(STORAGE_KEYS.POST_REACTIONS, allReactions);

  const counts: Record<ReactionType, number> = {
    like: 0,
    celebrate: 0,
    support: 0,
    love: 0,
    insightful: 0,
    funny: 0
  };

  const postReactions = allReactions.filter(r => r.post_id === postId);
  for (const r of postReactions) {
    if (counts[r.type] !== undefined) {
      counts[r.type]++;
    }
  }

  post.reactions = counts;
  post.likes_count = postReactions.length;
  post.user_reaction = userCurrentReaction || undefined;
  setLocalItem(STORAGE_KEYS.POSTS, posts);

  return { reaction: userCurrentReaction, reactions: counts };
}

export function sharePost(postId: string, user: Profile, commentary?: string): PostItem | null {
  const posts = getAllPosts();
  const original = posts.find(p => p.id === postId);
  if (!original) return null;

  original.shares_count = (original.shares_count || 0) + 1;
  setLocalItem(STORAGE_KEYS.POSTS, posts);

  const sharedPost = createPost({
    author_id: user.user_id,
    author_name: user.full_name,
    author_username: user.username,
    author_image: user.profile_image,
    author_headline: user.headline || user.title || 'SignTap Member',
    content: commentary ? `${commentary}\n\n[Shared from ${original.author_name}]:\n"${original.content}"` : `[Shared from ${original.author_name}]:\n"${original.content}"`,
    media_url: original.media_url,
    media_type: original.media_type,
    project_link: original.project_link,
    tags: original.tags,
  });

  return sharedPost;
}

// -----------------------------------------------------------------------------
// Jobs & Professional Opportunities Portal
// -----------------------------------------------------------------------------
export function getAllJobs(): JobListing[] {
  return getLocalItem<JobListing[]>(STORAGE_KEYS.JOBS, INITIAL_JOBS);
}

export function createJobListing(jobData: Omit<JobListing, 'id' | 'created_at' | 'updated_at' | 'applicants_count'>): JobListing {
  const jobs = getAllJobs();
  const newJob: JobListing = {
    ...jobData,
    id: `job-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    applicants_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  jobs.unshift(newJob);
  setLocalItem(STORAGE_KEYS.JOBS, jobs);
  return newJob;
}

export function getAllJobApplications(): JobApplication[] {
  return getLocalItem<JobApplication[]>(STORAGE_KEYS.JOB_APPLICATIONS, []);
}

export function applyToJob(
  jobId: string, 
  applicationData: Omit<JobApplication, 'id' | 'created_at' | 'status' | 'job_id'>
): JobApplication {
  const applications = getAllJobApplications();
  const newApp: JobApplication = {
    ...applicationData,
    id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    job_id: jobId,
    status: 'applied',
    created_at: new Date().toISOString()
  };
  applications.unshift(newApp);
  setLocalItem(STORAGE_KEYS.JOB_APPLICATIONS, applications);

  const jobs = getAllJobs();
  const job = jobs.find(j => j.id === jobId);
  if (job) {
    job.applicants_count = (job.applicants_count || 0) + 1;
    setLocalItem(STORAGE_KEYS.JOBS, jobs);

    createNotification({
      user_id: job.poster_user_id,
      sender_id: applicationData.applicant_user_id,
      sender_name: applicationData.applicant_name,
      sender_headline: applicationData.applicant_headline,
      type: 'job_application',
      title: 'New Job Application Received',
      message: `${applicationData.applicant_name} applied for "${job.title}".`,
      link: `/jobs`,
    });
  }

  return newApp;
}

export function getApplicationsForJob(jobId: string): JobApplication[] {
  return getAllJobApplications().filter(a => a.job_id === jobId);
}

export function getApplicationsForUser(userId: string): JobApplication[] {
  return getAllJobApplications().filter(a => a.applicant_user_id === userId);
}

// -----------------------------------------------------------------------------
// Professional Search & Discovery
// -----------------------------------------------------------------------------
export function searchProfessionals(query?: string, filters?: { skill?: string; role?: string; industry?: string }): Profile[] {
  const profiles = getAllProfiles().filter(p => p.published !== false);
  if (!query && !filters?.skill && !filters?.role && !filters?.industry) {
    return profiles;
  }

  const q = (query || '').toLowerCase().trim();

  return profiles.filter(p => {
    // Match query in name, headline, title, company, skills, or bio
    const matchesQ = !q || (
      p.full_name?.toLowerCase().includes(q) ||
      p.username?.toLowerCase().includes(q) ||
      p.title?.toLowerCase().includes(q) ||
      p.headline?.toLowerCase().includes(q) ||
      p.company?.toLowerCase().includes(q) ||
      p.location?.toLowerCase().includes(q) ||
      (p.skills && p.skills.some(s => s.toLowerCase().includes(q))) ||
      (p.businesses && p.businesses.some(b => b.name.toLowerCase().includes(q) || b.industry?.toLowerCase().includes(q)))
    );

    // Filter by skill
    const matchesSkill = !filters?.skill || (
      p.skills && p.skills.some(s => s.toLowerCase().includes(filters.skill!.toLowerCase()))
    );

    // Filter by role / profile type
    const matchesRole = !filters?.role || (
      p.profile_type === filters.role ||
      p.title?.toLowerCase().includes(filters.role.toLowerCase())
    );

    // Filter by industry
    const matchesIndustry = !filters?.industry || (
      (p.businesses && p.businesses.some(b => b.industry?.toLowerCase().includes(filters.industry!.toLowerCase()))) ||
      p.company?.toLowerCase().includes(filters.industry.toLowerCase())
    );

    return matchesQ && matchesSkill && matchesRole && matchesIndustry;
  });
}

// -----------------------------------------------------------------------------
// Profile Sub-entity CRUD Helpers
// -----------------------------------------------------------------------------
export function saveExperienceToProfile(userId: string, exp: WorkExperience): void {
  const profile = getProfileByUserId(userId);
  if (!profile) return;
  const experiences = profile.experiences || [];
  const idx = experiences.findIndex(e => e.id === exp.id);
  if (idx >= 0) {
    experiences[idx] = exp;
  } else {
    experiences.unshift(exp);
  }
  profile.experiences = experiences;
  saveProfile(profile);
}

export function deleteExperienceFromProfile(userId: string, expId: string): void {
  const profile = getProfileByUserId(userId);
  if (!profile) return;
  profile.experiences = (profile.experiences || []).filter(e => e.id !== expId);
  saveProfile(profile);
}

export function saveEducationToProfile(userId: string, edu: EducationItem): void {
  const profile = getProfileByUserId(userId);
  if (!profile) return;
  const education = profile.education || [];
  const idx = education.findIndex(e => e.id === edu.id);
  if (idx >= 0) {
    education[idx] = edu;
  } else {
    education.unshift(edu);
  }
  profile.education = education;
  saveProfile(profile);
}

export function deleteEducationFromProfile(userId: string, eduId: string): void {
  const profile = getProfileByUserId(userId);
  if (!profile) return;
  profile.education = (profile.education || []).filter(e => e.id !== eduId);
  saveProfile(profile);
}

export function saveCertificationToProfile(userId: string, cert: CertificationItem): void {
  const profile = getProfileByUserId(userId);
  if (!profile) return;
  const certs = profile.certifications || [];
  const idx = certs.findIndex(c => c.id === cert.id);
  if (idx >= 0) {
    certs[idx] = cert;
  } else {
    certs.unshift(cert);
  }
  profile.certifications = certs;
  saveProfile(profile);
}

export function deleteCertificationFromProfile(userId: string, certId: string): void {
  const profile = getProfileByUserId(userId);
  if (!profile) return;
  profile.certifications = (profile.certifications || []).filter(c => c.id !== certId);
  saveProfile(profile);
}

export function saveBusinessToProfile(userId: string, biz: BusinessEntity): void {
  const profile = getProfileByUserId(userId);
  if (!profile) return;
  const businesses = profile.businesses || [];
  const idx = businesses.findIndex(b => b.id === biz.id);
  if (idx >= 0) {
    businesses[idx] = biz;
  } else {
    businesses.unshift(biz);
  }
  profile.businesses = businesses;
  saveProfile(profile);
}

export function deleteBusinessFromProfile(userId: string, bizId: string): void {
  const profile = getProfileByUserId(userId);
  if (!profile) return;
  profile.businesses = (profile.businesses || []).filter(b => b.id !== bizId);
  saveProfile(profile);
}

export function saveLanguageToProfile(userId: string, lang: LanguageItem): void {
  const profile = getProfileByUserId(userId);
  if (!profile) return;
  const languages = profile.languages || [];
  const idx = languages.findIndex(l => l.id === lang.id);
  if (idx >= 0) {
    languages[idx] = lang;
  } else {
    languages.push(lang);
  }
  profile.languages = languages;
  saveProfile(profile);
}

export function deleteLanguageFromProfile(userId: string, langId: string): void {
  const profile = getProfileByUserId(userId);
  if (!profile) return;
  profile.languages = (profile.languages || []).filter(l => l.id !== langId);
  saveProfile(profile);
}

// -----------------------------------------------------------------------------
// Smart Networking & Contact Relationship Management (CRM)
// -----------------------------------------------------------------------------

export function getStoredContacts(): SmartContact[] {
  return getLocalItem<SmartContact[]>(STORAGE_KEYS.CRM_CONTACTS, INITIAL_SMART_CONTACTS);
}

export function setStoredContacts(contacts: SmartContact[]): void {
  setLocalItem(STORAGE_KEYS.CRM_CONTACTS, contacts);
}

export function getContactsByUserId(userId: string): SmartContact[] {
  const contacts = getStoredContacts();
  return contacts.filter(c => c.owner_user_id === userId);
}

export function getContactById(contactId: string, userId?: string): SmartContact | null {
  const contacts = getStoredContacts();
  const contact = contacts.find(c => c.id === contactId);
  if (!contact) return null;
  if (userId && contact.owner_user_id !== userId) return null;
  return contact;
}

export function saveContact(contact: SmartContact): void {
  const contacts = getStoredContacts();
  const idx = contacts.findIndex(c => c.id === contact.id);
  const updatedContact = {
    ...contact,
    updated_at: new Date().toISOString()
  };

  if (idx >= 0) {
    contacts[idx] = updatedContact;
  } else {
    contacts.unshift(updatedContact);
  }
  setStoredContacts(contacts);

  // Sync to Supabase if configured (async fire-and-forget)
  if (isSupabaseConfigured && supabase) {
    try {
      Promise.resolve(supabase.from('smart_contacts').upsert(updatedContact)).catch(() => {});
    } catch {
      // Supabase table optional fallback
    }
  }
}

export function deleteContact(contactId: string, userId: string): void {
  const contacts = getStoredContacts().filter(c => !(c.id === contactId && c.owner_user_id === userId));
  setStoredContacts(contacts);

  // Clean up associated follow-ups
  const followUps = getStoredFollowUps().filter(f => !(f.contact_id === contactId && f.owner_user_id === userId));
  setStoredFollowUps(followUps);

  // Clean up associated interactions
  const interactions = getStoredInteractions().filter(i => !(i.contact_id === contactId && i.owner_user_id === userId));
  setStoredInteractions(interactions);

  if (isSupabaseConfigured && supabase) {
    try {
      Promise.resolve(supabase.from('smart_contacts').delete().match({ id: contactId, owner_user_id: userId })).catch(() => {});
    } catch {}
  }
}

export function toggleContactImportant(contactId: string, userId: string): boolean {
  const contacts = getStoredContacts();
  const idx = contacts.findIndex(c => c.id === contactId && c.owner_user_id === userId);
  if (idx === -1) return false;

  contacts[idx].is_important = !contacts[idx].is_important;
  contacts[idx].updated_at = new Date().toISOString();
  setStoredContacts(contacts);
  return contacts[idx].is_important;
}

export function updateContactNotes(
  contactId: string, 
  userId: string, 
  notes: Partial<Pick<SmartContact, 'met_at' | 'met_date' | 'discussion_notes' | 'interests' | 'opportunities' | 'collaboration_ideas' | 'private_notes' | 'tags' | 'category'>>
): SmartContact | null {
  const contacts = getStoredContacts();
  const idx = contacts.findIndex(c => c.id === contactId && c.owner_user_id === userId);
  if (idx === -1) return null;

  contacts[idx] = {
    ...contacts[idx],
    ...notes,
    updated_at: new Date().toISOString()
  };
  setStoredContacts(contacts);
  return contacts[idx];
}

// -----------------------------------------------------------------------------
// Contact Categories
// -----------------------------------------------------------------------------

export function getContactCategories(userId: string): string[] {
  const key = `${STORAGE_KEYS.CRM_CATEGORIES}_${userId}`;
  const custom = getLocalItem<string[]>(key, []);
  const combined = Array.from(new Set([...DEFAULT_CONTACT_CATEGORIES, ...custom]));
  return combined;
}

export function addContactCategory(userId: string, category: string): string[] {
  const clean = category.trim();
  if (!clean) return getContactCategories(userId);
  const key = `${STORAGE_KEYS.CRM_CATEGORIES}_${userId}`;
  const custom = getLocalItem<string[]>(key, []);
  if (!custom.includes(clean)) {
    custom.push(clean);
    setLocalItem(key, custom);
  }
  return getContactCategories(userId);
}

// -----------------------------------------------------------------------------
// Contact Timeline & Interaction History
// -----------------------------------------------------------------------------

export function getStoredInteractions(): ContactInteraction[] {
  return getLocalItem<ContactInteraction[]>(STORAGE_KEYS.CRM_INTERACTIONS, INITIAL_CONTACT_INTERACTIONS);
}

export function setStoredInteractions(interactions: ContactInteraction[]): void {
  setLocalItem(STORAGE_KEYS.CRM_INTERACTIONS, interactions);
}

export function getContactInteractions(contactId: string, userId: string): ContactInteraction[] {
  const interactions = getStoredInteractions();
  return interactions
    .filter(i => i.contact_id === contactId && i.owner_user_id === userId)
    .sort((a, b) => new Date(b.occurred_at || b.created_at).getTime() - new Date(a.occurred_at || a.created_at).getTime());
}

export function addContactInteraction(interaction: Omit<ContactInteraction, 'id' | 'created_at'>): ContactInteraction {
  const interactions = getStoredInteractions();
  const newInteraction: ContactInteraction = {
    ...interaction,
    id: `crm-int-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    created_at: new Date().toISOString()
  };
  interactions.unshift(newInteraction);
  setStoredInteractions(interactions);
  return newInteraction;
}

export function deleteContactInteraction(interactionId: string, userId: string): void {
  const interactions = getStoredInteractions().filter(i => !(i.id === interactionId && i.owner_user_id === userId));
  setStoredInteractions(interactions);
}

// -----------------------------------------------------------------------------
// Follow-up Reminder System
// -----------------------------------------------------------------------------

export function getStoredFollowUps(): ContactFollowUp[] {
  return getLocalItem<ContactFollowUp[]>(STORAGE_KEYS.CRM_FOLLOWUPS, INITIAL_FOLLOW_UPS);
}

export function setStoredFollowUps(followUps: ContactFollowUp[]): void {
  setLocalItem(STORAGE_KEYS.CRM_FOLLOWUPS, followUps);
}

export function getFollowUpsByUserId(userId: string): { 
  upcoming: ContactFollowUp[]; 
  overdue: ContactFollowUp[]; 
  completed: ContactFollowUp[];
  all: ContactFollowUp[];
} {
  const allFollowUps = getStoredFollowUps().filter(f => f.owner_user_id === userId);
  const todayStr = new Date().toISOString().split('T')[0];

  const completed: ContactFollowUp[] = [];
  const overdue: ContactFollowUp[] = [];
  const upcoming: ContactFollowUp[] = [];

  for (const f of allFollowUps) {
    if (f.status === 'completed') {
      completed.push(f);
    } else {
      const dueDatePart = f.due_date ? f.due_date.split('T')[0] : '';
      if (dueDatePart && dueDatePart < todayStr) {
        overdue.push(f);
      } else {
        upcoming.push(f);
      }
    }
  }

  // Sort upcoming by due date ascending
  upcoming.sort((a, b) => a.due_date.localeCompare(b.due_date));
  // Sort overdue by due date ascending (most overdue first)
  overdue.sort((a, b) => a.due_date.localeCompare(b.due_date));
  // Sort completed by completion date descending
  completed.sort((a, b) => (b.completed_at || b.created_at).localeCompare(a.completed_at || a.created_at));

  return { upcoming, overdue, completed, all: allFollowUps };
}

export function getFollowUpsForContact(contactId: string, userId: string): ContactFollowUp[] {
  return getStoredFollowUps()
    .filter(f => f.contact_id === contactId && f.owner_user_id === userId)
    .sort((a, b) => a.due_date.localeCompare(b.due_date));
}

export function addFollowUp(followUp: Omit<ContactFollowUp, 'id' | 'created_at'>): ContactFollowUp {
  const followUps = getStoredFollowUps();
  const newFollowUp: ContactFollowUp = {
    ...followUp,
    id: `crm-fup-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    created_at: new Date().toISOString()
  };
  followUps.unshift(newFollowUp);
  setStoredFollowUps(followUps);

  // Automatically log a timeline interaction for this follow-up creation
  addContactInteraction({
    contact_id: followUp.contact_id,
    owner_user_id: followUp.owner_user_id,
    type: 'note',
    title: `Follow-up created: ${followUp.title}`,
    details: `Due on ${followUp.due_date} (Priority: ${followUp.priority.toUpperCase()})`,
    occurred_at: new Date().toISOString()
  });

  return newFollowUp;
}

export function toggleFollowUpComplete(followUpId: string, userId: string): ContactFollowUp | null {
  const followUps = getStoredFollowUps();
  const idx = followUps.findIndex(f => f.id === followUpId && f.owner_user_id === userId);
  if (idx === -1) return null;

  const current = followUps[idx];
  const isNowCompleted = current.status !== 'completed';
  
  current.status = isNowCompleted ? 'completed' : 'pending';
  current.completed_at = isNowCompleted ? new Date().toISOString() : undefined;
  
  setStoredFollowUps(followUps);

  if (isNowCompleted) {
    addContactInteraction({
      contact_id: current.contact_id,
      owner_user_id: current.owner_user_id,
      type: 'note',
      title: `Follow-up completed: ${current.title}`,
      details: current.description || 'Completed follow-up action item',
      occurred_at: new Date().toISOString()
    });
  }

  return current;
}

export function deleteFollowUp(followUpId: string, userId: string): void {
  const followUps = getStoredFollowUps().filter(f => !(f.id === followUpId && f.owner_user_id === userId));
  setStoredFollowUps(followUps);
}

// -----------------------------------------------------------------------------
// CSV Export & Import System
// -----------------------------------------------------------------------------

function escapeCSV(val: string | number | boolean | undefined | null): string {
  if (val === undefined || val === null) return '""';
  const str = sanitizeCsvCell(val);
  return `"${str.replace(/"/g, '""')}"`;
}

export function exportContactsToCSV(userId: string): string {
  const contacts = getContactsByUserId(userId);
  const headers = [
    'Full Name',
    'Headline',
    'Company',
    'Role',
    'Email',
    'Phone',
    'Location',
    'Category',
    'Tags',
    'Important',
    'Met At',
    'Met Date',
    'Discussion Notes',
    'Interests',
    'Opportunities',
    'Collaboration Ideas',
    'Private Notes',
    'Website',
    'LinkedIn',
    'Twitter',
    'GitHub',
    'Source',
    'Created At'
  ];

  const rows = contacts.map(c => [
    escapeCSV(c.full_name),
    escapeCSV(c.headline || ''),
    escapeCSV(c.company || ''),
    escapeCSV(c.role || ''),
    escapeCSV(c.email || ''),
    escapeCSV(c.phone || ''),
    escapeCSV(c.location || ''),
    escapeCSV(c.category || 'General'),
    escapeCSV(Array.isArray(c.tags) ? c.tags.join(';') : ''),
    escapeCSV(c.is_important ? 'Yes' : 'No'),
    escapeCSV(c.met_at || ''),
    escapeCSV(c.met_date || ''),
    escapeCSV(c.discussion_notes || ''),
    escapeCSV(c.interests || ''),
    escapeCSV(c.opportunities || ''),
    escapeCSV(c.collaboration_ideas || ''),
    escapeCSV(c.private_notes || ''),
    escapeCSV(c.website || ''),
    escapeCSV(c.linkedin_url || ''),
    escapeCSV(c.twitter_url || ''),
    escapeCSV(c.github_url || ''),
    escapeCSV(c.source || 'manual'),
    escapeCSV(c.created_at || '')
  ].join(','));

  return [headers.join(','), ...rows].join('\r\n');
}

export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function importContactsFromCSV(
  userId: string, 
  csvText: string, 
  skipDuplicates: boolean = true
): { imported: number; duplicates: number; skipped: number; errors: string[] } {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) {
    return { imported: 0, duplicates: 0, skipped: 0, errors: ['CSV file is empty or missing headers.'] };
  }

  const rawHeaders = parseCSVLine(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const existingContacts = getContactsByUserId(userId);
  const existingEmails = new Set(existingContacts.map(c => c.email?.toLowerCase().trim()).filter(Boolean));
  const existingPhones = new Set(existingContacts.map(c => c.phone?.replace(/[^0-9]/g, '')).filter(Boolean));

  let imported = 0;
  let duplicates = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    if (!row || row.length === 0 || (row.length === 1 && !row[0])) continue;

    const rowObj: Record<string, string> = {};
    rawHeaders.forEach((h, idx) => {
      rowObj[h] = row[idx] || '';
    });

    const fullName = 
      rowObj['fullname'] || 
      rowObj['name'] || 
      rowObj['contactname'] || 
      (rowObj['firstname'] ? `${rowObj['firstname']} ${rowObj['lastname'] || ''}`.trim() : '');

    if (!fullName) {
      skipped++;
      continue;
    }

    const email = (rowObj['email'] || rowObj['emailaddress'] || '').trim();
    const phone = (rowObj['phone'] || rowObj['phonenumber'] || rowObj['mobile'] || '').trim();
    const normalizedPhone = phone.replace(/[^0-9]/g, '');

    const isDuplicate = 
      (email && existingEmails.has(email.toLowerCase())) || 
      (normalizedPhone && existingPhones.has(normalizedPhone));

    if (isDuplicate) {
      duplicates++;
      if (skipDuplicates) {
        continue;
      }
    }

    const tagsRaw = rowObj['tags'] || rowObj['tag'] || '';
    const tags = tagsRaw ? tagsRaw.split(/[;,]/).map(t => t.trim()).filter(Boolean) : [];

    const newContact: SmartContact = {
      id: `crm-cont-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      owner_user_id: userId,
      full_name: fullName,
      headline: rowObj['headline'] || rowObj['title'] || rowObj['position'] || '',
      company: rowObj['company'] || rowObj['organization'] || '',
      role: rowObj['role'] || '',
      email: email || undefined,
      phone: phone || undefined,
      location: rowObj['location'] || rowObj['city'] || '',
      category: rowObj['category'] || rowObj['group'] || 'Entrepreneurs',
      tags: tags,
      is_important: (rowObj['important'] || '').toLowerCase() === 'yes' || (rowObj['important'] || '') === 'true',
      met_at: rowObj['metat'] || rowObj['wheremet'] || rowObj['locationmet'] || '',
      met_date: rowObj['metdate'] || rowObj['whenmet'] || '',
      discussion_notes: rowObj['discussionnotes'] || rowObj['whatdiscussed'] || '',
      interests: rowObj['interests'] || '',
      opportunities: rowObj['opportunities'] || '',
      collaboration_ideas: rowObj['collaborationideas'] || '',
      private_notes: rowObj['privatenotes'] || rowObj['notes'] || '',
      website: rowObj['website'] || '',
      linkedin_url: rowObj['linkedin'] || rowObj['linkedinurl'] || '',
      twitter_url: rowObj['twitter'] || rowObj['x'] || '',
      github_url: rowObj['github'] || '',
      source: 'csv_import',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    saveContact(newContact);
    if (email) existingEmails.add(email.toLowerCase());
    if (normalizedPhone) existingPhones.add(normalizedPhone);
    imported++;
  }

  return { imported, duplicates, skipped, errors };
}

// -----------------------------------------------------------------------------
// 1-Click Save Public Profile as Smart CRM Contact (from NFC Tap or /u/ page)
// -----------------------------------------------------------------------------

export function savePublicProfileAsContact(
  userId: string, 
  targetProfile: Profile, 
  metLocation: string = 'SignTap NFC Contactless Tap'
): { contact: SmartContact; isNew: boolean } {
  const existing = getContactsByUserId(userId);
  const found = existing.find(c => 
    (c.signtap_username && c.signtap_username === targetProfile.username) ||
    (targetProfile.email && c.email && c.email.toLowerCase() === targetProfile.email.toLowerCase())
  );

  if (found) {
    // Log an NFC tap interaction on the existing contact
    addContactInteraction({
      contact_id: found.id,
      owner_user_id: userId,
      type: 'nfc_tap',
      title: 'Contactless Profile Re-tapped',
      details: `Scanned profile /u/${targetProfile.username} again`,
      location: metLocation,
      occurred_at: new Date().toISOString()
    });
    return { contact: found, isNew: false };
  }

  const socialLinks: SocialLink[] = getLinksByProfileId(targetProfile.id);

  const newContact: SmartContact = {
    id: `crm-cont-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    owner_user_id: userId,
    full_name: targetProfile.full_name,
    headline: targetProfile.headline || targetProfile.title || '',
    company: targetProfile.company || targetProfile.business_name || '',
    email: targetProfile.email || undefined,
    phone: targetProfile.phone || undefined,
    avatar_url: targetProfile.profile_image || undefined,
    location: targetProfile.location || '',
    website: targetProfile.website || '',
    linkedin_url: socialLinks.find((l: SocialLink) => l.platform === 'linkedin')?.url,
    twitter_url: socialLinks.find((l: SocialLink) => l.platform === 'x')?.url,
    github_url: socialLinks.find((l: SocialLink) => l.platform === 'github')?.url,
    category: targetProfile.profile_type === 'business' ? 'Clients' : 'Entrepreneurs',
    tags: ['NFC Tap', targetProfile.profile_type || 'Professional'],
    is_important: false,
    met_at: metLocation,
    met_date: new Date().toISOString().split('T')[0],
    discussion_notes: `Exchanged professional details via SignTap digital contactless profile (/u/${targetProfile.username}).`,
    private_notes: targetProfile.bio || '',
    signtap_username: targetProfile.username,
    source: 'nfc_tap',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  saveContact(newContact);

  // Add initial timeline interaction
  addContactInteraction({
    contact_id: newContact.id,
    owner_user_id: userId,
    type: 'nfc_tap',
    title: 'Exchanged contact via SignTap NFC Tap',
    details: `Met via digital profile /u/${targetProfile.username}`,
    location: metLocation,
    occurred_at: new Date().toISOString()
  });

  return { contact: newContact, isNew: true };
}

// -----------------------------------------------------------------------------
// Direct Messaging & In-App Chat
// -----------------------------------------------------------------------------
export function getAllMessages(): ChatMessage[] {
  return getLocalItem<ChatMessage[]>(STORAGE_KEYS.MESSAGES, [
    {
      id: 'msg-demo-1',
      sender_id: 'user-surya-01',
      sender_name: 'Surya Narayanan',
      sender_username: 'surya',
      receiver_id: 'user-elena-02',
      receiver_name: 'Elena Rostova',
      receiver_username: 'elena',
      content: 'Hi Elena! Great meeting you at the tech summit. Did you get a chance to test the SignTap NFC smart card?',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      read: true,
    },
    {
      id: 'msg-demo-2',
      sender_id: 'user-elena-02',
      sender_name: 'Elena Rostova',
      sender_username: 'elena',
      receiver_id: 'user-surya-01',
      receiver_name: 'Surya Narayanan',
      receiver_username: 'surya',
      content: 'Yes Surya! The contactless tap worked instantly on my iPhone. Loved the sleek layout and vCard save.',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      read: true,
    }
  ]);
}

export function getMessagesBetween(userId1: string, userId2: string): ChatMessage[] {
  const all = getAllMessages();
  return all.filter(m => 
    (m.sender_id === userId1 && m.receiver_id === userId2) ||
    (m.sender_id === userId2 && m.receiver_id === userId1)
  ).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

export function sendMessage(
  sender: UserSession | Profile,
  receiver: Profile,
  content: string
): ChatMessage {
  const messages = getAllMessages();
  const senderId = 'user_id' in sender ? sender.user_id : sender.id;
  const senderName = 'full_name' in sender ? sender.full_name : (sender.user_metadata?.full_name || 'SignTap Member');
  const senderUsername = 'username' in sender ? sender.username : (sender.user_metadata?.username || 'member');
  const senderAvatar = 'profile_image' in sender ? sender.profile_image : (sender.user_metadata?.avatar_url || '');

  const newMsg: ChatMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    sender_id: senderId,
    sender_name: senderName,
    sender_username: senderUsername,
    sender_avatar: senderAvatar,
    receiver_id: receiver.user_id || receiver.id,
    receiver_name: receiver.full_name,
    receiver_username: receiver.username,
    content: content.trim(),
    created_at: new Date().toISOString(),
    read: false,
  };

  messages.push(newMsg);
  setLocalItem(STORAGE_KEYS.MESSAGES, messages);
  return newMsg;
}

export function getConversationsForUser(userId: string): ChatConversation[] {
  const messages = getAllMessages();
  const profiles = getAllProfiles();
  const conversationsMap = new Map<string, ChatConversation>();

  for (const m of messages) {
    const isSender = m.sender_id === userId;
    const isReceiver = m.receiver_id === userId;
    if (!isSender && !isReceiver) continue;

    const otherId = isSender ? m.receiver_id : m.sender_id;
    const otherProfile = profiles.find(p => p.user_id === otherId || p.id === otherId);

    const existing = conversationsMap.get(otherId);
    const unread = (!m.read && m.receiver_id === userId) ? 1 : 0;

    if (!existing || new Date(m.created_at) > new Date(existing.last_message_time || '')) {
      conversationsMap.set(otherId, {
        participant_id: otherId,
        participant_name: otherProfile ? otherProfile.full_name : (isSender ? m.receiver_name : m.sender_name),
        participant_username: otherProfile ? otherProfile.username : (isSender ? m.receiver_username : m.sender_username),
        participant_avatar: otherProfile ? otherProfile.profile_image : (isSender ? undefined : m.sender_avatar),
        participant_headline: otherProfile?.headline || otherProfile?.title || 'SignTap Member',
        last_message: m.content,
        last_message_time: m.created_at,
        unread_count: (existing?.unread_count || 0) + unread,
      });
    } else if (unread > 0) {
      existing.unread_count += unread;
    }
  }

  return Array.from(conversationsMap.values()).sort(
    (a, b) => new Date(b.last_message_time || 0).getTime() - new Date(a.last_message_time || 0).getTime()
  );
}

export function markMessagesAsRead(userId: string, senderId: string): void {
  const messages = getAllMessages();
  let changed = false;
  for (const m of messages) {
    if (m.receiver_id === userId && m.sender_id === senderId && !m.read) {
      m.read = true;
      changed = true;
    }
  }
  if (changed) {
    setLocalItem(STORAGE_KEYS.MESSAGES, messages);
  }
}

export function getUnreadMessageCount(userId: string): number {
  const messages = getAllMessages();
  return messages.filter(m => m.receiver_id === userId && !m.read).length;
}

/**
 * Checks whether a profile or user joined within the last 20 days.
 * Returns isNew boolean, how many days ago they joined, and days left as 'New'.
 * Automatically expires on day 21 (diffDays >= 20).
 */
export function getNewMemberStatus(createdAt?: string, daysLimit = 20): { isNew: boolean; daysAgo: number; daysLeft: number } {
  if (!createdAt) return { isNew: false, daysAgo: 999, daysLeft: 0 };
  const createdDate = new Date(createdAt).getTime();
  if (isNaN(createdDate)) return { isNew: false, daysAgo: 999, daysLeft: 0 };
  const now = Date.now();
  const diffMs = now - createdDate;
  // If created date is in the future due to slight clock drift, treat as 0
  const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  const isNew = diffDays < daysLimit;
  const daysLeft = Math.max(0, daysLimit - diffDays);
  return { isNew, daysAgo: diffDays, daysLeft };
}


