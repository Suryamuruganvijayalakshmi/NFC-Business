# SignBridge NFC – Digital Identity Platform

> **Your Identity. One Tap Away.**  
> Official Website: [signbridge.click](https://signbridge.click) | Product: SignBridge NFC

SignBridge NFC is a production-quality digital identity and NFC smart card platform that connects physical contactless cards with dynamic, personalized digital profile pages. 

---

## 1. Product Overview

1. **Physical Contactless Cards**: Embedded with genuine NTAG216 high-frequency RFID/NFC microchips.
2. **Dynamic Cloud Redirection**: Physical cards store a unique redirect URL (`/t/<cardUid>`), ensuring profile updates never require reprogramming physical cards.
3. **Zero App Requirement**: Visitors tap the card or scan the backup dynamic QR code; the profile opens directly in their smartphone browser (iOS CoreNFC & Android).
4. **1-Tap vCard Phonebook Save**: Downloads an RFC-compliant `.vcf` contact card directly into the visitor's phonebook with one tap.
5. **Customer Dashboard**: Real-time profile editing, live mobile preview, theme and accent color customization, social link management, and card pairing.
6. **Order Management**: Complete customer ordering workflow (product selection, custom laser engraving name, delivery details, order review, and manual payment verification).
7. **Separate Admin Console**: Role-protected portal for customer management, manual order status updates, payment verification, dynamic product pricing, and hardware provisioning.

---

## 2. Project Architecture & Directory Structure

```text
signbridge-nfc/
├── .env.example                    # Environment variable template
├── .env.local                      # Local environment configuration
├── next.config.ts                  # Next.js 16 configuration with Turbopack & static export
├── package.json                    # Project dependencies & scripts
├── supabase/
│   └── schema.sql                  # Complete 10-table PostgreSQL schema with RLS & triggers
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root HTML shell with SEO metadata
│   │   ├── page.tsx                # Homepage (Hero, How it Works, Products, Features, Preview, FAQ)
│   │   ├── globals.css             # Tailwind CSS & SignBridge design tokens
│   │   ├── how-it-works/           # Detailed 4-step workflow & device compatibility guide
│   │   ├── explore-cards/          # Physical hardware catalogue with filtering & direct order
│   │   ├── features/               # Platform capabilities & NFC technology details
│   │   ├── pricing/                # Transparent hardware & profile pricing matrix
│   │   ├── faq/                    # Searchable FAQ with category filters
│   │   ├── contact/                # Contact and enterprise inquiry form
│   │   ├── order/                  # 5-step customer card ordering workflow
│   │   ├── login/                  # Customer authentication with demo autofill
│   │   ├── signup/                 # Customer registration
│   │   ├── register/               # Canonical route alias
│   │   ├── forgot-password/        # Password recovery
│   │   ├── u/[username]/           # Public digital identity profile (/u/username)
│   │   ├── id/[username]/          # Backward-compatible redirect to /u/username
│   │   ├── t/[cardId]/             # Physical NFC tag tap redirect & telemetry logger
│   │   ├── dashboard/
│   │   │   ├── page.tsx            # User overview with metrics, completion bar, & card status
│   │   │   ├── profile/            # Profile editor with live side-by-side mobile preview
│   │   │   ├── design/             # Appearance (Signature, Minimal, Creative themes)
│   │   │   ├── links/              # Social media & external URL manager
│   │   │   ├── nfc/                # Hardware card management & activation code pairing
│   │   │   ├── orders/             # Customer order tracking & progress timeline
│   │   │   ├── portfolio/          # Project showcase manager
│   │   │   └── settings/           # Account settings & credentials
│   │   └── admin/
│   │       ├── login/              # Dedicated role-protected admin login
│   │       └── page.tsx            # Admin console (Metrics, Orders, Customers, Cards, Products, Audit Log)
│   ├── components/
│   │   ├── Logo.tsx                # SignBridge Hex-Bridge Signal Icon & Branding
│   │   ├── Navbar.tsx              # Sticky public navigation
│   │   ├── Footer.tsx              # Footer with links, contact, & legal
│   │   ├── NFCCardVisual.tsx       # Physical smart card mockup with ripple animation
│   │   ├── QRCodeModal.tsx         # High-resolution QR code generator & PNG exporter
│   │   ├── dashboard/
│   │   │   └── Sidebar.tsx         # Authenticated dashboard sidebar navigation
│   │   └── templates/
│   │       ├── MinimalTemplate.tsx # Clean modern monochrome layout
│   │       ├── SignatureTemplate.tsx # Flagship dark navy & electric blue theme
│   │       └── CreativeTemplate.tsx # Vibrant warm gradient creator theme
│   └── lib/
│       ├── types.ts                # TypeScript definitions for profiles, cards, orders, products
│       ├── store.ts                # Hybrid data store (Supabase live sync + persistent fallback)
│       ├── initialData.ts          # Seed data for products, demo profiles, and orders
│       ├── supabase.ts             # Supabase client initialization
│       └── vcard.ts                # RFC-compliant vCard 3.0 generator and downloader
```

---

## 3. Technology Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **UI Library**: React 19, TypeScript 5
- **Styling**: Tailwind CSS v4 with custom SignBridge tokens
- **Icons**: Lucide React
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS)
- **Utilities**: `qrcode.react`, `canvas-confetti`

