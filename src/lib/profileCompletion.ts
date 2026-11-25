import { Profile, PortfolioProject, SocialLink } from './types';

export interface ProfileSuggestion {
  id: string;
  label: string;
  tab: 'basic' | 'about' | 'skills' | 'education' | 'projects' | 'socials';
  points: number;
}

export interface ProfileCompletionResult {
  percentage: number;
  completedCount: number;
  totalChecks: number;
  suggestions: ProfileSuggestion[];
}

/**
 * Calculates real profile completion percentage from saved profile, project,
 * and social link records. Never returns a hardcoded percentage.
 */
export function calculateProfileCompletion(
  profile: Profile | null | undefined,
  projects: PortfolioProject[] = [],
  links: SocialLink[] = []
): ProfileCompletionResult {
  if (!profile) {
    return {
      percentage: 0,
      completedCount: 0,
      totalChecks: 7,
      suggestions: [],
    };
  }

  const checks: {
    id: string;
    passed: boolean;
    label: string;
    tab: ProfileSuggestion['tab'];
    points: number;
  }[] = [
    {
      id: 'basic',
      passed: Boolean(profile.full_name?.trim() && (profile.headline?.trim() || profile.title?.trim())),
      label: 'Add your name and professional headline',
      tab: 'basic',
      points: 15,
    },
    {
      id: 'photo',
      passed: Boolean(
        profile.profile_image?.trim() &&
          !profile.profile_image.includes('default-avatar')
      ),
      label: 'Upload a profile picture',
      tab: 'basic',
      points: 15,
    },
    {
      id: 'about',
      passed: Boolean((profile.about || profile.bio || '').trim().length >= 20),
      label: 'Write your About section',
      tab: 'about',
      points: 15,
    },
    {
      id: 'skills',
      passed: Array.isArray(profile.skills) && profile.skills.length >= 2,
      label: 'Add at least 2 skills',
      tab: 'skills',
      points: 15,
    },
    {
      id: 'edu_exp',
      passed:
        (Array.isArray(profile.education) && profile.education.length > 0) ||
        (Array.isArray(profile.experiences) && profile.experiences.length > 0),
      label: 'Add education or work experience',
      tab: 'education',
      points: 15,
    },
    {
      id: 'project',
      passed: Array.isArray(projects) && projects.length > 0,
      label: 'Add your first project',
      tab: 'projects',
      points: 15,
    },
    {
      id: 'links',
      passed:
        (Array.isArray(links) && links.length > 0) ||
        Boolean(profile.website?.trim() || profile.portfolio_url?.trim()),
      label: 'Add professional links or portfolio URL',
      tab: 'socials',
      points: 10,
    },
  ];

  let score = 0;
  let completedCount = 0;
  const suggestions: ProfileSuggestion[] = [];

  for (const c of checks) {
    if (c.passed) {
      score += c.points;
      completedCount++;
    } else {
      suggestions.push({
        id: c.id,
        label: c.label,
        tab: c.tab,
        points: c.points,
      });
    }
  }

  return {
    percentage: Math.min(100, score),
    completedCount,
    totalChecks: checks.length,
    suggestions,
  };
}

