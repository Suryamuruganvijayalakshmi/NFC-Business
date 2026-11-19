import { 
  Profile, 
  ProfileSection, 
  PortfolioProject, 
  SocialLink, 
  NFCCard, 
  AnalyticsEvent, 
  Product, 
  Order, 
  AdminActivity 
} from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-business',
    name: 'Business NFC Card',
    category: 'business',
    short_description: 'Engineered for corporate executives, sales teams, and agencies. Instant 1-click WhatsApp business chat, services catalog showcase, verified branding, and client lead capture.',
    price: 199,
    currency: 'INR',
    features: [
      'Instant WhatsApp 1-click business chat button',
      'Showcase company catalog, pricing & services',
      'Custom corporate logo & cardholder name laser-engraved',
      'Client lead capture and enquiry intake form',
      'Team member profile re-assignment & analytics',
      'High-grade matte PVC with embedded NTAG216 chip',
      'Dynamic backup QR code on back',
      'Free courier delivery across India'
    ],
    material: 'Midnight Obsidian & Gold Accents',
    image_url: '/images/nfc-smart-card.webp',
    badge: 'Enterprise Choice · Popular',
    in_stock: true,
    display_order: 1,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-11-01T00:00:00Z',
  },
  {
    id: 'prod-personal',
    name: 'Personal NFC Card',
    category: 'personal',
    short_description: 'Sleek, minimalist contactless smart card designed for individuals, creators, and professionals. Share your portfolio, verified social links, and 1-tap vCard phonebook save.',
    price: 199,
    currency: 'INR',
    features: [
      'One-tap instant digital profile sharing',
      'Direct 1-tap phonebook vCard contact save',
      'Personal portfolio, project gallery & resume link',
      'Consolidated social hub (LinkedIn, GitHub, X, Instagram)',
      'Embedded NTAG216 microchip (888 bytes, 100k writes)',
      'Dynamic backup QR code on back',
      'Unlimited real-time cloud profile updates',
      'Free courier delivery across India'
    ],
    material: 'Matte Jet Black Polymer',
    image_url: '/images/nfc-smart-card.webp',
    badge: 'Creator & Individual Choice',
    in_stock: true,
    display_order: 2,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-11-01T00:00:00Z',
  },
];

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
    email: 'signbridge.aiauto@gmail.com',
    phone: '+91 98422 53267',
    website: 'https://signbridge.click',
    company: 'SignTap Labs',
    business_name: 'SignBridge Technologies Pvt. Ltd.',
    business_description: 'Next-generation contactless identity systems bridging physical cards with dynamic web ecosystems.',
    whatsapp_number: '+919842253267',
    portfolio_url: 'https://signbridge.click',
    resume_url: 'https://signbridge.click/resume.pdf',
    skills: ['NFC Architecture', 'Embedded IoT', 'Full-Stack Next.js', 'System Security', 'Hardware Prototyping', 'Product Strategy'],
    services: [
      { title: 'Custom NFC Fleet Deployment', description: 'Enterprise-grade smart card architecture for company executives and sales forces.' },
      { title: 'Digital Identity Consulting', description: 'Transforming brand networking into contactless, trackable digital channels.' },
      { title: 'Hardware Integration', description: 'Custom NTAG216 and cryptographic contactless tags for physical security.' }
    ],
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
      experience: true
    },
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
    phone: '+31 6 12345678',
    website: 'https://rostova.design',
    company: 'Rostova Creative',
    skills: ['3D Motion Graphics', 'Brand Identity', 'Kinetic Typography', 'Creative Direction', 'Art Direction'],
    services: [
      { title: 'Brand Identity Design', description: 'Complete visual identity systems and digital design guidelines.' },
      { title: 'Motion & 3D Campaigns', description: 'High-impact 3D animation for product reveals and digital showcases.' }
    ],
    theme: 'creative',
    accent_color: '#FF7900',
    button_style: 'pill',
    font_family: 'serif',
    background_style: 'gradient',
    published: true,
    section_visibility: {
      bio: true,
      contact: true,
      socials: true,
      skills: true,
      services: true,
      portfolio: true
    },
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
    company: 'Apex Digital Labs LLC',
    business_name: 'Apex Digital Labs LLC',
    whatsapp_number: '+442079460912',
    skills: ['Fleet Management', 'Enterprise Security', 'Custom RFID/NFC', 'Team Portals', 'Cloud Directory Sync'],
    services: [
      { title: 'Corporate Fleet NFC Rollout', description: 'Bulk provisioned NFC cards integrated with corporate HR and SSO.' },
      { title: 'Custom Branded Portals', description: 'Whitelabel digital identity portals for sales organizations.' }
    ],
    theme: 'minimal',
    accent_color: '#101828',
    button_style: 'sharp',
    font_family: 'sans',
    background_style: 'clean',
    published: true,
    section_visibility: {
      bio: true,
      contact: true,
      socials: true,
      skills: true,
      services: true,
      portfolio: true
    },
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
    section_type: 'education',
    title: 'Education',
    display_order: 2,
    visible: true,
    content_json: {
      items: [
        {
          degree: 'B.Tech in Computer Science & Engineering',
          institution: 'Institute of Technology',
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
    title: 'SignBridge Contactless Identity Protocol',
    description: 'High-speed NFC dynamic routing architecture with zero app dependencies and instant vCard generation.',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    project_url: 'https://signbridge.click',
    technologies: ['NTAG216', 'Next.js', 'PostgreSQL', 'Web NFC API'],
    category: 'Hardware & Web',
    display_order: 1,
    created_at: '2026-01-20T10:00:00Z',
  },
  {
    id: 'proj-surya-2',
    profile_id: 'prof-surya-01',
    title: 'SignBridge AI Sign Translation',
    description: 'Real-time gesture recognition converting sign language gestures into audible speech and text.',
    image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    project_url: 'https://signbridge.click',
    technologies: ['MediaPipe', 'PyTorch', 'TensorFlow.js', 'FastAPI'],
    category: 'AI & Assistive Tech',
    display_order: 2,
    created_at: '2026-02-15T12:00:00Z',
  }
];

export const INITIAL_LINKS: SocialLink[] = [
  {
    id: 'link-surya-1',
    profile_id: 'prof-surya-01',
    platform: 'linkedin',
    label: 'LinkedIn',
    url: 'https://linkedin.com/in/surya-narayanan',
    display_order: 1,
    visible: true,
  },
  {
    id: 'link-surya-2',
    profile_id: 'prof-surya-01',
    platform: 'github',
    label: 'GitHub',
    url: 'https://github.com/surya-narayanan',
    display_order: 2,
    visible: true,
  },
  {
    id: 'link-surya-3',
    profile_id: 'prof-surya-01',
    platform: 'x',
    label: 'X (Twitter)',
    url: 'https://x.com/surya_signbridge',
    display_order: 3,
    visible: true,
  },
  {
    id: 'link-surya-4',
    profile_id: 'prof-surya-01',
    platform: 'website',
    label: 'Main Site',
    url: 'https://signbridge.click',
    display_order: 4,
    visible: true,
  }
];

export const INITIAL_NFC_CARDS: NFCCard[] = [
  {
    id: 'card-sb-01',
    card_uid: 'SB-NFC-9842',
    activation_code: 'ACT-9842-X',
    owner_user_id: 'user-surya-01',
    profile_id: 'prof-surya-01',
    card_name: 'Surya — Titanium Pro NFC Card',
    status: 'activated',
    order_reference: 'SBN-2026-8491',
    tap_count: 184,
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-11-01T12:00:00Z',
  },
  {
    id: 'card-sb-02',
    card_uid: 'SB-NFC-7319',
    activation_code: 'ACT-7319-Y',
    owner_user_id: 'user-elena-02',
    profile_id: 'prof-elena-02',
    card_name: 'Elena — Minimal Matte Black Card',
    status: 'activated',
    order_reference: 'SBN-2026-8512',
    tap_count: 96,
    created_at: '2026-02-12T14:30:00Z',
    updated_at: '2026-10-28T09:15:00Z',
  },
  {
    id: 'card-sb-03',
    card_uid: 'SB-NFC-4410',
    activation_code: 'ACT-4410-Z',
    owner_user_id: 'user-apex-03',
    profile_id: 'prof-apex-03',
    card_name: 'Apex Labs — Corporate Fleet Card #1',
    status: 'activated',
    order_reference: 'SBN-2026-8560',
    tap_count: 210,
    created_at: '2026-03-05T08:00:00Z',
    updated_at: '2026-10-31T16:00:00Z',
  },
  {
    id: 'card-sb-04',
    card_uid: 'SB-NFC-1188',
    activation_code: 'ACT-1188-A',
    owner_user_id: 'user-surya-01',
    profile_id: 'prof-surya-01',
    card_name: 'Surya — Backup Travel NFC Card',
    status: 'shipped',
    order_reference: 'SBN-2026-8622',
    tap_count: 0,
    created_at: '2026-11-10T11:00:00Z',
    updated_at: '2026-11-15T09:00:00Z',
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-8491',
    order_number: 'SBN-2026-8491',
    user_id: 'user-surya-01',
    customer_name: 'Surya Narayanan',
    customer_email: 'surya@signbridge.click',
    customer_phone: '+91 98765 43210',
    shipping_address: {
      fullName: 'Surya Narayanan',
      street: '124 Innovation Park, Tech Corridor',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560100',
      country: 'India',
    },
    items: [
      {
        id: 'item-1',
        order_id: 'ord-8491',
        product_id: 'prod-professional',
        product_name: 'Professional NFC Card',
        quantity: 1,
        unit_price: 49,
        custom_name_to_print: 'Surya Narayanan',
        custom_notes: 'Laser-etched metallic edge',
      }
    ],
    total_amount: 49,
    currency: 'USD',
    status: 'delivered',
    payment_method: 'Manual Bank Transfer (Verified)',
    payment_status: 'verified',
    tracking_number: 'DHL-IN-9872145',
    notes: 'Delivered successfully. Card activated by customer.',
    created_at: '2026-01-16T10:00:00Z',
    updated_at: '2026-01-20T16:00:00Z',
  },
  {
    id: 'ord-8512',
    order_number: 'SBN-2026-8512',
    user_id: 'user-elena-02',
    customer_name: 'Elena Rostova',
    customer_email: 'elena@rostova.design',
    customer_phone: '+31 6 12345678',
    shipping_address: {
      fullName: 'Elena Rostova',
      street: 'Prinsengracht 450',
      city: 'Amsterdam',
      state: 'North Holland',
      postalCode: '1016 HL',
      country: 'Netherlands',
    },
    items: [
      {
        id: 'item-2',
        order_id: 'ord-8512',
        product_id: 'prod-personal',
        product_name: 'Personal NFC Card',
        quantity: 1,
        unit_price: 29,
        custom_name_to_print: 'Elena Rostova',
      }
    ],
    total_amount: 29,
    currency: 'USD',
    status: 'delivered',
    payment_method: 'Invoice Bank Wire',
    payment_status: 'verified',
    tracking_number: 'POSTNL-NL-481920',
    notes: 'Delivered and active.',
    created_at: '2026-02-10T14:30:00Z',
    updated_at: '2026-02-14T11:00:00Z',
  },
  {
    id: 'ord-8560',
    order_number: 'SBN-2026-8560',
    user_id: 'user-apex-03',
    customer_name: 'Apex Digital Labs',
    customer_email: 'contact@apexlabs.co',
    customer_phone: '+44 20 7946 0912',
    shipping_address: {
      fullName: 'Apex Digital Labs — Procurement',
      street: '30 St Mary Axe',
      city: 'London',
      state: 'Greater London',
      postalCode: 'EC3A 8EP',
      country: 'United Kingdom',
    },
    items: [
      {
        id: 'item-3',
        order_id: 'ord-8560',
        product_id: 'prod-business',
        product_name: 'Business NFC Card',
        quantity: 5,
        unit_price: 69,
        custom_name_to_print: 'Apex Executive Suite',
        custom_notes: 'Includes company logo vector print',
      }
    ],
    total_amount: 345,
    currency: 'USD',
    status: 'in_production',
    payment_method: 'Corporate Wire Transfer',
    payment_status: 'verified',
    notes: 'Laser printing stage. Delivery scheduled via Fedex Express.',
    created_at: '2026-11-01T09:00:00Z',
    updated_at: '2026-11-05T14:00:00Z',
  },
  {
    id: 'ord-8604',
    order_number: 'SBN-2026-8604',
    user_id: 'user-surya-01',
    customer_name: 'Surya Narayanan',
    customer_email: 'surya@signbridge.click',
    customer_phone: '+91 98765 43210',
    shipping_address: {
      fullName: 'Surya Narayanan',
      street: '124 Innovation Park, Tech Corridor',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560100',
      country: 'India',
    },
    items: [
      {
        id: 'item-4',
        order_id: 'ord-8604',
        product_id: 'prod-custom',
        product_name: 'Custom NFC Card',
        quantity: 1,
        unit_price: 89,
        custom_name_to_print: 'Surya N. — Aerospace Edition',
        custom_notes: 'Carbon fiber texture with orange edge glow',
      }
    ],
    total_amount: 89,
    currency: 'USD',
    status: 'payment_pending',
    payment_method: 'Manual UPI / Bank Transfer',
    payment_status: 'pending',
    notes: 'Awaiting customer transaction receipt upload.',
    created_at: '2026-11-16T18:00:00Z',
    updated_at: '2026-11-16T18:00:00Z',
  }
];

export const INITIAL_ANALYTICS: AnalyticsEvent[] = [
  { id: 'ev-1', profile_id: 'prof-surya-01', event_type: 'profile_view', created_at: '2026-11-17T08:00:00Z' },
  { id: 'ev-2', profile_id: 'prof-surya-01', event_type: 'nfc_tap', created_at: '2026-11-17T09:30:00Z' },
  { id: 'ev-3', profile_id: 'prof-surya-01', event_type: 'contact_save', created_at: '2026-11-17T09:35:00Z' },
  { id: 'ev-4', profile_id: 'prof-surya-01', event_type: 'whatsapp_click', created_at: '2026-11-17T11:00:00Z' },
  { id: 'ev-5', profile_id: 'prof-surya-01', event_type: 'nfc_tap', created_at: '2026-11-18T10:15:00Z' },
  { id: 'ev-6', profile_id: 'prof-surya-01', event_type: 'profile_view', created_at: '2026-11-18T11:45:00Z' },
  { id: 'ev-7', profile_id: 'prof-surya-01', event_type: 'link_click', link_id: 'link-surya-1', created_at: '2026-11-18T12:00:00Z' }
];

export const INITIAL_ADMIN_ACTIVITIES: AdminActivity[] = [
  {
    id: 'act-1',
    admin_email: 'admin@signbridge.click',
    action: 'Card Provisioned',
    details: 'Provisioned NFC Card SB-NFC-9842 for customer surya (Surya Narayanan)',
    timestamp: '2026-11-01T10:15:00Z',
  },
  {
    id: 'act-2',
    admin_email: 'admin@signbridge.click',
    action: 'Payment Verified',
    details: 'Verified manual bank transfer for Order SBN-2026-8560 ($345.00)',
    timestamp: '2026-11-02T14:20:00Z',
  },
  {
    id: 'act-3',
    admin_email: 'admin@signbridge.click',
    action: 'Order Status Update',
    details: 'Changed status of Order SBN-2026-8560 to "In Production"',
    timestamp: '2026-11-05T14:00:00Z',
  },
  {
    id: 'act-4',
    admin_email: 'admin@signbridge.click',
    action: 'Product Price Configured',
    details: 'Updated Professional NFC Card catalog price to $49.00',
    timestamp: '2026-11-10T16:45:00Z',
  }
];
