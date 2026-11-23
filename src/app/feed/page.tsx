'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LinkedInNavbar from '@/components/LinkedInNavbar';
import { 
  getCurrentUser, 
  getProfileByUserId, 
  getAllProfiles, 
  getAllPosts, 
  createPost, 
  reactToPost, 
  sharePost, 
  getCommentsByPostId, 
  addCommentToPost,
  getAllConnections,
  sendConnectionRequest,
  toggleFollow,
  isFollowing,
  getLiveConnectionCount,
  getNewMemberStatus
} from '@/lib/store';
import { Profile, PostItem, PostComment, ReactionType, UserSession } from '@/lib/types';
import { 
  ThumbsUp, 
  MessageSquare, 
  Repeat, 
  Send, 
  Image as ImageIcon, 
  Video, 
  Briefcase, 
  FileText, 
  Sparkles, 
  Globe, 
  Users, 
  Bookmark, 
  MoreHorizontal, 
  UserPlus, 
  UserCheck, 
  Crown, 
  ShieldCheck, 
  CreditCard, 
  TrendingUp, 
  ArrowRight, 
  Check, 
  X,
  Smile,
  Heart,
  Share2
} from 'lucide-react';

const REACTION_CONFIG: { type: ReactionType; label: string; icon: string; color: string }[] = [
  { type: 'like', label: 'Like', icon: '👍', color: 'text-blue-600' },
  { type: 'celebrate', label: 'Celebrate', icon: '👏', color: 'text-emerald-600' },
  { type: 'support', label: 'Support', icon: '🤝', color: 'text-purple-600' },
  { type: 'love', label: 'Love', icon: '❤️', color: 'text-red-500' },
  { type: 'insightful', label: 'Insightful', icon: '💡', color: 'text-amber-500' },
  { type: 'funny', label: 'Funny', icon: '😂', color: 'text-sky-500' },
];

