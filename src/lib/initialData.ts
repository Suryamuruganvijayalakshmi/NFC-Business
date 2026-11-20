import { 
  Profile, 
  ProfileSection, 
  PortfolioProject, 
  SocialLink, 
  NFCCard, 
  AnalyticsEvent, 
  Product, 
  Order, 
  AdminActivity,
  Connection,
  PostItem,
  PostComment,
  Follow
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
    headline: 'Founder & Hardware Architect at SignBridge | NFC Contactless Systems & Physical Web Pioneer',
    bio: 'Pioneering physical-to-digital interactions. Building next-generation NFC embedded systems, IoT infrastructure, and modern web experiences at SignBridge.',
    about: 'Hardware systems architect and founder with 6+ years designing embedded IoT microcontrollers, high-speed contactless protocol firmware, and scalable cloud-synchronized web portals. Currently scaling SignTap to modernize professional identity and physical business interactions across India and global markets.',
    profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    cover_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    location: 'Bengaluru, Karnataka, India',
    email: 'signbridge.aiauto@gmail.com',
    phone: '+91 98422 53267',
    website: 'https://signbridge.click',
    company: 'SignTap Labs',
    business_name: 'SignBridge Technologies Pvt. Ltd.',
    business_description: 'Next-generation contactless identity systems bridging physical cards with dynamic web ecosystems.',
    whatsapp_number: '+919842253267',
    portfolio_url: 'https://signbridge.click',
    resume_url: 'https://signbridge.click/resume.pdf',
    skills: [
      'NFC Architecture',
      'Embedded IoT',
      'Full-Stack Next.js',
      'System Security',
      'Hardware Prototyping',
      'Product Strategy',
      'TypeScript',
      'PostgreSQL',
      'RFID Protocols'
    ],
    services: [
      { title: 'Custom NFC Fleet Deployment', description: 'Enterprise-grade smart card architecture for company executives and sales forces.', price: '₹4,999 onwards' },
      { title: 'Digital Identity Consulting', description: 'Transforming brand networking into contactless, trackable digital channels.', price: 'Custom Quote' },
      { title: 'Hardware Integration', description: 'Custom NTAG216 and cryptographic contactless tags for physical security.', price: '₹9,999' }
    ],
    experiences: [
      {
        id: 'exp-surya-1',
        title: 'Founder & Chief Hardware Architect',
        company: 'SignBridge Technologies',
        company_logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80',
        location: 'Bengaluru, India',
        employment_type: 'Full-time',
        start_date: 'Jan 2024',
        is_current: true,
        description: 'Leading the design of smart NFC credentials and cloud synchronization platform connecting physical cards to dynamic cloud profiles. Scaled active contactless smart card deployments across corporate clients.',
        skills_used: ['NTAG216', 'Next.js', 'PostgreSQL', 'Web NFC', 'Hardware Design']
      },
      {
        id: 'exp-surya-2',
        title: 'Senior Systems Engineer',
        company: 'Hyperlink Labs',
        location: 'Bengaluru, India',
        employment_type: 'Full-time',
        start_date: 'Jun 2021',
        end_date: 'Dec 2023',
        is_current: false,
        description: 'Designed secure RFID/NFC protocol firmware, automated hardware QA pipelines, and developed low-latency cloud synchronization microservices.',
        skills_used: ['C++', 'Embedded C', 'IoT Security', 'Kafka', 'Docker']
      }
    ],
    education: [
      {
        id: 'edu-surya-1',
        school: 'National Institute of Technology',
        degree: 'Bachelor of Technology (B.Tech)',
        field_of_study: 'Computer Science & Engineering',
        start_year: '2017',
        end_year: '2021',
        grade: 'First Class with Distinction (8.9 CGPA)',
        activities: 'Head of Robotics Club, IEEE Student Branch Secretary',
        description: 'Specialized in Microprocessor Architectures, Network Protocols, and Embedded Operating Systems.'
      }
    ],
    certifications: [
      {
        id: 'cert-surya-1',
        name: 'Certified IoT Systems Architect',
        issuing_org: 'IEEE Computer Society',
        issue_date: 'Oct 2023',
        credential_id: 'IEEE-IOT-84920'
      },
      {
        id: 'cert-surya-2',
        name: 'NFC Forum Type 2/4 Tag Implementation',
        issuing_org: 'NFC Forum Global',
        issue_date: 'Mar 2022',
        credential_id: 'NFC-FORUM-4491'
      }
    ],
    achievements: [
      {
        id: 'ach-surya-1',
        title: 'National Hardware Innovation Award 2024',
        issuer: 'India Tech Conclave',
        date: '2024',
        description: 'Awarded 1st place for pioneering contactless dynamic identity systems.'
      }
    ],
    businesses: [
      {
        id: 'biz-surya-1',
        name: 'SignBridge Technologies Pvt. Ltd.',
        tagline: 'Physical-to-Digital Contactless Identity Ecosystem',
        description: 'Manufacturer of smart NFC cards, contactless portals, and digital presence tools for professionals and modern enterprises.',
        website: 'https://signbridge.click',
        industry: 'Hardware & IoT / SaaS',
        services: ['Enterprise NFC Fleet Provisioning', 'Dynamic Cloud Profiles', 'Event Lead Badges'],
        contact_email: 'signbridge.aiauto@gmail.com',
        whatsapp: '+919842253267',
        is_primary: true
      }
    ],
    languages: [
      { id: 'lang-surya-1', language: 'English', proficiency: 'Fluent' },
      { id: 'lang-surya-2', language: 'Tamil', proficiency: 'Native' },
      { id: 'lang-surya-3', language: 'Hindi', proficiency: 'Professional' }
    ],
    custom_links: [
      { id: 'cl-surya-1', title: 'Schedule a Hardware Demo', url: 'https://calendly.com', icon: 'calendar', highlight: true },
      { id: 'cl-surya-2', title: 'SignBridge Whitepaper', url: 'https://signbridge.click/whitepaper.pdf', icon: 'file' }
    ],
    professional_interests: ['Smart Cards', 'Contactless Hardware', 'Web NFC', 'Decentralized Identity', 'Clean Tech'],
    connections_count: 548,
    followers_count: 1290,
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
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-11-20T12:00:00Z',
  },
  {
    id: 'prof-elena-02',
    user_id: 'user-elena-02',
    username: 'elena',
    full_name: 'Elena Rostova',
    profile_type: 'creator',
    title: 'Visual Storyteller & Motion Designer',
    headline: 'Visual Storyteller & Motion Designer | Creating 3D Kinetic Identities for Global Brands',
    bio: 'Crafting brand universes, 3D kinetic typography, and immersive tactile identities for global forward-thinking brands.',
    about: 'Award-winning creative director and motion artist with 8+ years collaborating with tech studios and luxury houses across Europe. Passionate about tactile interfaces, kinetic typography, and generative aesthetics.',
    profile_image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    cover_image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1600&q=80',
    location: 'Amsterdam, Netherlands',
    email: 'elena@rostova.design',
    phone: '+31 6 12345678',
    website: 'https://rostova.design',
    company: 'Rostova Creative',
    skills: ['3D Motion Graphics', 'Brand Identity', 'Kinetic Typography', 'Creative Direction', 'Cinema 4D', 'Blender', 'Figma'],
    services: [
      { title: 'Brand Identity Design', description: 'Complete visual identity systems and digital design guidelines.', price: '€2,500' },
      { title: 'Motion & 3D Campaigns', description: 'High-impact 3D animation for product reveals and digital showcases.', price: '€3,800' }
    ],
    experiences: [
      {
        id: 'exp-elena-1',
        title: 'Founder & Creative Director',
        company: 'Rostova Creative Studio',
        location: 'Amsterdam, Netherlands',
        employment_type: 'Full-time',
        start_date: 'Mar 2021',
        is_current: true,
        description: 'Directing visual storytelling campaigns, 3D interactive graphics, and brand identity systems for international tech clients.',
        skills_used: ['Cinema 4D', 'After Effects', 'Brand Systems']
      }
    ],
    education: [
      {
        id: 'edu-elena-1',
        school: 'Gerrit Rietveld Academie',
        degree: 'Bachelor of Fine Arts (BFA)',
        field_of_study: 'Graphic Design & Visual Communications',
        start_year: '2016',
        end_year: '2020',
        grade: 'Cum Laude'
      }
    ],
    certifications: [
      {
        id: 'cert-elena-1',
        name: 'Advanced 3D Motion Design',
        issuing_org: 'School of Motion',
        issue_date: 'Aug 2021'
      }
    ],
    achievements: [
      {
        id: 'ach-elena-1',
        title: 'Awwwards Site of the Day 2023',
        issuer: 'Awwwards',
        date: '2023',
        description: 'Recognized for immersive 3D generative portfolio design.'
      }
    ],
    businesses: [
      {
        id: 'biz-elena-1',
        name: 'Rostova Creative Studio',
        tagline: 'Visual identities that move hearts & minds',
        description: 'Boutique design and motion direction agency.',
        website: 'https://rostova.design',
        industry: 'Design & Creative Media',
        services: ['Brand Systems', '3D Motion Drops', 'Interactive Experiences'],
        contact_email: 'hello@rostova.design',
        is_primary: true
      }
    ],
    languages: [
      { id: 'lang-elena-1', language: 'English', proficiency: 'Fluent' },
      { id: 'lang-elena-2', language: 'Dutch', proficiency: 'Conversational' },
      { id: 'lang-elena-3', language: 'Russian', proficiency: 'Native' }
    ],
    professional_interests: ['Kinetic Typography', 'Generative Art', 'Industrial Design', 'UI/UX'],
    connections_count: 420,
    followers_count: 3100,
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
      portfolio: true,
      experience: true,
      education: true,
      certifications: true,
      achievements: true,
      businesses: true,
      languages: true,
      activity: true
    },
    created_at: '2026-02-10T14:30:00Z',
    updated_at: '2026-11-18T09:15:00Z',
  },
  {
    id: 'prof-alex-03',
    user_id: 'user-alex-03',
    username: 'alex',
    full_name: 'Alex Chen',
    profile_type: 'professional',
    title: 'Lead AI & Full-Stack Architect',
    headline: 'Lead AI & Full-Stack Architect at NeuralFlow | Building Scalable Agentic Workflows & Edge ML',
    bio: 'Bridging distributed cloud systems with state-of-the-art edge AI. Building agentic frameworks and high-throughput microservices.',
    about: 'Senior systems architect with a background in low-latency infrastructure and distributed ML pipelines. Creator of open-source tools with over 10,000 GitHub stars. Passionate about empowering developers through AI tooling and contactless developer credentials.',
    profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    cover_image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80',
    location: 'San Francisco, CA, USA',
    email: 'alex@neuralflow.io',
    phone: '+1 415 555 0192',
    website: 'https://neuralflow.io',
    company: 'NeuralFlow Labs',
    skills: ['PyTorch', 'Next.js 16', 'TypeScript', 'Kubernetes', 'Edge AI', 'Rust', 'GraphQL', 'Vector DBs'],
    services: [
      { title: 'Agentic AI Architecture', description: 'Enterprise LLM pipeline design, prompt optimization, and rag systems.', price: '$200/hr' },
      { title: 'Full-Stack Performance Audit', description: 'Next.js App router optimization, bundle reduction, and edge caching.', price: '$1,500' }
    ],
    experiences: [
      {
        id: 'exp-alex-1',
        title: 'Staff AI Infrastructure Engineer',
        company: 'NeuralFlow Labs',
        location: 'San Francisco, CA',
        employment_type: 'Full-time',
        start_date: 'Feb 2022',
        is_current: true,
        description: 'Orchestrating multi-agent inference workloads, reducing GPU cluster latency by 45%, and leading a team of 8 engineers.',
        skills_used: ['PyTorch', 'Rust', 'CUDA', 'Next.js', 'Go']
      },
      {
        id: 'exp-alex-2',
        title: 'Senior Software Engineer',
        company: 'Stripe',
        location: 'San Francisco, CA',
        employment_type: 'Full-time',
        start_date: 'Aug 2019',
        end_date: 'Jan 2022',
        is_current: false,
        description: 'Built high-throughput payment ingestion APIs handling 15,000+ requests per second with 99.999% SLA.',
        skills_used: ['Ruby', 'Java', 'Distributed Systems', 'PostgreSQL']
      }
    ],
    education: [
      {
        id: 'edu-alex-1',
        school: 'University of California, Berkeley',
        degree: 'Bachelor of Science (B.S.)',
        field_of_study: 'EECS & Machine Learning',
        start_year: '2015',
        end_year: '2019',
        grade: 'Dean’s Honors List (3.92 GPA)'
      }
    ],
    certifications: [
      {
        id: 'cert-alex-1',
        name: 'AWS Certified Solutions Architect – Professional',
        issuing_org: 'Amazon Web Services',
        issue_date: 'Nov 2022',
        credential_id: 'AWS-PSA-90184'
      }
    ],
    achievements: [
      {
        id: 'ach-alex-1',
        title: 'Open Source Contributor of the Year 2023',
        issuer: 'OpenSource Guild SF',
        date: '2023',
        description: 'Honored for building high-speed vector quantization algorithms in Rust.'
      }
    ],
    businesses: [
      {
        id: 'biz-alex-1',
        name: 'NeuralFlow Labs',
        tagline: 'Autonomous AI infrastructure for developers',
        description: 'Developer tooling and edge inference APIs.',
        website: 'https://neuralflow.io',
        industry: 'Artificial Intelligence / Cloud Infra',
        contact_email: 'contact@neuralflow.io',
        is_primary: true
      }
    ],
    languages: [
      { id: 'lang-alex-1', language: 'English', proficiency: 'Native' },
      { id: 'lang-alex-2', language: 'Mandarin Chinese', proficiency: 'Fluent' }
    ],
    professional_interests: ['Edge AI', 'Vector Databases', 'Rust Tooling', 'Contactless Hardware'],
    connections_count: 680,
    followers_count: 4500,
    theme: 'signature',
    accent_color: '#087CF0',
    button_style: 'rounded',
    font_family: 'mono',
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
    created_at: '2026-03-01T08:00:00Z',
    updated_at: '2026-11-19T14:00:00Z',
  },
  {
    id: 'prof-marcus-04',
    user_id: 'user-marcus-04',
    username: 'marcus',
    full_name: 'Marcus Vance',
    profile_type: 'business',
    title: 'Managing Partner & Growth Strategist',
    headline: 'Managing Partner at Horizon Capital | Early-Stage DeepTech & Hardware Investor',
    bio: 'Backing world-changing founders at the intersection of IoT, smart hardware, and intelligent physical infrastructure.',
    about: 'Venture investor and board advisor with 12+ years in private equity and hardware startup acceleration. Led early investments in 24 frontier tech startups across North America and Asia-Pacific.',
    profile_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    cover_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    location: 'New York & London',
    email: 'marcus@horizoncap.vc',
    phone: '+1 212 555 7820',
    website: 'https://horizoncap.vc',
    company: 'Horizon Capital Partners',
    skills: ['Venture Capital', 'DeepTech Investing', 'Board Advisory', 'M&A Strategy', 'Corporate Partnerships'],
    services: [
      { title: 'Series A Pitch Advisory', description: 'Reviewing deck, financials, and unit economics for hardware founders.' },
      { title: 'Board Governance & Scaling', description: 'Executive compensation, corporate structuring, and international expansion.' }
    ],
    experiences: [
      {
        id: 'exp-marcus-1',
        title: 'Managing Partner',
        company: 'Horizon Capital Partners',
        location: 'New York, NY',
        employment_type: 'Full-time',
        start_date: 'Jan 2018',
        is_current: true,
        description: 'Managing $140M Fund III focused on smart hardware, semiconductors, and edge connected devices.',
        skills_used: ['Portfolio Strategy', 'Due Diligence', 'Hardware Evaluation']
      }
    ],
    education: [
      {
        id: 'edu-marcus-1',
        school: 'Columbia Business School',
        degree: 'Master of Business Administration (MBA)',
        field_of_study: 'Finance & Private Equity',
        start_year: '2012',
        end_year: '2014'
      }
    ],
    certifications: [
      {
        id: 'cert-marcus-1',
        name: 'Chartered Financial Analyst (CFA)',
        issuing_org: 'CFA Institute',
        issue_date: 'Jun 2015'
      }
    ],
    achievements: [
      {
        id: 'ach-marcus-1',
        title: 'Top 40 Under 40 Venture Capitalists 2022',
        issuer: 'Venture Weekly',
        date: '2022'
      }
    ],
    businesses: [
      {
        id: 'biz-marcus-1',
        name: 'Horizon Capital Partners',
        tagline: 'Seed to Scale DeepTech Venture Fund',
        description: 'Early-stage venture fund backing hardware and enterprise infrastructure pioneers.',
        website: 'https://horizoncap.vc',
        industry: 'Venture Capital & Private Equity',
        contact_email: 'invest@horizoncap.vc',
        is_primary: true
      }
    ],
    languages: [
      { id: 'lang-marcus-1', language: 'English', proficiency: 'Native' },
      { id: 'lang-marcus-2', language: 'French', proficiency: 'Professional' }
    ],
    professional_interests: ['Hardware Startups', 'Semiconductors', 'Next-Gen Networking', 'Sovereign Cloud'],
    connections_count: 890,
    followers_count: 5200,
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
      portfolio: true,
      experience: true,
      education: true,
      certifications: true,
      achievements: true,
      businesses: true,
      languages: true,
      activity: true
    },
    created_at: '2026-03-05T08:00:00Z',
    updated_at: '2026-11-19T10:00:00Z',
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
    customer_email: 'signbridge.aiauto@gmail.com',
    customer_phone: '+91 98422 53267',
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
        product_id: 'prod-business',
        product_name: 'Business NFC Card',
        quantity: 1,
        unit_price: 199,
        custom_name_to_print: 'Surya Narayanan',
        custom_notes: 'Laser-etched metallic edge',
      }
    ],
    total_amount: 199,
    currency: 'INR',
    status: 'delivered',
    payment_method: 'Razorpay UPI (Verified)',
    payment_status: 'verified',
    tracking_number: 'DHL-IN-9872145',
    notes: 'Delivered successfully. Card activated by customer.',
    created_at: '2026-01-16T10:00:00Z',
    updated_at: '2026-01-20T16:00:00Z',
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
    details: 'Verified online payment for Order SBN-2026-8491 (₹199.00)',
    timestamp: '2026-11-02T14:20:00Z',
  }
];

