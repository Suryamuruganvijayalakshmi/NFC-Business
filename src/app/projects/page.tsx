'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import LinkedInNavbar from '@/components/LinkedInNavbar';
import { getAllProjects, getAllProfiles } from '@/lib/store';
import { PortfolioProject, Profile } from '@/lib/types';
import { sanitizeUrl } from '@/lib/security';
import { Search, ExternalLink, Sparkles } from 'lucide-react';

export default function ProjectsGalleryPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setProjects(getAllProjects());
    setProfiles(getAllProfiles());
  }, []);

  const filtered = projects.filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.technologies || []).some((t) => t.toLowerCase().includes(q)) ||
      (p.category || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#202124] pb-20 md:pb-12">
      <LinkedInNavbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-24 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E8EF] pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6969F5]">
              <Sparkles className="w-3.5 h-3.5" /> SignTap Showcase
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#202124] mt-1">
              Featured Projects & Portfolios
            </h1>
            <p className="text-sm text-[#777783] mt-1">
              Explore real work built by engineers, founders, and designers across SignTap.
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#777783] absolute left-3 top-2.5" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects or tech..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F7F7FB] border border-[#E8E8EF] text-xs text-[#202124] focus:outline-none focus:border-[#6969F5]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((proj) => {
            const owner = profiles.find((pr) => pr.id === proj.profile_id);
            return (
              <div key={proj.id} className="group">
                <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-[#F7F7FB] border border-[#E8E8EF] relative">
                  <img
                    src={proj.image_url || '/images/nfc-smart-card.webp'}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>
                <div className="mt-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-[#202124] truncate">{proj.title}</h2>
                    {owner ? (
                      <Link href={`/u/${owner.username}`} className="text-xs text-[#777783] hover:text-[#6969F5]">
                        by {owner.full_name}
                      </Link>
                    ) : (
                      <p className="text-xs text-[#777783] truncate">{proj.category}</p>
                    )}
                  </div>
                  {proj.project_url && (
                    <a
                      href={sanitizeUrl(proj.project_url)}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-[#F7F7FB] border border-[#E8E8EF] hover:border-[#6969F5] text-[11px] font-semibold text-[#202124] flex items-center gap-1 shrink-0"
                    >
                      Open <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