export default function FeedPage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [feedFilter, setFeedFilter] = useState<'recent' | 'top'>('recent');
  const [peopleYouMayKnow, setPeopleYouMayKnow] = useState<Profile[]>([]);
  const [connectionsCount, setConnectionsCount] = useState(0);

  // Post creation modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postMediaUrl, setPostMediaUrl] = useState('');
  const [postMediaType, setPostMediaType] = useState<'text' | 'image' | 'video' | 'project'>('text');
  const [postVisibility, setPostVisibility] = useState<'public' | 'connections'>('public');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  // Active open comment sections: map of postId -> boolean
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [commentsMap, setCommentsMap] = useState<Record<string, PostComment[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Floating reaction picker active post ID
  const [hoveredReactionPostId, setHoveredReactionPostId] = useState<string | null>(null);
  const reactionHoverTimeout = useRef<NodeJS.Timeout | null>(null);

  // Repost modal
  const [sharingPost, setSharingPost] = useState<PostItem | null>(null);
  const [shareCommentary, setShareCommentary] = useState('');

  // Status for connect buttons
  const [connectingMap, setConnectingMap] = useState<Record<string, boolean>>({});

  const refreshFeed = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    if (currentUser) {
      const p = getProfileByUserId(currentUser.id);
      setProfile(p);
      setConnectionsCount(getLiveConnectionCount(currentUser.id));
    } else {
      setProfile(null);
      setConnectionsCount(0);
    }

    const all = getAllPosts();
    if (feedFilter === 'top') {
      all.sort((a, b) => (b.likes_count + b.comments_count) - (a.likes_count + a.comments_count));
    } else {
      all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    setPosts([...all]);

    // Recommended members
    const allProfiles = getAllProfiles();
    const recommended = allProfiles
      .filter(p => !currentUser || p.user_id !== currentUser.id)
      .slice(0, 4);
    setPeopleYouMayKnow(recommended);
  };

  useEffect(() => {
    refreshFeed();
  }, [feedFilter]);

  // Handle post image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 900;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        setPostMediaUrl(compressedBase64);
        setPostMediaType('image');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim() && !postMediaUrl) return;
    if (!user || !profile) return;

    setIsSubmittingPost(true);
    try {
      createPost({
        author_id: user.id,
        author_name: profile.full_name,
        author_username: profile.username,
        author_image: profile.profile_image,
        author_headline: profile.headline || profile.title || 'SignTap Member',
        content: postContent.trim(),
        media_url: postMediaUrl || undefined,
        media_type: postMediaType === 'text' ? undefined : (postMediaType as any),
      });

      setPostContent('');
      setPostMediaUrl('');
      setPostMediaType('text');
      setIsCreateModalOpen(false);
      refreshFeed();
    } finally {
      setIsSubmittingPost(false);
    }
  };

  const handleReaction = (postId: string, reactionType: ReactionType) => {
    if (!user) return;
    reactToPost(postId, user.id, reactionType, profile);
    setHoveredReactionPostId(null);
    refreshFeed();
  };

  const toggleCommentsSection = (postId: string) => {
    const nextState = !openComments[postId];
    setOpenComments(prev => ({ ...prev, [postId]: nextState }));
    if (nextState && !commentsMap[postId]) {
      setCommentsMap(prev => ({ ...prev, [postId]: getCommentsByPostId(postId) }));
    }
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text || !profile) return;

    addCommentToPost(postId, profile, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setCommentsMap(prev => ({ ...prev, [postId]: getCommentsByPostId(postId) }));
    refreshFeed();
  };

  const handleShareSubmit = () => {
    if (!sharingPost || !profile) return;
    sharePost(sharingPost.id, profile, shareCommentary.trim() || undefined);
    setSharingPost(null);
    setShareCommentary('');
    refreshFeed();
  };

  const handleConnect = (targetUserId: string) => {
    if (!profile) return;
    const targetProfile = getAllProfiles().find(p => p.user_id === targetUserId);
    if (!targetProfile) return;
    sendConnectionRequest(profile, targetProfile);
    setConnectingMap(prev => ({ ...prev, [targetUserId]: true }));
    setTimeout(refreshFeed, 500);
  };

  return (
    <div className="min-h-screen bg-[#F4F2EE] text-slate-800">
      <LinkedInNavbar />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-20 pb-20 md:pb-12">
        <div className="flex justify-center gap-6">

          {/* ================================================================= */}
          {/* LEFT COLUMN: User Identity Card & Digital NFC Card Shortcut */}
          {/* ================================================================= */}
          <aside className="hidden md:block w-56 lg:w-60 xl:w-64 shrink-0 space-y-3">
            
            {/* User Mini Profile Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              {/* Cover Banner */}
              <div className="h-16 bg-gradient-to-r from-[#0A66C2] via-[#004182] to-[#101828] relative">
                {profile?.cover_image && (
                  <img
                    src={profile.cover_image}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Avatar & Basic Info */}
              <div className="px-4 pb-4 -mt-9 text-center">
                <Link href={profile ? `/u/${profile.username}` : '/login'} className="inline-block relative group">
                  {profile?.profile_image ? (
                    <img
                      src={profile.profile_image}
                      alt={profile.full_name}
                      className="w-18 h-18 rounded-full object-cover border-2 border-white shadow-sm mx-auto group-hover:opacity-90 transition-opacity"
                    />
                  ) : (
                    <div className="w-18 h-18 rounded-full bg-[#0A66C2] text-white flex items-center justify-center font-bold text-2xl border-2 border-white shadow-sm mx-auto">
                      {profile?.full_name?.charAt(0) || 'U'}
                    </div>
                  )}
                  {profile?.is_premium && (
                    <Crown className="w-4 h-4 text-amber-500 absolute bottom-0 right-0 fill-amber-400 stroke-amber-600 drop-shadow-xs" />
                  )}
                </Link>

                <h3 className="font-bold text-slate-900 text-sm mt-2 hover:underline">
                  <Link href={profile ? `/u/${profile.username}` : '/login'}>
                    {profile?.full_name || 'SignTap Member'}
                  </Link>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                  {profile?.headline || profile?.title || 'Connect and share your digital identity'}
                </p>

                {profile && (
                  <div className="mt-3 pt-3 border-t border-slate-100 text-left space-y-2 text-xs">
                    <Link
                      href="/network"
                      className="flex items-center justify-between text-slate-600 hover:text-[#0A66C2] font-medium transition-colors"
                    >
                      <span>Connections</span>
                      <span className="font-bold text-[#0A66C2]">{connectionsCount}</span>
                    </Link>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Profile impressions</span>
                      <span className="font-bold text-slate-900">1,280</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Digital NFC Card Shortcut */}
              <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 text-xs">
                <Link
                  href={profile ? `/u/${profile.username}` : '/login'}
                  className="flex items-center gap-2 text-slate-700 hover:text-[#0A66C2] font-semibold"
                >
                  <CreditCard className="w-4 h-4 text-[#0A66C2]" />
                  <span>My Digital Identity Card</span>
                </Link>
              </div>
            </div>

            {/* Premium Upgrade CTA Card */}
            {!profile?.is_premium && (
              <div className="bg-gradient-to-br from-amber-50/80 to-amber-100/50 rounded-xl border border-amber-200/80 p-3.5 shadow-xs">
                <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs">
                  <Crown className="w-4 h-4 text-amber-600 fill-amber-400" />
                  <span>SignTap Premium PRO</span>
                </div>
                <p className="text-[11px] text-amber-800/90 mt-1 leading-relaxed">
                  Get verified gold crown badge, unlimited contactless profile shares & priority discovery.
                </p>
                <Link
                  href="/cards"
                  className="mt-2.5 block text-center py-1.5 px-3 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Unlock PRO · ₹1,000/yr
                </Link>
              </div>
            )}

            {/* Quick Navigation Drawer */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs text-xs space-y-2 text-slate-600">
              <Link href="/network" className="flex items-center gap-2 hover:text-[#0A66C2] transition-colors">
                <Users className="w-4 h-4 text-slate-400" />
                <span>My Network ({connectionsCount})</span>
              </Link>
              <Link href="/jobs" className="flex items-center gap-2 hover:text-[#0A66C2] transition-colors">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <span>Saved Jobs & Alerts</span>
              </Link>
              <Link href="/cards" className="flex items-center gap-2 hover:text-[#0A66C2] transition-colors">
                <CreditCard className="w-4 h-4 text-slate-400" />
                <span>Order Physical NFC Card</span>
              </Link>
            </div>
          </aside>

          {/* ================================================================= */}
          {/* CENTER COLUMN: Create Post & Social Activity Stream */}
          {/* ================================================================= */}
          <section className="flex-1 max-w-[580px] lg:max-w-[620px] space-y-3">
            
            {/* Create Post Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
              <div className="flex items-center gap-3">
                {profile?.profile_image ? (
                  <img
                    src={profile.profile_image}
                    alt={profile.full_name}
                    className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-[#0A66C2] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {profile?.full_name?.charAt(0) || 'U'}
                  </div>
                )}
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex-1 text-left px-4 py-2.5 rounded-full border border-slate-300 hover:bg-slate-100/80 text-xs sm:text-sm font-medium text-slate-500 transition-colors cursor-pointer"
                >
                  Start a post, share a project, milestone...
                </button>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    setIsCreateModalOpen(true);
                    setPostMediaType('image');
                  }}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-xs font-semibold text-slate-600 transition-colors"
                >
                  <ImageIcon className="w-4 h-4 text-blue-500" />
                  <span>Media</span>
                </button>

                <button
                  onClick={() => {
                    setIsCreateModalOpen(true);
                    setPostMediaType('video');
                  }}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-xs font-semibold text-slate-600 transition-colors"
                >
                  <Video className="w-4 h-4 text-emerald-500" />
                  <span>Video</span>
                </button>

                <button
                  onClick={() => {
                    setIsCreateModalOpen(true);
                    setPostMediaType('project');
                  }}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-xs font-semibold text-slate-600 transition-colors"
                >
                  <Briefcase className="w-4 h-4 text-purple-500" />
                  <span>Project</span>
                </button>

                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-xs font-semibold text-slate-600 transition-colors"
                >
                  <FileText className="w-4 h-4 text-amber-500" />
                  <span>Article</span>
                </button>
              </div>
            </div>

            {/* Filter / Sort Divider */}
            <div className="flex items-center justify-between px-1 text-xs text-slate-500">
              <div className="h-px bg-slate-300 flex-1 mr-3" />
              <div className="flex items-center gap-1.5 font-medium shrink-0">
                <span>Sort by:</span>
                <select
                  value={feedFilter}
                  onChange={(e) => setFeedFilter(e.target.value as 'recent' | 'top')}
                  className="bg-transparent text-slate-900 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="recent">Recent</option>
                  <option value="top">Top</option>
                </select>
              </div>
            </div>

            {/* Posts Stream */}
            <div className="space-y-3">
              {posts.map((post) => {
                const userReaction = post.user_reaction;
                const activeReaction = REACTION_CONFIG.find(r => r.type === userReaction);
                const isAuthor = user?.id === post.author_id;

                return (
                  <article
                    key={post.id}
                    className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden"
                  >
                    {/* Author Header */}
                    <div className="p-3.5 pb-2 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Link href={`/u/${post.author_username}`} className="shrink-0">
                          {post.author_image ? (
                            <img
                              src={post.author_image}
                              alt={post.author_name}
                              className="w-11 h-11 rounded-full object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-[#0A66C2] text-white flex items-center justify-center font-bold text-sm">
                              {post.author_name.charAt(0)}
                            </div>
                          )}
                        </Link>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Link
                              href={`/u/${post.author_username}`}
                              className="font-bold text-slate-900 text-sm hover:text-[#0A66C2] hover:underline truncate"
                            >
                              {post.author_name}
                            </Link>
                          </div>
                          <p className="text-xs text-slate-500 truncate">{post.author_headline}</p>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                            <span>{new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                            <span>•</span>
                            <Globe className="w-3 h-3 text-slate-400" />
                          </div>
                        </div>
                      </div>

                      {/* Connect / Options button */}
                      {!isAuthor && (
                        <button
                          onClick={() => handleConnect(post.author_id)}
                          className="shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-[#0A66C2] hover:bg-blue-50 transition-colors"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Connect</span>
                        </button>
                      )}
                    </div>

                    {/* Post Content */}
                    <div className="px-3.5 py-2">
                      <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                        {post.content}
                      </p>

                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {post.tags.map(t => (
                            <span key={t} className="text-xs font-medium text-[#0A66C2] hover:underline cursor-pointer">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Media preview */}
                    {post.media_url && (
                      <div className="mt-1 border-t border-b border-slate-100 bg-slate-900/5">
                        <img
                          src={post.media_url}
                          alt="Post Media"
                          className="w-full max-h-[460px] object-cover"
                        />
                      </div>
                    )}

                    {/* Social Stats Summary */}
                    <div className="px-3.5 py-2 flex items-center justify-between text-xs text-slate-500 border-b border-slate-100">
                      <div className="flex items-center gap-1">
                        <span className="flex -space-x-1">
                          <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]">👍</span>
                          <span className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px]">❤️</span>
                          <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">💡</span>
                        </span>
                        <span className="ml-1 text-[11px] font-medium text-slate-600">
                          {post.likes_count > 0 ? post.likes_count : 'Be the first to react'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px]">
                        <span>{post.comments_count || 0} comments</span>
                        <span>•</span>
                        <span>{post.shares_count || 0} reposts</span>
                      </div>
                    </div>

                    {/* LinkedIn 4-Action Buttons Row */}
                    <div className="px-2 py-1 flex items-center justify-between relative">
                      
                      {/* Like / Floating Reaction Dock */}
                      <div
                        className="relative flex-1"
                        onMouseEnter={() => {
                          if (reactionHoverTimeout.current) clearTimeout(reactionHoverTimeout.current);
                          setHoveredReactionPostId(post.id);
                        }}
                        onMouseLeave={() => {
                          reactionHoverTimeout.current = setTimeout(() => {
                            setHoveredReactionPostId(null);
                          }, 350);
                        }}
                      >
                        {/* Floating 6-Reaction Emoji Bar */}
                        {hoveredReactionPostId === post.id && (
                          <div className="absolute -top-12 left-0 bg-white border border-slate-200/90 rounded-full shadow-lg px-2 py-1 flex items-center gap-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                            {REACTION_CONFIG.map((rc) => (
                              <button
                                key={rc.type}
                                onClick={() => handleReaction(post.id, rc.type)}
                                className="hover:scale-130 transition-transform p-1 text-lg leading-none rounded-full"
                                title={rc.label}
                              >
                                {rc.icon}
                              </button>
                            ))}
                          </div>
                        )}

                        <button
                          onClick={() => handleReaction(post.id, userReaction || 'like')}
                          className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-md hover:bg-slate-100 text-xs font-semibold transition-colors ${
                            activeReaction ? activeReaction.color : 'text-slate-600'
                          }`}
                        >
                          <ThumbsUp className={`w-4 h-4 ${userReaction ? 'fill-current' : ''}`} />
                          <span>{activeReaction ? activeReaction.label : 'Like'}</span>
                        </button>
                      </div>

                      {/* Comment */}
                      <button
                        onClick={() => toggleCommentsSection(post.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md hover:bg-slate-100 text-xs font-semibold text-slate-600 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Comment</span>
                      </button>

                      {/* Repost */}
                      <button
                        onClick={() => setSharingPost(post)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md hover:bg-slate-100 text-xs font-semibold text-slate-600 transition-colors"
                      >
                        <Repeat className="w-4 h-4" />
                        <span>Repost</span>
                      </button>

                      {/* Send */}
                      <Link
                        href={`/messages?sharePost=${post.id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md hover:bg-slate-100 text-xs font-semibold text-slate-600 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                        <span>Send</span>
                      </Link>
                    </div>

                    {/* Comments Drawer */}
                    {openComments[post.id] && (
                      <div className="p-3.5 bg-slate-50 border-t border-slate-100 space-y-3">
                        {/* New Comment Input */}
                        <div className="flex items-start gap-2.5">
                          {profile?.profile_image ? (
                            <img
                              src={profile.profile_image}
                              alt={profile.full_name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0 mt-0.5"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[#0A66C2] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                              {profile?.full_name?.charAt(0) || 'U'}
                            </div>
                          )}
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              value={commentInputs[post.id] || ''}
                              onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddComment(post.id);
                              }}
                              placeholder="Add a professional comment..."
                              className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-full text-xs focus:outline-none focus:border-[#0A66C2]"
                            />
                            <button
                              onClick={() => handleAddComment(post.id)}
                              disabled={!commentInputs[post.id]?.trim()}
                              className="px-3 py-1 bg-[#0A66C2] disabled:opacity-50 text-white rounded-full text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
                            >
                              Post
                            </button>
                          </div>
                        </div>

                        {/* Comments Stream */}
                        <div className="space-y-2.5 pt-1">
                          {(commentsMap[post.id] || []).map((comm) => (
                            <div key={comm.id} className="flex items-start gap-2.5 text-xs">
                              <Link href={`/u/${comm.author_username}`} className="shrink-0">
                                {comm.author_image ? (
                                  <img
                                    src={comm.author_image}
                                    alt={comm.author_name}
                                    className="w-7 h-7 rounded-full object-cover border border-slate-200"
                                  />
                                ) : (
                                  <div className="w-7 h-7 rounded-full bg-[#0A66C2] text-white flex items-center justify-center font-bold text-[10px]">
                                    {comm.author_name.charAt(0)}
                                  </div>
                                )}
                              </Link>
                              <div className="flex-1 bg-white p-2.5 rounded-xl border border-slate-200">
                                <div className="flex items-center justify-between">
                                  <Link
                                    href={`/u/${comm.author_username}`}
                                    className="font-bold text-slate-900 hover:underline"
                                  >
                                    {comm.author_name}
                                  </Link>
                                  <span className="text-[10px] text-slate-400">
                                    {new Date(comm.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className="text-slate-700 mt-1 leading-relaxed">{comm.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>

          {/* ================================================================= */}
          {/* RIGHT COLUMN: Trending Topics, People You May Know, NFC Cards */}
          {/* ================================================================= */}
          <aside className="hidden lg:block w-72 xl:w-80 shrink-0 space-y-3">
            
            {/* Trending Topics & News */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#0A66C2]" />
                  <span>SignTap Professional News</span>
                </h4>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <h5 className="font-semibold text-slate-800 hover:text-[#0A66C2] cursor-pointer">
                    • Physical NFC web cards surge across India
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">2d ago • 3,420 readers</p>
                </div>
                <div>
                  <h5 className="font-semibold text-slate-800 hover:text-[#0A66C2] cursor-pointer">
                    • Edge computing & microchip contactless identity
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">1d ago • 1,980 readers</p>
                </div>
                <div>
                  <h5 className="font-semibold text-slate-800 hover:text-[#0A66C2] cursor-pointer">
                    • Replacing paper visiting cards with Smart CRM
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">3d ago • 985 readers</p>
                </div>
                <div>
                  <h5 className="font-semibold text-slate-800 hover:text-[#0A66C2] cursor-pointer">
                    • Next.js 15 App Router architecture in production
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">4d ago • 1,450 readers</p>
                </div>
              </div>
            </div>

            {/* People You May Know */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <h4 className="font-bold text-slate-900 text-sm mb-3">
                People You May Know
              </h4>

              <div className="space-y-3">
                {peopleYouMayKnow.map((person) => {
                  const hasConnected = connectingMap[person.user_id];
                  return (
                    <div key={person.id} className="flex items-start justify-between gap-2.5">
                      <Link href={`/u/${person.username}`} className="shrink-0 mt-0.5">
                        {person.profile_image ? (
                          <img
                            src={person.profile_image}
                            alt={person.full_name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#0A66C2] text-white flex items-center justify-center font-bold text-xs">
                            {person.full_name.charAt(0)}
                          </div>
                        )}
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/u/${person.username}`}
                          className="font-bold text-slate-900 text-xs hover:text-[#0A66C2] hover:underline block truncate"
                        >
                          {person.full_name}
                        </Link>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{person.headline || person.title}</p>
                        
                        <button
                          onClick={() => handleConnect(person.user_id)}
                          disabled={hasConnected}
                          className="mt-1 inline-flex items-center gap-1 px-3 py-1 rounded-full border border-[#0A66C2] text-[#0A66C2] hover:bg-blue-50 text-[11px] font-semibold transition-colors disabled:opacity-60"
                        >
                          {hasConnected ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Pending</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3 h-3" />
                              <span>Connect</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 text-center">
                <Link
                  href="/network"
                  className="text-xs font-semibold text-[#0A66C2] hover:underline inline-flex items-center gap-1"
                >
                  <span>View All Network Suggestions</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* SignTap NFC Smart Card Showcase */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#0A66C2]/20 rounded-full blur-2xl" />
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SignTap Physical Hardware</span>
              </div>
              <h4 className="font-bold text-sm mt-1">Get Your Laser-Engraved NFC Card</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Tap any phone to share your verified profile instantly. No app required. Free courier delivery.
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-bold text-amber-400 text-sm">₹199 only</span>
                <Link
                  href="/cards"
                  className="px-3 py-1.5 rounded-full bg-[#0A66C2] hover:bg-blue-600 text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  Order Card
                </Link>
              </div>
            </div>

            {/* Footer mini links */}
            <div className="text-[11px] text-slate-400 space-x-2 text-center pt-2">
              <Link href="/about" className="hover:underline">About</Link>
              <span>•</span>
              <Link href="/privacy" className="hover:underline">Privacy</Link>
              <span>•</span>
              <Link href="/terms" className="hover:underline">Terms</Link>
              <span>•</span>
              <Link href="/contact" className="hover:underline">Help Center</Link>
              <p className="mt-1">SignTap Corporation © 2026</p>
            </div>
          </aside>

        </div>
      </main>

      {/* ===================================================================== */}
      {/* CREATE POST MODAL */}
      {/* ===================================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {profile?.profile_image ? (
                  <img
                    src={profile.profile_image}
                    alt={profile.full_name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#0A66C2] text-white flex items-center justify-center font-bold text-sm">
                    {profile?.full_name?.charAt(0) || 'U'}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{profile?.full_name || 'Member'}</h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                    <Globe className="w-3 h-3" />
                    <span>Post to Anyone</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreatePost} className="p-5 space-y-4">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What do you want to talk about? Share an achievement, milestone, or insights..."
                rows={5}
                className="w-full text-sm text-slate-800 placeholder-slate-400 border-none focus:outline-none resize-none"
                autoFocus
              />

              {/* Media preview in modal */}
              {postMediaUrl && (
                <div className="relative rounded-lg overflow-hidden border border-slate-200 max-h-48 bg-slate-100">
                  <img src={postMediaUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setPostMediaUrl('');
                      setPostMediaType('text');
                    }}
                    className="absolute top-2 right-2 p-1 bg-slate-900/70 text-white rounded-full hover:bg-slate-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Media Attachments Bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <label className="p-2 text-slate-500 hover:text-[#0A66C2] hover:bg-blue-50 rounded-lg cursor-pointer">
                    <ImageIcon className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const url = prompt('Enter video link (e.g. YouTube or demo video):');
                      if (url) {
                        setPostMediaUrl(url);
                        setPostMediaType('video');
                      }
                    }}
                    className="p-2 text-slate-500 hover:text-[#0A66C2] hover:bg-blue-50 rounded-lg cursor-pointer"
                  >
                    <Video className="w-5 h-5" />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={(!postContent.trim() && !postMediaUrl) || isSubmittingPost}
                  className="px-5 py-2 rounded-full bg-[#0A66C2] hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  {isSubmittingPost ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* REPOST / SHARE MODAL */}
      {/* ===================================================================== */}
      {sharingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Repeat className="w-4 h-4 text-[#0A66C2]" />
                <span>Repost to Feed</span>
              </h4>
              <button onClick={() => setSharingPost(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              value={shareCommentary}
              onChange={(e) => setShareCommentary(e.target.value)}
              placeholder="Add your thoughts about this post..."
              rows={3}
              className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#0A66C2]"
            />

            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs">
              <p className="font-semibold text-slate-900">{sharingPost.author_name}</p>
              <p className="text-slate-600 line-clamp-2 mt-0.5">{sharingPost.content}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSharingPost(null)}
                className="px-3.5 py-1.5 rounded-full text-xs text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleShareSubmit}
                className="px-4 py-1.5 rounded-full bg-[#0A66C2] text-white text-xs font-semibold hover:bg-blue-700"
              >
                Repost
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
