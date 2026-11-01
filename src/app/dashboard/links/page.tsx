'use client';

import React, { useState, useEffect } from 'react';
import { 
  getCurrentUser, 
  getProfileByUserId, 
  getAllProfiles,
  getLinksByProfileId, 
  saveLink, 
  deleteLink 
} from '@/lib/store';
import { Profile, SocialLink, SocialPlatform } from '@/lib/types';
import { 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  Link2,
  MoveUp,
  MoveDown
} from 'lucide-react';

export default function LinksManagerPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [savedToast, setSavedToast] = useState(false);
  const [error, setError] = useState('');

  // New Link modal/drawer state
  const [platform, setPlatform] = useState<SocialPlatform>('linkedin');
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;

    let p = getProfileByUserId(user.id);
    if (!p) {
      const all = getAllProfiles();
      p = all[0] || null;
    }

    if (p) {
      setProfile(p);
      setLinks(getLinksByProfileId(p.id));
    }
  }, []);

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!profile) return;
    if (!url.trim()) {
      setError('Please provide a valid destination URL.');
      return;
    }

    // URL validation
    let validUrl = url.trim();
    if (!/^https?:\/\//i.test(validUrl)) {
      validUrl = 'https://' + validUrl;
    }

    try {
      new URL(validUrl);
    } catch {
      setError('Please provide a valid URL format (e.g. https://linkedin.com/in/you)');
      return;
    }

    const newLink: SocialLink = {
      id: `link-${Date.now()}`,
      profile_id: profile.id,
      platform,
      label: label.trim() || platform.charAt(0).toUpperCase() + platform.slice(1),
      url: validUrl,
      display_order: links.length + 1,
      visible: true,
    };

    saveLink(newLink);
    setLinks([...links, newLink]);
    setLabel('');
    setUrl('');
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleToggleVisible = (linkId: string) => {
    const target = links.find(l => l.id === linkId);
    if (!target) return;

    const updated = { ...target, visible: !target.visible };
    saveLink(updated);
    setLinks(links.map(l => l.id === linkId ? updated : l));
  };

  const handleDelete = (linkId: string) => {
    deleteLink(linkId);
    setLinks(links.filter(l => l.id !== linkId));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;

    const newLinks = [...links];
    const temp = newLinks[index];
    newLinks[index] = newLinks[targetIndex];
    newLinks[targetIndex] = temp;

    // Update orders
    newLinks.forEach((l, idx) => {
      l.display_order = idx + 1;
      saveLink(l);
    });

    setLinks(newLinks);
  };

  const supportedPlatforms: { id: SocialPlatform; label: string }[] = [
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'github', label: 'GitHub' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'x', label: 'X (Twitter)' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'website', label: 'Personal Website' },
    { id: 'custom', label: 'Custom External Link' },
  ];

  if (!profile) return null;

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Social & External Links
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage the social channels, portfolios, and booking links shown on your profile.
          </p>
        </div>

        {savedToast && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Links Updated!</span>
          </div>
        )}
      </div>

      {/* Add New Link Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#087CF0]" />
          Add New Link
        </h2>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAddLink} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Platform Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#087CF0]"
              >
                {supportedPlatforms.map((sp) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Label */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Display Label (Optional)</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. My Open Source Code"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#087CF0]"
              />
            </div>

            {/* URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Destination URL</label>
              <input
                required
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#087CF0]"
              />
            </div>

          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#087CF0] text-white text-xs font-bold hover:bg-[#0668cc] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Link to Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* Existing Links List */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-sm font-bold text-slate-900">
            Active Links ({links.length})
          </h2>
          <span className="text-xs text-slate-400">
            Reorder using arrows
          </span>
        </div>

        {links.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Link2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-xs">No links added yet. Add your first social or external link above.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {links.map((link, idx) => (
              <div
                key={link.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                  link.visible ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-50 border-slate-200/60 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center uppercase">
                    {link.platform.slice(0, 2)}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {link.label || link.platform}
                    </h4>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[11px] text-[#087CF0] hover:underline flex items-center gap-1"
                    >
                      {link.url} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Actions: Reorder, Visibility, Delete */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'up')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                    title="Move Up"
                  >
                    <MoveUp className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    disabled={idx === links.length - 1}
                    onClick={() => handleMove(idx, 'down')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                    title="Move Down"
                  >
                    <MoveDown className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleVisible(link.id)}
                    className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                    title={link.visible ? 'Hide from profile' : 'Show on profile'}
                  >
                    {link.visible ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(link.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 ml-1"
                    title="Delete link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
