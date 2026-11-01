'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { logoutUser } from '@/lib/store';
import { 
  LayoutDashboard, 
  User, 
  Palette, 
  Link2, 
  Briefcase, 
  BarChart3, 
  Wifi, 
  Settings, 
  LogOut, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  onNavigate?: () => void;
  username?: string;
}

export default function Sidebar({ onNavigate, username = 'surya' }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile Editor', href: '/dashboard/profile', icon: User },
    { name: 'Customization', href: '/dashboard/design', icon: Palette },
    { name: 'Social & Links', href: '/dashboard/links', icon: Link2 },
    { name: 'Portfolio Works', href: '/dashboard/portfolio', icon: Briefcase },
    { name: 'Live Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'NFC Smart Card', href: '/dashboard/nfc', icon: Wifi, badge: 'NFC' },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0">
      
      {/* Top Header */}
      <div>
        <div className="h-18 flex items-center px-6 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2">
            <Logo theme="light" size="sm" />
          </Link>
        </div>

        {/* View Public Profile Quick Link */}
        <div className="p-4">
          <Link
            href={`/id/${username}`}
            target="_blank"
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors group"
          >
            <span className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="truncate">/id/{username}</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 flex-shrink-0" />
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#101828] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#087CF0]' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase ${
                    isActive ? 'bg-[#FF7900] text-white' : 'bg-orange-100 text-[#FF7900]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Profile Card & Logout */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-rose-400" />
        </button>
      </div>

    </aside>
  );
}
