import { Profile, ProfileSection, PortfolioProject, SocialLink, NFCCard, AnalyticsEvent } from './types';

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'prof-surya-01',
    user_id: 'user-surya-01',
    username: 'surya',
    full_name: 'Surya Narayanan',
    profile_type: 'professional',
    title: 'Founder & Hardware Architect',
    bio: 'Pioneering physical-to-digital interactions. Building next-generation NFC embedded systems, IoT infrastructure, and modern web experiences at SignBridge.',
    profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    cover_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    location: 'Bengaluru, India',
    email: 'surya@signbridge.click',
    phone: '+91 98765 43210',
    website: 'https://signbridge.click',
    company: 'SignBridge Inc.',
    theme: 'signature',
    accent_color: '#087CF0',
    button_style: 'rounded',
    font_family: 'sans',
    background_style: 'navy_grid',
    published: true,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-11-01T12:00:00Z',
  },
  {
    id: 'prof-elena-02',
    user_id: 'user-elena-02',
    username: 'elena',
    full_name: 'Elena Rostova',
    profile_type: 'creator',
    title: 'Visual Storyteller & Motion Designer',
    bio: 'Crafting brand universes, 3D kinetic typography, and immersive tactile identities for global forward-thinking brands.',
    profile_image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    cover_image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1600&q=80',
    location: 'Amsterdam, Netherlands',
    email: 'elena@rostova.design',
    website: 'https://rostova.design',
    theme: 'creative',
    accent_color: '#FF7900',
    button_style: 'pill',
    font_family: 'serif',
    background_style: 'gradient',
    published: true,
    created_at: '2026-02-10T14:30:00Z',
    updated_at: '2026-10-28T09:15:00Z',
  },
  {
    id: 'prof-apex-03',
    user_id: 'user-apex-03',
    username: 'apex-studios',
    full_name: 'Apex Digital Labs',
    profile_type: 'business',
    title: 'Enterprise NFC Solutions & Identity Design',
    bio: 'We equip Fortune 500 executives and elite teams with custom titanium and bamboo NFC business credentials with real-time dynamic profiles.',
    profile_image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=600&q=80',
    cover_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
    location: 'London & Singapore',
    email: 'contact@apexlabs.co',
    phone: '+44 20 7946 0912',
    website: 'https://apexlabs.co',
    business_name: 'Apex Digital Labs LLC',
    whatsapp_number: '+442079460912',
    theme: 'minimal',
    accent_color: '#101828',
    button_style: 'sharp',
    font_family: 'sans',
    background_style: 'clean',
    published: true,
    created_at: '2026-03-01T08:00:00Z',
    updated_at: '2026-10-31T16:00:00Z',
  }
];

export const INITIAL_SECTIONS: ProfileSection[] = [
  {
    id: 'sec-surya-1',
    profile_id: 'prof-surya-01',
    section_type: 'experience',
    title: 'Work Experience',
    display_order: 1,
    visible: true,
    content_json: {
      items: [
        {
          role: 'Founder & Chief Hardware Architect',
          company: 'SignBridge',
          period: '2024 — Present',
          description: 'Spearheading the engineering of smart NFC credentials and cloud synchronization platform connecting physical cards to dynamic cloud profiles.'
        },
        {
          role: 'Senior Systems Engineer',
          company: 'Hyperlink Labs',
          period: '2021 — 2024',
          description: 'Designed secure RFID/NFC protocol firmware, automated hardware QA pipelines, and low-latency microservices.'
        }
      ]
    }
  },
  {
    id: 'sec-surya-2',
    profile_id: 'prof-surya-01',
    section_type: 'skills',
    title: 'Technical Core',
    display_order: 2,
    visible: true,
    content_json: {
      tags: ['NFC NTAG216', 'Embedded C/C++', 'Next.js App Router', 'TypeScript', 'Supabase PostgreSQL', 'Hardware Security', 'IoT Telemetry']
    }
  },
  {
    id: 'sec-surya-3',
    profile_id: 'prof-surya-01',
    section_type: 'education',
    title: 'Education',
    display_order: 3,
    visible: true,
    content_json: {
      items: [
        {
          degree: 'B.Tech in Computer Science & Embedded Systems',
          institution: 'National Institute of Technology',
          period: '2017 — 2021',
          grade: 'First Class with Distinction'
        }
      ]
    }
  }
];

