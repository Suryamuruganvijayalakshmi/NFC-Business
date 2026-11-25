import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const outDir = path.resolve('node_modules/.cache/signtap-test');

// Compile the real TypeScript modules to CommonJS/ESM for Node test runner
execSync(
  `npx tsc src/lib/profileCompletion.ts src/lib/entitlements.ts src/lib/security.ts --outDir "${outDir}" --module commonjs --target es2022 --moduleResolution node --esModuleInterop --skipLibCheck`,
  { stdio: 'pipe' }
);

const { calculateProfileCompletion } = await import(
  pathToFileURL(path.join(outDir, 'profileCompletion.js')).href
);
const { canAccessFeature, hasActivePremium } = await import(
  pathToFileURL(path.join(outDir, 'entitlements.js')).href
);
const { sanitizeUrl, getSafeRedirectUrl, sanitizeCsvCell } = await import(
  pathToFileURL(path.join(outDir, 'security.js')).href
);

function makeBaseProfile(overrides = {}) {
  return {
    id: 'prof-test',
    user_id: 'user-test',
    username: 'testuser',
    full_name: '',
    profile_type: 'professional',
    title: '',
    bio: '',
    profile_image: '',
    email: 'test@signtap.click',
    theme: 'signature',
    accent_color: '#0A66C2',
    button_style: 'rounded',
    font_family: 'sans',
    background_style: 'clean',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

test('calculateProfileCompletion computes 0% for empty profile and 100% when complete', () => {
  const empty = makeBaseProfile();
  const res0 = calculateProfileCompletion(empty, [], []);
  assert.equal(res0.percentage, 0);
  assert.equal(res0.suggestions.length, 7);

  const complete = makeBaseProfile({
    full_name: 'Surya Narayanan',
    headline: 'Founder & Engineer',
    profile_image: 'data:image/jpeg;base64,abc',
    about: 'Building contactless professional identity tools for modern teams.',
    skills: ['TypeScript', 'Next.js'],
    education: [{ id: 'e1', school: 'IIT', degree: 'B.Tech', field_of_study: 'CS', start_year: '2020' }],
    website: 'https://signtap.click',
  });
  const res100 = calculateProfileCompletion(
    complete,
    [{ id: 'p1', profile_id: 'prof-test', title: 'SignTap', description: 'NFC Platform', image_url: '', project_url: '', technologies: ['Next.js'], category: 'Tech', display_order: 1, created_at: '' }],
    []
  );
  assert.equal(res100.percentage, 100);
  assert.equal(res100.suggestions.length, 0);
});

test('entitlements keep core networking free and gate PRO features accurately', () => {
  const freeUser = makeBaseProfile({ is_premium: false });
  assert.equal(hasActivePremium(freeUser), false);
  assert.equal(canAccessFeature(freeUser, 'core_networking'), true);
  assert.equal(canAccessFeature(freeUser, 'basic_analytics'), true);
  assert.equal(canAccessFeature(freeUser, 'advanced_analytics'), false);

  const proUser = makeBaseProfile({
    is_premium: true,
    premium_expires_at: new Date(Date.now() + 86400000).toISOString(),
  });
  assert.equal(hasActivePremium(proUser), true);
  assert.equal(canAccessFeature(proUser, 'advanced_analytics'), true);
});

test('security helpers block XSS URIs, open redirects, and CSV formula injection', () => {
  assert.equal(sanitizeUrl('javascript:alert(1)'), '#');
  assert.equal(sanitizeUrl('data:text/html,<script>alert(1)</script>'), '#');
  assert.equal(sanitizeUrl('https://signtap.click/u/surya'), 'https://signtap.click/u/surya');

  assert.equal(getSafeRedirectUrl('https://evil.com', '/feed'), '/feed');
  assert.equal(getSafeRedirectUrl('//evil.com', '/feed'), '/feed');
  assert.equal(getSafeRedirectUrl('/u/surya', '/feed'), '/u/surya');

  assert.equal(sanitizeCsvCell('=CMD("calc")'), "'=CMD(\"calc\")");
  assert.equal(sanitizeCsvCell('Safe Value'), 'Safe Value');
});

