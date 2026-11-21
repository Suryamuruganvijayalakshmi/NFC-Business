// SignBridge NFC TypeScript Definitions
// Brand: SignBridge | Product: SignBridge NFC (signbridge.click)
// Tagline: Your Identity. One Tap Away.

export type ProfileType = 'personal' | 'professional' | 'creator' | 'business';

export type TemplateTheme = 'minimal' | 'signature' | 'creative';

export type ButtonStyle = 'rounded' | 'pill' | 'sharp' | 'glow';

export type FontFamily = 'sans' | 'serif' | 'mono';

export type BackgroundStyle = 'clean' | 'gradient' | 'mesh' | 'navy_grid';

export interface ServiceItem {
  id?: string;
  title: string;
  description?: string;
  price?: string;
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  company_logo?: string;
  location?: string;
  employment_type?: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship' | 'Co-Founder';
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
  skills_used?: string[];
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  field_of_study: string;
  start_year: string;
  end_year?: string;
  grade?: string;
  activities?: string;
  description?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuing_org: string;
  issue_date: string;
  expiration_date?: string;
  credential_id?: string;
  credential_url?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  issuer?: string;
  date?: string;
  description?: string;
}

export interface BusinessEntity {
  id: string;
  name: string;
  tagline?: string;
  description?: string;
  logo?: string;
  website?: string;
  industry?: string;
  services?: string[];
  contact_email?: string;
  whatsapp?: string;
  is_primary?: boolean;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: 'Native' | 'Fluent' | 'Professional' | 'Conversational' | 'Basic';
}

export interface CustomLinkItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
  highlight?: boolean;
}

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  full_name: string;
  profile_type: ProfileType;
  title: string;
  headline?: string;
  bio: string;
  about?: string;
  profile_image: string;
  cover_image?: string;
  location?: string;
  email: string;
  phone?: string;
  website?: string;
  company?: string;
  business_name?: string;
  business_description?: string;
  whatsapp_number?: string;
  portfolio_url?: string;
  resume_url?: string;
  skills?: string[];
  services?: ServiceItem[];
  experiences?: WorkExperience[];
  education?: EducationItem[];
  certifications?: CertificationItem[];
  achievements?: AchievementItem[];
  businesses?: BusinessEntity[];
  languages?: LanguageItem[];
  custom_links?: CustomLinkItem[];
  professional_interests?: string[];
  connections_count?: number;
  followers_count?: number;
  is_premium?: boolean;
  premium_plan?: 'yearly' | 'lifetime' | 'none';
  premium_expires_at?: string;
  theme: TemplateTheme;
  accent_color: string;
  button_style: ButtonStyle;
  font_family: FontFamily;
  background_style: BackgroundStyle;
  published: boolean;
  section_visibility?: {
    bio?: boolean;
    contact?: boolean;
    socials?: boolean;
    skills?: boolean;
    services?: boolean;
    portfolio?: boolean;
    experience?: boolean;
    education?: boolean;
    certifications?: boolean;
    achievements?: boolean;
    businesses?: boolean;
    languages?: boolean;
    activity?: boolean;
  };
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------------------------------
// Professional Networking & Connections
// -----------------------------------------------------------------------------
export type ConnectionStatus = 'pending' | 'connected' | 'declined';

