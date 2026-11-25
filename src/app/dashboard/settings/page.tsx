'use client';

import React, { useState, useEffect } from 'react';
import { 
  getCurrentUser, 
  getProfileByUserId, 
  getOrCreateProfileForUser, 
  getAllProfiles,
  saveProfile,
  deleteProfile,
  logoutUser
} from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/lib/types';
import { 
  Settings, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Trash2, 
  Lock, 
  Bell, 
  UserCheck 
} from 'lucide-react';

export default function AccountSettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [notifyViews, setNotifyViews] = useState(true);
  const [notifyTaps, setNotifyTaps] = useState(true);
  const [savedToast, setSavedToast] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;

    let p = getProfileByUserId(user.id);
    if (!p) {
      p = getOrCreateProfileForUser(user);
    }

    if (p) {
      setProfile(p);
      setUsername(p.username);
      setEmail(p.email);
      const prefs = (p.section_visibility as Record<string, unknown> | undefined)?._notifications as
        | { notifyTaps?: boolean; notifyViews?: boolean }
        | undefined;
      if (prefs) {
        if (typeof prefs.notifyTaps === 'boolean') setNotifyTaps(prefs.notifyTaps);
        if (typeof prefs.notifyViews === 'boolean') setNotifyViews(prefs.notifyViews);
      }
    }
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!profile) return;
    const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_-]/g, '').trim();

    if (!cleanUsername || cleanUsername.length < 3) {
      setError('Username must be at least 3 alphanumeric characters.');
      return;
    }

    // Check conflict
    const all = getAllProfiles();
    const conflict = all.find((p: Profile) => p.username.toLowerCase() === cleanUsername && p.id !== profile.id);
    if (conflict) {
      setError('This username is already claimed by another user.');
      return;
    }

    const updated = {
      ...profile,
      username: cleanUsername,
      email: email.trim(),
      section_visibility: {
        ...(profile.section_visibility || {}),
        _notifications: { notifyTaps, notifyViews },
      } as Profile['section_visibility'],
      updated_at: new Date().toISOString(),
    };

    saveProfile(updated);
    setProfile(updated);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleDeleteAccount = async () => {
    if (!profile) return;
    if (!window.confirm('Are you sure you want to permanently delete your SignTap account and profile? This action cannot be undone.')) {
      return;
    }
    try {
      const sessionRes = supabase ? await supabase.auth.getSession() : null;
      const token = sessionRes?.data?.session?.access_token;
      if (token) {
        await fetch('/api/account/delete', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.warn('Account delete request note:', err);
    }
    deleteProfile(profile.id);
    logoutUser();
    window.location.href = '/login';
  };

  const handleExportData = () => {
    if (!profile) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `signbridge-export-${profile.username}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!profile) return null;

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your credentials, custom handle, and privacy preferences.
          </p>
        </div>

        {savedToast && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Profile URL Handle */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#087CF0]" />
            Identity URL Handle
          </h2>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Public Profile URL
            </label>
            <div className="flex items-center">
              <span className="px-3.5 py-2.5 rounded-l-xl bg-slate-100 border border-r-0 border-slate-200 text-xs font-mono text-slate-500 select-none">
                signbridge.click/id/
              </span>
              <input
                required
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                className="w-full px-3.5 py-2.5 rounded-r-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-[#087CF0]"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Changing your handle updates your public web link and NFC redirects immediately.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Account Primary Email
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#087CF0]"
            />
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#FF7900]" />
            Telemetry & Notifications
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <span className="text-xs font-semibold text-slate-800">
                Weekly NFC card tap summary digest
              </span>
              <input
                type="checkbox"
                checked={notifyTaps}
                onChange={(e) => setNotifyTaps(e.target.checked)}
                className="w-4 h-4 text-[#087CF0] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <span className="text-xs font-semibold text-slate-800">
                New visitor contact inquiry alerts
              </span>
              <input
                type="checkbox"
                checked={notifyViews}
                onChange={(e) => setNotifyViews(e.target.checked)}
                className="w-4 h-4 text-[#087CF0] rounded"
              />
            </label>
          </div>
        </div>

        {/* Data Portability */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-600" />
              Export Identity Data
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Download your full profile, projects, and links as a clean JSON backup.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportData}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 flex-shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON Archive</span>
          </button>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#087CF0] text-white text-xs font-bold hover:bg-[#0668cc] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>

        {/* Danger Zone: Account Deletion */}
        <div className="p-6 sm:p-8 rounded-3xl bg-rose-50/70 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-rose-900 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-600" />
              Delete Account
            </h2>
            <p className="text-xs text-rose-700 mt-1">
              Permanently remove your SignTap digital identity, saved contacts, and posts.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 flex-shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete My Account</span>
          </button>
        </div>

      </form>
    </div>
  );
}
