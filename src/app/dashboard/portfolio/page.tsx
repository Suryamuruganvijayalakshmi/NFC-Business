'use client';

import React, { useState, useEffect } from 'react';
import { 
  getCurrentUser, 
  getProfileByUserId, 
  getOrCreateProfileForUser,
  getProjectsByProfileId, 
  saveProject, 
  deleteProject 
} from '@/lib/store';
import { Profile, PortfolioProject } from '@/lib/types';
import { 
  Plus, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  Briefcase, 
  Image as ImageIcon,
  MoveUp,
  MoveDown,
  Layers,
  Sparkles
} from 'lucide-react';

export default function PortfolioManagerPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [savedToast, setSavedToast] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New project form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [category, setCategory] = useState('Featured Work');
  const [techInput, setTechInput] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;

    let p = getProfileByUserId(user.id);
    if (!p) {
      p = getOrCreateProfileForUser(user);
    }

    if (p) {
      setProfile(p);
      setProjects(getProjectsByProfileId(p.id));
    }
  }, []);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const technologies = techInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const newProject: PortfolioProject = {
      id: `proj-${Date.now()}`,
      profile_id: profile.id,
      title: title.trim(),
      description: description.trim(),
      image_url: imageUrl.trim() || 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
      project_url: projectUrl.trim(),
      technologies: technologies.length > 0 ? technologies : ['Next.js', 'SignBridge NFC'],
      category: category.trim() || 'Featured',
      display_order: projects.length + 1,
      created_at: new Date().toISOString(),
    };

    saveProject(newProject);
    setProjects([...projects, newProject]);
    setShowAddModal(false);

    // Reset fields
    setTitle('');
    setDescription('');
    setImageUrl('');
    setProjectUrl('');
    setTechInput('');

    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleDeleteProject = (projectId: string) => {
    deleteProject(projectId);
    setProjects(projects.filter(p => p.id !== projectId));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const newProjects = [...projects];
    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;

    newProjects.forEach((p, idx) => {
      p.display_order = idx + 1;
      saveProject(p);
    });

    setProjects(newProjects);
  };

  if (!profile) return null;

  return (
    <div className="space-y-8 max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Portfolio Showcase
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Highlight your best projects, case studies, apps, and hardware innovations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedToast && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Project Saved!</span>
            </div>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl bg-[#087CF0] text-white text-xs font-bold hover:bg-[#0668cc] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center text-slate-400">
          <Briefcase className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <h3 className="text-base font-bold text-slate-700">No Projects Added Yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Click &ldquo;Add New Project&rdquo; to showcase your client works, open-source repositories, or products.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
          >
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj, idx) => (
            <div
              key={proj.id}
              className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={proj.image_url}
                    alt={proj.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold">
                    {proj.category}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-bold text-slate-900">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-3 leading-relaxed">
                    {proj.description}
                  </p>

                  {/* Tech Tags */}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {proj.technologies.map((t, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Card Bar: Reorder & Actions */}
              <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs">
                {proj.project_url ? (
                  <a
                    href={proj.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#087CF0] font-semibold hover:underline flex items-center gap-1"
                  >
                    View Link <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-slate-400">Internal Showcase</span>
                )}

                <div className="flex items-center gap-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'up')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-20"
                    title="Move up"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    disabled={idx === projects.length - 1}
                    onClick={() => handleMove(idx, 'down')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-20"
                    title="Move down"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteProject(proj.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 ml-1"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              Add Portfolio Project
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Add project details, technology stack, and destination links.
            </p>

            <form onSubmit={handleCreateProject} className="space-y-4 my-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Title</label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="SignBridge NFC Card V2"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#087CF0]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Hardware, Web Architecture, Mobile, etc."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#087CF0]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Thumbnail Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#087CF0]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Destination Project URL</label>
                <input
                  type="url"
                  value={projectUrl}
                  onChange={(e) => setProjectUrl(e.target.value)}
                  placeholder="https://github.com/you/repo or https://site.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#087CF0]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Technologies (comma separated)</label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="Next.js, TypeScript, Supabase, NFC NTAG216"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#087CF0]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what was built, your specific contribution, and outcomes..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#087CF0]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#087CF0] text-white text-xs font-semibold hover:bg-[#0668cc] shadow-sm"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
