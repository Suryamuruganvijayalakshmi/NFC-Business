'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import NotificationDropdown from '@/components/NotificationDropdown';
import { 
  getCurrentUser, 
  getProfileByUserId, 
  getOrCreateProfileForUser,
  syncProfilesFromSupabase,
  getAllConnections, 
  getUnreadMessageCount,
  logoutUser,
  isSuperAdminUser
} from '@/lib/store';
import { Profile, UserSession } from '@/lib/types';
import { 
  Home, 
  Users, 
  Briefcase, 
  MessageSquare, 
  CreditCard, 
  Search, 
  ChevronDown, 
  User, 
  Settings, 
  ShieldCheck, 
  LogOut, 
  Sparkles, 
  Crown,
  LayoutDashboard,
  Menu,
  X,
  PlusSquare,
  Compass
} from 'lucide-react';

export default function LinkedInNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<UserSession | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);

  const syncState = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      const p = getProfileByUserId(currentUser.id) || getOrCreateProfileForUser(currentUser);
      setProfile(p);

      // Pending received requests count
      const conns = getAllConnections();
      const pendingCount = conns.filter(c => 
        c.recipient_id === currentUser.id && c.status === 'pending'
      ).length;
      setPendingRequestsCount(pendingCount);

      // Unread messages count
      const unreadCount = getUnreadMessageCount(currentUser.id);
      setUnreadMessagesCount(unreadCount);
    } else {
      setProfile(null);
      setPendingRequestsCount(0);
      setUnreadMessagesCount(0);
    }
  };

  useEffect(() => {
    syncState();
    syncProfilesFromSupabase().then(() => syncState()).catch(() => {});
    const interval = setInterval(syncState, 6000);
    return () => clearInterval(interval);
  }, [pathname]);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/discover?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowMobileSearch(false);
    }
  };

  const handleSignOut = () => {
    logoutUser();
    setUser(null);
    setProfile(null);
    setShowProfileMenu(false);
    router.push('/login');
  };

  const isSuperAdmin = isSuperAdminUser(user);
  const username =
    profile?.username ||
    (user?.user_metadata?.username as string | undefined) ||
    (user?.email ? user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, '') : 'surya');
  const isPremium = profile?.is_premium;

  const navItems = [
    {
      label: 'Home',
      href: '/feed',
      icon: Home,
      active: pathname === '/feed' || pathname === '/',
    },
    {
      label: 'My Network',
      href: '/network',
      icon: Users,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : null,
      active: pathname.startsWith('/network'),
    },
    {
      label: 'Jobs',
      href: '/jobs',
      icon: Briefcase,
      active: pathname.startsWith('/jobs'),
    },
    {
      label: 'Messaging',
      href: '/messages',
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : null,
      active: pathname.startsWith('/messages'),
    },
    {
      label: 'Discover',
      href: '/discover',
      icon: Compass,
      active: pathname.startsWith('/discover'),
    },
  ];

  return (
    <>
      {/* Top Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] h-14 transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-full flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Brand Logo & Search Bar */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-md">
            <Link 
              href="/feed" 
              className="flex items-center gap-2 focus:outline-none shrink-0 group"
              title="SignTap Professional Network"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#0A66C2] to-[#004182] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Image
                  src="/images/signtap-logo.png"
                  alt="SignTap"
                  width={24}
                  height={24}
                  className="brightness-0 invert object-contain"
                />
              </div>
              <span className="font-bold text-lg text-slate-900 tracking-tight hidden sm:inline-block">
                Sign<span className="text-[#0A66C2]">Tap</span>
              </span>
            </Link>

            {/* Desktop Search Bar */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search professionals, skills, jobs..."
                className="w-full pl-9 pr-4 py-1.5 bg-[#EDF3F8] hover:bg-[#E1E9F0] focus:bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-500 rounded-md border border-transparent focus:border-[#0A66C2] focus:outline-none transition-all"
              />
            </form>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Right: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative flex flex-col items-center justify-center px-2.5 lg:px-3.5 py-1 min-w-[62px] h-12 text-[11px] font-medium transition-colors ${
                    item.active
                      ? 'text-slate-950 font-semibold border-b-2 border-slate-900'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <div className="relative">
                    <Icon className="w-5 h-5 mb-0.5" />
                    {item.badge ? (
                      <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-[16px] px-1 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    ) : null}
                  </div>
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Notifications Dropdown Component */}
            <div className="flex flex-col items-center justify-center px-2 py-1 min-w-[62px]">
              <NotificationDropdown />
              <span className="text-[11px] font-medium text-slate-500 -mt-1">Notifications</span>
            </div>

            {/* SignTap NFC Cards Link */}
            <Link
              href="/cards"
              className={`relative flex flex-col items-center justify-center px-2.5 lg:px-3 py-1 min-w-[66px] h-12 text-[11px] font-medium transition-colors ${
                pathname.startsWith('/cards')
                  ? 'text-slate-950 font-semibold border-b-2 border-slate-900'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <CreditCard className="w-5 h-5 mb-0.5 text-[#0A66C2]" />
                <span className="absolute -top-1.5 -right-3 text-[9px] font-bold px-1 py-0.2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full">
                  NFC
                </span>
              </div>
              <span className="text-[#0A66C2] font-semibold">NFC Cards</span>
            </Link>

            <div className="h-7 w-px bg-slate-200 mx-1 hidden lg:block" />

            {/* Profile Dropdown or Login / Join */}
            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex flex-col items-center justify-center px-2 py-1 min-w-[60px] h-12 text-[11px] font-medium text-slate-600 hover:text-slate-950 focus:outline-none cursor-pointer"
                >
                  <div className="relative">
                    {profile?.profile_image ? (
                      <img
                        src={profile.profile_image}
                        alt={profile.full_name}
                        className="w-6 h-6 rounded-full object-cover border border-slate-300 shadow-xs"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[#0A66C2] text-white flex items-center justify-center text-[10px] font-bold">
                        {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    {isPremium && (
                      <Crown className="w-3 h-3 text-amber-500 absolute -bottom-1 -right-1 fill-amber-400 stroke-amber-600 drop-shadow-xs" />
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 text-slate-700">
                    <span>Me</span>
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  </div>
                </button>

                {/* Profile Popup Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 top-13 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* Header Mini Info */}
                    <Link
                      href={`/u/${username}`}
                      onClick={() => setShowProfileMenu(false)}
                      className="px-4 pb-3 border-b border-slate-100 flex items-start gap-3 hover:bg-slate-50 transition-colors group cursor-pointer"
                      title="View Public Profile"
                    >
                      {profile?.profile_image ? (
                        <img
                          src={profile.profile_image}
                          alt={profile.full_name}
                          className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0 group-hover:opacity-90"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#0A66C2] text-white flex items-center justify-center font-bold text-lg shrink-0 group-hover:opacity-90">
                          {profile?.full_name?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-semibold text-slate-900 text-sm truncate group-hover:text-[#0A66C2] transition-colors">
                            {profile?.full_name || user.email}
                          </h4>
                          {isPremium && (
                            <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              PRO
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {profile?.headline || profile?.title || 'SignTap Member'}
                        </p>
                        <p className="text-[11px] text-[#0A66C2] font-semibold">
                          @{username} · View Profile
                        </p>
                      </div>
                    </Link>

                    {/* View Profile Action Button */}
                    <div className="px-4 py-2.5">
                      <Link
                        href={`/u/${username}`}
                        onClick={() => setShowProfileMenu(false)}
                        className="w-full block text-center py-1.5 px-3 rounded-full border border-[#0A66C2] text-[#0A66C2] hover:bg-blue-50/70 text-xs font-semibold transition-colors"
                      >
                        View Public Profile
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 my-1" />

                    {/* Menu Links */}
                    <div className="py-1">
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        <span>Edit Professional Profile</span>
                      </Link>

                      <Link
                        href="/dashboard"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-500" />
                        <span>SignTap Identity Console</span>
                      </Link>

                      <Link
                        href="/dashboard/nfc"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-colors"
                      >
                        <CreditCard className="w-4 h-4 text-slate-500" />
                        <span>Manage NFC Physical Card</span>
                      </Link>

                      <Link
                        href="/dashboard/contacts"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-colors"
                      >
                        <Users className="w-4 h-4 text-slate-500" />
                        <span>Smart CRM & Follow-ups</span>
                      </Link>

                      <Link
                        href="/connect"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-[#0A66C2]" />
                        <span>SignTap Connect (QR / NFC)</span>
                      </Link>

                      <Link
                        href="/events"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-colors"
                      >
                        <Compass className="w-4 h-4 text-slate-500" />
                        <span>Events & Networking</span>
                      </Link>

                      <Link
                        href="/organizations"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-colors"
                      >
                        <Briefcase className="w-4 h-4 text-slate-500" />
                        <span>Organizations & Teams</span>
                      </Link>

                      <Link
                        href="/dashboard/orders"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-colors"
                      >
                        <Briefcase className="w-4 h-4 text-slate-500" />
                        <span>My Card Orders</span>
                      </Link>

                      <Link
                        href="/dashboard/settings"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-slate-500" />
                        <span>Settings & Privacy</span>
                      </Link>

                      {/* Super Admin Console for authorized accounts */}
                      {isSuperAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-purple-600" />
                          <span>Super Admin Panel</span>
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-slate-100 my-1" />

                    {/* Sign Out */}
                    <div className="px-2 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-full transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-1.5 text-xs font-semibold text-[#0A66C2] border border-[#0A66C2] hover:bg-blue-50/70 rounded-full transition-colors"
                >
                  Join Now
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Right Bar: Profile Avatar or Login, Notification & Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            {user ? (
              <Link
                href={`/u/${username}`}
                className="relative shrink-0 flex items-center justify-center group"
                title="View My Profile"
              >
                {profile?.profile_image ? (
                  <img
                    src={profile.profile_image}
                    alt={profile.full_name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-300 group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#0A66C2] text-white flex items-center justify-center text-[11px] font-bold group-hover:scale-105 transition-transform">
                    {profile?.full_name?.charAt(0) || 'U'}
                  </div>
                )}
                {isPremium && (
                  <Crown className="w-2.5 h-2.5 text-amber-500 absolute -bottom-0.5 -right-0.5 fill-amber-400 stroke-amber-600" />
                )}
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-2.5 py-1 text-xs font-semibold text-[#0A66C2] bg-blue-50/80 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
              >
                Sign In
              </Link>
            )}
            <NotificationDropdown />
            <button
              onClick={() => setShowMobileDrawer(!showMobileDrawer)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle Navigation"
            >
              {showMobileDrawer ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Input Overlay */}
        {showMobileSearch && (
          <div className="md:hidden px-4 py-2 bg-white border-b border-slate-200 animate-in slide-in-from-top-1">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search professionals, jobs, skills..."
                className="w-full pl-9 pr-4 py-2 bg-slate-100 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0A66C2]"
                autoFocus
              />
            </form>
          </div>
        )}

        {/* Mobile Drawer */}
        {showMobileDrawer && (
          <div className="md:hidden fixed inset-x-0 top-14 bg-white border-b border-slate-200 shadow-xl z-40 p-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-2">
            {user && profile ? (
              <Link
                href={`/u/${username}`}
                onClick={() => setShowMobileDrawer(false)}
                className="pb-4 mb-4 border-b border-slate-100 flex items-center gap-3 group -mx-1 px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                title="View Public Profile"
              >
                <img
                  src={profile.profile_image}
                  alt={profile.full_name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200 group-hover:opacity-90"
                />
                <div className="flex-1 min-w-0 text-left">
                  <h4 className="font-semibold text-slate-900 text-sm truncate group-hover:text-[#0A66C2] transition-colors">{profile.full_name}</h4>
                  <p className="text-xs text-slate-500 truncate">{profile.headline || profile.title}</p>
                  <span className="text-xs text-[#0A66C2] font-semibold inline-block mt-0.5">
                    View Public Profile →
                  </span>
                </div>
              </Link>
            ) : null}

            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setShowMobileDrawer(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                      item.active
                        ? 'bg-blue-50 text-[#0A66C2]'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-full">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}

              <Link
                href="/cards"
                onClick={() => setShowMobileDrawer(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#0A66C2] bg-blue-50/50"
              >
                <CreditCard className="w-5 h-5 text-[#0A66C2]" />
                <span>SignTap NFC Cards Marketplace</span>
              </Link>

              {user ? (
                <>
                  <div className="border-t border-slate-100 my-2 pt-2" />
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setShowMobileDrawer(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <User className="w-4 h-4 text-slate-500" />
                    <span>Edit Profile</span>
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setShowMobileDrawer(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-500" />
                    <span>Identity Dashboard</span>
                  </Link>
                  {isSuperAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setShowMobileDrawer(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-50"
                    >
                      <ShieldCheck className="w-4 h-4 text-purple-600" />
                      <span>Super Admin Panel</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setShowMobileDrawer(false);
                      handleSignOut();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setShowMobileDrawer(false)}
                    className="block w-full text-center py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setShowMobileDrawer(false)}
                    className="block w-full text-center py-2 text-sm font-semibold text-white bg-[#0A66C2] rounded-lg"
                  >
                    Join SignTap Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation Bar (LinkedIn Style for mobile thumb navigation) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/90 shadow-[0_-1px_3px_rgba(0,0,0,0.05)] h-14 flex items-center justify-around px-2">
        <Link
          href="/feed"
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium ${
            pathname === '/feed' || pathname === '/' ? 'text-[#0A66C2] font-semibold' : 'text-slate-500'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </Link>

        <Link
          href="/network"
          className={`relative flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium ${
            pathname.startsWith('/network') ? 'text-[#0A66C2] font-semibold' : 'text-slate-500'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          {pendingRequestsCount > 0 && (
            <span className="absolute top-0 right-5 w-2 h-2 bg-red-600 rounded-full" />
          )}
          <span>Network</span>
        </Link>

        <Link
          href="/feed?create=1"
          className="flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium text-slate-500"
        >
          <PlusSquare className="w-5 h-5 mb-0.5 text-slate-800" />
          <span>Post</span>
        </Link>

        <Link
          href="/messages"
          className={`relative flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium ${
            pathname.startsWith('/messages') ? 'text-[#0A66C2] font-semibold' : 'text-slate-500'
          }`}
        >
          <MessageSquare className="w-5 h-5 mb-0.5" />
          {unreadMessagesCount > 0 && (
            <span className="absolute top-0 right-5 w-2 h-2 bg-red-600 rounded-full" />
          )}
          <span>Chat</span>
        </Link>

        <Link
          href="/jobs"
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium ${
            pathname.startsWith('/jobs') ? 'text-[#0A66C2] font-semibold' : 'text-slate-500'
          }`}
        >
          <Briefcase className="w-5 h-5 mb-0.5" />
          <span>Jobs</span>
        </Link>
      </nav>
    </>
  );
}
