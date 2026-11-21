'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getCurrentUser, 
  getProfileByUserId, 
  getOrCreateProfileForUser,
  getAllConnections,
  getConnectionsForUser,
  getPendingRequests,
  acceptConnectionRequest,
  declineConnectionRequest,
  removeConnection,
  sendConnectionRequest,
  getAllProfiles,
  getConnectionStatus,
  isFollowing,
  toggleFollow,
  getNewMemberStatus
} from '@/lib/store';
import { Profile, Connection } from '@/lib/types';
import { 
  Users2, 
  UserCheck, 
  UserX, 
  UserPlus, 
  Search, 
  ExternalLink, 
  MessageCircle, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  Building2, 
  Sparkles,
  Wifi,
  Trash2,
  Share2
} from 'lucide-react';

export default function NetworkPage() {
  const [activeTab, setActiveTab] = useState<'connections' | 'pending' | 'grow'>('connections');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Connection[]>([]);
  const [otherProfiles, setOtherProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = () => {
    const user = getCurrentUser();
    if (!user) return;

    let p = getProfileByUserId(user.id);
    if (!p) {
      p = getOrCreateProfileForUser(user);
    }
    setProfile(p);

    if (p) {
      const conns = getConnectionsForUser(user.id);
      setConnections(conns);

      const pending = getPendingRequests(user.id);
      setPendingRequests(pending);

      // Recommendations / Grow Network (all profiles except current user)
      const all = getAllProfiles().filter(prof => prof.user_id !== user.id && prof.published !== false);
      setOtherProfiles(all);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAccept = (connId: string, name: string) => {
    acceptConnectionRequest(connId);
    showToast(`You are now connected with ${name}!`);
    loadData();
  };

  const handleDecline = (connId: string) => {
    declineConnectionRequest(connId);
    showToast('Connection request dismissed.');
    loadData();
  };

  const handleRemove = (connId: string, name: string) => {
    if (confirm(`Remove connection with ${name}?`)) {
      removeConnection(connId);
      showToast(`Removed ${name} from your connections.`);
      loadData();
    }
  };

  const handleConnect = (targetProfile: Profile) => {
    if (!profile) return;
    sendConnectionRequest(profile, targetProfile);
    showToast(`Connection request sent to ${targetProfile.full_name}!`);
    loadData();
  };

  const handleToggleFollow = (targetUserId: string, name: string) => {
    if (!profile) return;
    const following = toggleFollow(profile.user_id, targetUserId);
    showToast(following ? `Now following ${name}` : `Unfollowed ${name}`);
    loadData();
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#087CF0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Filter connections by search query
  const filteredConnections = connections.filter(c => {
    const otherName = c.requester_id === profile.user_id ? c.recipient_name : c.requester_name;
    const otherHeadline = c.requester_id === profile.user_id ? c.recipient_headline : c.requester_headline;
    return (
      otherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      otherHeadline?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#101828] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 text-sm font-semibold animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#101828] tracking-tight flex items-center gap-2">
            <Users2 className="w-6 h-6 text-[#087CF0]" />
            <span>Network & Connections</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Build and manage your professional network across the physical-to-digital SignTap ecosystem.
          </p>
        </div>

        {/* Global Directory Link */}
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-[#087CF0] text-xs font-semibold hover:bg-blue-100 transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Discover Public Directory</span>
        </Link>
      </div>

      {/* Navigation Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('connections')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'connections'
                ? 'bg-[#101828] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>My Connections</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
              {connections.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'bg-[#101828] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Pending Requests</span>
            {pendingRequests.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-white font-bold">
                {pendingRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('grow')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'grow'
                ? 'bg-[#101828] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF7900]" />
            <span>Grow Network</span>
          </button>
        </div>

        {activeTab === 'connections' && (
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search connections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20 focus:border-[#087CF0]"
            />
          </div>
        )}
      </div>

      {/* Tab 1: My Connections */}
      {activeTab === 'connections' && (
        <div className="space-y-4">
          {filteredConnections.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
              <Users2 className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">No connections found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {searchQuery ? 'Try adjusting your search keywords.' : 'Start expanding your network by exploring verified professionals or sharing your NFC card.'}
              </p>
              <button
                onClick={() => setActiveTab('grow')}
                className="mt-2 px-4 py-2 rounded-xl bg-[#087CF0] text-white text-xs font-semibold hover:bg-[#0668cc] transition-colors"
              >
                Browse Recommended Professionals
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredConnections.map((conn) => {
                const isUserRequester = conn.requester_id === profile.user_id;
                const otherUserId = isUserRequester ? conn.recipient_id : conn.requester_id;
                const otherName = isUserRequester ? conn.recipient_name : conn.requester_name;
                const otherUsername = isUserRequester ? conn.recipient_username : conn.requester_username;
                const otherImage = isUserRequester ? conn.recipient_image : conn.requester_image;
                const otherHeadline = isUserRequester ? conn.recipient_headline : conn.requester_headline;

                return (
                  <div 
                    key={conn.id} 
                    className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#087CF0]/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={otherImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
                            alt={otherName}
                            className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100"
                          />
                          <div>
                            <Link 
                              href={`/u/${otherUsername}`} 
                              target="_blank"
                              className="text-sm font-bold text-[#101828] hover:text-[#087CF0] transition-colors flex items-center gap-1.5"
                            >
                              <span>{otherName}</span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </Link>
                            <span className="text-[10px] font-mono text-slate-400">@{otherUsername}</span>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Connected</span>
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                        {otherHeadline}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      <Link
                        href={`/u/${otherUsername}`}
                        target="_blank"
                        className="font-semibold text-[#087CF0] hover:underline"
                      >
                        View Profile
                      </Link>

                      <button
                        onClick={() => handleRemove(conn.id, otherName)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Remove Connection"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Pending Requests */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">All caught up!</h3>
              <p className="text-xs text-slate-400">
                You have no pending connection requests at this time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingRequests.map((req) => (
                <div key={req.id} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img 
                      src={req.requester_image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'} 
                      alt={req.requester_name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <Link 
                        href={`/u/${req.requester_username}`} 
                        target="_blank"
                        className="text-sm font-bold text-[#101828] hover:text-[#087CF0] transition-colors truncate block"
                      >
                        {req.requester_name}
                      </Link>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                        {req.requester_headline}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                        Sent {new Date(req.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleAccept(req.id, req.requester_name)}
                      className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Accept</span>
                    </button>

                    <button
                      onClick={() => handleDecline(req.id)}
                      className="py-2 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Dismiss</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Grow Network / Recommendations */}
      {activeTab === 'grow' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-[#101828]">People you may know on SignTap</h3>
              <p className="text-xs text-slate-600">
                Connect with professionals sharing similar skills, hardware interests, and industries.
              </p>
            </div>
            <Link
              href="/discover"
              className="px-3.5 py-1.5 rounded-xl bg-[#087CF0] text-white text-xs font-semibold hover:bg-[#0668cc] transition-colors flex-shrink-0"
            >
              Search All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {otherProfiles.map((prof) => {
              const connStatus = getConnectionStatus(profile.user_id, prof.user_id);
              const following = isFollowing(profile.user_id, prof.user_id);
              const profNewStatus = getNewMemberStatus(prof.created_at, 20);

              return (
                <div 
                  key={prof.id} 
                  className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden hover:border-[#087CF0]/40 transition-all flex flex-col justify-between group"
                >
                  {/* Banner */}
                  <div className="relative h-20 bg-gradient-to-r from-[#101828] to-[#1A253A] overflow-hidden">
                    {prof.cover_image && (
                      <img 
                        src={prof.cover_image} 
                        alt="Cover" 
                        className="w-full h-full object-cover opacity-60"
                      />
                    )}
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] text-white font-mono flex items-center gap-1">
                      <Wifi className="w-2.5 h-2.5 text-[#087CF0] rotate-90" />
                      <span>NFC Active</span>
                    </div>
                  </div>

                  {/* Profile Body */}
                  <div className="p-5 pt-0 relative flex-1 flex flex-col justify-between">
                    <div>
                      {/* Avatar */}
                      <div className="-mt-10 mb-3 flex justify-between items-end">
                        <div className="relative">
                          {profNewStatus.isNew && (
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-xs border border-white">
                              NEW
                            </span>
                          )}
                          <div className={`w-16 h-16 rounded-2xl overflow-hidden ring-4 ${
                            profNewStatus.isNew ? 'ring-emerald-400 shadow-emerald-400/20' : 'ring-white'
                          } shadow-md bg-slate-800`}>
                            <img 
                              src={prof.profile_image} 
                              alt={prof.full_name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleFollow(prof.user_id, prof.full_name)}
                          className={`text-xs font-semibold px-3 py-1 rounded-full border transition-all ${
                            following 
                              ? 'bg-slate-100 text-slate-700 border-slate-200' 
                              : 'bg-white text-[#087CF0] border-[#087CF0]/40 hover:bg-blue-50'
                          }`}
                        >
                          {following ? 'Following' : '+ Follow'}
                        </button>
                      </div>

                      <Link 
                        href={`/u/${prof.username}`} 
                        target="_blank"
                        className="text-base font-bold text-[#101828] hover:text-[#087CF0] transition-colors flex items-center gap-1.5"
                      >
                        <span>{prof.full_name}</span>
                        <ShieldCheck className="w-4 h-4 text-[#087CF0]" />
                        {profNewStatus.isNew && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                            NEW
                          </span>
                        )}
                      </Link>

                      <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                        {prof.headline || prof.title}
                      </p>

                      {prof.location && (
                        <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{prof.location}</span>
                        </p>
                      )}

                      {/* Top Skills */}
                      {prof.skills && prof.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {prof.skills.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                      {connStatus.status === 'connected' ? (
                        <span className="w-full py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold text-center flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Connected</span>
                        </span>
                      ) : connStatus.status === 'pending' ? (
                        <span className="w-full py-2 rounded-xl bg-slate-100 text-slate-500 text-xs font-semibold text-center">
                          Request Pending
                        </span>
                      ) : (
                        <button
                          onClick={() => handleConnect(prof)}
                          className="w-full py-2 rounded-xl bg-[#087CF0] hover:bg-[#0668cc] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Connect</span>
                        </button>
                      )}

                      <Link
                        href={`/u/${prof.username}`}
                        target="_blank"
                        className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors flex-shrink-0"
                        title="View Public Profile"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