export const INITIAL_PROJECTS: PortfolioProject[] = [
  {
    id: 'proj-surya-1',
    profile_id: 'prof-surya-01',
    title: 'SignBridge NFC Smart Card V2',
    description: 'Ultra-thin matte black PVC and brushed stainless steel NFC smart cards with encrypted NDEF payload and instant URL routing.',
    image_url: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
    project_url: 'https://signbridge.click',
    technologies: ['NFC NTAG213/216', 'Next.js', 'PostgreSQL'],
    category: 'Hardware & IoT',
    display_order: 1,
    created_at: '2026-04-10T11:00:00Z',
  },
  {
    id: 'proj-surya-2',
    profile_id: 'prof-surya-01',
    title: 'PulseTelemetry Mesh Network',
    description: 'An open-source low-power telemetry protocol for distributed conference badge scanners and lead retrieval stations.',
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    project_url: 'https://github.com/signbridge/pulse-telemetry',
    technologies: ['C++', 'BLE', 'MQTT', 'WebSockets'],
    category: 'Firmware',
    display_order: 2,
    created_at: '2026-06-15T15:30:00Z',
  },
  {
    id: 'proj-surya-3',
    profile_id: 'prof-surya-01',
    title: 'Dynamic QR Identity Engine',
    description: 'High-contrast micro-QR generator with embedded logo vector mask and client-side contact parsing without server latency.',
    image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    project_url: 'https://signbridge.click/features',
    technologies: ['Canvas API', 'TypeScript', 'Web Workers'],
    category: 'Web Architecture',
    display_order: 3,
    created_at: '2026-08-20T09:20:00Z',
  }
];

export const INITIAL_LINKS: SocialLink[] = [
  {
    id: 'link-surya-1',
    profile_id: 'prof-surya-01',
    platform: 'linkedin',
    label: 'Connect on LinkedIn',
    url: 'https://linkedin.com/in/surya-signbridge',
    display_order: 1,
    visible: true,
  },
  {
    id: 'link-surya-2',
    profile_id: 'prof-surya-01',
    platform: 'github',
    label: 'GitHub Repositories',
    url: 'https://github.com/surya-dev',
    display_order: 2,
    visible: true,
  },
  {
    id: 'link-surya-3',
    profile_id: 'prof-surya-01',
    platform: 'x',
    label: 'Follow on X',
    url: 'https://x.com/surya_signbridge',
    display_order: 3,
    visible: true,
  },
  {
    id: 'link-surya-4',
    profile_id: 'prof-surya-01',
    platform: 'website',
    label: 'Official Website',
    url: 'https://signbridge.click',
    display_order: 4,
    visible: true,
  },
  {
    id: 'link-surya-5',
    profile_id: 'prof-surya-01',
    platform: 'whatsapp',
    label: 'Chat on WhatsApp',
    url: 'https://wa.me/919876543210',
    display_order: 5,
    visible: true,
  }
];

export const INITIAL_NFC_CARDS: NFCCard[] = [
  {
    id: 'card-surya-01',
    card_uid: 'SB-CARD-7821',
    owner_user_id: 'user-surya-01',
    profile_id: 'prof-surya-01',
    card_name: 'Surya Signature Matte Black Card',
    status: 'active',
    created_at: '2026-03-12T10:00:00Z',
    updated_at: '2026-10-31T14:00:00Z',
  },
  {
    id: 'card-surya-02',
    card_uid: 'SB-CARD-9044',
    owner_user_id: 'user-surya-01',
    profile_id: 'prof-surya-01',
    card_name: 'Surya Brushed Steel Keychain Tag',
    status: 'active',
    created_at: '2026-05-20T11:30:00Z',
    updated_at: '2026-10-15T08:00:00Z',
  }
];

export const INITIAL_ANALYTICS: AnalyticsEvent[] = [
  { id: 'ev-1', profile_id: 'prof-surya-01', event_type: 'profile_view', created_at: '2026-10-25T08:12:00Z' },
  { id: 'ev-2', profile_id: 'prof-surya-01', event_type: 'nfc_tap', created_at: '2026-10-25T09:30:00Z' },
  { id: 'ev-3', profile_id: 'prof-surya-01', event_type: 'link_click', link_id: 'link-surya-1', created_at: '2026-10-25T09:35:00Z' },
  { id: 'ev-4', profile_id: 'prof-surya-01', event_type: 'profile_view', created_at: '2026-10-26T12:00:00Z' },
  { id: 'ev-5', profile_id: 'prof-surya-01', event_type: 'nfc_tap', created_at: '2026-10-26T14:15:00Z' },
  { id: 'ev-6', profile_id: 'prof-surya-01', event_type: 'qr_visit', created_at: '2026-10-27T16:45:00Z' },
  { id: 'ev-7', profile_id: 'prof-surya-01', event_type: 'nfc_tap', created_at: '2026-10-28T10:20:00Z' },
  { id: 'ev-8', profile_id: 'prof-surya-01', event_type: 'profile_view', created_at: '2026-10-29T11:10:00Z' },
  { id: 'ev-9', profile_id: 'prof-surya-01', event_type: 'link_click', link_id: 'link-surya-2', created_at: '2026-10-29T11:15:00Z' },
  { id: 'ev-10', profile_id: 'prof-surya-01', event_type: 'nfc_tap', created_at: '2026-10-30T17:05:00Z' },
  { id: 'ev-11', profile_id: 'prof-surya-01', event_type: 'profile_view', created_at: '2026-10-31T09:00:00Z' },
  { id: 'ev-12', profile_id: 'prof-surya-01', event_type: 'nfc_tap', created_at: '2026-10-31T15:20:00Z' },
  { id: 'ev-13', profile_id: 'prof-surya-01', event_type: 'profile_view', created_at: '2026-11-01T10:00:00Z' },
];
