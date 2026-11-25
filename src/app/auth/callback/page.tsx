'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { setCurrentUser, saveProfile, getProfileByUserId, getOrCreateProfileForUser } from '@/lib/store';
import { UserSession, Profile } from '@/lib/types';
import Logo from '@/components/Logo';

function CallbackContent() {
  const router = useRouter();
  const [status, setStatus] = useState('Authenticating with Google...');

  useEffect(() => {
    let isMounted = true;
    let processed = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let unsubscribeAuth: (() => void) | null = null;

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
            timeoutId = setTimeout(() => router.replace('/login'), 2000);
            return;
          }

          const processUser = async (user: any) => {
            if (processed) return;
            processed = true;
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }

            const fullName = user.user_metadata?.full_name || user.user_metadata?.name || 'SignTap Member';
            const email = user.email || '';
            const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
            const rawHandle = email ? email.split('@')[0] : '';
            const cleanHandle = rawHandle.replace(/[^a-z0-9_-]/gi, '').toLowerCase();
            const username = user.user_metadata?.username || cleanHandle || `user${Date.now().toString().slice(-4)}`;

            const sessionUser: UserSession = {
              id: user.id,
              email,
              user_metadata: {
                full_name: fullName,
                username,
                profile_type: 'professional',
                avatar_url: avatarUrl,
              }
            };

            try {
              setCurrentUser(sessionUser);

              // Fetch profile from Supabase if available or create locally
              try {
                if (supabase) {
                  const { data: dbProfile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('user_id', user.id)
                    .maybeSingle();

                  if (dbProfile) {
                    saveProfile(dbProfile);
                    if (isMounted) setStatus('Welcome back! Loading your SignTap Feed...');
                    setTimeout(() => {
                      if (isMounted) router.replace('/feed');
                    }, 150);
                    return;
                  }
                }
              } catch (err) {
                console.warn('Profile fetch notice:', err);
              }

              // Create or fetch profile for this user
              getOrCreateProfileForUser(sessionUser);
            } catch (storageErr) {
              console.warn('Profile hydration notice:', storageErr);
            }

            if (isMounted) setStatus('Welcome to SignTap! Loading your Home Feed...');
            setTimeout(() => {
              if (isMounted) router.replace('/feed');
            }, 150);
          };

          if (data.session?.user) {
            await processUser(data.session.user);
            return;
          }

          // Listen for session resolution via onAuthStateChange
          const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
              processUser(session.user);
            }
          });
          unsubscribeAuth = () => authListener.subscription.unsubscribe();

          // Timeout fallback: if no session detected after 4 seconds, send to login
          timeoutId = setTimeout(() => {
            if (isMounted && !processed) {
              setStatus('Authentication incomplete. Redirecting to login...');
              router.replace('/login');
            }
          }, 4000);
        } catch (e: any) {
          console.warn('Callback error:', e);
          if (isMounted) setStatus('Authentication failed. Returning to login...');
          timeoutId = setTimeout(() => router.replace('/login'), 2000);
        }
      } else {
        if (isMounted) setStatus('Authentication service not configured. Returning to login...');
        timeoutId = setTimeout(() => router.replace('/login'), 2000);
      }
    }

    handleAuth();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      if (unsubscribeAuth) unsubscribeAuth();
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