// -----------------------------------------------------------------------------
// Professional Networking: Connections
// -----------------------------------------------------------------------------
export const INITIAL_CONNECTIONS: Connection[] = [
  {
    id: 'conn-1',
    requester_id: 'user-elena-02',
    requester_name: 'Elena Rostova',
    requester_username: 'elena',
    requester_image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    requester_headline: 'Visual Storyteller & Motion Designer | Creating 3D Kinetic Identities',
    recipient_id: 'user-surya-01',
    recipient_name: 'Surya Narayanan',
    recipient_username: 'surya',
    recipient_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    recipient_headline: 'Founder & Hardware Architect at SignBridge',
    status: 'connected',
    created_at: '2026-10-15T09:30:00Z',
  },
  {
    id: 'conn-2',
    requester_id: 'user-alex-03',
    requester_name: 'Alex Chen',
    requester_username: 'alex',
    requester_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    requester_headline: 'Lead AI & Full-Stack Architect at NeuralFlow',
    recipient_id: 'user-surya-01',
    recipient_name: 'Surya Narayanan',
    recipient_username: 'surya',
    recipient_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    recipient_headline: 'Founder & Hardware Architect at SignBridge',
    status: 'connected',
    created_at: '2026-11-02T14:00:00Z',
  },
  {
    id: 'conn-3',
    requester_id: 'user-marcus-04',
    requester_name: 'Marcus Vance',
    requester_username: 'marcus',
    requester_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    requester_headline: 'Managing Partner at Horizon Capital | DeepTech & Hardware Investor',
    recipient_id: 'user-surya-01',
    recipient_name: 'Surya Narayanan',
    recipient_username: 'surya',
    recipient_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    recipient_headline: 'Founder & Hardware Architect at SignBridge',
    status: 'pending',
    created_at: '2026-11-19T16:45:00Z',
  }
];

