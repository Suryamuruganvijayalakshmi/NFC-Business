'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { signUpUser } from '@/lib/store';
import { ProfileType } from '@/lib/types';
import { ArrowRight, User, Mail, Lock, AtSign, AlertCircle, Briefcase, Palette, Building } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profileType, setProfileType] = useState<ProfileType>('professional');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Username format check
    const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_-]/g, '').trim();
    if (!cleanUsername || cleanUsername.length < 3) {
      setError('Username must be at least 3 characters (letters, numbers, underscores).');
      return;
    }

    setLoading(true);

    try {
      const res = await signUpUser(email, password, fullName, cleanUsername, profileType);
      if (res.error) {
        setError(res.error);
        setLoading(false);
      } else {
        router.push('/dashboard/profile');
      }
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
      setLoading(false);
    }
  };

  const profileTypes: { id: ProfileType; title: string; desc: string; icon: any }[] = [
    { id: 'professional', title: 'Professional', desc: 'Engineers, executives, & consultants', icon: Briefcase },
    { id: 'creator', title: 'Creator', desc: 'Designers, YouTubers, & artists', icon: Palette },
    { id: 'business', title: 'Business', desc: 'Agencies, clinics, & teams', icon: Building },
    { id: 'personal', title: 'Personal', desc: 'Students & tech innovators', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#FAFAFB]">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center">
        <Link href="/" className="inline-block mb-4">
          <Logo theme="light" size="lg" />
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101828] tracking-tight">
          Create your SignBridge ID
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
          Your personalized digital identity and NFC smart card profile
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-slate-200">
          
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700">Full Name</label>
              <div className="relative mt-1">
                <input
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Surya Narayanan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Unique Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-700">Unique Profile Username</label>
              <div className="relative mt-1 flex items-center">
                <span className="absolute left-3 text-xs font-mono text-slate-400 select-none">
                  signbridge.click/id/
                </span>
                <input
                  required
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  placeholder="surya"
                  className="w-full pl-38 sm:pl-42 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700">Email Address</label>
              <div className="relative mt-1">
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="surya@signbridge.click"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <div className="relative mt-1">
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Profile Type Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Select Profile Type</label>
              <div className="grid grid-cols-2 gap-2">
                {profileTypes.map((pt) => {
                  const Icon = pt.icon;
                  const isSelected = profileType === pt.id;
                  return (
                    <button
                      key={pt.id}
                      type="button"
                      onClick={() => setProfileType(pt.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#087CF0] bg-[#087CF0]/5 ring-1 ring-[#087CF0]'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-[#087CF0]' : 'text-slate-400'}`} />
                        <span className={`text-xs font-bold ${isSelected ? 'text-[#087CF0]' : 'text-slate-800'}`}>
                          {pt.title}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{pt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 rounded-xl bg-[#087CF0] text-white text-xs sm:text-sm font-semibold hover:bg-[#0668cc] transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 disabled:opacity-50"
            >
              <span>{loading ? 'Creating Identity...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already have a profile?{' '}
            <Link href="/login" className="text-[#087CF0] font-semibold hover:underline">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