export interface Connection {
  id: string;
  requester_id: string;
  requester_name: string;
  requester_username: string;
  requester_image: string;
  requester_headline: string;
  recipient_id: string;
  recipient_name: string;
  recipient_username: string;
  recipient_image: string;
  recipient_headline: string;
  status: ConnectionStatus;
  created_at: string;
  updated_at?: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

// -----------------------------------------------------------------------------
// Professional Activity Feed (Posts, Updates, Project Drops)
// -----------------------------------------------------------------------------
export interface PostItem {
  id: string;
  author_id: string;
  author_name: string;
  author_username: string;
  author_image: string;
  author_headline: string;
  content: string;
  media_url?: string;
  media_type?: 'image' | 'link' | 'project' | 'milestone';
  project_link?: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  liked_by?: string[];
  bookmarked_by?: string[];
  tags?: string[];
  created_at: string;
}

export interface PostComment {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  author_username: string;
  author_image: string;
  content: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_username: string;
  sender_avatar?: string;
  receiver_id: string;
  receiver_name: string;
  receiver_username: string;
  content: string;
  created_at: string;
  read: boolean;
}

export interface ChatConversation {
  participant_id: string;
  participant_name: string;
  participant_username: string;
  participant_avatar?: string;
  participant_headline?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
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

// NFC Card Statuses as defined in requirements:
// Pending, In Production, Shipped, Delivered, Activated, Blocked, Active, Inactive
export type NFCCardStatus = 
  | 'pending' 
  | 'in_production' 
  | 'shipped' 
  | 'delivered' 
  | 'activated' 
  | 'blocked' 
  | 'active' 
  | 'inactive';

export interface NFCCard {
  id: string;
  card_uid: string;
  activation_code: string;
  owner_user_id: string;
  profile_id: string | null;
  card_name: string;
  status: NFCCardStatus;
  order_reference?: string;
  tap_count?: number;
  created_at: string;
  updated_at: string;
}

// Product Categories: Personal NFC Card, Business NFC Card, Professional NFC Card, Custom NFC Card
export type ProductCategory = 'personal' | 'business' | 'professional' | 'custom';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  short_description: string;
  price: number;
  currency: string;
  features: string[];
  image_url: string;
  material: string;
  badge?: string;
  in_stock: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Order Statuses:
// Order Received, Payment Pending, Confirmed, Processing, In Production, Shipped, Delivered, Cancelled
export type OrderStatus = 
  | 'order_received' 
  | 'payment_pending' 
  | 'confirmed' 
  | 'processing' 
  | 'in_production' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

export type PaymentStatus = 'pending' | 'verified' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  custom_name_to_print?: string;
  custom_notes?: string;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  total_amount: number;
  currency: string;
  status: OrderStatus;
  payment_method: string;
  payment_status: PaymentStatus;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type AnalyticsEventType = 
  | 'profile_view' 
  | 'nfc_tap' 
  | 'qr_visit' 
  | 'link_click' 
  | 'contact_save' 
  | 'whatsapp_click';

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
  total_contact_saves: number;
  total_whatsapp_clicks: number;
  views_by_day: { date: string; views: number; nfc_taps: number }[];
  top_links: { id: string; label: string; url: string; clicks: number }[];
}

export interface AdminActivity {
  id: string;
  admin_email: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface UserSession {
  id: string;
  email: string;
  role?: 'user' | 'admin';
  user_metadata?: {
    full_name?: string;
    username?: string;
    profile_type?: ProfileType;
    phone?: string;
    avatar_url?: string;
    picture?: string;
    [key: string]: any;
  };
}

// -----------------------------------------------------------------------------
// Smart Networking & Contact Relationship Management (CRM)
// -----------------------------------------------------------------------------
export type FollowUpPriority = 'low' | 'medium' | 'high';
export type FollowUpStatus = 'pending' | 'completed';

export interface ContactFollowUp {
  id: string;
  contact_id: string;
  contact_name: string;
  owner_user_id: string;
  title: string;
  description?: string;
  due_date: string; // ISO date 'YYYY-MM-DD'
  priority: FollowUpPriority;
  status: FollowUpStatus;
  completed_at?: string;
  created_at: string;
}

export type InteractionType = 
  | 'nfc_tap' 
  | 'meeting' 
  | 'call' 
  | 'email' 
  | 'whatsapp' 
  | 'note' 
  | 'connection' 
  | 'other';

export interface ContactInteraction {
  id: string;
  contact_id: string;
  owner_user_id: string;
  type: InteractionType;
  title: string;
  details?: string;
  location?: string;
  occurred_at: string;
  created_at: string;
}

export interface SmartContact {
  id: string;
  owner_user_id: string; // Private to this user only
  full_name: string;
  headline?: string;
  company?: string;
  role?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  location?: string;
  website?: string;
  linkedin_url?: string;
  twitter_url?: string;
  github_url?: string;
  category: string; // 'Entrepreneurs', 'Clients', 'Investors', etc.
  tags: string[]; // Custom tags e.g. ['AI', 'Bengaluru Meetup']
  is_important: boolean; // Starred
  
  // Private Networking Notes (Never visible on public profiles)
  met_at?: string; // Where we met, e.g. "TechSparks 2026"
  met_date?: string; // YYYY-MM-DD
  discussion_notes?: string; // What was discussed
  interests?: string; // Their hobbies, professional interests
  opportunities?: string; // Business opportunities identified
  collaboration_ideas?: string; // Future collaboration possibilities
  private_notes?: string; // Additional private scratchpad
  
  // Linked user ID if contact is also a SignTap member
  signtap_username?: string;
  source: 'nfc_tap' | 'manual' | 'qr_scan' | 'profile_save' | 'csv_import';
  
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------------------------------
// Notifications System
// -----------------------------------------------------------------------------
export type NotificationType = 
  | 'connection_request' 
  | 'connection_accepted' 
  | 'new_follower' 
  | 'post_like' 
  | 'post_comment'
  | 'system';

export interface AppNotification {
  id: string;
  user_id: string; // The recipient of the notification
  sender_id?: string;
  sender_name?: string;
  sender_username?: string;
  sender_image?: string;
  sender_headline?: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  connection_id?: string;
  created_at: string;
}


