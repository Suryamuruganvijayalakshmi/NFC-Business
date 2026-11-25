'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LinkedInNavbar from '@/components/LinkedInNavbar';
import { 
  getCurrentUser, 
  getProfileByUserId, 
  getAllJobs, 
  createJobListing, 
  applyToJob, 
  getApplicationsForUser,
  syncJobsFromSupabase
} from '@/lib/store';
import { JobListing, JobApplication, JobType, WorkplaceType, Profile, UserSession } from '@/lib/types';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  Building, 
  Clock, 
  DollarSign, 
  Check, 
  Plus, 
  X, 
  Bookmark, 
  Share2, 
  ExternalLink, 
  Filter, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  Send
} from 'lucide-react';

export default function JobsPage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [myApplications, setMyApplications] = useState<JobApplication[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);

  // Filters
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'explore' | 'applied'>('explore');

  // Apply Modal
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantHeadline, setApplicantHeadline] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);

  // Post Job Modal
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newType, setNewType] = useState<JobType>('Full-time');
  const [newWorkplace, setNewWorkplace] = useState<WorkplaceType>('Remote');
  const [newSalary, setNewSalary] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newRequirements, setNewRequirements] = useState('');

  const syncData = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    const all = getAllJobs();
    setJobs(all);
    if (!selectedJob && all.length > 0) {
      setSelectedJob(all[0]);
    }

    if (currentUser) {
      const p = getProfileByUserId(currentUser.id);
      setProfile(p);
      if (p) {
        setApplicantName(p.full_name || '');
        setApplicantEmail(p.email || '');
        setApplicantPhone(p.phone || '');
        setApplicantHeadline(p.headline || p.title || '');
        setResumeUrl(p.resume_url || '');
      }
      const apps = getApplicationsForUser(currentUser.id);
      setMyApplications(apps);
    }
  };

  useEffect(() => {
    syncData();
    syncJobsFromSupabase().then(() => syncData()).catch(() => {});
  }, []);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob || !user) return;

    applyToJob(selectedJob.id, {
      applicant_user_id: user.id,
      applicant_name: applicantName || 'SignTap Member',
      applicant_email: applicantEmail || user.email,
      applicant_headline: applicantHeadline,
      resume_url: resumeUrl || undefined,
      cover_note: coverNote || undefined,
    });

    setApplySuccess(true);
    setTimeout(() => {
      setApplySuccess(false);
      setIsApplyModalOpen(false);
      syncData();
    }, 1500);
  };

  const handlePostJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTitle || !newCompany) return;

    const reqs = newRequirements
      .split('\n')
      .map(r => r.trim())
      .filter(Boolean);

    const created = createJobListing({
      poster_user_id: user.id,
      title: newTitle.trim(),
      company: newCompany.trim(),
      location: newLocation.trim() || 'India / Remote',
      type: newType,
      workplace_type: newWorkplace,
      description: newDescription.trim(),
      requirements: reqs.length > 0 ? reqs : ['Strong domain expertise', 'Excellent communication skills'],
      salary_range: newSalary.trim() || 'Competitive',
      experience_level: 'Mid-Senior level',
      status: 'active',
    });

    setIsPostJobModalOpen(false);
    setNewTitle('');
    setNewCompany('');
    setNewLocation('');
    setNewSalary('');
    setNewDescription('');
    setNewRequirements('');
    syncData();
    setSelectedJob(created);
  };

  const filteredJobs = jobs.filter(j => {
    const matchesTitle = !searchTitle || 
      j.title.toLowerCase().includes(searchTitle.toLowerCase()) || 
      j.company.toLowerCase().includes(searchTitle.toLowerCase());
    const matchesLoc = !searchLocation || 
      j.location.toLowerCase().includes(searchLocation.toLowerCase());
    const matchesType = filterType === 'all' || j.type === filterType;
    return matchesTitle && matchesLoc && matchesType;
  });

  const hasAppliedToSelected = selectedJob && myApplications.some(a => a.job_id === selectedJob.id);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-slate-800">
      <LinkedInNavbar />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-20 pb-20 md:pb-12">
        
        {/* Top Search & Filter Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs mb-5">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                placeholder="Search job title, skill, or company"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 focus:bg-white text-xs sm:text-sm rounded-lg border border-slate-200 focus:border-[#6969F5] focus:outline-none transition-all"
              />
            </div>

            <div className="relative flex-1 w-full">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="City, state, or 'Remote'"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 focus:bg-white text-xs sm:text-sm rounded-lg border border-slate-200 focus:border-[#6969F5] focus:outline-none transition-all"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full md:w-auto px-4 py-2 bg-slate-50 text-xs sm:text-sm font-semibold rounded-lg border border-slate-200 focus:outline-none focus:border-[#6969F5] cursor-pointer"
            >
              <option value="all">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ================================================================= */}
          {/* LEFT SIDEBAR: Job Preferences & Post Job CTA */}
          {/* ================================================================= */}
          <aside className="w-full lg:w-64 shrink-0 space-y-4">
            
            {/* Preferences Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 font-bold text-slate-900 text-sm">
                Job Seeker Hub
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                <button
                  onClick={() => setActiveTab('explore')}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors cursor-pointer ${
                    activeTab === 'explore' ? 'bg-blue-50 text-[#6969F5] font-semibold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4" />
                    <span>Explore Opportunities</span>
                  </div>
                  <span className="font-bold">{jobs.length}</span>
                </button>

                <button
                  onClick={() => setActiveTab('applied')}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors cursor-pointer ${
                    activeTab === 'applied' ? 'bg-blue-50 text-[#6969F5] font-semibold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>My Applications</span>
                  </div>
                  <span className="font-bold text-[#6969F5]">{myApplications.length}</span>
                </button>
              </div>
            </div>

            {/* Post Job Action Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <h4 className="font-bold text-slate-900 text-sm mb-1">Hiring for your team?</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Post your job on SignTap to reach verified engineers, founders, and creative directors.
              </p>
              <button
                onClick={() => setIsPostJobModalOpen(true)}
                className="mt-3 w-full py-2 px-4 rounded-full border border-[#6969F5] text-[#6969F5] hover:bg-blue-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Post a Free Job</span>
              </button>
            </div>

          </aside>

          {/* ================================================================= */}
          {/* MAIN CONTENT: Jobs List + Detail Split View */}
          {/* ================================================================= */}
          <div className="flex-1 w-full">
            
            {activeTab === 'applied' ? (
              /* My Applications View */
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                <h3 className="font-bold text-slate-900 text-base mb-3">
                  My Job Applications ({myApplications.length})
                </h3>

                {myApplications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-600">No applications submitted yet</p>
                    <p className="text-slate-400 mt-0.5">Explore open roles and use 1-click Easy Apply.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {myApplications.map((app) => {
                      const matchedJob = jobs.find(j => j.id === app.job_id);
                      return (
                        <div key={app.id} className="py-3.5 flex items-start justify-between gap-3">
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">{matchedJob?.title || 'Job Listing'}</h4>
                            <p className="text-xs text-slate-600">{matchedJob?.company || 'Company'} • {matchedJob?.location}</p>
                            <p className="text-[11px] text-slate-400 mt-1">
                              Applied on {new Date(app.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#6969F5] border border-blue-200">
                            {app.status.toUpperCase()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Explore Jobs Split View */
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                
                {/* Jobs List (Left pane of split) */}
                <div className="md:col-span-5 space-y-2.5">
                  <p className="text-xs font-semibold text-slate-500 px-1">
                    Showing {filteredJobs.length} top job matches
                  </p>

                  <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
                    {filteredJobs.map((job) => {
                      const isSelected = selectedJob?.id === job.id;
                      return (
                        <div
                          key={job.id}
                          onClick={() => setSelectedJob(job)}
                          className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#6969F5] ring-1 ring-[#6969F5] shadow-sm'
                              : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-11 h-11 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 font-bold text-[#6969F5] text-sm overflow-hidden">
                              {job.company_logo ? (
                                <img src={job.company_logo} alt={job.company} className="w-full h-full object-cover" />
                              ) : (
                                job.company.charAt(0)
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-slate-900 text-sm truncate hover:text-[#6969F5]">
                                {job.title}
                              </h4>
                              <p className="text-xs text-slate-600 truncate">{job.company}</p>
                              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 truncate">
                                <MapPin className="w-3 h-3" />
                                <span>{job.location} ({job.workplace_type})</span>
                              </p>
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                                  {job.type}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {job.applicants_count} applicants
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Job Detail Card (Right pane of split) */}
                <div className="md:col-span-7">
                  {selectedJob ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs sticky top-20">
                      
                      {/* Header */}
                      <div className="border-b border-slate-100 pb-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-bold text-slate-900 text-lg sm:text-xl">
                              {selectedJob.title}
                            </h3>
                            <p className="text-sm font-medium text-slate-700 mt-0.5">
                              {selectedJob.company} • {selectedJob.location}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              Posted {new Date(selectedJob.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {selectedJob.applicants_count} applicants
                            </p>
                          </div>
                        </div>

                        {/* Badges Bar */}
                        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                            💼 {selectedJob.type}
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                            🏢 {selectedJob.workplace_type}
                          </span>
                          {selectedJob.salary_range && (
                            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                              💰 {selectedJob.salary_range}
                            </span>
                          )}
                        </div>

                        {/* Apply & Save Buttons */}
                        <div className="flex items-center gap-3 mt-4">
                          <button
                            onClick={() => setIsApplyModalOpen(true)}
                            disabled={Boolean(hasAppliedToSelected)}
                            className={`px-5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer ${
                              hasAppliedToSelected
                                ? 'bg-slate-100 text-slate-500 border border-slate-300'
                                : 'bg-[#6969F5] hover:bg-blue-700 text-white'
                            }`}
                          >
                            {hasAppliedToSelected ? (
                              <>
                                <Check className="w-4 h-4 text-emerald-600" />
                                <span>Applied</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4" />
                                <span>Easy Apply</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Job Description & Requirements */}
                      <div className="pt-4 space-y-4 max-h-[460px] overflow-y-auto pr-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm mb-1.5">About the Role</h4>
                          <p className="whitespace-pre-line">{selectedJob.description}</p>
                        </div>

                        {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm mb-1.5">Qualifications & Requirements</h4>
                            <ul className="list-disc list-inside space-y-1 text-slate-600">
                              {selectedJob.requirements.map((req, i) => (
                                <li key={i}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
                      Select a job on the left to see full requirements and apply.
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

        </div>
      </main>

      {/* ===================================================================== */}
      {/* EASY APPLY MODAL */}
      {/* ===================================================================== */}
      {isApplyModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-5 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Apply to {selectedJob.company}</h3>
                <p className="text-xs text-slate-500">{selectedJob.title}</p>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {applySuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="font-bold text-slate-900 text-base">Application Submitted!</h4>
                <p className="text-xs text-slate-500">
                  Your profile and details have been delivered to {selectedJob.company}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#6969F5]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#6969F5]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      placeholder="+91..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#6969F5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Professional Headline</label>
                  <input
                    type="text"
                    value={applicantHeadline}
                    onChange={(e) => setApplicantHeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#6969F5]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Resume / Portfolio Link</label>
                  <input
                    type="url"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    placeholder="https://yourportfolio.com or drive link"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#6969F5]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cover Note (Optional)</label>
                  <textarea
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    rows={3}
                    placeholder="Briefly state why you're a great fit for this position..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#6969F5] resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="px-4 py-2 rounded-full text-slate-600 hover:bg-slate-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#6969F5] hover:bg-blue-700 text-white font-semibold shadow-xs"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* POST A JOB MODAL */}
      {/* ===================================================================== */}
      {isPostJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Post a Free Job Opportunity</h3>
                <p className="text-xs text-slate-500">Reach thousands of active professionals on SignTap</p>
              </div>
              <button
                onClick={() => setIsPostJobModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostJobSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Lead Full-Stack Architect"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#6969F5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. SignBridge Labs"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#6969F5]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Bengaluru / Remote"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#6969F5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Job Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as JobType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#6969F5]"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Workplace Type</label>
                  <select
                    value={newWorkplace}
                    onChange={(e) => setNewWorkplace(e.target.value as WorkplaceType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#6969F5]"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Salary Range / Compensation</label>
                <input
                  type="text"
                  value={newSalary}
                  onChange={(e) => setNewSalary(e.target.value)}
                  placeholder="e.g. ₹20,00,000 - ₹30,00,000 / yr"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#6969F5]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Description *</label>
                <textarea
                  required
                  rows={4}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe key responsibilities and mission of this role..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#6969F5]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Requirements (1 per line)</label>
                <textarea
                  rows={3}
                  value={newRequirements}
                  onChange={(e) => setNewRequirements(e.target.value)}
                  placeholder="5+ years Next.js experience&#10;Strong TypeScript skills&#10;Experience with embedded IoT"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#6969F5]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPostJobModalOpen(false)}
                  className="px-4 py-2 rounded-full text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#6969F5] hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
