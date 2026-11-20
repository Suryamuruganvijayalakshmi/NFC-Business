'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getCurrentUser, 
  getProfileByUserId, 
  getOrCreateProfileForUser,
  saveBusinessToProfile,
  deleteBusinessFromProfile,
  saveProfile
} from '@/lib/store';
import { Profile, BusinessEntity } from '@/lib/types';
import { 
  Building, 
  Plus, 
  ExternalLink, 
  Mail, 
  Phone, 
  MessageCircle, 
  Globe, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Check, 
  ShieldCheck,
  Briefcase,
  Building2,
  X
} from 'lucide-react';

export default function BusinessPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [businesses, setBusinesses] = useState<BusinessEntity[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBizId, setEditingBizId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('Hardware & IoT / SaaS');
  const [contactEmail, setContactEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [servicesInput, setServicesInput] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);

  const loadData = () => {
    const user = getCurrentUser();
    if (!user) return;

    let p = getProfileByUserId(user.id);
    if (!p) {
      p = getOrCreateProfileForUser(user);
    }
    setProfile(p);
    setBusinesses(p.businesses || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAddModal = (biz?: BusinessEntity) => {
    if (biz) {
      setEditingBizId(biz.id);
      setName(biz.name);
      setTagline(biz.tagline || '');
      setDescription(biz.description || '');
      setLogo(biz.logo || '');
      setWebsite(biz.website || '');
      setIndustry(biz.industry || 'Hardware & IoT / SaaS');
      setContactEmail(biz.contact_email || '');
      setWhatsapp(biz.whatsapp || '');
      setServicesInput(biz.services ? biz.services.join(', ') : '');
      setIsPrimary(Boolean(biz.is_primary));
    } else {
      setEditingBizId(null);
      setName('');
      setTagline('');
      setDescription('');
      setLogo('');
      setWebsite('');
      setIndustry('Hardware & IoT / SaaS');
      setContactEmail('');
      setWhatsapp('');
      setServicesInput('');
      setIsPrimary(businesses.length === 0);
    }
    setShowAddModal(true);
  };

  const handleSaveBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !name.trim()) return;

    const services = servicesInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const biz: BusinessEntity = {
      id: editingBizId || `biz-${Date.now()}`,
      name: name.trim(),
      tagline: tagline.trim() || undefined,
      description: description.trim() || undefined,
      logo: logo.trim() || undefined,
      website: website.trim() || undefined,
      industry: industry.trim() || undefined,
      services: services.length > 0 ? services : undefined,
      contact_email: contactEmail.trim() || undefined,
      whatsapp: whatsapp.trim() || undefined,
      is_primary: isPrimary,
    };

    saveBusinessToProfile(profile.user_id, biz);
    setShowAddModal(false);
    showToast(editingBizId ? 'Business entity updated!' : 'New business entity added!');
    loadData();
  };

  const handleDeleteBusiness = (bizId: string, bizName: string) => {
    if (!profile) return;
    if (confirm(`Are you sure you want to delete ${bizName}?`)) {
      deleteBusinessFromProfile(profile.user_id, bizId);
      showToast(`Deleted ${bizName}`);
      loadData();
    }
  };

  const handleSetPrimary = (bizId: string) => {
    if (!profile) return;
    const updated = (profile.businesses || []).map(b => ({
      ...b,
      is_primary: b.id === bizId
    }));
    profile.businesses = updated;
    profile.company = updated.find(b => b.id === bizId)?.name || profile.company;
    saveProfile(profile);
    showToast('Primary business updated!');
    loadData();
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#087CF0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#101828] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 text-sm font-semibold animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#101828] tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#FF7900]" />
            <span>Business & Organization Identities</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Maintain your ventures, corporate entities, services, and B2B contact channels alongside your personal profile.
          </p>
        </div>

        <button
          onClick={() => handleOpenAddModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#101828] text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs active:scale-95"
        >
          <Plus className="w-4 h-4 text-[#FF7900]" />
          <span>Add Business Entity</span>
        </button>
      </div>

      {/* Businesses Grid */}
      {businesses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
          <Building className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No Business Entities Added</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Showcase your agency, startup, consulting practice, or corporate firm on your SignTap profile.
          </p>
          <button
            onClick={() => handleOpenAddModal()}
            className="mt-2 px-5 py-2.5 rounded-xl bg-[#FF7900] text-white text-xs font-semibold hover:bg-[#e06b00] transition-colors"
          >
            Add Your First Business
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {businesses.map((biz) => (
            <div 
              key={biz.id} 
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-[#FF7900]/40 transition-all space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {biz.logo ? (
                        <img src={biz.logo} alt={biz.name} className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-6 h-6 text-slate-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#101828]">{biz.name}</h3>
                        {biz.is_primary && (
                          <span className="px-2 py-0.5 rounded-full bg-orange-100 text-[#FF7900] text-[10px] font-bold uppercase tracking-wider">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#087CF0] font-medium">{biz.industry}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenAddModal(biz)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBusiness(biz.id, biz.name)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {biz.tagline && (
                  <p className="text-xs font-semibold text-slate-700 italic">
                    "{biz.tagline}"
                  </p>
                )}

                {biz.description && (
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {biz.description}
                  </p>
                )}

                {/* Services Tags */}
                {biz.services && biz.services.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Services Catalog
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {biz.services.map((serv, idx) => (
                        <span key={idx} className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                          {serv}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Direct Contact Links */}
                <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                  {biz.website && (
                    <a
                      href={biz.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#087CF0]" />
                      <span>Website</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  )}

                  {biz.contact_email && (
                    <a
                      href={`mailto:${biz.contact_email}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>{biz.contact_email}</span>
                    </a>
                  )}

                  {biz.whatsapp && (
                    <a
                      href={`https://wa.me/${biz.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-semibold transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Inquiry</span>
                    </a>
                  )}
                </div>
              </div>

              {!biz.is_primary && (
                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleSetPrimary(biz.id)}
                    className="text-xs font-semibold text-slate-500 hover:text-[#087CF0] transition-colors"
                  >
                    Set as Primary Business Entity
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add / Edit Business */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-[#101828]">
                {editingBizId ? 'Edit Business Entity' : 'Add New Business Entity'}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBusiness} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. SignBridge Technologies Pvt. Ltd."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Tagline / Motto
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Physical-to-Digital Contactless Identity Ecosystem"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Hardware & IoT / SaaS"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://signbridge.click"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your organization, products, target clients, and mission..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="contact@company.com"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    WhatsApp Inquiry Number
                  </label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+91 98422 53267"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Services Offered (comma separated)
                </label>
                <input
                  type="text"
                  value={servicesInput}
                  onChange={(e) => setServicesInput(e.target.value)}
                  placeholder="Enterprise NFC Deployment, Dynamic Cloud Profiles, Event Badges"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="primaryCheck"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="w-4 h-4 rounded text-[#FF7900] focus:ring-[#FF7900]"
                />
                <label htmlFor="primaryCheck" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Set as Primary Business Entity shown on Profile Header
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#101828] text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
                >
                  Save Business
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
