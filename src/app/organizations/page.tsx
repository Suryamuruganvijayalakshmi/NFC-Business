'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import LinkedInNavbar from '@/components/LinkedInNavbar';
import {
  getCurrentUser,
  getProfileByUserId,
  getAllOrganizations,
  createOrganization,
  getMembersForOrganization,
  joinOrganization,
} from '@/lib/store';
import { Organization, OrgType, OrganizationMember, Profile, UserSession } from '@/lib/types';
import { Building2, Users, Globe, MapPin, Plus, X, ShieldCheck } from 'lucide-react';

export default function OrganizationsPage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [name, setName] = useState('');
  const [orgType, setOrgType] = useState<OrgType>('company');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');

  const refresh = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    if (currentUser) setProfile(getProfileByUserId(currentUser.id));
    const list = getAllOrganizations();
    setOrgs(list);
    if (!selectedOrg && list.length > 0) {
      setSelectedOrg(list[0]);
      setMembers(getMembersForOrganization(list[0].id));
    } else if (selectedOrg) {
      setMembers(getMembersForOrganization(selectedOrg.id));
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleSelectOrg = (org: Organization) => {
    setSelectedOrg(org);
    setMembers(getMembersForOrganization(org.id));
  };

  const handleCreateOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !name.trim()) return;
    const created = createOrganization(
      {
        name: name.trim(),
        org_type: orgType,
        tagline: tagline.trim(),
        description: description.trim(),
        industry: industry.trim(),
        location: location.trim(),
        website: website.trim(),
        owner_user_id: profile.user_id,
      },
      profile
    );
    setShowCreateModal(false);
    setName('');
    setTagline('');
    setDescription('');
    refresh();
    handleSelectOrg(created);
  };

  const handleJoin = (orgId: string) => {
    if (!profile) return;
    joinOrganization(orgId, profile, 'member');
    setMembers(getMembersForOrganization(orgId));
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-slate-900 pb-20 md:pb-12">
      <LinkedInNavbar />
      <main className="max-w-6xl mx-auto px-4 pt-20 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Organizations, Startups & Teams</h1>
            <p className="text-sm text-slate-600 mt-1">
              Manage company pages, team members, roles, and organization NFC identity branding.
            </p>
          </div>
          {profile && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 rounded-full bg-[#6969F5] hover:bg-[#5858E6] text-white text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create Organization
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            {orgs.map((org) => (
              <button
                key={org.id}
                onClick={() => handleSelectOrg(org)}
                className={`w-full text-left p-5 rounded-2xl bg-white border transition-all cursor-pointer ${
                  selectedOrg?.id === org.id ? 'border-[#6969F5] shadow-sm' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase text-[#6969F5] bg-blue-50 px-2 py-0.5 rounded-full">
                    {org.org_type}
                  </span>
                  {org.verified && <ShieldCheck className="w-4 h-4 text-[#6969F5]" />}
                </div>
                <h2 className="text-base font-bold text-slate-900 mt-2">{org.name}</h2>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{org.tagline || org.description}</p>
                <p className="text-[11px] text-slate-400 mt-2">{org.industry || 'Technology'} · {org.location || 'Global'}</p>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2">
            {selectedOrg ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-[#6969F5]" />
                      <h2 className="text-xl font-extrabold text-slate-900">{selectedOrg.name}</h2>
                    </div>
                    {selectedOrg.tagline && <p className="text-sm text-slate-600 mt-1">{selectedOrg.tagline}</p>}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-3">
                      {selectedOrg.location && (
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {selectedOrg.location}</span>
                      )}
                      {selectedOrg.website && (
                        <a href={selectedOrg.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#6969F5] hover:underline">
                          <Globe className="w-3.5 h-3.5" /> Website
                        </a>
                      )}
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {members.length} members</span>
                    </div>
                  </div>
                  {user && !members.some((m) => m.user_id === user.id) && (
                    <button
                      onClick={() => handleJoin(selectedOrg.id)}
                      className="px-4 py-2 rounded-full bg-[#6969F5] text-white text-xs font-bold cursor-pointer"
                    >
                      Join Organization
                    </button>
                  )}
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">About</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">{selectedOrg.description}</p>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Team Members & Roles ({members.length})
                  </h3>
                  <div className="divide-y divide-slate-100">
                    {members.map((m) => (
                      <div key={m.id} className="py-3 flex items-center justify-between gap-3">
                        <div>
                          <Link href={`/u/${m.username}`} className="text-sm font-bold text-slate-900 hover:text-[#6969F5]">
                            {m.full_name}
                          </Link>
                          <p className="text-xs text-slate-500">{m.headline || m.title || `@${m.username}`}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold uppercase">
                          {m.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Create Organization Page</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreateOrg} className="space-y-3">
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Organization Name" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl" />
                <div className="grid grid-cols-2 gap-3">
                  <select value={orgType} onChange={(e) => setOrgType(e.target.value as OrgType)} className="px-3 py-2 text-sm border border-slate-200 rounded-xl">
                    <option value="company">Company</option>
                    <option value="startup">Startup</option>
                    <option value="club">College Club</option>
                    <option value="community">Community</option>
                    <option value="team">Team</option>
                  </select>
                  <input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Industry" className="px-3 py-2 text-sm border border-slate-200 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="px-3 py-2 text-sm border border-slate-200 rounded-xl" />
                  <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Website URL" className="px-3 py-2 text-sm border border-slate-200 rounded-xl" />
                </div>
                <input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Short tagline" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl" />
                <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Organization mission & overview..." className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl" />
                <button type="submit" className="w-full py-2.5 rounded-xl bg-[#6969F5] text-white text-sm font-bold cursor-pointer">
                  Create Page
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