// -----------------------------------------------------------------------------
// Professional Activity Feed: Posts & Updates
// -----------------------------------------------------------------------------
export const INITIAL_POSTS: PostItem[] = [
  {
    id: 'post-1',
    author_id: 'user-surya-01',
    author_name: 'Surya Narayanan',
    author_username: 'surya',
    author_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    author_headline: 'Founder & Hardware Architect at SignBridge',
    content: '🚀 Excited to announce that SignTap NFC v2.0 is officially live! We have upgraded the entire architecture into an all-in-one professional identity platform. Every physical tap now syncs your career history, live portfolio, business services, and verified credentials with sub-millisecond cloud routing. Thank you to everyone supporting the physical web revolution! 🌐✨',
    media_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    media_type: 'milestone',
    project_link: 'https://signbridge.click',
    likes_count: 84,
    comments_count: 16,
    shares_count: 12,
    liked_by: ['user-elena-02', 'user-alex-03', 'user-marcus-04'],
    bookmarked_by: ['user-elena-02'],
    tags: ['Hardware', 'IoT', 'Nextjs', 'ProfessionalIdentity', 'Startup'],
    created_at: '2026-11-20T10:00:00Z',
  },
  {
    id: 'post-2',
    author_id: 'user-elena-02',
    author_name: 'Elena Rostova',
    author_username: 'elena',
    author_image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    author_headline: 'Visual Storyteller & Motion Designer',
    content: 'Just wrapped up the visual identity refresh for our European motion studio. Integrating tactile typography with interactive micro-animations. Check out the sneak peek below and let me know your thoughts on spatial branding in 2026! 🎨💡',
    media_url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    project_link: 'https://rostova.design',
    likes_count: 128,
    comments_count: 24,
    shares_count: 9,
    liked_by: ['user-surya-01', 'user-alex-03'],
    bookmarked_by: ['user-surya-01'],
    tags: ['Design', 'Motion', 'KineticType', 'CreativeDirection'],
    created_at: '2026-11-19T14:30:00Z',
  },
  {
    id: 'post-3',
    author_id: 'user-alex-03',
    author_name: 'Alex Chen',
    author_username: 'alex',
    author_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    author_headline: 'Lead AI & Full-Stack Architect at NeuralFlow',
    content: 'We just benchmarked our new edge AI inference worker against cloud LLMs: 4.2x latency improvement with zero degradation in reasoning quality. Combining local device intelligence with instant contactless credentials gives developers superpower networking capabilities. Thoughts on edge LLMs?',
    media_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    media_type: 'project',
    project_link: 'https://neuralflow.io',
    likes_count: 95,
    comments_count: 19,
    shares_count: 14,
    liked_by: ['user-surya-01'],
    bookmarked_by: [],
    tags: ['AI', 'EdgeComputing', 'Rust', 'MachineLearning'],
    created_at: '2026-11-18T18:15:00Z',
  }
];

export const INITIAL_POST_COMMENTS: PostComment[] = [
  {
    id: 'comm-1',
    post_id: 'post-1',
    author_id: 'user-elena-02',
    author_name: 'Elena Rostova',
    author_username: 'elena',
    author_image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    content: 'Incredible milestone Surya! The physical tap to live LinkedIn-style profile transition feels super fluid.',
    created_at: '2026-11-20T10:30:00Z',
  },
  {
    id: 'comm-2',
    post_id: 'post-1',
    author_id: 'user-alex-03',
    author_name: 'Alex Chen',
    author_username: 'alex',
    author_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    content: 'Loving the clean typography and sub-millisecond redirect speed. Great work!',
    created_at: '2026-11-20T11:00:00Z',
  }
];
