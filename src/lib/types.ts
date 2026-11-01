// SignBridge ID TypeScript Definitions

export type ProfileType = 'personal' | 'professional' | 'creator' | 'business';

export type TemplateTheme = 'minimal' | 'signature' | 'creative';

export type ButtonStyle = 'rounded' | 'pill' | 'sharp' | 'glow';

export type FontFamily = 'sans' | 'serif' | 'mono';

export type BackgroundStyle = 'clean' | 'gradient' | 'mesh' | 'navy_grid';

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  full_name: string;
  profile_type: ProfileType;
  title: string;
  bio: string;
  profile_image: string;
  cover_image?: string;
  location?: string;
  email: string;
  phone?: string;
  website?: string;
  theme: TemplateTheme;
  accent_color: string;
  button_style: ButtonStyle;
  font_family: FontFamily;
  background_style: BackgroundStyle;
  published: boolean;
  company?: string;
  business_name?: string;
  whatsapp_number?: string;
  created_at: string;
  updated_at: string;
}

export type SectionType = 
  | 'about' 
  | 'experience' 
  | 'education' 
  | 'skills' 
  | 'certifications' 
  | 'services' 
  | 'products' 
  | 'featured_media' 
  | 'custom';

export interface ProfileSection {
  id: string;
  profile_id: string;
  section_type: SectionType;
  title: string;
  content_json: Record<string, any>;
  display_order: number;
  visible: boolean;
}

export interface PortfolioProject {
  id: string;
  profile_id: string;
  title: string;
  description: string;
  image_url: string;
  project_url: string;
  technologies: string[];
  category: string;
  display_order: number;
  created_at: string;
}

export type SocialPlatform = 
  | 'linkedin' 
  | 'github' 
  | 'instagram' 
  | 'youtube' 
  | 'x' 
  | 'facebook' 
  | 'whatsapp' 
  | 'website' 
  | 'email' 
  | 'phone' 
  | 'custom';

export interface SocialLink {
  id: string;
  profile_id: string;
  platform: SocialPlatform;
  label: string;
  url: string;
  display_order: number;
  visible: boolean;
}

export type NFCCardStatus = 'active' | 'inactive' | 'unlinked';

export interface NFCCard {
  id: string;
  card_uid: string;
  owner_user_id: string;
  profile_id: string | null;
  card_name: string;
  status: NFCCardStatus;
  created_at: string;
  updated_at: string;
}

export type AnalyticsEventType = 'profile_view' | 'nfc_tap' | 'qr_visit' | 'link_click';

export interface AnalyticsEvent {
  id: string;
  profile_id: string;
  event_type: AnalyticsEventType;
  link_id?: string;
  created_at: string;
}

export interface AnalyticsSummary {
  total_views: number;
  total_nfc_taps: number;
  total_qr_scans: number;
  total_link_clicks: number;
  views_by_day: { date: string; views: number; nfc_taps: number }[];
  top_links: { id: string; label: string; url: string; clicks: number }[];
}

export interface UserSession {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    username?: string;
    profile_type?: ProfileType;
  };
}