---

## 4. Brand & Design Tokens

| Token | Hex Value | Purpose |
|---|---|---|
| **Brand Blue** | `#087CF0` | Primary brand action color, active pills, links |
| **Brand Orange** | `#FF7900` | Secondary accent, badges, highlight microchip |
| **Navy Dark** | `#101828` | Main dark background, footer, card backdrops |
| **Navy Deep** | `#0C121E` | High-contrast dark theme background |
| **Light Slate** | `#FAFAFB` | Main public page background |
| **Border Light**| `#E4E7EC` | Clean subtle borders |

---

## 5. Database Schema & SQL Migrations

The database consists of 10 structured tables defined in `supabase/schema.sql`:

1. `profiles`: Customer accounts, bio, theme, contact preferences, and public visibility.
2. `digital_profiles`: Publicly accessible SQL view of published customer records.
3. `social_links`: Verified social and website links per profile.
4. `profile_sections`: Modular sections (Experience, Education, Skills, Services).
5. `products`: Configurable physical card catalogue with live pricing.
6. `orders`: Customer orders, delivery addresses, status, and payment verification.
7. `order_items`: Order line items with custom engraved name and notes.
8. `nfc_cards`: Physical hardware registry with Card UID, Activation Code, and assigned profile.
9. `profile_analytics`: Telemetry events (Profile view, NFC tap, QR scan, vCard save, WhatsApp click).
10. `admin_activity`: Audit log for administrative actions.

### Running Migrations in Supabase:
1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor**.
3. Paste the contents of `supabase/schema.sql` and click **Run**.
4. All tables, Row Level Security policies, indexes, triggers, and seed products will be created.

---

## 6. Environment Variables (`.env.local`)

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_DOMAIN=signbridge.click
```

> **Note on Resiliency:** If Supabase credentials are not connected or network is offline, the platform automatically utilizes its built-in client-side data store (`src/lib/store.ts`). You can immediately test orders, profiles, and admin controls with zero setup friction!

---

## 7. Local Development Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Start Production Server**:
   ```bash
   npm run start
   ```

---

## 8. Credentials for Demo & Testing

- **Demo Customer**:
  - Email: `surya@signbridge.click` (Password: `demo123456`)
  - Public Profile URL: `/u/surya`
  - NFC Test Tap URL: `/t/SB-NFC-9842`

- **Demo Admin**:
  - Login Route: `/admin/login`
  - Email: `admin@signbridge.click` (Password: `admin123`)
  - Admin Console: `/admin`

---

## 9. MVP Feature Completion Checklist

- [x] **Branding & Visuals**: Hex-Bridge signal icon, Electric Blue (`#087CF0`) & Orange (`#FF7900`) palette.
- [x] **Homepage (`/`)**: Exact headline, hero with NFC tap animation, 3-step workflow, dynamic product showcase, 10 feature highlights, interactive profile preview, benefits, FAQ accordion, and footer.
- [x] **Public Profile (`/u/[username]`)**: Responsive mini-website, profile photo, cover, designation, bio, direct contact buttons (Call, WhatsApp, Email), 1-tap `.vcf` vCard download, social links, portfolio, and skills.
- [x] **NFC Tap Redirection (`/t/[cardId]`)**: Decodes card UID, increments tap count, verifies activation/blocked status, and redirects instantly to `/u/[username]`.
- [x] **Customer Ordering Workflow (`/order`)**: 5-step interactive workflow (Card selection, Card quantity, Custom laser engraving name, Delivery address, Order review, and Confirmation with manual payment instructions).
- [x] **Customer Order Tracking (`/dashboard/orders`)**: Timeline tracker (`Order Received` &rarr; `Payment Pending` &rarr; `Confirmed` &rarr; `In Production` &rarr; `Shipped` &rarr; `Delivered`).
- [x] **Hardware Card Management (`/dashboard/nfc`)**: View registered cards, test tap simulator, deactivate card, report lost/block card, and "Activate New Card" modal with activation code.
- [x] **Profile Editor (`/dashboard/profile`)**: Edit personal, professional, skills, services, and contact info with live side-by-side mobile preview.
- [x] **Profile Appearance (`/dashboard/design`)**: Signature, Minimal, and Creative themes with brand-approved accent colors.
- [x] **Private Admin Console (`/admin`)**: Separate login (`/admin/login`), overview metrics, customer search, manual payment verification, order workflow updates, NFC card issuance, profile visibility toggling, dynamic product pricing, and audit logging.
- [x] **Database & Security**: Complete 10-table PostgreSQL schema with Row Level Security and automatic user triggers.
