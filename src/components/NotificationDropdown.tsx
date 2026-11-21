'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { AppNotification } from '@/lib/types';
import { 
  getNotificationsForUser, 
  getUnreadNotificationCount, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification,
  acceptConnectionRequest,
  declineConnectionRequest,
  getCurrentUser
} from '@/lib/store';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  Users2, 
  UserPlus, 
  UserCheck, 
  ArrowRight, 
  Sparkles,
  ExternalLink,
  X
} from 'lucide-react';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionDone, setActionDone] = useState<Record<string, string>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifications = () => {
    const user = getCurrentUser();
    if (!user) return;
    const notifs = getNotificationsForUser(user.id);
    setNotifications(notifs);
    setUnreadCount(getUnreadNotificationCount(user.id));
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 8000); // Poll notifications every 8s
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAllRead = () => {
    const user = getCurrentUser();
    if (!user) return;
    markAllNotificationsAsRead(user.id);
    loadNotifications();
  };

  const handleAcceptRequest = (notif: AppNotification) => {
    if (!notif.connection_id) return;
    setActionLoading(notif.id);
    try {
      acceptConnectionRequest(notif.connection_id);
      markNotificationAsRead(notif.id);
      setActionDone(prev => ({ ...prev, [notif.id]: 'accepted' }));
      setTimeout(loadNotifications, 500);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeclineRequest = (notif: AppNotification) => {
    if (!notif.connection_id) return;
    setActionLoading(notif.id);
    try {
      declineConnectionRequest(notif.connection_id);
      markNotificationAsRead(notif.id);
      setActionDone(prev => ({ ...prev, [notif.id]: 'declined' }));
      setTimeout(loadNotifications, 500);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(id);
    loadNotifications();
  };

  const formatTime = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          loadNotifications();
        }}
        className="relative p-2 rounded-xl border border-slate-200/90 text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors focus:outline-none"
        title="Notifications"
        aria-label="View notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200/90 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#087CF0]/10 text-[#087CF0]">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] font-semibold text-[#087CF0] hover:text-[#0668cc] flex items-center gap-1"
              >
                <CheckCheck className="w-3 h-3" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="py-10 text-center px-4">
                <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600">No notifications yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">When someone connects, follows, or messages you, it will appear here.</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const isConnectionRequest = notif.type === 'connection_request';
                const status = actionDone[notif.id];

                return (
                  <div
                    key={notif.id}
                    className={`p-3.5 hover:bg-slate-50/80 transition-colors flex gap-3 ${
                      !notif.read ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    {/* Avatar / Icon */}
                    <div className="shrink-0 relative">
                      {notif.sender_image ? (
                        <img
                          src={notif.sender_image}
                          alt={notif.sender_name || 'Member'}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#087CF0] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                          {notif.sender_name?.charAt(0) || 'U'}
                        </div>
                      )}
                      {isConnectionRequest && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px]">
                          <UserPlus className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {notif.sender_name || notif.title}
                        </p>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {formatTime(notif.created_at)}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>

                      {/* 1-Click Connection Actions for Connection Requests */}
                      {isConnectionRequest && !status && (
                        <div className="mt-2.5 flex items-center gap-2">
                          <button
                            type="button"
                            disabled={actionLoading === notif.id}
                            onClick={() => handleAcceptRequest(notif)}
                            className="px-3 py-1 rounded-full bg-[#087CF0] hover:bg-[#0668cc] text-white text-[11px] font-bold shadow-xs transition-colors flex items-center gap-1 disabled:opacity-50"
                          >
                            <Check className="w-3 h-3" />
                            <span>Accept</span>
                          </button>
                          <button
                            type="button"
                            disabled={actionLoading === notif.id}
                            onClick={() => handleDeclineRequest(notif)}
                            className="px-2.5 py-1 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600 text-[11px] font-semibold transition-colors disabled:opacity-50"
                          >
                            <span>Decline</span>
                          </button>
                        </div>
                      )}

                      {/* Handled status banner */}
                      {status === 'accepted' && (
                        <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md w-fit">
                          <UserCheck className="w-3 h-3" />
                          <span>Connected!</span>
                        </div>
                      )}

                      {status === 'declined' && (
                        <div className="mt-2 text-[11px] font-medium text-slate-400">
                          Request declined
                        </div>
                      )}

                      {/* If not a connection request, show link if present */}
                      {!isConnectionRequest && notif.link && (
                        <Link
                          href={notif.link}
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            setIsOpen(false);
                          }}
                          className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#087CF0] hover:underline"
                        >
                          <span>View Profile</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>

                    {/* Delete action */}
                    <button
                      type="button"
                      onClick={(e) => handleDelete(notif.id, e)}
                      className="text-slate-300 hover:text-rose-500 transition-colors p-1 shrink-0 self-start"
                      title="Dismiss notification"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 border-t border-slate-100 bg-slate-50/70 text-center">
            <Link
              href="/dashboard/network"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-[#087CF0] hover:text-[#0668cc] inline-flex items-center gap-1.5 transition-colors"
            >
              <Users2 className="w-3.5 h-3.5" />
              <span>Manage Network & Connections</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}
