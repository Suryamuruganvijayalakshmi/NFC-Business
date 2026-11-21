'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/Logo';
import { getCurrentUser, logoutUser } from '@/lib/store';
import { ArrowRight, Menu, X, LayoutDashboard, CreditCard, Sparkles, Wifi, LogIn, LogOut, UserPlus } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    setUser(getCurrentUser());
  }, [pathname]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Discover', href: '/discover' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Explore Cards', href: '/explore-cards' },
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <div className="sticky top-2 z-40 w-full px-3 sm:px-6 pointer-events-none">
      <header className="max-w-6xl mx-auto rounded-full border border-solid border-[#dee5ed] bg-white/95 backdrop-blur-xl shadow-[0_4px_16px_rgba(140,150,169,0.12)] px-4 sm:px-5 py-2.5 flex items-center justify-between pointer-events-auto transition-all">
        
        {/* Brand Logo with SignTap Official Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#923cf6]"
          aria-label="SignTap Home"
        >
          <Logo theme="light" size="sm" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#101828] text-white shadow-xs'
                    : 'text-[#45545e] hover:text-[#923cf6] hover:bg-slate-100/70'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA / Auth Status with Hero 02 Purple Button */}
        <div className="hidden md:flex items-center gap-2.5">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#101828] text-xs font-semibold transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#923cf6]" />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/order"
                className="inline-flex items-center overflow-clip rounded-full bg-[#923cf6] hover:bg-[#8129e0] hover:scale-[1.02] px-4 py-2 text-xs font-semibold text-white transition-all shadow-md active:scale-95"
              >
                <CreditCard className="w-3.5 h-3.5 mr-1.5" />
                <span>Get SignTap Card</span>
              </Link>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-xs font-semibold text-[#45545e] hover:text-[#010110] transition-colors"
              >
                Login
              </Link>

              <Link
                href="/order"
                className="inline-flex items-center overflow-clip rounded-full bg-[#923cf6] hover:bg-[#8129e0] hover:scale-[1.02] px-4 py-2 text-xs font-semibold text-white transition-all shadow-md active:scale-95"
              >
                <span>Get SignTap Card</span>
                <ArrowRight className="w-3 h-3 ml-1.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-full text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden max-w-6xl mx-auto mt-2 rounded-2xl border border-solid border-[#dee5ed] bg-white/95 backdrop-blur-2xl p-4 shadow-xl pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#101828] text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-[#923cf6] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.user_metadata?.full_name || 'SignTap Member'}</p>
                    <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold shadow-xs hover:bg-black transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#923cf6]" />
                  <span>Go to Dashboard</span>
                </Link>

                <Link
                  href="/order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#923cf6] text-white text-xs font-bold shadow-md hover:bg-[#8129e0] transition-colors"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Get SignTap Card</span>
                </Link>

                <button
                  onClick={() => {
                    logoutUser();
                    setUser(null);
                    setMobileMenuOpen(false);
                    window.location.href = '/';
                  }}
                  className="w-full py-2 rounded-full text-center text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-full text-center text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 border border-slate-200"
                >
                  <LogIn className="w-4 h-4 text-[#923cf6]" />
                  <span>Log In to SignTap</span>
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 rounded-full text-center text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create Free Account</span>
                </Link>
                <Link
                  href="/order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-full text-center text-xs font-semibold text-white bg-[#923cf6] hover:bg-[#8129e0] flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Get SignTap NFC Card</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
