import { Profile } from './types';

/**
 * SignTap Subscription & Feature Entitlement System
 *
 * Core Principle: Essential professional networking (profiles, connections,
 * following, posts, messaging, SignTap Connect exchange, basic CRM, basic analytics,
 * job applications) is ALWAYS free and never artificially paywalled.
 */
export type EntitlementFeature =
  | 'core_networking'
  | 'basic_analytics'
  | 'advanced_analytics'
  | 'multiple_identities'
  | 'premium_themes'
  | 'unlimited_followups'
  | 'team_analytics'
  | 'organization_branding'
  | 'verified_pro_badge';

const FREE_FEATURES = new Set<EntitlementFeature>([
  'core_networking',
  'basic_analytics',
]);

export function hasActivePremium(profile?: Profile | null): boolean {
  if (!profile || !profile.is_premium) return false;
  if (!profile.premium_expires_at) return true;
  const expiresAt = new Date(profile.premium_expires_at).getTime();
  return Number.isNaN(expiresAt) ? true : expiresAt > Date.now();
}

export function canAccessFeature(
  profile: Profile | null | undefined,
  feature: EntitlementFeature
): boolean {
  if (FREE_FEATURES.has(feature)) return true;
  return hasActivePremium(profile);
}

export function getPlanLabel(profile?: Profile | null): string {
  if (!hasActivePremium(profile)) return 'Free Member';
  if (profile?.premium_plan === 'lifetime') return 'SignTap Lifetime PRO';
  return 'SignTap Professional PRO';
}

