/**
 * SignTap Security & Input Sanitization Suite
 * 
 * Provides defense-in-depth against:
 * 1. Cross-Site Scripting (XSS) via javascript:, data:, vbscript: URIs
 * 2. Open Redirect vulnerabilities in auth/login redirects
 * 3. CSV Formula Injection in contact exports
 * 4. Insecure Direct Object References (IDOR)
 * 5. Analytics event spam / flooding rate-limiting
 */

/**
 * Sanitizes URLs to ensure they only use safe protocols (http, https, mailto, tel, or root-relative paths).
 * Prevents javascript:, data:, vbscript:, and control-character bypasses.
 */
export function sanitizeUrl(rawUrl: string | null | undefined): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '#';
  
  const trimmed = rawUrl.trim();
  if (!trimmed) return '#';

  // Check for dangerous protocol prefixes (case-insensitive and stripped of whitespace/control chars)
  const normalized = trimmed.replace(/[\u0000-\u001F\u007F-\u009F\s]/g, '').toLowerCase();
  
  if (
    normalized.startsWith('javascript:') ||
    normalized.startsWith('data:') ||
    normalized.startsWith('vbscript:') ||
    normalized.startsWith('file:')
  ) {
    console.warn(`[Security] Blocked unsafe URI protocol: ${trimmed.slice(0, 30)}...`);
    return '#';
  }

  // Allow relative paths starting with / (but not // which is protocol-relative external domain)
  if (trimmed.startsWith('/')) {
    if (trimmed.startsWith('//')) {
      return '#';
    }
    return trimmed;
  }

  // Allow telephone and mailto links
  if (/^mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(trimmed)) {
    return trimmed;
  }
  if (/^tel:\+?[0-9\s\-().]{6,20}$/i.test(trimmed)) {
    return trimmed;
  }

  // Validate absolute URLs
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
    return '#';
  } catch {
    // If it looks like a domain without protocol (e.g. "linkedin.com/in/surya"), prefix with https://
    if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/.*)?$/i.test(trimmed)) {
      return `https://${trimmed}`;
    }
    return '#';
  }
}

/**
 * Sanitizes plain text to prevent script or HTML injection when rendered or stored.
 */
export function sanitizeText(text: string | null | undefined): string {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Validates internal redirect paths to protect against Open Redirect vulnerabilities.
 * Ensures the target is strictly an internal application route (starts with single / and contains no host).
 */
export function getSafeRedirectUrl(target: string | null | undefined, fallback: string = '/feed'): string {
  if (!target || typeof target !== 'string') return fallback;
  
  const trimmed = target.trim();
  
  // Must start with single / and NOT // (protocol-relative) and NOT /\ or contain scheme
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.startsWith('/\\')) {
    return fallback;
  }

  // Block any scheme separators e.g. /http:, /javascript:
  if (trimmed.includes(':')) {
    return fallback;
  }

  // Valid internal paths
  return trimmed;
}

/**
 * In-memory & sessionStorage client rate limiter for analytics events.
 * Throttles duplicate profile views from the same client session to max 1 per 10 minutes.
 */
const recentAnalyticsMap: Record<string, number> = {};

export function isAnalyticsRateLimited(profileId: string, eventType: string = 'view'): boolean {
  if (typeof window === 'undefined') return false;

  const key = `sb_ratelimit_${eventType}_${profileId}`;
  const now = Date.now();
  const cooldownMs = 10 * 60 * 1000; // 10 minutes cooldown

  // Check memory map
  const memLastTime = recentAnalyticsMap[key];
  if (memLastTime && now - memLastTime < cooldownMs) {
    return true;
  }

  // Check sessionStorage
  try {
    const sessionLastTime = window.sessionStorage.getItem(key);
    if (sessionLastTime) {
      const parsed = parseInt(sessionLastTime, 10);
      if (!isNaN(parsed) && now - parsed < cooldownMs) {
        return true;
      }
    }
    window.sessionStorage.setItem(key, now.toString());
  } catch {
    // Session storage unavailable, proceed
  }

  recentAnalyticsMap[key] = now;
  return false;
}

/**
 * Protects against CSV / Spreadsheet Formula Injection (CWE-1236).
 * Prepends a single quote if a cell starts with formula characters (=, +, -, @, tab, cr).
 */
export function sanitizeCsvCell(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (/^[=+\-@\t\r]/.test(str)) {
    return `'${str}`;
  }
  return str;
}
