'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import Logo from '@/components/Logo';
import QRCodeModal from '@/components/QRCodeModal';
import { getCurrentUser, getProfileByUserId, saveProfile, getOrCreateProfileForUser } from '@/lib/store';
import { Profile, UserSession } from '@/lib/types';
import { 
  Menu, 
  X, 
  ExternalLink, 
  QrCode, 
  Globe, 
  Eye, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const curUser = getCurrentUser();
    if (!curUser) {
      router.push('/login');
      return;
    }
    setUser(curUser);

    let p = getProfileByUserId(curUser.id);
    if (!p) {
      p = getOrCreateProfileForUser(curUser);
    }
    setProfile(p);
  }, [router]);

  const togglePublished = () => {
    if (!profile) return;
    const updated = { ...profile, published: !profile.published };
    saveProfile(updated);
    setProfile(updated);
  };

  const username = profile?.username || user?.user_metadata?.username || 'member';
  const publicUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/id/${username}` 
    : `https://signbridge.click/id/${username}`;

  return (
    <div className="min-h-screen bg-[#F8FAFD] flex text-slate-800">
      
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block">
        <Sidebar username={username} />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs" 
            onClick={() => setMobileSidebarOpen(false)} 
          />
          <div className="relative z-10 w-64 bg-white shadow-2xl h-full">
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar 
              username={username} 
              onNavigate={() => setMobileSidebarOpen(false)} 
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Dashboard Top Header */}
        <header className="h-18 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-sm font-bold text-slate-900 hidden sm:block">
                {profile?.full_name || 'SignBridge Member'}
              </h2>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
                signbridge.click/id/{username}
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Published / Draft Pill Switch */}
            <button
              onClick={togglePublished}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                profile?.published
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${profile?.published ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span>{profile?.published ? 'Published' : 'Draft Mode'}</span>
            </button>

            {/* QR Modal Trigger */}
            <button
              onClick={() => setShowQR(true)}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
              title="Show QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* View Public Profile Button */}
            <a
              href={`/id/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#087CF0] text-white text-xs font-semibold hover:bg-[#0668cc] transition-colors shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Public Profile</span>
            </a>
          </div>

        </header>

        {/* Dashboard Body Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

      </div>

      {profile && (
        <QRCodeModal
          isOpen={showQR}
          onClose={() => setShowQR(false)}
          url={publicUrl}
          fullName={profile.full_name}
          username={profile.username}
        />
      )}

    </div>
  );
}
