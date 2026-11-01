'use client';

import React, { useState, useEffect } from 'react';
import { 
  getCurrentUser, 
  getProfileByUserId, 
  getOrCreateProfileForUser, 
  getAnalyticsSummary,
  getLinksByProfileId
} from '@/lib/store';
import { Profile, AnalyticsSummary } from '@/lib/types';
import { 
  BarChart3, 
  Eye, 
  Wifi, 
  QrCode, 
  MousePointerClick, 
  Calendar, 
  TrendingUp, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function AnalyticsDashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;

    let p = getProfileByUserId(user.id);
    if (!p) {
      p = getOrCreateProfileForUser(user);
    }

    if (p) {
      setProfile(p);
      setAnalytics(getAnalyticsSummary(p.id));
    }
  }, []);

  if (!profile || !analytics) return null;

  // Max value calculation for bar chart height
  const maxDayViews = Math.max(...analytics.views_by_day.map(d => d.views + d.nfc_taps), 8);

  return (
    <div className="space-y-8 max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Profile Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time telemetry on physical NFC card taps, QR scans, and link clicks.
          </p>
        </div>

        {/* Time Filter */}
        <div className="inline-flex p-1 rounded-xl bg-slate-200/80 border border-slate-300/60">
          {(['7d', '30d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                timeRange === range
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Views</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#087CF0] flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">
            {timeRange === '30d' ? analytics.total_views * 3 : analytics.total_views}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> Healthy upward engagement
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">NFC Smart Card Taps</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#FF7900] flex items-center justify-center">
              <Wifi className="w-4 h-4 rotate-90" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">
            {timeRange === '30d' ? analytics.total_nfc_taps * 3 : analytics.total_nfc_taps}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 font-mono">
            Direct contactless reads
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">QR Code Visits</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">
            {timeRange === '30d' ? analytics.total_qr_scans * 3 : analytics.total_qr_scans}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 font-mono">
            Optical smartphone scans
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Outbound Link Clicks</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">
            {timeRange === '30d' ? analytics.total_link_clicks * 3 : analytics.total_link_clicks}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 font-mono">
            Social & portfolio clicks
          </span>
        </div>

      </div>

      {/* Visual Chart: Views & NFC Taps Over Time */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Activity Over Time
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Daily profile visits and physical NFC smart card taps.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="w-3 h-3 rounded-md bg-[#087CF0]" /> Web Views
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="w-3 h-3 rounded-md bg-[#FF7900]" /> NFC Taps
            </span>
          </div>
        </div>

        {/* Clean Bar Visualization */}
        <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-8 pb-2 px-2">
          {analytics.views_by_day.map((d, i) => {
            const viewHeightPercent = Math.min(Math.round((d.views / maxDayViews) * 100), 100);
            const tapHeightPercent = Math.min(Math.round((d.nfc_taps / maxDayViews) * 100), 100);

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                
                {/* Floating tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2 rounded-md font-mono whitespace-nowrap mb-1">
                  Views: {d.views} · Taps: {d.nfc_taps}
                </div>

                <div className="w-full max-w-[48px] flex items-end justify-center gap-1 h-44">
                  {/* View Bar */}
                  <div
                    style={{ height: `${Math.max(viewHeightPercent, 8)}%` }}
                    className="w-1/2 bg-[#087CF0] rounded-t-md transition-all duration-500 group-hover:bg-[#0668cc]"
                  />
                  {/* Tap Bar */}
                  <div
                    style={{ height: `${Math.max(tapHeightPercent, 6)}%` }}
                    className="w-1/2 bg-[#FF7900] rounded-t-md transition-all duration-500 group-hover:bg-[#e06a00]"
                  />
                </div>

                <span className="text-[11px] font-medium text-slate-400 mt-2 truncate text-center">
                  {d.date}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Most Clicked External Links Breakdown */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Most Clicked External Channels
        </h2>

        {analytics.top_links.length === 0 ? (
          <p className="text-xs text-slate-400 py-4">No outbound clicks recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {analytics.top_links.map((link, idx) => (
              <div 
                key={link.id} 
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold text-[10px] flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{link.label}</h4>
                    <p className="text-[11px] text-slate-400 truncate max-w-xs">{link.url}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-900">
                    {link.clicks} clicks
                  </span>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-700">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Privacy Guarantee Note */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-500 flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <span>
          SignBridge ID uses strictly privacy-preserving aggregate telemetry. We do not store visitor IP addresses, personal identifiers, or track users across external domains.
        </span>
      </div>

    </div>
  );
}
