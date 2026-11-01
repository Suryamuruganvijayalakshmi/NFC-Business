'use client';

import React, { useState } from 'react';
import { 
  Profile, 
  ProfileSection, 
  PortfolioProject, 
  SocialLink 
} from '@/lib/types';
import { downloadVCard } from '@/lib/vcard';
import QRCodeModal from '@/components/QRCodeModal';
import { 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  QrCode, 
  UserPlus, 
  ExternalLink, 
  Briefcase, 
  GraduationCap, 
  Sparkles,
  Share2,
  Building2,
  MessageCircle
} from 'lucide-react';

interface TemplateProps {
  profile: Profile;
  sections?: ProfileSection[];
  projects?: PortfolioProject[];
  links?: SocialLink[];
  onLinkClick?: (linkId: string) => void;
  isPreview?: boolean;
}

export default function MinimalTemplate({
  profile,
  sections = [],
  projects = [],
  links = [],
  onLinkClick,
  isPreview = false,
}: TemplateProps) {
  const [showQR, setShowQR] = useState(false);
  const publicUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/id/${profile.username}` 
    : `https://signbridge.click/id/${profile.username}`;

  const accentColor = profile.accent_color || '#101828';

  const visibleLinks = links.filter(l => l.visible);
  const visibleProjects = projects;
  const visibleSections = sections.filter(s => s.visible);

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-slate-800 font-sans py-8 sm:py-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
        
        {/* Cover Header (Optional) */}
        {profile.cover_image && (
          <div className="relative h-36 sm:h-48 -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 mb-6 rounded-t-3xl overflow-hidden bg-slate-100">
            <img 
              src={profile.cover_image} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Minimal Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="relative">
            <img 
              src={profile.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'} 
              alt={profile.full_name} 
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white shadow-md"
            />
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" title="Active NFC Identity" />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {profile.full_name}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium capitalize">
                {profile.profile_type}
              </span>
            </div>

            <p className="text-base text-slate-600 font-medium mt-1">
              {profile.title}
            </p>

            {profile.company && (
              <p className="text-sm text-slate-500 flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                <Building2 className="w-3.5 h-3.5" />
                {profile.company}
              </p>
            )}

            {profile.location && (
              <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1 mt-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {profile.location}
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {profile.bio}
            </p>
          </div>
        )}

        {/* Primary Action Buttons: Save Contact & Share QR */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={() => downloadVCard(profile, links)}
            style={{ backgroundColor: accentColor }}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Save Contact
          </button>

          <button
            onClick={() => setShowQR(true)}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-semibold transition-colors"
          >
            <QrCode className="w-4 h-4 text-slate-600" />
            QR Code
          </button>
        </div>

        {/* Social / External Links List */}
        {visibleLinks.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Connect & External Links
            </h3>
            <div className="flex flex-col gap-2.5">
              {visibleLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onLinkClick && onLinkClick(link.id)}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 transition-all text-sm font-medium text-slate-800 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-200 transition-colors uppercase text-xs font-bold">
                      {link.platform.slice(0, 2)}
                    </span>
                    <span>{link.label || link.platform}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Custom Profile Sections */}
        {visibleSections.map((sec) => (
          <div key={sec.id} className="mt-8 pt-6 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              {sec.section_type === 'experience' && <Briefcase className="w-4 h-4 text-slate-500" />}
              {sec.section_type === 'education' && <GraduationCap className="w-4 h-4 text-slate-500" />}
              {sec.section_type === 'skills' && <Sparkles className="w-4 h-4 text-slate-500" />}
              {sec.title}
            </h3>

            {/* Experience / Education items */}
            {sec.content_json?.items && (
              <div className="space-y-4">
                {sec.content_json.items.map((item: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-between items-start text-sm">
                      <h4 className="font-semibold text-slate-900">
                        {item.role || item.degree}
                      </h4>
                      <span className="text-xs text-slate-400">{item.period}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.company || item.institution}
                    </p>
                    {item.description && (
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Skill tags */}
            {sec.content_json?.tags && (
              <div className="flex flex-wrap gap-2">
                {sec.content_json.tags.map((tag: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Portfolio Projects */}
        {visibleProjects.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Featured Portfolio
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {visibleProjects.map((proj) => (
                <div 
                  key={proj.id}
                  className="rounded-2xl border border-slate-200 overflow-hidden bg-white hover:shadow-md transition-shadow flex flex-col"
                >
                  {proj.image_url && (
                    <img 
                      src={proj.image_url} 
                      alt={proj.title} 
                      className="w-full h-36 object-cover bg-slate-100"
                    />
                  )}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                        {proj.category}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                        {proj.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {proj.description}
                      </p>
                    </div>

                    {proj.project_url && (
                      <a 
                        href={proj.project_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-3 text-xs font-semibold text-slate-900 flex items-center gap-1 hover:underline"
                      >
                        View Project <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Business WhatsApp or Inquiry */}
        {profile.whatsapp_number && (
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <a
              href={`https://wa.me/${profile.whatsapp_number.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>
        )}

        {/* SignBridge ID Footer Badge */}
        <div className="mt-12 text-center pt-6 border-t border-slate-100">
          <p className="text-[11px] text-slate-400">
            Powered by{' '}
            <a 
              href="https://signbridge.click" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-slate-700 hover:text-[#087CF0] transition-colors"
            >
              SignBridge ID
            </a>
            {' '}· Your Identity. One Tap Away.
          </p>
        </div>
      </div>

      <QRCodeModal 
        isOpen={showQR} 
        onClose={() => setShowQR(false)} 
        url={publicUrl}
        fullName={profile.full_name}
        username={profile.username}
      />
    </div>
  );
}
