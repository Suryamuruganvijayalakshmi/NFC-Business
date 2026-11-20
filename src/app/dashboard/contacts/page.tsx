'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { 
  getCurrentUser,
  getProfileByUserId,
  getContactsByUserId,
  saveContact,
  deleteContact,
  toggleContactImportant,
  updateContactNotes,
  getContactCategories,
  addContactCategory,
  getContactInteractions,
  addContactInteraction,
  deleteContactInteraction,
  getFollowUpsByUserId,
  getFollowUpsForContact,
  addFollowUp,
  toggleFollowUpComplete,
  deleteFollowUp,
  exportContactsToCSV,
  importContactsFromCSV
} from '@/lib/store';
import { 
  SmartContact, 
  ContactFollowUp, 
  ContactInteraction, 
  FollowUpPriority,
  InteractionType,
  Profile 
} from '@/lib/types';
import { 
  Contact,
  Users, 
  Star, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Upload, 
  Calendar, 
  Clock, 
  MapPin, 
  Building, 
  Briefcase, 
  Mail, 
  Phone, 
  Globe, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Edit3, 
  Trash2, 
  MessageSquare, 
  Share2, 
  Sparkles, 
  Tag, 
  FolderPlus, 
  ChevronRight, 
  Wifi, 
  History, 
  Check, 
  FileText,
  AlertTriangle,
  LayoutGrid,
  List,
  Flame,
  Award,
  Layers,
  ChevronDown
} from 'lucide-react';

