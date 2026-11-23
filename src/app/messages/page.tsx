'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import LinkedInNavbar from '@/components/LinkedInNavbar';
import { 
  getCurrentUser, 
  getProfileByUserId, 
  getAllProfiles, 
  getConversationsForUser, 
  getMessagesBetween, 
  sendMessage, 
  markMessagesAsRead,
  getAllPosts
} from '@/lib/store';
import { Profile, ChatMessage, ChatConversation, UserSession } from '@/lib/types';
import { 
  Search, 
  Send, 
  Image as ImageIcon, 
  Smile, 
  MoreVertical, 
  Phone, 
  Video, 
  Check, 
  CheckCheck, 
  Crown, 
  ArrowLeft, 
  MessageSquare,
  Sparkles,
  Paperclip,
  ExternalLink
} from 'lucide-react';

function MessagesContent() {
  const searchParams = useSearchParams();
  const initialUserId = searchParams.get('user');
  const sharePostId = searchParams.get('sharePost');

  const [user, setUser] = useState<UserSession | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [activePartnerProfile, setActivePartnerProfile] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const syncMessages = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    if (!currentUser) return;
    const currentProfile = getProfileByUserId(currentUser.id);
    setProfile(currentProfile);

    const convos = getConversationsForUser(currentUser.id);
    setConversations(convos);

    // If initial query param has a user id
    if (initialUserId && !selectedConversation) {
      const partner = getAllProfiles().find(p => p.user_id === initialUserId || p.id === initialUserId);
      if (partner) {
        setActivePartnerProfile(partner);
        const existingConvo = convos.find(c => c.participant_id === partner.user_id);
        if (existingConvo) {
          setSelectedConversation(existingConvo);
        } else {
          setSelectedConversation({
            participant_id: partner.user_id,
            participant_name: partner.full_name,
            participant_username: partner.username,
            participant_avatar: partner.profile_image,
            participant_headline: partner.headline || partner.title,
            unread_count: 0
          });
        }
        setShowMobileChat(true);
      }
    } else if (!selectedConversation && convos.length > 0) {
      // Default to first conversation
      handleSelectConversation(convos[0]);
    }

    // Refresh active messages
    if (selectedConversation && currentUser) {
      const msgs = getMessagesBetween(currentUser.id, selectedConversation.participant_id);
      setMessages(msgs);
      markMessagesAsRead(currentUser.id, selectedConversation.participant_id);
    }
  };

  useEffect(() => {
    syncMessages();
    const interval = setInterval(() => {
      if (user && selectedConversation) {
        const msgs = getMessagesBetween(user.id, selectedConversation.participant_id);
        setMessages(msgs);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedConversation?.participant_id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // If sharePost was passed, pre-fill text
  useEffect(() => {
    if (sharePostId) {
      const post = getAllPosts().find(p => p.id === sharePostId);
      if (post) {
        setInputMessage(`Check out this post from ${post.author_name}: "${post.content.substring(0, 100)}..."`);
      }
    }
  }, [sharePostId]);

  const handleSelectConversation = (convo: ChatConversation) => {
    setSelectedConversation(convo);
    const partner = getAllProfiles().find(p => p.user_id === convo.participant_id);
    setActivePartnerProfile(partner || null);
    setShowMobileChat(true);

    if (user) {
      const msgs = getMessagesBetween(user.id, convo.participant_id);
      setMessages(msgs);
      markMessagesAsRead(user.id, convo.participant_id);
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputMessage.trim() && !attachedImage) return;
    if (!user || !activePartnerProfile) return;

    let finalContent = inputMessage.trim();
    if (attachedImage) {
      finalContent = finalContent ? `${finalContent}\n[Image Attached]` : '[Image Attached]';
    }

    const newMsg = sendMessage(profile || user, activePartnerProfile, finalContent);
    setInputMessage('');
    setAttachedImage(null);

    setMessages(prev => [...prev, newMsg]);
    setTimeout(scrollToBottom, 100);

    // Refresh conversations list
    const convos = getConversationsForUser(user.id);
    setConversations(convos);
  };

  const handleImageAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const filteredConversations = conversations.filter(c => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return c.participant_name.toLowerCase().includes(q) || c.last_message?.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-[#F4F2EE] text-slate-800">
      <LinkedInNavbar />

      <main className="max-w-6xl mx-auto px-3 sm:px-6 pt-20 pb-20 md:pb-12">
        <div className="h-[calc(100vh-140px)] min-h-[580px] bg-white rounded-xl border border-slate-200 shadow-xs flex overflow-hidden">
          
          {/* ================================================================= */}
          {/* LEFT PANE: Conversation List */}
          {/* ================================================================= */}
          <aside className={`w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-white shrink-0 ${
            showMobileChat ? 'hidden md:flex' : 'flex'
          }`}>
            {/* Header */}
            <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-base">Messaging</h2>
              <div className="flex items-center gap-1 text-slate-500">
                <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-[#0A66C2] rounded-full">
                  {conversations.length} Active
                </span>
              </div>
            </div>

            {/* Search filter input */}
            <div className="p-3 border-b border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search messages..."
                  className="w-full pl-9 pr-3 py-1.5 bg-[#EDF3F8] hover:bg-[#E1E9F0] focus:bg-white text-xs rounded-lg border border-transparent focus:border-[#0A66C2] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Conversation Items List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-slate-600">No conversations yet</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Connect with professionals in your network to start chatting.
                  </p>
                </div>
              ) : (
                filteredConversations.map((convo) => {
                  const isSelected = selectedConversation?.participant_id === convo.participant_id;
                  return (
                    <div
                      key={convo.participant_id}
                      onClick={() => handleSelectConversation(convo)}
                      className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50/70 border-l-4 border-[#0A66C2]' : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        {convo.participant_avatar ? (
                          <img
                            src={convo.participant_avatar}
                            alt={convo.participant_name}
                            className="w-12 h-12 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-[#0A66C2] text-white flex items-center justify-center font-bold text-sm">
                            {convo.participant_name.charAt(0)}
                          </div>
                        )}
                        <span className="w-3 h-3 bg-emerald-500 border-2 border-white rounded-full absolute bottom-0 right-0" />
                      </div>

                      {/* Content preview */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-slate-900 text-xs truncate">
                            {convo.participant_name}
                          </h4>
                          {convo.last_message_time && (
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {new Date(convo.last_message_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {convo.participant_headline}
                        </p>
                        <p className={`text-xs truncate mt-1 ${
                          convo.unread_count > 0 ? 'font-bold text-slate-900' : 'text-slate-500'
                        }`}>
                          {convo.last_message || 'Start conversation...'}
                        </p>
                      </div>

                      {/* Unread badge */}
                      {convo.unread_count > 0 && (
                        <span className="px-1.5 py-0.5 bg-[#0A66C2] text-white rounded-full text-[10px] font-bold shrink-0 self-center">
                          {convo.unread_count}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </aside>

          {/* ================================================================= */}
          {/* RIGHT PANE: Active Chat View */}
          {/* ================================================================= */}
          <section className={`flex-1 flex flex-col bg-white overflow-hidden ${
            !showMobileChat ? 'hidden md:flex' : 'flex'
          }`}>
            {selectedConversation && activePartnerProfile ? (
              <>
                {/* Chat Top Header */}
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white z-10">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowMobileChat(false)}
                      className="md:hidden p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>

                    <Link href={`/u/${activePartnerProfile.username}`} className="shrink-0">
                      {activePartnerProfile.profile_image ? (
                        <img
                          src={activePartnerProfile.profile_image}
                          alt={activePartnerProfile.full_name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#0A66C2] text-white flex items-center justify-center font-bold text-sm">
                          {activePartnerProfile.full_name.charAt(0)}
                        </div>
                      )}
                    </Link>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/u/${activePartnerProfile.username}`}
                          className="font-bold text-slate-900 text-sm hover:text-[#0A66C2] hover:underline"
                        >
                          {activePartnerProfile.full_name}
                        </Link>
                        {activePartnerProfile.is_premium && (
                          <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400 stroke-amber-600" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {activePartnerProfile.headline || activePartnerProfile.title}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/u/${activePartnerProfile.username}`}
                      className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
                    >
                      <span>Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Message Stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFD]">
                  
                  {/* Participant Intro Card */}
                  <div className="text-center py-6 px-4 max-w-sm mx-auto">
                    {activePartnerProfile.profile_image ? (
                      <img
                        src={activePartnerProfile.profile_image}
                        alt={activePartnerProfile.full_name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm mx-auto mb-2"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-[#0A66C2] text-white flex items-center justify-center font-bold text-xl mx-auto mb-2">
                        {activePartnerProfile.full_name.charAt(0)}
                      </div>
                    )}
                    <h4 className="font-bold text-slate-900 text-sm">{activePartnerProfile.full_name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{activePartnerProfile.headline}</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      You are connected on SignTap. Messages are instant and encrypted.
                    </p>
                  </div>

                  {/* Messages Bubble List */}
                  {messages.map((msg) => {
                    const isMe = msg.sender_id === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[78%] sm:max-w-[70%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                            isMe
                              ? 'bg-[#0A66C2] text-white rounded-tr-xs'
                              : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-slate-400">
                          <span>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMe && (
                            msg.read ? (
                              <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                            ) : (
                              <Check className="w-3.5 h-3.5 text-slate-400" />
                            )
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 bg-white border-t border-slate-200">
                  {attachedImage && (
                    <div className="relative inline-block mb-2 p-1 bg-slate-100 rounded-lg border border-slate-300">
                      <img src={attachedImage} alt="Attach" className="w-16 h-16 object-cover rounded" />
                      <button
                        onClick={() => setAttachedImage(null)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                    <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-300 focus-within:border-[#0A66C2] focus-within:bg-white transition-all px-3 py-1.5 flex items-center gap-2">
                      <textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Write a message..."
                        rows={1}
                        className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-none max-h-24"
                      />

                      <label className="p-1 text-slate-500 hover:text-[#0A66C2] cursor-pointer shrink-0">
                        <ImageIcon className="w-4 h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageAttachment}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={!inputMessage.trim() && !attachedImage}
                      className="p-2.5 rounded-full bg-[#0A66C2] disabled:opacity-50 text-white hover:bg-blue-700 transition-colors shrink-0 shadow-xs cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <MessageSquare className="w-16 h-16 text-slate-200 mb-3" />
                <h3 className="font-bold text-slate-700 text-base">Select a Conversation</h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Choose an active chat from the left panel or click "Message" on any professional's profile to connect.
                </p>
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-[#F4F2EE] flex items-center justify-center text-slate-500 text-sm font-semibold">
        <LinkedInNavbar />
        <span>Loading SignTap Messaging...</span>
      </div>
    }>
      <MessagesContent />
    </React.Suspense>
  );
}
