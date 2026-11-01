import { Profile, SocialLink } from './types';

/**
 * Generate a standard vCard (.vcf) formatted string from a profile
 */
export function generateVCard(profile: Profile, links: SocialLink[] = []): string {
  const nameParts = profile.full_name.trim().split(' ');
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
  const firstName = nameParts[0] || '';

  let vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${lastName};${firstName};;;`,
    `FN:${profile.full_name}`,
    profile.title ? `TITLE:${profile.title}` : '',
    profile.company || profile.business_name ? `ORG:${profile.company || profile.business_name}` : '',
    profile.email ? `EMAIL;TYPE=INTERNET,PREF:${profile.email}` : '',
    profile.phone ? `TEL;TYPE=CELL,VOICE:${profile.phone}` : '',
    profile.website ? `URL:${profile.website}` : '',
    profile.location ? `ADR;TYPE=WORK:;;;${profile.location};;;` : '',
    profile.bio ? `NOTE:${profile.bio.replace(/\n/g, '\\n')}` : '',
  ];

  // Add social links as URLs
  links.filter(l => l.visible).forEach(link => {
    vcard.push(`URL;TYPE=${link.platform.toUpperCase()}:${link.url}`);
  });

  vcard.push('REV:' + new Date().toISOString());
  vcard.push('END:VCARD');

  return vcard.filter(Boolean).join('\r\n');
}

/**
 * Trigger immediate browser download of the .vcf contact card
 */
export function downloadVCard(profile: Profile, links: SocialLink[] = []): void {
  const vcardText = generateVCard(profile, links);
  const blob = new Blob([vcardText], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${profile.username || 'contact'}.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
