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
  Sparkles,
  Palette,
  Play,
  Heart,
  MessageSquare
} from 'lucide-react';

interface TemplateProps {
  profile: Profile;
  sections?: ProfileSection[];
  projects?: PortfolioProject[];
  links?: SocialLink[];
  onLinkClick?: (linkId: string) => void;
  isPreview?: boolean;
}

export default function CreativeTemplate({
  profile,
  sections = [],
  projects = [],
  links = [],
  onLinkClick,
  isPreview = false,
}: TemplateProps) {
  const [showQR, setShowQR] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  const publicUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/id/${profile.username}` 
    : `https://signbridge.click/id/${profile.username}`;

  const accentColor = profile.accent_color || '#FF7900';
  const visibleLinks = links.filter(l => l.visible);
  const visibleProjects = projects;
  const visibleSections = sections.filter(s => s.visible);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/40 via-sky-50/30 to-purple-50/40 text-slate-800 font-sans py-8 sm:py-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto rounded-[32px] bg-white/90 backdrop-blur-2xl border border-white/80 p-6 sm:p-12 shadow-xl shadow-amber-900/5">
        
        {/* Creative Cover Banner */}
        {profile.cover_image && (
          <div className="relative h-44 sm:h-56 -mx-6 sm:-mx-12 -mt-6 sm:-mt-12 mb-8 rounded-t-[32px] overflow-hidden">
            <img 
              src={profile.cover_image} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        )}

        {/* Creator Intro Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden p-1.5 bg-gradient-to-tr from-[#FF7900] via-pink-500 to-[#087CF0] shadow-xl">
              <img 
                src={profile.profile_image || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80'} 
                alt={profile.full_name} 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="absolute bottom-1 right-2 px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold tracking-wider uppercase shadow-md flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#FF7900]" />
              CREATOR
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-serif">
            {profile.full_name}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-medium mt-1">
            {profile.title}
          </p>

          {profile.location && (
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#FF7900]" />
              {profile.location}
            </p>
          )}

          {/* Bio */}
          {profile.bio && (
            <p className="text-sm sm:text-base text-slate-600 mt-4 max-w-lg leading-relaxed">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Primary Interaction Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-8">
          <button
            onClick={() => downloadVCard(profile, links)}
            style={{ backgroundColor: accentColor }}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-white text-xs sm:text-sm font-semibold hover:opacity-95 transition-opacity shadow-md shadow-orange-500/20"
          >
            <UserPlus className="w-4 h-4" />
            Save Contact
          </button>

          <button
            onClick={() => setShowInquiryModal(true)}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-colors shadow-md"
          >
            <MessageSquare className="w-4 h-4 text-[#FF7900]" />
            Collab Inquiry
          </button>

          <button
            onClick={() => setShowQR(true)}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors shadow-sm"
          >
            <QrCode className="w-4 h-4 text-slate-600" />
            Share QR
          </button>
        </div>

        {/* Social Links Chips */}
        {visibleLinks.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">
              Find Me Everywhere
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {visibleLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onLinkClick && onLinkClick(link.id)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200/80 hover:border-slate-300 hover:bg-slate-100 transition-all text-xs font-semibold text-slate-800 group shadow-2xs"
                >
                  <span className="w-2 h-2 rounded-full bg-[#FF7900] group-hover:scale-125 transition-transform" />
                  {link.label || link.platform}
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-700" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Featured Creative Portfolio */}
        {visibleProjects.length > 0 && (
          <div className="mt-10 pt-8 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#FF7900]" />
                Selected Showcase
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {visibleProjects.length} Works
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {visibleProjects.map((proj) => (
                <div 
                  key={proj.id}
                  className="rounded-3xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/50 overflow-hidden hover:shadow-lg transition-all flex flex-col group"
                >
                  {proj.image_url && (
                    <div className="relative h-44 overflow-hidden">
                      <img 
                        src={proj.image_url} 
                        alt={proj.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold">
                        {proj.category}
                      </span>
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">
                        {proj.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                        {proj.description}
                      </p>
                    </div>

                    {proj.project_url && (
                      <a 
                        href={proj.project_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-4 text-xs font-bold text-[#FF7900] flex items-center gap-1 hover:underline"
                      >
                        View Project <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Creator Sections */}
        {visibleSections.map((sec) => (
          <div key={sec.id} className="mt-8 pt-6 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-3">
              {sec.title}
            </h3>

            {sec.content_json?.tags && (
              <div className="flex flex-wrap gap-2">
                {sec.content_json.tags.map((tag: string, idx: number) => (
                  <span key={idx} className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* SignBridge ID Footer Badge */}
        <div className="mt-12 text-center pt-6 border-t border-slate-100">
          <p className="text-[11px] text-slate-400">
            Crafted with{' '}
            <a 
              href="https://signbridge.click" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-slate-700 hover:text-[#FF7900] transition-colors"
            >
              SignBridge ID
            </a>
            {' '}· Your Identity. One Tap Away.
          </p>
        </div>
      </div>

      {/* Collaboration Inquiry Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900">
              Work with {profile.full_name}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Send a project collaboration or business inquiry.
            </p>

            {inquirySent ? (
              <div className="my-6 p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-center text-sm font-semibold">
                Inquiry sent successfully! {profile.full_name} will get back to you soon.
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setInquirySent(true);
                  setTimeout(() => {
                    setShowInquiryModal(false);
                    setInquirySent(false);
                  }, 1800);
                }} 
                className="space-y-3 my-4"
              >
                <div>
                  <label className="text-xs font-semibold text-slate-700">Your Name</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Jane Doe" 
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7900]" 
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Your Email</label>
                  <input 
                    required 
                    type="email" 
                    placeholder="jane@company.com" 
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7900]" 
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Project Details</label>
                  <textarea 
                    required 
                    rows={3} 
                    placeholder="Tell us about your project, budget, and timeline..." 
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7900]" 
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInquiryModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#FF7900] text-white text-xs font-semibold hover:bg-amber-600 transition-colors shadow-sm"
                  >
                    Send Inquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

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
