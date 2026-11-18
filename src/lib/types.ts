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
  company?: string;
  business_name?: string;
  business_description?: string;
  whatsapp_number?: string;
  portfolio_url?: string;
  resume_url?: string;
  skills?: string[];
  services?: ServiceItem[];
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
  };
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
  };
}