export default function SmartNetworkingPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [contacts, setContacts] = useState<SmartContact[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyImportant, setOnlyImportant] = useState<boolean>(false);
  const [onlyWithFollowUps, setOnlyWithFollowUps] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Active contact for Drawer
  const [selectedContact, setSelectedContact] = useState<SmartContact | null>(null);
  const [drawerTab, setDrawerTab] = useState<'notes' | 'timeline' | 'followups' | 'info'>('notes');

  // Modals
  const [showAddContactModal, setShowAddContactModal] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);
  const [showAddFollowUpModal, setShowAddFollowUpModal] = useState<boolean>(false);

  // Quick form states
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Follow-ups overview
  const [followUpsData, setFollowUpsData] = useState<{
    upcoming: ContactFollowUp[];
    overdue: ContactFollowUp[];
    completed: ContactFollowUp[];
    all: ContactFollowUp[];
  }>({ upcoming: [], overdue: [], completed: [], all: [] });

  // Contact Drawer state for editing notes
  const [contactNotesForm, setContactNotesForm] = useState<{
    met_at: string;
    met_date: string;
    discussion_notes: string;
    interests: string;
    opportunities: string;
    collaboration_ideas: string;
    private_notes: string;
    tagsInput: string;
    category: string;
  }>({
    met_at: '',
    met_date: '',
    discussion_notes: '',
    interests: '',
    opportunities: '',
    collaboration_ideas: '',
    private_notes: '',
    tagsInput: '',
    category: 'Entrepreneurs'
  });

  // Drawer timeline & follow-ups state
  const [contactInteractions, setContactInteractions] = useState<ContactInteraction[]>([]);
  const [contactFollowUps, setContactFollowUps] = useState<ContactFollowUp[]>([]);

  // New interaction form
  const [newInteractionType, setNewInteractionType] = useState<InteractionType>('meeting');
  const [newInteractionTitle, setNewInteractionTitle] = useState<string>('');
  const [newInteractionLocation, setNewInteractionLocation] = useState<string>('');
  const [newInteractionDetails, setNewInteractionDetails] = useState<string>('');

  // New follow-up form inside contact drawer or modal
  const [newFollowUpTitle, setNewFollowUpTitle] = useState<string>('');
  const [newFollowUpDate, setNewFollowUpDate] = useState<string>('');
  const [newFollowUpPriority, setNewFollowUpPriority] = useState<FollowUpPriority>('medium');
  const [newFollowUpDesc, setNewFollowUpDesc] = useState<string>('');
  const [newFollowUpContactId, setNewFollowUpContactId] = useState<string>('');

  // New Contact form
  const [newContactForm, setNewContactForm] = useState({
    full_name: '',
    headline: '',
    company: '',
    role: '',
    email: '',
    phone: '',
    location: '',
    category: 'Entrepreneurs',
    tags: '',
    met_at: '',
    met_date: new Date().toISOString().split('T')[0],
    discussion_notes: '',
    opportunities: '',
    collaboration_ideas: '',
    website: '',
    linkedin_url: '',
    twitter_url: '',
    github_url: '',
    is_important: false
  });

  // CSV Import state
  const [csvFileContent, setCsvFileContent] = useState<string>('');
  const [csvFileName, setCsvFileName] = useState<string>('');
  const [csvSkipDuplicates, setCsvSkipDuplicates] = useState<boolean>(true);
  const [importResult, setImportResult] = useState<{ imported: number; duplicates: number; skipped: number; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const reloadData = () => {
    const user = getCurrentUser();
    if (!user) return;
    setCurrentUser(user);

    const userContacts = getContactsByUserId(user.id);
    setContacts(userContacts);

    const cats = getContactCategories(user.id);
    setCategories(cats);

    const fu = getFollowUpsByUserId(user.id);
    setFollowUpsData(fu);

    if (selectedContact) {
      const refreshed = userContacts.find(c => c.id === selectedContact.id);
      if (refreshed) {
        setSelectedContact(refreshed);
        loadContactDetails(refreshed);
      } else {
        setSelectedContact(null);
      }
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  const loadContactDetails = (c: SmartContact) => {
    const user = getCurrentUser();
    if (!user) return;
    setContactNotesForm({
      met_at: c.met_at || '',
      met_date: c.met_date || '',
      discussion_notes: c.discussion_notes || '',
      interests: c.interests || '',
      opportunities: c.opportunities || '',
      collaboration_ideas: c.collaboration_ideas || '',
      private_notes: c.private_notes || '',
      tagsInput: Array.isArray(c.tags) ? c.tags.join(', ') : '',
      category: c.category || 'Entrepreneurs'
    });

    const interactions = getContactInteractions(c.id, user.id);
    setContactInteractions(interactions);

    const followUps = getFollowUpsForContact(c.id, user.id);
    setContactFollowUps(followUps);
  };

  const handleOpenContactDrawer = (contact: SmartContact, initialTab: 'notes' | 'timeline' | 'followups' | 'info' = 'notes') => {
    setSelectedContact(contact);
    setDrawerTab(initialTab);
    loadContactDetails(contact);
  };

  const handleToggleImportant = (e: React.MouseEvent, contactId: string) => {
    e.stopPropagation();
    if (!currentUser) return;
    const isNow = toggleContactImportant(contactId, currentUser.id);
    reloadData();
    showToast(isNow ? 'Contact marked as Important ⭐' : 'Removed from Important');
  };

  const handleDeleteContact = (e: React.MouseEvent, contactId: string, name: string) => {
    e.stopPropagation();
    if (!currentUser) return;
    if (confirm(`Are you sure you want to delete ${name} from your CRM contacts?`)) {
      deleteContact(contactId, currentUser.id);
      if (selectedContact?.id === contactId) {
        setSelectedContact(null);
      }
      reloadData();
      showToast(`Deleted ${name} from contacts.`);
    }
  };

  const handleSaveContactNotes = () => {
    if (!selectedContact || !currentUser) return;
    const tags = contactNotesForm.tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const updated = updateContactNotes(selectedContact.id, currentUser.id, {
      met_at: contactNotesForm.met_at,
      met_date: contactNotesForm.met_date,
      discussion_notes: contactNotesForm.discussion_notes,
      interests: contactNotesForm.interests,
      opportunities: contactNotesForm.opportunities,
      collaboration_ideas: contactNotesForm.collaboration_ideas,
      private_notes: contactNotesForm.private_notes,
      tags: tags,
      category: contactNotesForm.category
    });

    if (updated) {
      setSelectedContact(updated);
      reloadData();
      showToast('Private networking notes saved securely!');
    }
  };

  const handleAddInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact || !currentUser || !newInteractionTitle.trim()) return;

    addContactInteraction({
      contact_id: selectedContact.id,
      owner_user_id: currentUser.id,
      type: newInteractionType,
      title: newInteractionTitle.trim(),
      details: newInteractionDetails.trim() || undefined,
      location: newInteractionLocation.trim() || undefined,
      occurred_at: new Date().toISOString()
    });

    setNewInteractionTitle('');
    setNewInteractionDetails('');
    setNewInteractionLocation('');
    loadContactDetails(selectedContact);
    reloadData();
    showToast('Interaction logged to timeline.');
  };

  const handleDeleteInteraction = (interactionId: string) => {
    if (!currentUser || !selectedContact) return;
    deleteContactInteraction(interactionId, currentUser.id);
    loadContactDetails(selectedContact);
  };

  const handleAddFollowUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newFollowUpTitle.trim()) return;

    const targetContactId = selectedContact?.id || newFollowUpContactId;
    const targetContact = contacts.find(c => c.id === targetContactId);

    if (!targetContactId || !targetContact) {
      alert('Please select a contact for this reminder.');
      return;
    }

    addFollowUp({
      contact_id: targetContactId,
      contact_name: targetContact.full_name,
      owner_user_id: currentUser.id,
      title: newFollowUpTitle.trim(),
      description: newFollowUpDesc.trim() || undefined,
      due_date: newFollowUpDate || new Date().toISOString().split('T')[0],
      priority: newFollowUpPriority,
      status: 'pending'
    });

    setNewFollowUpTitle('');
    setNewFollowUpDesc('');
    setNewFollowUpDate('');
    setShowAddFollowUpModal(false);
    reloadData();
    if (selectedContact) {
      loadContactDetails(selectedContact);
    }
    showToast('Follow-up reminder set successfully!');
  };

  const handleToggleFollowUp = (e: React.MouseEvent, followUpId: string) => {
    e.stopPropagation();
    if (!currentUser) return;
    const updated = toggleFollowUpComplete(followUpId, currentUser.id);
    reloadData();
    if (selectedContact) {
      loadContactDetails(selectedContact);
    }
    if (updated?.status === 'completed') {
      showToast('Follow-up marked as Completed! ✅');
    } else {
      showToast('Follow-up re-opened.');
    }
  };

  const handleDeleteFollowUp = (e: React.MouseEvent, followUpId: string) => {
    e.stopPropagation();
    if (!currentUser) return;
    deleteFollowUp(followUpId, currentUser.id);
    reloadData();
    if (selectedContact) {
      loadContactDetails(selectedContact);
    }
    showToast('Follow-up deleted.');
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newCategoryName.trim()) return;
    const updated = addContactCategory(currentUser.id, newCategoryName.trim());
    setCategories(updated);
    setSelectedCategory(newCategoryName.trim());
    setNewCategoryName('');
    setShowAddCategoryModal(false);
    showToast(`Added custom category "${newCategoryName.trim()}"`);
  };

  const handleExportCSV = () => {
    if (!currentUser) return;
    const csvData = exportContactsToCSV(currentUser.id);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `SignTap_Smart_Contacts_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported contacts to CSV successfully.');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvFileContent(content);
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = () => {
    if (!currentUser || !csvFileContent) return;
    const res = importContactsFromCSV(currentUser.id, csvFileContent, csvSkipDuplicates);
    setImportResult(res);
    reloadData();
    showToast(`Imported ${res.imported} contacts! (${res.duplicates} duplicates skipped)`);
  };

  const handleCreateContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newContactForm.full_name.trim()) return;

    const tagsArray = newContactForm.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const newContact: SmartContact = {
      id: `crm-cont-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      owner_user_id: currentUser.id,
      full_name: newContactForm.full_name.trim(),
      headline: newContactForm.headline.trim() || undefined,
      company: newContactForm.company.trim() || undefined,
      role: newContactForm.role.trim() || undefined,
      email: newContactForm.email.trim() || undefined,
      phone: newContactForm.phone.trim() || undefined,
      location: newContactForm.location.trim() || undefined,
      category: newContactForm.category || 'Entrepreneurs',
      tags: tagsArray,
      is_important: newContactForm.is_important,
      met_at: newContactForm.met_at.trim() || undefined,
      met_date: newContactForm.met_date || undefined,
      discussion_notes: newContactForm.discussion_notes.trim() || undefined,
      opportunities: newContactForm.opportunities.trim() || undefined,
      collaboration_ideas: newContactForm.collaboration_ideas.trim() || undefined,
      website: newContactForm.website.trim() || undefined,
      linkedin_url: newContactForm.linkedin_url.trim() || undefined,
      twitter_url: newContactForm.twitter_url.trim() || undefined,
      github_url: newContactForm.github_url.trim() || undefined,
      source: 'manual',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    saveContact(newContact);

    // Initial timeline log
    addContactInteraction({
      contact_id: newContact.id,
      owner_user_id: currentUser.id,
      type: 'connection',
      title: 'Added contact to Smart CRM',
      details: newContact.met_at ? `Met at ${newContact.met_at}` : 'Manual contact entry',
      location: newContact.met_at,
      occurred_at: new Date().toISOString()
    });

    setShowAddContactModal(false);
    setNewContactForm({
      full_name: '',
      headline: '',
      company: '',
      role: '',
      email: '',
      phone: '',
      location: '',
      category: 'Entrepreneurs',
      tags: '',
      met_at: '',
      met_date: new Date().toISOString().split('T')[0],
      discussion_notes: '',
      opportunities: '',
      collaboration_ideas: '',
      website: '',
      linkedin_url: '',
      twitter_url: '',
      github_url: '',
      is_important: false
    });
    reloadData();
    showToast(`Added ${newContact.full_name} to your Smart CRM!`);
  };

  // Filtered contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter(c => {
      // Category filter
      if (selectedCategory !== 'All' && c.category !== selectedCategory) {
        return false;
      }
      // Important filter
      if (onlyImportant && !c.is_important) {
        return false;
      }
      // Follow-up due filter
      if (onlyWithFollowUps) {
        const hasActiveFollowUp = followUpsData.all.some(
          f => f.contact_id === c.id && f.status === 'pending'
        );
        if (!hasActiveFollowUp) return false;
      }
      // Search query filter (matches name, company, headline, role, tags, notes, location, category)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = c.full_name.toLowerCase().includes(q);
        const matchesCompany = (c.company || '').toLowerCase().includes(q);
        const matchesHeadline = (c.headline || '').toLowerCase().includes(q);
        const matchesRole = (c.role || '').toLowerCase().includes(q);
        const matchesLocation = (c.location || '').toLowerCase().includes(q);
        const matchesCategory = (c.category || '').toLowerCase().includes(q);
        const matchesTags = Array.isArray(c.tags) && c.tags.some(t => t.toLowerCase().includes(q));
        const matchesNotes = (
          (c.discussion_notes || '') + 
          (c.interests || '') + 
          (c.opportunities || '') + 
          (c.collaboration_ideas || '') + 
          (c.private_notes || '') + 
          (c.met_at || '')
        ).toLowerCase().includes(q);

        return matchesName || matchesCompany || matchesHeadline || matchesRole || matchesLocation || matchesCategory || matchesTags || matchesNotes;
      }

      return true;
    });
  }, [contacts, selectedCategory, onlyImportant, onlyWithFollowUps, searchQuery, followUpsData]);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom duration-200">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
              <Contact className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                Smart Networking CRM
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium">
                  Personal Relationship Hub
                </span>
              </h1>
              <p className="text-sm text-slate-500">
                Track connections, private meeting context, follow-up reminders, and timeline interactions.
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            Import CSV
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export CSV
          </button>
          <button
            onClick={() => {
              setNewFollowUpContactId(contacts[0]?.id || '');
              setShowAddFollowUpModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            New Follow-up
          </button>
          <button
            onClick={() => setShowAddContactModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Contact
          </button>
        </div>
      </div>

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Contacts</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{contacts.length}</span>
            <span className="text-xs text-slate-400">in CRM</span>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Starred Important</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {contacts.filter(c => c.is_important).length}
            </span>
            <span className="text-xs text-slate-400">priority contacts</span>
          </div>
        </div>

        <div className={`p-4.5 rounded-2xl border shadow-sm ${
          followUpsData.overdue.length > 0 
            ? 'bg-rose-50/50 border-rose-200 text-rose-900' 
            : 'bg-white border-slate-200/80 text-slate-900'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
              Overdue Tasks
              {followUpsData.overdue.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </span>
            <AlertTriangle className={`w-4 h-4 ${followUpsData.overdue.length > 0 ? 'text-rose-500' : 'text-slate-400'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${followUpsData.overdue.length > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {followUpsData.overdue.length}
            </span>
            <span className="text-xs text-slate-500">needs immediate action</span>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Upcoming Follow-ups</span>
            <Calendar className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{followUpsData.upcoming.length}</span>
            <span className="text-xs text-slate-400">scheduled</span>
          </div>
        </div>
      </div>

      {/* Urgent Follow-Up Reminders Banner (if any overdue or upcoming today) */}
      {(followUpsData.overdue.length > 0 || followUpsData.upcoming.length > 0) && (
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-5 text-white shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400 animate-spin-slow" />
              <h3 className="text-sm font-semibold text-white tracking-wide">
                Active Networking Follow-Ups & Reminders
              </h3>
            </div>
            <span className="text-xs text-slate-300">
              {followUpsData.overdue.length} overdue · {followUpsData.upcoming.length} upcoming
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {followUpsData.overdue.map(f => {
              const contact = contacts.find(c => c.id === f.contact_id);
              return (
                <div 
                  key={f.id} 
                  className="bg-rose-950/60 border border-rose-500/40 rounded-xl p-3 flex flex-col justify-between gap-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-bold text-rose-200">
                        <span className="px-1.5 py-0.5 rounded bg-rose-500/30 text-rose-300 font-mono text-[10px] uppercase">
                          Overdue
                        </span>
                        <span>{f.due_date}</span>
                      </div>
                      <p className="font-semibold text-white line-clamp-1">{f.title}</p>
                      <p className="text-rose-300/80 font-medium">With: {f.contact_name}</p>
                    </div>
                    <button
                      onClick={(e) => handleToggleFollowUp(e, f.id)}
                      title="Mark Complete"
                      className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-emerald-500/30 text-rose-300 hover:text-emerald-300 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                  {contact && (
                    <button
                      onClick={() => handleOpenContactDrawer(contact, 'notes')}
                      className="text-left text-[11px] text-rose-300 hover:underline flex items-center gap-1 pt-1 border-t border-rose-500/20"
                    >
                      <span>Open Contact Context</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}

            {followUpsData.upcoming.slice(0, 3).map(f => {
              const contact = contacts.find(c => c.id === f.contact_id);
              return (
                <div 
                  key={f.id} 
                  className="bg-white/10 border border-white/10 rounded-xl p-3 flex flex-col justify-between gap-2 text-xs backdrop-blur-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[10px]">
                        <span className="px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-300 uppercase">
                          {f.priority} priority
                        </span>
                        <span>Due: {f.due_date}</span>
                      </div>
                      <p className="font-semibold text-white line-clamp-1">{f.title}</p>
                      <p className="text-slate-300">With: {f.contact_name}</p>
                    </div>
                    <button
                      onClick={(e) => handleToggleFollowUp(e, f.id)}
                      title="Mark Complete"
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-emerald-500/40 text-slate-300 hover:text-emerald-300 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                  {contact && (
                    <button
                      onClick={() => handleOpenContactDrawer(contact, 'notes')}
                      className="text-left text-[11px] text-indigo-300 hover:underline flex items-center gap-1 pt-1 border-t border-white/10"
                    >
                      <span>Open Contact Notes</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search, Category Filter Bar & View Toggle */}
      <div className="space-y-4">
        {/* Top Filter Controls */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts by name, company, skill, tags, location or private discussion notes..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Badges & View Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyImportant(!onlyImportant)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                onlyImportant
                  ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${onlyImportant ? 'fill-white' : 'text-amber-500'}`} />
              Important
            </button>

            <button
              onClick={() => setOnlyWithFollowUps(!onlyWithFollowUps)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                onlyWithFollowUps
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Has Follow-Up
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid Cards"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'All'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            All Contacts ({contacts.length})
          </button>

          {categories.map(cat => {
            const count = contacts.filter(c => c.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => setShowAddCategoryModal(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Category</span>
          </button>
        </div>
      </div>

      {/* Contacts List / Empty State */}
      {filteredContacts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Contact className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">No networking contacts found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              {searchQuery || selectedCategory !== 'All' || onlyImportant || onlyWithFollowUps
                ? 'Try adjusting your filters or search keywords.'
                : 'Start logging contacts from NFC taps, business events, or import your existing contacts via CSV.'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setShowAddContactModal(true)}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
              + Add Contact
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Import CSV
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredContacts.map(contact => {
            const hasPendingFollowUp = followUpsData.upcoming.find(f => f.contact_id === contact.id);
            const hasOverdueFollowUp = followUpsData.overdue.find(f => f.contact_id === contact.id);

            return (
              <div
                key={contact.id}
                onClick={() => handleOpenContactDrawer(contact, 'notes')}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all p-5 flex flex-col justify-between gap-4 cursor-pointer relative group"
              >
                {/* Card Top: Avatar, Category, Star */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {contact.avatar_url ? (
                        <img
                          src={contact.avatar_url}
                          alt={contact.full_name}
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-base flex items-center justify-center shadow-sm">
                          {contact.full_name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {contact.full_name}
                          </h3>
                          {contact.source === 'nfc_tap' && (
                            <span title="Met via SignTap NFC Tap" className="p-0.5 rounded bg-emerald-50 text-emerald-600">
                              <Wifi className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium line-clamp-1">
                          {contact.headline || contact.role || contact.company || 'Professional Contact'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleToggleImportant(e, contact.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                      title={contact.is_important ? 'Starred Important' : 'Star as Important'}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          contact.is_important
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-300 hover:text-amber-400'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Company & Location */}
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                    {contact.company && (
                      <span className="flex items-center gap-1">
                        <Building className="w-3 h-3 text-slate-400" />
                        <span className="font-medium text-slate-700">{contact.company}</span>
                      </span>
                    )}
                    {contact.location && (
                      <span className="flex items-center gap-1 text-slate-400">
                        <MapPin className="w-3 h-3" />
                        <span>{contact.location}</span>
                      </span>
                    )}
                  </div>

                  {/* Met at & Date badge */}
                  {contact.met_at && (
                    <div className="mt-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-600">
                      <MapPin className="w-3 h-3 text-indigo-500 flex-shrink-0" />
                      <span className="truncate">
                        Met: <strong className="text-slate-800">{contact.met_at}</strong>
                        {contact.met_date ? ` (${contact.met_date})` : ''}
                      </span>
                    </div>
                  )}

                  {/* Private Discussion Snippet (Confidential) */}
                  {contact.discussion_notes && (
                    <p className="mt-2 text-xs text-slate-500 line-clamp-2 italic">
                      "{contact.discussion_notes}"
                    </p>
                  )}

                  {/* Tags & Category */}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-semibold">
                      {contact.category}
                    </span>
                    {contact.tags?.slice(0, 3).map((tag, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                        #{tag}
                      </span>
                    ))}
                    {contact.tags && contact.tags.length > 3 && (
                      <span className="text-[10px] text-slate-400 font-medium">
                        +{contact.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Bottom: Follow-up Status & Actions */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  {/* Follow-up reminder indicator */}
                  {hasOverdueFollowUp ? (
                    <div className="flex items-center justify-between text-xs text-rose-600 bg-rose-50 px-2.5 py-1.5 rounded-xl font-medium">
                      <span className="flex items-center gap-1 truncate">
                        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">Overdue: {hasOverdueFollowUp.title}</span>
                      </span>
                      <button
                        onClick={(e) => handleToggleFollowUp(e, hasOverdueFollowUp.id)}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-rose-200 text-rose-800 hover:bg-rose-300 font-bold"
                      >
                        Done
                      </button>
                    </div>
                  ) : hasPendingFollowUp ? (
                    <div className="flex items-center justify-between text-xs text-indigo-700 bg-indigo-50/80 px-2.5 py-1.5 rounded-xl font-medium">
                      <span className="flex items-center gap-1 truncate">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">Task: {hasPendingFollowUp.title} ({hasPendingFollowUp.due_date})</span>
                      </span>
                      <button
                        onClick={(e) => handleToggleFollowUp(e, hasPendingFollowUp.id)}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-200 text-indigo-800 hover:bg-indigo-300 font-bold"
                      >
                        Done
                      </button>
                    </div>
                  ) : null}

                  {/* Action Icon Buttons */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1">
                      {contact.phone && (
                        <a
                          href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title="WhatsApp Chat"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {contact.email && (
                        <a
                          href={`mailto:${contact.email}`}
                          onClick={(e) => e.stopPropagation()}
                          title="Send Email"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {contact.phone && (
                        <a
                          href={`tel:${contact.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          title="Call"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {contact.signtap_username && (
                        <Link
                          href={`/u/${contact.signtap_username}`}
                          target="_blank"
                          onClick={(e) => e.stopPropagation()}
                          title="View Live SignTap Profile"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors">
                      <span>View Context</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-10">★</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Company / Role</th>
                  <th className="py-3 px-4">Met At</th>
                  <th className="py-3 px-4">Follow-Up</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredContacts.map(contact => {
                  const hasOverdueFollowUp = followUpsData.overdue.find(f => f.contact_id === contact.id);
                  const hasPendingFollowUp = followUpsData.upcoming.find(f => f.contact_id === contact.id);

                  return (
                    <tr
                      key={contact.id}
                      onClick={() => handleOpenContactDrawer(contact, 'notes')}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4">
                        <button
                          onClick={(e) => handleToggleImportant(e, contact.id)}
                          className="p-1 rounded hover:bg-slate-100"
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              contact.is_important ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          {contact.avatar_url ? (
                            <img
                              src={contact.avatar_url}
                              alt={contact.full_name}
                              className="w-8 h-8 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                              {contact.full_name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-900">{contact.full_name}</p>
                            <p className="text-[11px] text-slate-500">{contact.email || contact.phone || 'No email'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-semibold">
                          {contact.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-800">{contact.company || '—'}</p>
                        <p className="text-[11px] text-slate-400">{contact.role || contact.headline || ''}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {contact.met_at ? (
                          <div className="flex items-center gap-1 text-[11px]">
                            <MapPin className="w-3 h-3 text-indigo-500 flex-shrink-0" />
                            <span className="truncate max-w-[160px]">{contact.met_at}</span>
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {hasOverdueFollowUp ? (
                          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[10px]">
                            Overdue ({hasOverdueFollowUp.due_date})
                          </span>
                        ) : hasPendingFollowUp ? (
                          <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-medium text-[10px]">
                            Due {hasPendingFollowUp.due_date}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">None</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {contact.phone && (
                            <a
                              href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded text-slate-400 hover:text-emerald-600"
                              title="WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={(e) => handleDeleteContact(e, contact.id, contact.full_name)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600"
                            title="Delete Contact"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SLIDE-OVER CONTACT DETAILS & CRM DRAWER                                   */}
      {/* ========================================================================= */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-200 sticky top-0 bg-white z-10 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {selectedContact.avatar_url ? (
                    <img
                      src={selectedContact.avatar_url}
                      alt={selectedContact.full_name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xl flex items-center justify-center">
                      {selectedContact.full_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900">{selectedContact.full_name}</h2>
                      <button
                        onClick={(e) => handleToggleImportant(e, selectedContact.id)}
                        className="p-1 rounded hover:bg-slate-100"
                        title="Star as Important"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            selectedContact.is_important ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{selectedContact.headline || selectedContact.company}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                        {selectedContact.category}
                      </span>
                      {selectedContact.source === 'nfc_tap' && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                          <Wifi className="w-3 h-3" /> NFC Tap Contact
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleDeleteContact(e, selectedContact.id, selectedContact.full_name)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Delete Contact"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Drawer Tabs */}
              <div className="flex items-center border-b border-slate-100 gap-6 text-xs font-semibold">
                <button
                  onClick={() => setDrawerTab('notes')}
                  className={`pb-2.5 transition-colors relative flex items-center gap-1.5 ${
                    drawerTab === 'notes' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Private Notes</span>
                  {drawerTab === 'notes' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                  )}
                </button>

                <button
                  onClick={() => setDrawerTab('timeline')}
                  className={`pb-2.5 transition-colors relative flex items-center gap-1.5 ${
                    drawerTab === 'timeline' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Timeline ({contactInteractions.length})</span>
                  {drawerTab === 'timeline' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                  )}
                </button>

                <button
                  onClick={() => setDrawerTab('followups')}
                  className={`pb-2.5 transition-colors relative flex items-center gap-1.5 ${
                    drawerTab === 'followups' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Follow-ups ({contactFollowUps.length})</span>
                  {drawerTab === 'followups' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                  )}
                </button>

                <button
                  onClick={() => setDrawerTab('info')}
                  className={`pb-2.5 transition-colors relative flex items-center gap-1.5 ${
                    drawerTab === 'info' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Contact className="w-3.5 h-3.5" />
                  <span>Info & Links</span>
                  {drawerTab === 'info' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                  )}
                </button>
              </div>
            </div>

            {/* Drawer Body */}
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              {/* TAB 1: PRIVATE NETWORKING NOTES */}
              {drawerTab === 'notes' && (
                <div className="space-y-5 text-xs">
                  <div className="p-3 bg-amber-50/80 border border-amber-200/60 rounded-xl text-amber-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>
                      These networking notes are strictly confidential and visible only to you. Never published on any public profile.
                    </span>
                  </div>

                  {/* Category & Tags */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Relationship Category</label>
                      <select
                        value={contactNotesForm.category}
                        onChange={(e) => setContactNotesForm({ ...contactNotesForm, category: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-1 focus:ring-slate-900"
                      >
                        {categories.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Custom Tags (comma separated)</label>
                      <input
                        type="text"
                        value={contactNotesForm.tagsInput}
                        onChange={(e) => setContactNotesForm({ ...contactNotesForm, tagsInput: e.target.value })}
                        placeholder="e.g. AI, Hardware, Series A"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-1 focus:ring-slate-900"
                      />
                    </div>
                  </div>

                  {/* Where & When we met */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Where We Met</label>
                      <input
                        type="text"
                        value={contactNotesForm.met_at}
                        onChange={(e) => setContactNotesForm({ ...contactNotesForm, met_at: e.target.value })}
                        placeholder="e.g. TechSparks Bangalore, NFC Tap"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-1 focus:ring-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Date Met</label>
                      <input
                        type="date"
                        value={contactNotesForm.met_date}
                        onChange={(e) => setContactNotesForm({ ...contactNotesForm, met_date: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-1 focus:ring-slate-900"
                      />
                    </div>
                  </div>

                  {/* What We Discussed */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">What We Discussed</label>
                    <textarea
                      rows={3}
                      value={contactNotesForm.discussion_notes}
                      onChange={(e) => setContactNotesForm({ ...contactNotesForm, discussion_notes: e.target.value })}
                      placeholder="Summary of conversational topics, key points, challenges they mentioned..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  {/* Their Interests & Hobbies */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Their Personal & Professional Interests</label>
                    <input
                      type="text"
                      value={contactNotesForm.interests}
                      onChange={(e) => setContactNotesForm({ ...contactNotesForm, interests: e.target.value })}
                      placeholder="e.g. Generative AI, badminton, vintage watches, angel investing"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  {/* Business Opportunities */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Business Opportunities Identified</label>
                    <textarea
                      rows={2}
                      value={contactNotesForm.opportunities}
                      onChange={(e) => setContactNotesForm({ ...contactNotesForm, opportunities: e.target.value })}
                      placeholder="Potential contract, customer referral, pilot deal, investment size..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  {/* Future Collaboration Ideas */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Future Collaboration Possibilities</label>
                    <textarea
                      rows={2}
                      value={contactNotesForm.collaboration_ideas}
                      onChange={(e) => setContactNotesForm({ ...contactNotesForm, collaboration_ideas: e.target.value })}
                      placeholder="Joint webinar, co-branded NFC release, tech advisory..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  {/* General Private Notes */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Private Scratchpad & Follow-up Notes</label>
                    <textarea
                      rows={2}
                      value={contactNotesForm.private_notes}
                      onChange={(e) => setContactNotesForm({ ...contactNotesForm, private_notes: e.target.value })}
                      placeholder="Reminders, preferred communication channel, personal details to remember..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleSaveContactNotes}
                      className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Save Networking Notes
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: INTERACTION TIMELINE */}
              {drawerTab === 'timeline' && (
                <div className="space-y-6 text-xs">
                  {/* Log new interaction */}
                  <form onSubmit={handleAddInteraction} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-indigo-600" />
                      Log New Interaction Event
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-500 font-medium mb-1">Type</label>
                        <select
                          value={newInteractionType}
                          onChange={(e) => setNewInteractionType(e.target.value as InteractionType)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-800"
                        >
                          <option value="meeting">Meeting / Coffee</option>
                          <option value="call">Phone Call</option>
                          <option value="whatsapp">WhatsApp Chat</option>
                          <option value="email">Email</option>
                          <option value="nfc_tap">NFC Tap Event</option>
                          <option value="note">Private Note</option>
                          <option value="other">Other Event</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-500 font-medium mb-1">Location / Channel</label>
                        <input
                          type="text"
                          value={newInteractionLocation}
                          onChange={(e) => setNewInteractionLocation(e.target.value)}
                          placeholder="e.g. Google Meet, Blue Tokai"
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-500 font-medium mb-1">Headline / Event Summary *</label>
                      <input
                        type="text"
                        required
                        value={newInteractionTitle}
                        onChange={(e) => setNewInteractionTitle(e.target.value)}
                        placeholder="e.g. 30-minute sync on Q1 hardware pricing"
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-medium mb-1">Details & Takeaways</label>
                      <textarea
                        rows={2}
                        value={newInteractionDetails}
                        onChange={(e) => setNewInteractionDetails(e.target.value)}
                        placeholder="Key outcomes, next steps discussed..."
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                      Log to Timeline
                    </button>
                  </form>

                  {/* Timeline list */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900 text-sm">Chronological Relationship Timeline</h4>
                    {contactInteractions.length === 0 ? (
                      <p className="text-slate-400 text-center py-6">No interactions logged yet.</p>
                    ) : (
                      <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                        {contactInteractions.map(item => (
                          <div key={item.id} className="relative group">
                            {/* Dot */}
                            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-indigo-500 flex items-center justify-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            </div>

                            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900">{item.title}</span>
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] text-slate-400">
                                    {item.occurred_at ? new Date(item.occurred_at).toLocaleDateString() : ''}
                                  </span>
                                  <button
                                    onClick={() => handleDeleteInteraction(item.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-rose-500"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                              {item.location && (
                                <p className="text-[11px] text-indigo-600 font-medium flex items-center gap-1">
                                  <MapPin className="w-3 h-3" /> {item.location}
                                </p>
                              )}
                              {item.details && (
                                <p className="text-xs text-slate-600 pt-1 leading-relaxed">{item.details}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: FOLLOW-UP REMINDERS */}
              {drawerTab === 'followups' && (
                <div className="space-y-6 text-xs">
                  {/* Create follow up */}
                  <form onSubmit={handleAddFollowUpSubmit} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      Add Follow-Up Reminder for {selectedContact.full_name}
                    </h4>
                    <div>
                      <label className="block text-slate-500 font-medium mb-1">Reminder Action / Task *</label>
                      <input
                        type="text"
                        required
                        value={newFollowUpTitle}
                        onChange={(e) => setNewFollowUpTitle(e.target.value)}
                        placeholder="e.g. Follow up about joint proposal, Send updated deck"
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-500 font-medium mb-1">Due Date *</label>
                        <input
                          type="date"
                          required
                          value={newFollowUpDate}
                          onChange={(e) => setNewFollowUpDate(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 font-medium mb-1">Priority</label>
                        <select
                          value={newFollowUpPriority}
                          onChange={(e) => setNewFollowUpPriority(e.target.value as FollowUpPriority)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-500 font-medium mb-1">Additional Notes</label>
                      <input
                        type="text"
                        value={newFollowUpDesc}
                        onChange={(e) => setNewFollowUpDesc(e.target.value)}
                        placeholder="Context or links to include..."
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                    >
                      Set Reminder
                    </button>
                  </form>

                  {/* Follow-up list for contact */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm">Reminders for {selectedContact.full_name}</h4>
                    {contactFollowUps.length === 0 ? (
                      <p className="text-slate-400 text-center py-6">No follow-up reminders scheduled for this contact.</p>
                    ) : (
                      contactFollowUps.map(fu => {
                        const isDone = fu.status === 'completed';
                        return (
                          <div
                            key={fu.id}
                            className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${
                              isDone ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-slate-200 shadow-sm'
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <button
                                onClick={(e) => handleToggleFollowUp(e, fu.id)}
                                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors mt-0.5 ${
                                  isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-slate-500'
                                }`}
                              >
                                {isDone && <Check className="w-3.5 h-3.5" />}
                              </button>
                              <div className="space-y-0.5">
                                <p className={`font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                                  {fu.title}
                                </p>
                                {fu.description && (
                                  <p className="text-[11px] text-slate-500">{fu.description}</p>
                                )}
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5">
                                  <span>Due: {fu.due_date}</span>
                                  <span>•</span>
                                  <span className={`uppercase font-bold ${
                                    fu.priority === 'high' ? 'text-rose-600' : fu.priority === 'medium' ? 'text-amber-600' : 'text-slate-500'
                                  }`}>
                                    {fu.priority}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={(e) => handleDeleteFollowUp(e, fu.id)}
                              className="p-1 text-slate-300 hover:text-rose-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: CONTACT INFO & SOCIAL LINKS */}
              {drawerTab === 'info' && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    <h4 className="font-bold text-slate-900">Contact Channels</h4>
                    {selectedContact.email && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" /> Email:
                        </span>
                        <a href={`mailto:${selectedContact.email}`} className="font-semibold text-indigo-600 hover:underline">
                          {selectedContact.email}
                        </a>
                      </div>
                    )}
                    {selectedContact.phone && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone:
                        </span>
                        <a href={`tel:${selectedContact.phone}`} className="font-semibold text-indigo-600 hover:underline">
                          {selectedContact.phone}
                        </a>
                      </div>
                    )}
                    {selectedContact.location && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location:
                        </span>
                        <span className="font-medium text-slate-800">{selectedContact.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Web & Social Links */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900">Web & Social Presences</h4>
                    {selectedContact.website && (
                      <a
                        href={selectedContact.website}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        <span className="flex items-center gap-2 text-slate-700 font-medium">
                          <Globe className="w-4 h-4 text-slate-400" /> Website
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </a>
                    )}
                    {selectedContact.linkedin_url && (
                      <a
                        href={selectedContact.linkedin_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        <span className="flex items-center gap-2 text-slate-700 font-medium">
                          <ExternalLink className="w-4 h-4 text-blue-600" /> LinkedIn Profile
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </a>
                    )}
                    {selectedContact.github_url && (
                      <a
                        href={selectedContact.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        <span className="flex items-center gap-2 text-slate-700 font-medium">
                          <ExternalLink className="w-4 h-4 text-slate-900" /> GitHub Profile
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </a>
                    )}
                    {selectedContact.signtap_username && (
                      <Link
                        href={`/u/${selectedContact.signtap_username}`}
                        target="_blank"
                        className="flex items-center justify-between p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 hover:bg-indigo-100 transition-colors"
                      >
                        <span className="flex items-center gap-2 font-bold">
                          <Wifi className="w-4 h-4 text-indigo-600" /> View SignTap Public Profile (/u/{selectedContact.signtap_username})
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD CONTACT MODAL                                                         */}
      {/* ========================================================================= */}
      {showAddContactModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Contact className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Add New Professional Contact</h3>
              </div>
              <button
                onClick={() => setShowAddContactModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContactSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newContactForm.full_name}
                  onChange={(e) => setNewContactForm({ ...newContactForm, full_name: e.target.value })}
                  placeholder="e.g. Samantha Wright"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={newContactForm.company}
                    onChange={(e) => setNewContactForm({ ...newContactForm, company: e.target.value })}
                    placeholder="e.g. Apex Global"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Role / Headline</label>
                  <input
                    type="text"
                    value={newContactForm.headline}
                    onChange={(e) => setNewContactForm({ ...newContactForm, headline: e.target.value })}
                    placeholder="e.g. Head of Growth"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newContactForm.email}
                    onChange={(e) => setNewContactForm({ ...newContactForm, email: e.target.value })}
                    placeholder="samantha@example.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={newContactForm.phone}
                    onChange={(e) => setNewContactForm({ ...newContactForm, phone: e.target.value })}
                    placeholder="+91 98422 12345"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={newContactForm.category}
                    onChange={(e) => setNewContactForm({ ...newContactForm, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Location / City</label>
                  <input
                    type="text"
                    value={newContactForm.location}
                    onChange={(e) => setNewContactForm({ ...newContactForm, location: e.target.value })}
                    placeholder="e.g. Bengaluru, India"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Where met */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Where We Met</label>
                  <input
                    type="text"
                    value={newContactForm.met_at}
                    onChange={(e) => setNewContactForm({ ...newContactForm, met_at: e.target.value })}
                    placeholder="e.g. Retail Tech Expo, NFC Tap"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Date Met</label>
                  <input
                    type="date"
                    value={newContactForm.met_date}
                    onChange={(e) => setNewContactForm({ ...newContactForm, met_date: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Discussion Notes (Private)</label>
                <textarea
                  rows={2}
                  value={newContactForm.discussion_notes}
                  onChange={(e) => setNewContactForm({ ...newContactForm, discussion_notes: e.target.value })}
                  placeholder="Key topics discussed, mutual interests, follow-up items..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newContactForm.tags}
                  onChange={(e) => setNewContactForm({ ...newContactForm, tags: e.target.value })}
                  placeholder="e.g. Retail, Enterprise, Investor"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="mark_imp_cb"
                  checked={newContactForm.is_important}
                  onChange={(e) => setNewContactForm({ ...newContactForm, is_important: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-slate-900"
                />
                <label htmlFor="mark_imp_cb" className="font-semibold text-slate-800 cursor-pointer">
                  Star as Important / Priority Contact
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddContactModal(false)}
                  className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Save to CRM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CSV IMPORT MODAL                                                          */}
      {/* ========================================================================= */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Import Contacts from CSV</h3>
              </div>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportResult(null);
                  setCsvFileContent('');
                  setCsvFileName('');
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-slate-500">
                Upload contacts from LinkedIn, Google Contacts, Apple Contacts, or CRM exports.
                Standard headers such as <strong>Full Name, Email, Phone, Company, Role, Category, Tags, Notes</strong> will be automatically mapped.
              </p>

              {/* File Input Box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-indigo-50/30"
              >
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-bold text-slate-800">
                  {csvFileName ? csvFileName : 'Click to select CSV file'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Accepts standard .csv files</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Duplicate Handling Option */}
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="skip_dups"
                  checked={csvSkipDuplicates}
                  onChange={(e) => setCsvSkipDuplicates(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <label htmlFor="skip_dups" className="text-slate-700 font-semibold cursor-pointer">
                  Skip duplicate contacts (matched by email or phone)
                </label>
              </div>

              {/* Result notification */}
              {importResult && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 space-y-1">
                  <p className="font-bold">✓ Import Completed!</p>
                  <p>
                    Imported <strong>{importResult.imported}</strong> new contacts.
                    {importResult.duplicates > 0 && ` (${importResult.duplicates} duplicates detected and skipped)`}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={!csvFileContent}
                  onClick={handleExecuteImport}
                  className="px-5 py-2.5 bg-slate-900 disabled:opacity-40 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Import Contacts Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD CUSTOM CATEGORY MODAL                                                 */}
      {/* ========================================================================= */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Create Contact Category</h3>
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Design Agency, Alumni, Press"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
              >
                Add Category
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* GLOBAL NEW FOLLOW-UP REMINDER MODAL                                       */}
      {/* ========================================================================= */}
      {showAddFollowUpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Schedule Networking Follow-Up</h3>
              </div>
              <button
                onClick={() => setShowAddFollowUpModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddFollowUpSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Target Contact *</label>
                <select
                  value={newFollowUpContactId}
                  onChange={(e) => setNewFollowUpContactId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  {contacts.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.full_name} ({c.company || c.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Follow-up Task / Objective *</label>
                <input
                  type="text"
                  required
                  value={newFollowUpTitle}
                  onChange={(e) => setNewFollowUpTitle(e.target.value)}
                  placeholder="e.g. Schedule pilot demonstration, Send proposal"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={newFollowUpDate}
                    onChange={(e) => setNewFollowUpDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Priority</label>
                  <select
                    value={newFollowUpPriority}
                    onChange={(e) => setNewFollowUpPriority(e.target.value as FollowUpPriority)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  value={newFollowUpDesc}
                  onChange={(e) => setNewFollowUpDesc(e.target.value)}
                  placeholder="Additional context..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddFollowUpModal(false)}
                  className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Create Follow-Up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

