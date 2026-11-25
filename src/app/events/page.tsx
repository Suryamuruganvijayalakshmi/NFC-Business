'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import LinkedInNavbar from '@/components/LinkedInNavbar';
import {
  getCurrentUser,
  getProfileByUserId,
  getAllEvents,
  createEvent,
  registerForEvent,
  cancelEventRegistration,
  getRegistrationsForEvent,
} from '@/lib/store';
import { SignTapEvent, EventCategory, EventRegistration, Profile, UserSession } from '@/lib/types';
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  X,
  CheckCircle2,
  QrCode,
  Globe,
  BarChart3,
} from 'lucide-react';

export default function EventsPage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [events, setEvents] = useState<SignTapEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<SignTapEvent | null>(null);
  const [attendees, setAttendees] = useState<EventRegistration[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New event form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('meetup');
  const [location, setLocation] = useState('');
  const [isVirtual, setIsVirtual] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [description, setDescription] = useState('');

  const refresh = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      setProfile(getProfileByUserId(currentUser.id));
    }
    const list = getAllEvents();
    setEvents(list);
    if (selectedEvent) {
      setAttendees(getRegistrationsForEvent(selectedEvent.id));
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleSelectEvent = (evt: SignTapEvent) => {
    setSelectedEvent(evt);
    setAttendees(getRegistrationsForEvent(evt.id));
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !title.trim() || !location.trim() || !startDate) return;
    const created = createEvent({
      title: title.trim(),
      description: description.trim(),
      category,
      organizer_user_id: profile.user_id,
      organizer_name: profile.full_name,
      location: location.trim(),
      is_virtual: isVirtual,
      start_date: new Date(startDate).toISOString(),
      visibility: 'public',
    });
    setShowCreateModal(false);
    setTitle('');
    setLocation('');
    setStartDate('');
    setDescription('');
    refresh();
    handleSelectEvent(created);
  };

  const handleRegister = (evtId: string) => {
    if (!profile) return;
    registerForEvent(evtId, profile, true);
    refresh();
    setAttendees(getRegistrationsForEvent(evtId));
  };

  const handleCancel = (evtId: string) => {
    if (!user) return;
    cancelEventRegistration(evtId, user.id);
    refresh();
    setAttendees(getRegistrationsForEvent(evtId));
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-slate-900 pb-20 md:pb-12">
      <LinkedInNavbar />
      <main className="max-w-6xl mx-auto px-4 pt-20 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">SignTap Events & Real-World Networking</h1>
            <p className="text-sm text-slate-600 mt-1">
              Register for conferences, hackathons, and meetups — and exchange SignTap identities with attendees.
            </p>
          </div>
          {profile && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 rounded-full bg-[#6969F5] hover:bg-[#5858E6] text-white text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Host Event
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Event List */}
          <div className="lg:col-span-2 space-y-4">
            {events.map((evt) => {
              const regs = getRegistrationsForEvent(evt.id);
              const isRegistered = Boolean(user && regs.some((r) => r.user_id === user.id));
              return (
                <div
                  key={evt.id}
                  className={`bg-white rounded-2xl border p-6 shadow-xs transition-all ${
                    selectedEvent?.id === evt.id ? 'border-[#6969F5]' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-[#6969F5]">
                        {evt.category}
                      </span>
                      <h2 className="text-lg font-bold text-slate-900 mt-2">{evt.title}</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Hosted by {evt.organizer_name}</p>
                    </div>
                    <button
                      onClick={() => handleSelectEvent(evt)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      Details & Attendees
                    </button>
                  </div>

                  <p className="text-sm text-slate-700 mt-3">{evt.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(evt.start_date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      {evt.is_virtual ? <Globe className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                      {evt.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {evt.registrations_count} registered
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    {user ? (
                      isRegistered ? (
                        <button
                          onClick={() => handleCancel(evt.id)}
                          className="px-4 py-2 rounded-full border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Registered (Cancel)
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRegister(evt.id)}
                          className="px-4 py-2 rounded-full bg-[#6969F5] text-white text-xs font-bold hover:bg-[#5858E6] cursor-pointer"
                        >
                          Register to Attend
                        </button>
                      )
                    ) : (
                      <Link href="/login" className="px-4 py-2 rounded-full bg-[#6969F5] text-white text-xs font-bold">
                        Sign in to Register
                      </Link>
                    )}

                    <Link
                      href={`/connect?event=${encodeURIComponent(evt.id)}&eventName=${encodeURIComponent(evt.title)}`}
                      className="px-4 py-2 rounded-full border border-[#6969F5] text-[#6969F5] text-xs font-semibold hover:bg-blue-50 flex items-center gap-1.5"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      Event Contact Exchange
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Panel: Selected Event Attendees & Organizer Analytics */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs h-fit space-y-5">
            {selectedEvent ? (
              <>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedEvent.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">Discoverable Attendees & Organizer Metrics</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                      <BarChart3 className="w-3 h-3" /> Registrations
                    </p>
                    <p className="text-xl font-extrabold text-slate-900 mt-1">{selectedEvent.registrations_count}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-[11px] text-slate-500 font-semibold">Discoverable</p>
                    <p className="text-xl font-extrabold text-slate-900 mt-1">
                      {attendees.filter((a) => a.discoverable).length}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Attendees</h4>
                  {attendees.filter((a) => a.discoverable).length === 0 ? (
                    <p className="text-xs text-slate-500">No discoverable attendees yet.</p>
                  ) : (
                    attendees
                      .filter((a) => a.discoverable)
                      .map((att) => (
                        <div key={att.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                          <div className="min-w-0">
                            <Link href={`/u/${att.username}`} className="text-xs font-bold text-slate-900 hover:text-[#6969F5] truncate block">
                              {att.full_name}
                            </Link>
                            <p className="text-[11px] text-slate-500 truncate">{att.headline || `@${att.username}`}</p>
                          </div>
                          <Link
                            href={`/connect?with=${att.username}&method=link&event=${encodeURIComponent(selectedEvent.id)}&eventName=${encodeURIComponent(selectedEvent.title)}`}
                            className="px-2.5 py-1 rounded-full bg-blue-50 text-[#6969F5] text-[11px] font-semibold shrink-0"
                          >
                            Exchange
                          </Link>
                        </div>
                      ))
                  )}
                </div>
              </>
            ) : (
              <p className="text-xs text-slate-500">Select an event to inspect attendees, organizer analytics, and event-specific contact exchange.</p>
            )}
          </div>
        </div>

        {/* Host Event Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Host Networking Event</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreateEvent} className="space-y-3">
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Event Title"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EventCategory)}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-xl"
                  >
                    <option value="meetup">Meetup</option>
                    <option value="conference">Conference</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="workshop">Workshop</option>
                    <option value="startup">Startup Event</option>
                    <option value="college">College Event</option>
                  </select>
                  <input
                    required
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-xl"
                  />
                </div>
                <input
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Venue or Virtual Link"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                />
                <label className="flex items-center gap-2 text-xs text-slate-700">
                  <input type="checkbox" checked={isVirtual} onChange={(e) => setIsVirtual(e.target.checked)} />
                  Virtual Event
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Event agenda and networking focus..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#6969F5] text-white text-sm font-bold cursor-pointer"
                >
                  Publish Event
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

