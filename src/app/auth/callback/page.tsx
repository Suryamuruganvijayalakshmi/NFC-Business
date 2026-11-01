'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { setCurrentUser, saveProfile, getProfileByUserId } from '@/lib/store';
import { UserSession, Profile } from '@/lib/types';
import Logo from '@/components/Logo';

function CallbackContent() {
  const router = useRouter();
  const [status, setStatus] = useState('Authenticating with Google...');

  useEffect(() => {
    let isMounted = true;

    async function handleAuth() {
      if (isSupabaseConfigured && supabase) {
        try {
          // If code is in URL search params (PKCE flow), exchange it
          if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            if (code) {
              const { error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
              if (exchangeErr) {
                console.warn('OAuth exchange error:', exchangeErr.message);
              }
            }
          }

          const { data, error } = await supabase.auth.getSession();
          if (error) {
            if (isMounted) setStatus(`Authentication error: ${error.message}`);
            setTimeout(() => router.push('/login'), 2000);
            return;
          }

          const processUser = (user: any) => {
            const fullName = user.user_metadata?.full_name || user.user_metadata?.name || 'SignBridge Member';
            const email = user.email || '';
            const username = user.user_metadata?.username || email.split('@')[0].replace(/[^a-z0-9_-]/g, '').toLowerCase() || `user${Date.now().toString().slice(-4)}`;

            const sessionUser: UserSession = {
              id: user.id,
              email,
              user_metadata: {
                full_name: fullName,
                username,
                profile_type: 'professional',
              }
            };

            setCurrentUser(sessionUser);

            // Check if profile exists for this user
            const existing = getProfileByUserId(user.id);
            if (!existing) {
              if (isMounted) setStatus('Welcome to SignBridge! Setting up your workspace...');
              setTimeout(() => router.replace('/onboarding'), 400);
            } else {
              if (isMounted) setStatus('Success! Loading your personalized dashboard...');
              setTimeout(() => router.replace('/dashboard'), 400);
            }
          };

          if (data.session?.user) {
            processUser(data.session.user);
            return;
          }

          // Listen for session resolution via onAuthStateChange
          const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
              processUser(session.user);
            }
          });

          // Timeout fallback: if no session detected after 4 seconds, send to login
          setTimeout(() => {
            if (isMounted && !data.session?.user) {
              setStatus('Authentication incomplete. Redirecting to login...');
              router.replace('/login');
            }
          }, 4000);

          return () => {
            authListener.subscription.unsubscribe();
          };
        } catch (e: any) {
          console.warn('Callback error:', e);
          if (isMounted) setStatus('Authentication failed. Returning to login...');
          setTimeout(() => router.replace('/login'), 2000);
        }
      } else {
        if (isMounted) setStatus('Authentication service not configured. Returning to login...');
        setTimeout(() => router.replace('/login'), 2000);
      }
    }

    handleAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAFAFB] text-slate-800 text-center">
      <div className="max-w-sm w-full p-8 rounded-3xl bg-white border border-slate-200 shadow-xl flex flex-col items-center">
        <Logo theme="light" size="md" className="mb-6" />
        <div className="w-10 h-10 border-3 border-[#087CF0] border-t-transparent rounded-full animate-spin mb-4" />
        <h3 className="text-base font-bold text-slate-900">Google Authentication</h3>
        <p className="text-xs text-slate-500 mt-1">{status}</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAFAFB]">
        <div className="w-10 h-10 border-3 border-[#087CF0] border-t-transparent rounded-full animate-spin mb-4" />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
