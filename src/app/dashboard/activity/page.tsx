'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getCurrentUser, 
  getProfileByUserId, 
  getOrCreateProfileForUser,
  getAllPosts,
  createPost,
  toggleLikePost,
  toggleBookmarkPost,
  getCommentsByPostId,
  addCommentToPost
} from '@/lib/store';
import { Profile, PostItem, PostComment } from '@/lib/types';
import { 
  Newspaper, 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Send, 
  Image as ImageIcon, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Check, 
  Copy,
  FolderGit2,
  Rocket,
  Plus,
  ShieldCheck,
  Tag
} from 'lucide-react';

export default function ActivityFeedPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [newContent, setNewContent] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'project' | 'milestone'>('milestone');
  const [mediaUrl, setMediaUrl] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [commentsMap, setCommentsMap] = useState<Record<string, PostComment[]>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  const loadData = () => {
    const user = getCurrentUser();
    if (!user) return;

    let p = getProfileByUserId(user.id);
    if (!p) {
      p = getOrCreateProfileForUser(user);
    }
    setProfile(p);

    const allPosts = getAllPosts();
    setPosts(allPosts);

    // Preload comments for posts
    const map: Record<string, PostComment[]> = {};
    allPosts.forEach(post => {
      map[post.id] = getCommentsByPostId(post.id);
    });
    setCommentsMap(map);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !newContent.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const newPost = createPost({
      author_id: profile.user_id,
      author_name: profile.full_name,
      author_username: profile.username,
      author_image: profile.profile_image,
      author_headline: profile.headline || profile.title,
      content: newContent.trim(),
      media_url: mediaUrl.trim() || undefined,
      media_type: mediaType,
      project_link: projectLink.trim() || undefined,
      tags: tags.length > 0 ? tags : ['ProfessionalUpdate', 'SignTap'],
    });

    setNewContent('');
    setMediaUrl('');
    setProjectLink('');
    setTagsInput('');
    showToast('Post published to your network!');
    loadData();
  };

  const handleLike = (postId: string) => {
    if (!profile) return;
    toggleLikePost(postId, profile.user_id);
    loadData();
  };

  const handleBookmark = (postId: string) => {
    if (!profile) return;
    const isBookmarked = toggleBookmarkPost(postId, profile.user_id);
    showToast(isBookmarked ? 'Post saved to bookmarks' : 'Post removed from bookmarks');
    loadData();
  };

  const handleShare = (post: PostItem) => {
    const shareUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/u/${post.author_username}`
      : `https://signbridge.click/u/${post.author_username}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedPostId(post.id);
    showToast('Post link copied to clipboard!');
    setTimeout(() => setCopiedPostId(null), 2000);
  };

  const handleCommentSubmit = (postId: string) => {
    if (!profile) return;
    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;

    addCommentToPost(postId, profile, commentText);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#101828] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 text-sm font-semibold animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#101828] tracking-tight flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-[#923cf6]" />
          <span>Professional Activity & Feed</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Share project drops, career milestones, hardware discoveries, and business insights with your network.
        </p>
      </div>

      {/* 1. Create Post Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-start gap-3">
          <img 
            src={profile.profile_image} 
            alt={profile.full_name} 
            className="w-11 h-11 rounded-xl object-cover ring-2 ring-slate-100 flex-shrink-0"
          />
          <div className="flex-1">
            <h3 className="text-xs font-bold text-[#101828]">{profile.full_name}</h3>
            <p className="text-[11px] text-slate-400 truncate">{profile.headline || profile.title}</p>
          </div>
        </div>

        <form onSubmit={handleCreatePost} className="space-y-3.5">
          <textarea
            rows={3}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Share a milestone, project drop, engineering insight, or business update..."
            className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20 focus:border-[#087CF0] resize-none"
            required
          />

          {/* Post Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Post Category
              </label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value as any)}
                className="w-full p-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
              >
                <option value="milestone">🏆 Milestone Announcement</option>
                <option value="project">🚀 Project Drop</option>
                <option value="image">📸 Visual Showcase</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Image Banner URL (Optional)
              </label>
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2 rounded-xl border border-slate-200 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Hardware, AI, Launch"
                className="w-full p-2 rounded-xl border border-slate-200 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-[#101828] hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs active:scale-95"
            >
              <Rocket className="w-3.5 h-3.5 text-[#FF7900]" />
              <span>Publish Update</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Feed Stream */}
      <div className="space-y-5">
        {posts.map((post) => {
          const hasLiked = post.liked_by?.includes(profile.user_id);
          const hasBookmarked = post.bookmarked_by?.includes(profile.user_id);
          const isCommentsOpen = activeCommentsPostId === post.id;
          const postComments = commentsMap[post.id] || [];

          return (
            <div 
              key={post.id} 
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4 hover:border-slate-300 transition-all"
            >
              {/* Author Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img 
                    src={post.author_image} 
                    alt={post.author_name} 
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Link 
                        href={`/u/${post.author_username}`}
                        target="_blank"
                        className="text-sm font-bold text-[#101828] hover:text-[#087CF0] transition-colors"
                      >
                        {post.author_name}
                      </Link>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#087CF0]" />
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {post.author_headline}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                      {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {post.media_type && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-[#087CF0] border border-blue-100">
                    {post.media_type}
                  </span>
                )}
              </div>

              {/* Content Body */}
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.tags.map((tag, idx) => (
                    <span key={idx} className="text-[11px] font-medium text-[#087CF0] hover:underline cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Media Preview */}
              {post.media_url && (
                <div className="rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-900 max-h-96">
                  <img 
                    src={post.media_url} 
                    alt="Post media" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Project Card if provided */}
              {post.project_link && (
                <a
                  href={post.project_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition-colors text-xs font-semibold text-slate-800 group"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <FolderGit2 className="w-4 h-4 text-[#087CF0] flex-shrink-0" />
                    <span className="truncate">{post.project_link}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 flex-shrink-0" />
                </a>
              )}

              {/* Action Buttons: Like, Comment, Bookmark, Share */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      hasLiked
                        ? 'bg-rose-50 text-rose-600'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                    <span>{post.likes_count}</span>
                  </button>

                  <button
                    onClick={() => setActiveCommentsPostId(isCommentsOpen ? null : post.id)}
                    className="py-1.5 px-3 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments_count}</span>
                  </button>

                  <button
                    onClick={() => handleBookmark(post.id)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      hasBookmarked
                        ? 'bg-amber-50 text-amber-600'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${hasBookmarked ? 'fill-amber-600 text-amber-600' : ''}`} />
                    <span className="hidden sm:inline">Save</span>
                  </button>
                </div>

                <button
                  onClick={() => handleShare(post)}
                  className="py-1.5 px-3 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all flex items-center gap-1.5"
                >
                  {copiedPostId === post.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                  <span>{copiedPostId === post.id ? 'Copied' : 'Share'}</span>
                </button>
              </div>

              {/* Expandable Comments Section */}
              {isCommentsOpen && (
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  {/* Existing comments */}
                  <div className="space-y-2.5">
                    {postComments.map((comm) => (
                      <div key={comm.id} className="p-3 rounded-2xl bg-slate-50 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#101828]">{comm.author_name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(comm.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-700">{comm.content}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add comment input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add an insightful comment..."
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                      className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087CF0]/20"
                    />
                    <button
                      onClick={() => handleCommentSubmit(post.id)}
                      className="p-2.5 rounded-xl bg-[#087CF0] text-white hover:bg-[#0668cc] transition-colors"
                      title="Post Comment"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
