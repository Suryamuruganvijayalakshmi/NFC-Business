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
  ShieldCheck,
  Wifi,
  Building2,
  MessageCircle,
  FolderGit2
} from 'lucide-react';

interface TemplateProps {
  profile: Profile;
  sections?: ProfileSection[];
  projects?: PortfolioProject[];
  links?: SocialLink[];
  onLinkClick?: (linkId: string) => void;
  isPreview?: boolean;
}

export default function SignatureTemplate({
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

  const accentColor = profile.accent_color || '#087CF0';
  const visibleLinks = links.filter(l => l.visible);
  const visibleProjects = projects;
  const visibleSections = sections.filter(s => s.visible);

  return (
    <div className="min-h-screen bg-[#0C121E] text-slate-100 font-sans py-8 sm:py-16 px-4 sm:px-6 relative selection:bg-[#087CF0] selection:text-white">
      {/* Background Subtle Gradient Grid */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 0%, rgba(8, 124, 240, 0.25) 0%, transparent 60%), linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
          backgroundSize: '100% 100%, 32px 32px, 32px 32px'
        }}
      />

      <div className="relative max-w-2xl mx-auto rounded-3xl bg-[#131B2E]/90 backdrop-blur-xl border border-white/10 p-6 sm:p-10 shadow-2xl">
        
        {/* Cover Header Banner */}
        {profile.cover_image && (
          <div className="relative h-40 sm:h-52 -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 mb-8 rounded-t-3xl overflow-hidden">
            <img 
              src={profile.cover_image} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#131B2E] via-transparent to-transparent" />
          </div>
        )}

        {/* Profile Identity Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden ring-2 ring-[#087CF0]/40 p-1 bg-gradient-to-br from-[#087CF0] to-[#FF7900] shadow-lg">
              <img 
                src={profile.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'} 
                alt={profile.full_name} 
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            {/* NFC Contactless Badge */}
            <div 
              className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-[#101828] border border-white/20 text-[#087CF0] shadow-md flex items-center justify-center"
              title="Verified SignBridge NFC Smart Card"
            >
              <Wifi className="w-3.5 h-3.5 rotate-90" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                {profile.full_name}
                <ShieldCheck className="w-5 h-5 text-[#087CF0]" />
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-[#087CF0]/15 text-[#087CF0] border border-[#087CF0]/30">
                {profile.profile_type}
              </span>
            </div>

            <p className="text-sm sm:text-base text-slate-300 font-medium mt-1">
              {profile.title}
            </p>

            {profile.company && (
              <p className="text-xs sm:text-sm text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                <Building2 className="w-3.5 h-3.5 text-[#FF7900]" />
                {profile.company}
              </p>
            )}

            {profile.location && (
              <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1 mt-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {profile.location}
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {profile.bio}
            </p>
          </div>
        )}

        {/* Action Buttons: 1-Tap Save Contact & QR Share */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={() => downloadVCard(profile, links)}
            style={{ backgroundColor: accentColor }}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            Save Contact
          </button>

          <button
            onClick={() => setShowQR(true)}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition-all active:scale-95"
          >
            <QrCode className="w-4 h-4 text-[#FF7900]" />
            Share QR
          </button>
        </div>

        {/* Social / External Links Grid */}
        {visibleLinks.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#087CF0]" />
              Verified Links
            </h3>
            <div className="flex flex-col gap-2.5">
              {visibleLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onLinkClick && onLinkClick(link.id)}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#087CF0]/40 transition-all text-sm font-medium text-slate-200 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#087CF0]/20 text-[#087CF0] border border-[#087CF0]/30 flex items-center justify-center group-hover:bg-[#087CF0] group-hover:text-white transition-colors uppercase text-xs font-bold">
                      {link.platform.slice(0, 2)}
                    </span>
                    <span className="group-hover:text-white transition-colors">
                      {link.label || link.platform}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#087CF0] transition-colors" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Profile Custom Sections */}
        {visibleSections.map((sec) => (
          <div key={sec.id} className="mt-8 pt-6 border-t border-white/10">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              {sec.section_type === 'experience' && <Briefcase className="w-4 h-4 text-[#FF7900]" />}
              {sec.section_type === 'education' && <GraduationCap className="w-4 h-4 text-[#087CF0]" />}
              {sec.section_type === 'skills' && <Sparkles className="w-4 h-4 text-[#FF7900]" />}
              {sec.title}
            </h3>

            {/* Experience / Education items */}
            {sec.content_json?.items && (
              <div className="space-y-3">
                {sec.content_json.items.map((item: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/[0.04] border border-white/5">
                    <div className="flex justify-between items-start text-sm">
                      <h4 className="font-semibold text-white">
                        {item.role || item.degree}
                      </h4>
                      <span className="text-xs text-slate-400 font-mono">{item.period}</span>
                    </div>
                    <p className="text-xs text-[#087CF0] font-medium mt-0.5">
                      {item.company || item.institution}
                    </p>
                    {item.description && (
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">
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
                  <span 
                    key={idx} 
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-xs font-medium hover:border-[#087CF0]/40 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Portfolio Projects Grid */}
        {visibleProjects.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-[#087CF0]" />
              Portfolio & Selected Work
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {visibleProjects.map((proj) => (
                <div 
                  key={proj.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden hover:border-[#087CF0]/50 transition-all flex flex-col group"
                >
                  {proj.image_url && (
                    <div className="relative h-36 overflow-hidden bg-slate-900">
                      <img 
                        src={proj.image_url} 
                        alt={proj.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF7900]">
                        {proj.category}
                      </span>
                      <h4 className="font-bold text-white text-sm mt-0.5">
                        {proj.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {proj.description}
                      </p>

                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {proj.technologies.slice(0, 3).map((tech, idx) => (
                            <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-300">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {proj.project_url && (
                      <a 
                        href={proj.project_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-3 text-xs font-semibold text-[#087CF0] flex items-center gap-1 hover:underline group-hover:text-white transition-colors"
                      >
                        Explore Project <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Business WhatsApp Direct Interaction */}
        {profile.whatsapp_number && (
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <a
              href={`https://wa.me/${profile.whatsapp_number.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/30"
            >
              <MessageCircle className="w-4 h-4" />
              Direct WhatsApp Inquiry
            </a>
          </div>
        )}

        {/* SignBridge ID Footer Badge */}
        <div className="mt-12 text-center pt-6 border-t border-white/10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#087CF0]" />
            <p className="text-[11px] text-slate-400">
              Official Profile on{' '}
              <a 
                href="https://signbridge.click" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-white hover:text-[#087CF0] transition-colors"
              >
                SignBridge ID
              </a>
              {' '}· One Tap Away
            </p>
          </div>
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
