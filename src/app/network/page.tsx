'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LinkedInNavbar from '@/components/LinkedInNavbar';
import { 
  getCurrentUser, 
  getProfileByUserId, 
  getAllProfiles, 
  getAllConnections, 
  sendConnectionRequest, 
  acceptConnectionRequest, 
  declineConnectionRequest,
  getLiveConnectionCount,
  getLiveFollowersCount,
  getNewMemberStatus,
  syncConnectionsFromSupabase,
  syncProfilesFromSupabase
} from '@/lib/store';
import { Profile, Connection, UserSession } from '@/lib/types';
import { popMiniPapers } from '@/lib/celebrate';
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  Check, 
  X, 
  Search, 
  Crown, 
  Sparkles, 
  MessageSquare, 
  ArrowRight, 
  CreditCard,
  Briefcase,
  Building,
  UserX,
  Clock
} from 'lucide-react';

export default function NetworkPage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [searchQuery, setSearchQuery] = useState('');
  const [connectedTabOpen, setConnectedTabOpen] = useState(false);

  // Map of targetUserId -> boolean for optimistic connect button clicks
  const [sentRequestsMap, setSentRequestsMap] = useState<Record<string, boolean>>({});

  const refreshNetwork = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    const allP = getAllProfiles();
    setProfiles(allP);

    if (currentUser) {
      const p = getProfileByUserId(currentUser.id);
      setProfile(p);
      const allConns = getAllConnections();
      setConnections(allConns);
    }
  };

  useEffect(() => {
    refreshNetwork();
    const currentUser = getCurrentUser();
    if (currentUser?.id) {
      Promise.all([syncConnectionsFromSupabase(currentUser.id), syncProfilesFromSupabase()]).then(() => {
        refreshNetwork();
      }).catch(() => {});
    } else {
      syncProfilesFromSupabase().then(() => refreshNetwork()).catch(() => {});
    }
    const interval = setInterval(refreshNetwork, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = (connectionId: string) => {
    acceptConnectionRequest(connectionId);
    refreshNetwork();
  };

  const handleDecline = (connectionId: string) => {
    declineConnectionRequest(connectionId);
    refreshNetwork();
  };

  const handleSendConnect = (targetProfile: Profile, e?: React.MouseEvent<HTMLElement>) => {
    if (!profile) return;
    sendConnectionRequest(profile, targetProfile);
    popMiniPapers(e);
    setSentRequestsMap(prev => ({ ...prev, [targetProfile.user_id]: true }));
    setTimeout(refreshNetwork, 400);
  };

  const currentUserId = user?.id || '';
  const liveConnCount = currentUserId ? getLiveConnectionCount(currentUserId) : 0;
  const liveFollowerCount = currentUserId ? getLiveFollowersCount(currentUserId) : 0;

  // Received pending requests
  const receivedPending = connections.filter(c => 
    c.recipient_id === currentUserId && c.status === 'pending'
  );

  // Sent pending requests
  const sentPending = connections.filter(c => 
    c.requester_id === currentUserId && c.status === 'pending'
  );

  // Connected connections
  const activeConnections = connections.filter(c => 
    (c.requester_id === currentUserId || c.recipient_id === currentUserId) && c.status === 'connected'
  );

  // IDs of people already connected or with pending request
  const excludedUserIds = new Set<string>([
    currentUserId,
    ...connections
      .filter(c => c.requester_id === currentUserId || c.recipient_id === currentUserId)
      .map(c => c.requester_id === currentUserId ? c.recipient_id : c.requester_id)
  ]);

  // People you may know recommendations
  const recommendedProfiles = profiles.filter(p => {
    if (excludedUserIds.has(p.user_id)) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.full_name?.toLowerCase().includes(q) ||
      p.headline?.toLowerCase().includes(q) ||
      p.company?.toLowerCase().includes(q) ||
      p.skills?.some(s => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-slate-800">
      <LinkedInNavbar />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-20 pb-20 md:pb-12">
        <div className="flex flex-col md:flex-row gap-6 items-start">

          {/* ================================================================= */}
          {/* LEFT COLUMN: Manage My Network Sidebar */}
          {/* ================================================================= */}
          <aside className="w-full md:w-64 lg:w-72 shrink-0 space-y-4">
            
            {/* Manage Network Stats Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 font-bold text-slate-900 text-sm">
                Manage My Network
              </div>

              <div className="py-1 text-xs divide-y divide-slate-100">
                <button
                  onClick={() => setConnectedTabOpen(!connectedTabOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">Connections</span>
                  </div>
                  <span className="font-bold text-[#6969F5]">{liveConnCount}</span>
                </button>

                <div className="flex items-center justify-between px-4 py-3 text-slate-600 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <UserCheck className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">Followers</span>
                  </div>
                  <span className="font-bold text-slate-800">{liveFollowerCount}</span>
                </div>

                <Link
                  href="/dashboard/crm"
                  className="flex items-center justify-between px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">Smart CRM Contacts</span>
                  </div>
                  <span className="font-bold text-slate-500">CRM</span>
                </Link>

                <Link
                  href="/cards"
                  className="flex items-center justify-between px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-4 h-4 text-[#6969F5]" />
                    <span className="font-medium">SignTap Hardware Cards</span>
                  </div>
                  <span className="font-bold text-amber-600">NFC</span>
                </Link>
              </div>
            </div>

            {/* Hardware NFC Upsell Mini Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 text-white shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SignTap Physical Hardware</span>
              </div>
              <h4 className="font-bold text-sm">Expand In-Person Connections</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Tap your NFC smart card to anyone's phone to connect them directly into your SignTap network.
              </p>
              <Link
                href="/cards"
                className="mt-3 inline-block py-1.5 px-4 rounded-full bg-[#6969F5] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                Order Card · ₹199
              </Link>
            </div>

          </aside>

          {/* ================================================================= */}
          {/* RIGHT COLUMN: Invitations & People You May Know */}
          {/* ================================================================= */}
          <div className="flex-1 w-full space-y-4">
            
            {/* Invitations Center */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">Invitations</h3>
                  <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
                    <button
                      onClick={() => setActiveTab('received')}
                      className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                        activeTab === 'received' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Received ({receivedPending.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('sent')}
                      className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                        activeTab === 'sent' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Sent ({sentPending.length})
                    </button>
                  </div>
                </div>
              </div>

              {/* Received Invitations List */}
              {activeTab === 'received' && (
                <div className="divide-y divide-slate-100">
                  {receivedPending.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-xs sm:text-sm">
                      <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className="font-semibold text-slate-700">No pending invitations</p>
                      <p className="text-slate-400 text-xs mt-0.5">
                        When people ask to connect with you on SignTap, their invitations will appear here.
                      </p>
                    </div>
                  ) : (
                    receivedPending.map((inv) => (
                      <div
                        key={inv.id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <Link href={`/u/${inv.requester_username}`} className="shrink-0">
                            {inv.requester_image ? (
                              <img
                                src={inv.requester_image}
                                alt={inv.requester_name}
                                className="w-14 h-14 rounded-full object-cover border border-slate-200 shadow-xs"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-full bg-[#6969F5] text-white flex items-center justify-center font-bold text-lg">
                                {inv.requester_name.charAt(0)}
                              </div>
                            )}
                          </Link>
                          <div>
                            <Link
                              href={`/u/${inv.requester_username}`}
                              className="font-bold text-slate-900 text-sm hover:text-[#6969F5] hover:underline"
                            >
                              {inv.requester_name}
                            </Link>
                            <p className="text-xs text-slate-600 line-clamp-1">{inv.requester_headline}</p>
                            <p className="text-[11px] text-slate-400 mt-1">
                              Invited {new Date(inv.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => handleDecline(inv.id)}
                            className="px-4 py-1.5 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Ignore
                          </button>
                          <button
                            onClick={() => handleAccept(inv.id)}
                            className="px-4 py-1.5 rounded-full bg-[#6969F5] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Sent Invitations List */}
              {activeTab === 'sent' && (
                <div className="divide-y divide-slate-100">
                  {sentPending.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-xs sm:text-sm">
                      <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className="font-semibold text-slate-700">No sent requests pending</p>
                      <p className="text-slate-400 text-xs mt-0.5">
                        You have no outgoing invitations awaiting response.
                      </p>
                    </div>
                  ) : (
                    sentPending.map((inv) => (
                      <div
                        key={inv.id}
                        className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Link href={`/u/${inv.recipient_username}`} className="shrink-0">
                            {inv.recipient_image ? (
                              <img
                                src={inv.recipient_image}
                                alt={inv.recipient_name}
                                className="w-12 h-12 rounded-full object-cover border border-slate-200"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-[#6969F5] text-white flex items-center justify-center font-bold text-sm">
                                {inv.recipient_name.charAt(0)}
                              </div>
                            )}
                          </Link>
                          <div>
                            <Link
                              href={`/u/${inv.recipient_username}`}
                              className="font-bold text-slate-900 text-sm hover:underline"
                            >
                              {inv.recipient_name}
                            </Link>
                            <p className="text-xs text-slate-500 line-clamp-1">{inv.recipient_headline}</p>
                            <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">
                              Pending response
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDecline(inv.id)}
                          className="px-3.5 py-1.5 rounded-full border border-slate-300 text-slate-500 hover:text-red-600 hover:border-red-300 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Withdraw
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Connected Members Modal / Drawer if toggled */}
            {connectedTabOpen && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="font-bold text-slate-900 text-sm">
                    My Connected Members ({liveConnCount})
                  </h4>
                  <button
                    onClick={() => setConnectedTabOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100 mt-2">
                  {activeConnections.map(c => {
                    const isRequester = c.requester_id === currentUserId;
                    const otherName = isRequester ? c.recipient_name : c.requester_name;
                    const otherUsername = isRequester ? c.recipient_username : c.requester_username;
                    const otherImage = isRequester ? c.recipient_image : c.requester_image;
                    const otherHeadline = isRequester ? c.recipient_headline : c.requester_headline;
                    const otherUserId = isRequester ? c.recipient_id : c.requester_id;

                    return (
                      <div key={c.id} className="py-2.5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Link href={`/u/${otherUsername}`} className="shrink-0">
                            {otherImage ? (
                              <img
                                src={otherImage}
                                alt={otherName}
                                className="w-10 h-10 rounded-full object-cover border border-slate-200"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-[#6969F5] text-white flex items-center justify-center font-bold text-xs">
                                {otherName.charAt(0)}
                              </div>
                            )}
                          </Link>
                          <div className="min-w-0">
                            <Link href={`/u/${otherUsername}`} className="font-semibold text-xs text-slate-900 truncate hover:underline block">
                              {otherName}
                            </Link>
                            <p className="text-[11px] text-slate-500 truncate">{otherHeadline}</p>
                          </div>
                        </div>

                        <Link
                          href={`/messages?user=${otherUserId}`}
                          className="shrink-0 px-3 py-1 rounded-full border border-[#6969F5] text-[#6969F5] hover:bg-blue-50 text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Message</span>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* People You May Know Grid */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    People You May Know in SignTap
                  </h3>
                  <p className="text-xs text-slate-500">Based on your industry, skills and mutual connections</p>
                </div>

                {/* Instant Search Bar */}
                <div className="relative w-full sm:w-60">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, role, skill..."
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-100 focus:bg-white text-xs rounded-lg border border-transparent focus:border-[#6969F5] focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Grid of Profile Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {recommendedProfiles.map((p) => {
                  const newStatus = getNewMemberStatus(p.created_at, 20);
                  const isSent = sentRequestsMap[p.user_id];

                  return (
                    <div
                      key={p.id}
                      className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center p-4 relative overflow-hidden"
                    >
                      {/* Top Banner */}
                      <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-r from-blue-700 to-indigo-900" />

                      {/* Avatar */}
                      <Link href={`/u/${p.username}`} className="relative mt-2 mb-2 group">
                        {p.profile_image ? (
                          <img
                            src={p.profile_image}
                            alt={p.full_name}
                            className="w-18 h-18 rounded-full object-cover border-2 border-white shadow-sm group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-18 h-18 rounded-full bg-[#6969F5] text-white flex items-center justify-center font-bold text-2xl border-2 border-white shadow-sm">
                            {p.full_name.charAt(0)}
                          </div>
                        )}
                        {p.is_premium && (
                          <Crown className="w-4 h-4 text-amber-500 absolute bottom-0 right-0 fill-amber-400 stroke-amber-600" />
                        )}
                      </Link>

                      {/* Name & Badges */}
                      <div className="w-full">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          <Link
                            href={`/u/${p.username}`}
                            className="font-bold text-slate-900 text-sm hover:text-[#6969F5] hover:underline truncate"
                          >
                            {p.full_name}
                          </Link>
                          {newStatus.isNew && (
                            <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-300">
                              NEW
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 min-h-[32px]">
                          {p.headline || p.title || 'SignTap Member'}
                        </p>

                        <p className="text-[11px] text-slate-400 mt-2 truncate">
                          {p.location || 'India'}
                        </p>
                      </div>

                      {/* Action Button */}
                      <div className="w-full mt-4 pt-3 border-t border-slate-100">
                        <button
                          onClick={(e) => handleSendConnect(p, e)}
                          disabled={isSent}
                          className={`w-full py-1.5 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isSent
                              ? 'bg-slate-100 text-slate-500 border border-slate-200'
                              : 'border border-[#6969F5] text-[#6969F5] hover:bg-blue-50/70 hover:border-blue-700'
                          }`}
                        >
                          {isSent ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Pending</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>Connect</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {recommendedProfiles.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No professionals found matching "{searchQuery}".
                </div>
              )}
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

