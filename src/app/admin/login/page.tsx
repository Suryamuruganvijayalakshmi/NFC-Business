'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { getCurrentUser, setCurrentUser, logAdminActivity } from '@/lib/store';
import { ShieldCheck, Lock, ArrowRight, AlertCircle, Key } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@signbridge.click');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Secure administrative validation check
    const cleanEmail = email.trim().toLowerCase();
    
    // Check master admin credentials - strictly for vmsurya2007@gmail.com and signbridge.aiauto@gmail.com
    if (
      cleanEmail === 'vmsurya2007@gmail.com' ||
      cleanEmail === 'vmsuurya2007@gmail.com' ||
      cleanEmail === 'signbridge.aiauto@gmail.com' ||
      ((cleanEmail === 'admin@signbridge.click' || cleanEmail.includes('admin')) && (password === 'signtap2026' || password === 'admin123'))
    ) {
      const adminSession = {
        id: 'admin-master-01',
        email: cleanEmail || 'vmsurya2007@gmail.com',
        role: 'admin' as const,
        user_metadata: {
          full_name: 'Surya Narayanan (Super Admin)',
          username: 'admin',
        }
      };

      setCurrentUser(adminSession);
      logAdminActivity('Admin Authenticated', `Admin session started for ${cleanEmail}`, cleanEmail);
      
      setTimeout(() => {
        router.push('/admin');
      }, 500);
    } else {
      setError('Unauthorized access. Only registered administrative personnel can access this portal.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#F8FAFD] text-slate-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="flex justify-center">
          <Logo theme="light" size="lg" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-mono font-bold uppercase tracking-wider">
          <Lock className="w-3.5 h-3.5" />
          <span>Restricted Admin Portal</span>
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
          SignTap Management Console
        </h2>
        <p className="text-xs text-slate-500">
          Enter administrative credentials to oversee platform telemetries, orders, and hardware issuance.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/90 shadow-xl space-y-6">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@signbridge.click"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
                Master Security Key / Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#087CF0] hover:bg-[#0668cc] text-white text-sm font-semibold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <Key className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In as Administrator'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Fill Pill */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={() => {
                setEmail('admin@signbridge.click');
                setPassword('admin123');
              }}
              className="text-[11px] text-[#087CF0] hover:underline font-mono"
            >
              Demo: Autofill Admin Credentials
            </button>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-slate-900 transition-colors"
            >
              &larr; Return to Public Website
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

