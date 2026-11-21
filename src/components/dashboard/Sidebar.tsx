'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { logoutUser, getCurrentUser, getProfileByUserId, getPendingRequests, getFollowUpsByUserId, isSuperAdminUser } from '@/lib/store';
import { 
  LayoutDashboard, 
  User, 
  Palette, 
  Link2, 
  Briefcase, 
  BarChart3, 
  Wifi, 
  Package,
  Settings, 
  LogOut, 
  ExternalLink,
  Users2,
  Newspaper,
  Building,
  Compass,
  Contact,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  onNavigate?: () => void;
  username?: string;
}

export default function Sidebar({ onNavigate, username }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [pendingCount, setPendingCount] = useState(0);
  const [followUpDueCount, setFollowUpDueCount] = useState(0);
  const [hasOverdue, setHasOverdue] = useState(false);
  const [activeUsername, setActiveUsername] = useState(username || 'member');

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      const p = getProfileByUserId(user.id);
      if (p) setActiveUsername(p.username);
      else if (user.user_metadata?.username) setActiveUsername(user.user_metadata.username);
      else if (username) setActiveUsername(username);

      const pending = getPendingRequests(user.id);
      setPendingCount(pending.length);

      const { upcoming, overdue } = getFollowUpsByUserId(user.id);
      setFollowUpDueCount(overdue.length + upcoming.length);
      setHasOverdue(overdue.length > 0);
    } else if (username) {
      setActiveUsername(username);
    }
  }, [pathname, username]);

  const currentUser = getCurrentUser();
  // Strictly restricted to vmsurya2007@gmail.com and signbridge.aiauto@gmail.com
  const isAdmin = isSuperAdminUser(currentUser);

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Professional Profile', href: '/dashboard/profile', icon: User },
    ...(isAdmin ? [{ name: 'Super Admin Console', href: '/admin', icon: ShieldCheck, badge: 'MASTER', badgeColor: 'bg-indigo-600 text-white' }] : []),
    { 
      name: 'Smart Networking', 
      href: '/dashboard/contacts', 
      icon: Contact,
      badge: followUpDueCount > 0 ? `${followUpDueCount} task${followUpDueCount > 1 ? 's' : ''}` : undefined,
      badgeColor: hasOverdue ? 'bg-rose-500 text-white animate-pulse' : 'bg-amber-500 text-white'
    },
    { 
      name: 'Network & Connections', 
      href: '/dashboard/network', 
      icon: Users2, 
      badge: pendingCount > 0 ? `${pendingCount} new` : undefined,
      badgeColor: 'bg-emerald-500 text-white'
    },
    { name: 'Activity & Posts', href: '/dashboard/activity', icon: Newspaper },
    { name: 'Business Identity', href: '/dashboard/business', icon: Building },
    { name: 'Portfolio Works', href: '/dashboard/portfolio', icon: Briefcase },
    { name: 'Social & Custom Links', href: '/dashboard/links', icon: Link2 },
    { name: 'Appearance & Theme', href: '/dashboard/design', icon: Palette },
    { name: 'NFC Management', href: '/dashboard/nfc', icon: Wifi, badge: 'NFC' },
    { name: 'My Orders', href: '/dashboard/orders', icon: Package },
    { name: 'Live Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings & Privacy', href: '/dashboard/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 overflow-y-auto">
      
      {/* Top Header */}
      <div>
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2">
            <Logo theme="light" size="sm" />
          </Link>
        </div>

        {/* View Public Profile Quick Link */}
        <div className="p-3">
          <div className="flex flex-col gap-1.5">
            <Link
              href={`/u/${activeUsername}`}
              target="_blank"
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors group"
            >
              <span className="flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse" />
                <span className="truncate">/u/{activeUsername}</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 flex-shrink-0" />
            </Link>

            <Link
              href="/discover"
              className="flex items-center justify-between p-2 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] font-semibold text-[#087CF0] hover:bg-blue-100/60 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Discover Professionals</span>
              </span>
              <span className="text-[10px] bg-blue-200/80 px-1.5 py-0.2 rounded font-bold">New</span>
            </Link>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-0.5">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#101828] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#087CF0]' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase ${
                    item.badgeColor 
                      ? item.badgeColor 
                      : isActive 
                        ? 'bg-[#FF7900] text-white' 
                        : 'bg-orange-100 text-[#FF7900]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer User & Sign Out */}
      <div className="p-4 border-t border-slate-100 space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>

        <p className="text-[10px] text-center text-slate-400 font-mono">
          SignTap Identity Platform v2.0
        </p>
      </div>
    </aside>
  );
}
