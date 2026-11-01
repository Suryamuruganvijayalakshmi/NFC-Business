# SignBridge ID — Cloudflare Pages Publishing Guide

This guide explains how to publish **SignBridge ID** (`signbridge.click`) to **Cloudflare Pages** directly from your GitHub repository.

---

## 1. Quick Overview

- **Repository:** `https://github.com/Suryamuruganvijayalakshmi/NFC-Business.git`
- **Framework:** Next.js 16 (App Router)
- **Domain:** `signbridge.click`
- **Database:** Supabase PostgreSQL with Row Level Security (RLS)

---

## 2. Deploying on Cloudflare Pages (Step-by-Step)

### Step 1: Connect GitHub to Cloudflare
1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left navigation, click **Workers & Pages**.
3. Click the **Create application** button.
4. Select the **Pages** tab and click **Connect to Git**.
5. Select your GitHub account and choose the repository: **`Suryamuruganvijayalakshmi/NFC-Business`**.
6. Click **Begin setup**.

---

### Step 2: Configure Build Settings
Fill in the following build options:

| Setting | Value |
|---|---|
| **Project name** | `signbridge-id` (or your choice) |
| **Production branch** | `main` |
| **Framework preset** | `Next.js` |
| **Build command** | `npm run build` |
| **Build output directory** | `.next` |
| **Root directory** | `/` (leave blank) |

---

### Step 3: Add Environment Variables
Under **Environment variables (advanced)**, add the following variables for both **Production** and **Preview**:

| Variable Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://gtrhfzxgkcjknlbrkwmp.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` *(your anon key)* |
| `NEXT_PUBLIC_APP_URL` | `https://nfc.signbridge.click` |
| `NEXT_PUBLIC_SITE_DOMAIN` | `nfc.signbridge.click` |
| `NODE_VERSION` | `20` (or `22`) |

Click **Save and Deploy**.

Cloudflare will clone your repository, run the build, and publish your global edge site within 1 to 2 minutes.

---

### Step 4: Connect Your Custom Domain (`nfc.signbridge.click`)
1. In Cloudflare Pages, open your newly deployed project.
2. Navigate to the **Custom domains** tab at the top.
3. Click **Set up a custom domain**.
4. Enter **`nfc.signbridge.click`**.
5. Click **Continue** &rarr; **Activate domain**.
6. Cloudflare automatically sets up the DNS CNAME record and provisions a free Universal SSL certificate.

---

### Step 5: Update Supabase OAuth for `nfc.signbridge.click`
To ensure Google Sign-In and email login work seamlessly on your live subdomain:
1. Go to your **Supabase Dashboard** (`gtrhfzxgkcjknlbrkwmp`).
2. Go to **Authentication** &rarr; **URL Configuration**.
3. Set **Site URL** to:
   ```
   https://nfc.signbridge.click
   ```
4. Under **Redirect URLs**, add:
   ```
   https://nfc.signbridge.click/auth/callback
   ```
5. Click **Save**.

---

## 3. Cloudflare-Ready Optimizations Included in this Repo

- **`public/_headers`**: Configures edge security headers and long-term caching for immutable assets (`/_next/static/*`).
- **`public/_redirects`**: Manages contactless card redirects and SPA routing.
- **`next.config.ts`**: Contains `images: { unoptimized: true }` so edge CDNs can serve all avatars and portfolio media natively without node image servers.
- **New User Onboarding (`/onboarding`)**: Automatically intercepts first-time sign-ins (Google or email) to collect their unique username, title, bio, and phone number before taking them to their own dedicated dashboard.
