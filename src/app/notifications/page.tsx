'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import LinkedInNavbar from '@/components/LinkedInNavbar';
import { 
  getCurrentUser, 
  getProfileByUserId, 
  getNotificationsForUser, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification,
  acceptConnectionRequest,
  declineConnectionRequest,
  syncNotificationsFromSupabase
} from '@/lib/store';
import { AppNotification, Profile, UserSession } from '@/lib/types';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  UserPlus, 
  UserCheck, 
  Users, 
  ThumbsUp, 
  MessageSquare, 
  Briefcase, 
  Sparkles, 
  MoreHorizontal,
  Crown
} from 'lucide-react';

export default function NotificationsPage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [actionDone, setActionDone] = useState<Record<string, string>>({});

  const syncNotifications = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      setProfile(getProfileByUserId(currentUser.id));
      const notifs = getNotificationsForUser(currentUser.id);
      setNotifications(notifs);
    }
  };

  useEffect(() => {
    syncNotifications();
    const currentUser = getCurrentUser();
    if (currentUser?.id) {
      syncNotificationsFromSupabase(currentUser.id).then(() => {
        syncNotifications();
      }).catch(() => {});
    }
    const interval = setInterval(syncNotifications, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllRead = () => {
    if (!user) return;
    markAllNotificationsAsRead(user.id);
    syncNotifications();
  };

  const handleAcceptConnection = (connId?: string, notifId?: string) => {
    if (!connId) return;
    acceptConnectionRequest(connId);
    if (notifId) {
      setActionDone(prev => ({ ...prev, [notifId]: 'accepted' }));
      markNotificationAsRead(notifId);
    }
    syncNotifications();
  };

  const handleDeclineConnection = (connId?: string, notifId?: string) => {
    if (!connId) return;
    declineConnectionRequest(connId);
    if (notifId) {
      setActionDone(prev => ({ ...prev, [notifId]: 'declined' }));
      markNotificationAsRead(notifId);
    }
    syncNotifications();
  };

  const handleDelete = (id: string) => {
    deleteNotification(id);
    syncNotifications();
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-slate-800">
      <LinkedInNavbar />

      <main className="max-w-5xl mx-auto px-3 sm:px-6 pt-20 pb-20 md:pb-12">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          
          {/* Left Mini Sidebar */}
          <aside className="w-full md:w-60 shrink-0 space-y-3">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs text-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-2">Manage Notifications</h3>
              <p className="text-slate-500 leading-relaxed mb-3">
                Stay updated on requests, job alerts, reactions and in-person NFC card taps.
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg font-semibold transition-colors ${
                    filter === 'all' ? 'bg-blue-50 text-[#6969F5]' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  All Notifications ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`w-full text-left px-3 py-2 rounded-lg font-semibold transition-colors ${
                    filter === 'unread' ? 'bg-blue-50 text-[#6969F5]' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Unread ({notifications.filter(n => !n.read).length})
                </button>
              </div>
            </div>
          </aside>

          {/* Main Notifications Stream */}
          <div className="flex-1 w-full bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#6969F5]" />
                <span>Notifications</span>
              </h2>

              {notifications.some(n => !n.read) && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs font-semibold text-[#6969F5] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all as read</span>
                </button>
              )}
            </div>

            {/* List */}
            <div className="divide-y divide-slate-100">
              {filteredNotifications.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs">
                  <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-slate-600">No notifications to display</p>
                  <p className="text-slate-400 mt-0.5">
                    You're all caught up! New updates from your network will appear here.
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notif) => {
                  const isAccepted = actionDone[notif.id] === 'accepted';
                  const isDeclined = actionDone[notif.id] === 'declined';

                  return (
                    <div
                      key={notif.id}
                      className={`p-4 flex items-start justify-between gap-3 transition-colors ${
                        !notif.read ? 'bg-blue-50/40' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Sender Avatar or Icon */}
                        {notif.sender_image ? (
                          <img
                            src={notif.sender_image}
                            alt={notif.sender_name || 'Member'}
                            className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-[#6969F5] text-white flex items-center justify-center font-bold text-sm shrink-0">
                            {notif.sender_name ? notif.sender_name.charAt(0) : 'S'}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm text-slate-800 leading-snug">
                            {notif.sender_name && (
                              <strong className="font-semibold text-slate-900 mr-1">
                                {notif.sender_name}
                              </strong>
                            )}
                            {notif.message}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notif.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </p>

                          {/* Connection Request 1-Click Action Buttons */}
                          {notif.type === 'connection_request' && notif.connection_id && !isAccepted && !isDeclined && (
                            <div className="flex items-center gap-2 mt-2.5">
                              <button
                                onClick={() => handleDeclineConnection(notif.connection_id, notif.id)}
                                className="px-3 py-1 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
                              >
                                Decline
                              </button>
                              <button
                                onClick={() => handleAcceptConnection(notif.connection_id, notif.id)}
                                className="px-4 py-1 rounded-full bg-[#6969F5] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                              >
                                Accept
                              </button>
                            </div>
                          )}

                          {isAccepted && (
                            <span className="inline-block mt-2 text-xs font-semibold text-emerald-600">
                              ✓ Connection Accepted
                            </span>
                          )}

                          {isDeclined && (
                            <span className="inline-block mt-2 text-xs font-semibold text-slate-400">
                              Request Ignored
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(notif.id)}
                        className="p-1.5 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg shrink-0"
                        title="Delete notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

