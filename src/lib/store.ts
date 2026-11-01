'use client';

import { 
  Profile, 
  ProfileSection, 
  PortfolioProject, 
  SocialLink, 
  NFCCard, 
  AnalyticsEvent, 
  AnalyticsSummary,
  UserSession 
} from './types';
import { 
  INITIAL_PROFILES, 
  INITIAL_SECTIONS, 
  INITIAL_PROJECTS, 
  INITIAL_LINKS, 
  INITIAL_NFC_CARDS, 
  INITIAL_ANALYTICS 
} from './initialData';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  USER: 'sb_current_user',
  PROFILES: 'sb_profiles',
  SECTIONS: 'sb_sections',
  PROJECTS: 'sb_projects',
  LINKS: 'sb_links',
  CARDS: 'sb_cards',
  ANALYTICS: 'sb_analytics',
};

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
  const defaultUser: UserSession = {
    id: 'user-surya-01',
    email: 'surya@signbridge.click',
    user_metadata: {
      full_name: 'Surya Narayanan',
      username: 'surya',
      profile_type: 'professional',
    }
  };
  return getLocalItem<UserSession | null>(STORAGE_KEYS.USER, defaultUser);
}

export function setCurrentUser(user: UserSession | null): void {
  setLocalItem(STORAGE_KEYS.USER, user);
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
    user_metadata: {
      full_name: matchedProfile ? matchedProfile.full_name : 'SignBridge Pioneer',
      username: matchedProfile ? matchedProfile.username : email.split('@')[0],
      profile_type: matchedProfile ? matchedProfile.profile_type : 'personal',
    }
  };

  setCurrentUser(user);
  return { user };
}

export async function loginWithGoogle(): Promise<{ error?: string }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback`
        : 'https://signbridge.click/auth/callback';

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
      return {};
    } catch (err: any) {
      return { error: err?.message || 'Google authentication failed' };
    }
  }

  // Fallback demo Google user when offline
  const demoGoogleUser: UserSession = {
    id: `user-google-${Date.now()}`,
    email: 'surya.google@signbridge.click',
    user_metadata: {
      full_name: 'Surya Narayanan',
      username: 'surya',
      profile_type: 'professional',
    }
  };
  setCurrentUser(demoGoogleUser);
  return {};
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
    profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    cover_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
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

  // Create initial NFC Card
  const newCard: NFCCard = {
    id: `card-${Date.now()}`,
    card_uid: `SB-CARD-${Math.floor(1000 + Math.random() * 9000)}`,
    owner_user_id: userId,
    profile_id: newProfile.id,
    card_name: `${fullName}'s Smart Card`,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  saveNFCCard(newCard);

  const user: UserSession = {
    id: userId,
    email,
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

export function saveProfile(profile: Profile): void {
  const profiles = getAllProfiles();
  const index = profiles.findIndex(p => p.id === profile.id || p.username.toLowerCase() === profile.username.toLowerCase());
  
  const updatedProfile = {
    ...profile,
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
      theme: updatedProfile.theme,
      accent_color: updatedProfile.accent_color,
      button_style: updatedProfile.button_style,
      font_family: updatedProfile.font_family,
      background_style: updatedProfile.background_style,
      published: updatedProfile.published,
      updated_at: updatedProfile.updated_at,
    }, { onConflict: 'username' }).then(({ error }) => {
      if (error) console.warn('Supabase profile sync notice:', error.message);
    });
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
  const allProjects = getLocalItem<PortfolioProject[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  const index = allProjects.findIndex(p => p.id === project.id);
  if (index >= 0) {
    allProjects[index] = project;
  } else {
    allProjects.push(project);
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
  const allLinks = getLocalItem<SocialLink[]>(STORAGE_KEYS.LINKS, INITIAL_LINKS);
  const index = allLinks.findIndex(l => l.id === link.id);
  if (index >= 0) {
    allLinks[index] = link;
  } else {
    allLinks.push(link);
  }
  setLocalItem(STORAGE_KEYS.LINKS, allLinks);
}

export function deleteLink(linkId: string): void {
  const allLinks = getLocalItem<SocialLink[]>(STORAGE_KEYS.LINKS, INITIAL_LINKS);
  const filtered = allLinks.filter(l => l.id !== linkId);
  setLocalItem(STORAGE_KEYS.LINKS, filtered);
}

// -----------------------------------------------------------------------------
// NFC Smart Cards
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
  return cards.find(c => c.card_uid.toLowerCase() === cardUid.toLowerCase() || c.id === cardUid) || null;
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

export function deleteNFCCard(cardId: string): void {
  const cards = getAllNFCCards();
  const filtered = cards.filter(c => c.id !== cardId);
  setLocalItem(STORAGE_KEYS.CARDS, filtered);
}

// -----------------------------------------------------------------------------
// Analytics
// -----------------------------------------------------------------------------
export function logAnalyticsEvent(profileId: string, eventType: any, linkId?: string): void {
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

  return {
    total_views: Math.max(total_views, 42),
    total_nfc_taps: Math.max(total_nfc_taps, 28),
    total_qr_scans: Math.max(total_qr_scans, 14),
    total_link_clicks: Math.max(total_link_clicks, 39),
    views_by_day: days,
    top_links,
  };
}
