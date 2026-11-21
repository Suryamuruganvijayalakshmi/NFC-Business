'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  getCurrentUser, 
  getAllProfiles, 
  getMessagesBetween, 
  sendMessage, 
  getConversationsForUser, 
  markMessagesAsRead,
  getUnreadMessageCount 
} from '@/lib/store';
import { Profile, ChatMessage, ChatConversation, UserSession } from '@/lib/types';
import { 
  MessageSquare, 
  ChevronUp, 
  ChevronDown, 
  X, 
  Send, 
  Search, 
  User, 
  Check, 
  CheckCheck,
  Minimize2,
  Maximize2,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';

interface LinkedInChatWidgetProps {
  initialTargetUser?: Profile | null;
  isOpenExplicit?: boolean;
  onCloseExplicit?: () => void;
}

export default function LinkedInChatWidget({
  initialTargetUser,
  isOpenExplicit,
  onCloseExplicit,
}: LinkedInChatWidgetProps) {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeConversationUser, setActiveConversationUser] = useState<Profile | null>(null);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load user & conversations
  const refreshChat = () => {
    const user = getCurrentUser();
    setCurrentUser(user);
    if (user) {
      const convs = getConversationsForUser(user.id);
      setConversations(convs);
      setUnreadCount(getUnreadMessageCount(user.id));
    }
    setAllProfiles(getAllProfiles());
  };

  useEffect(() => {
    refreshChat();
  }, []);

  // Handle opening directly with a target user (e.g. from profile "Message" button)
  useEffect(() => {
    if (initialTargetUser) {
      setActiveConversationUser(initialTargetUser);
      setIsExpanded(true);
    }
  }, [initialTargetUser]);

  useEffect(() => {
    if (isOpenExplicit) {
      setIsExpanded(true);
    }
  }, [isOpenExplicit]);

  // Load messages whenever active conversation user changes
  useEffect(() => {
    if (currentUser && activeConversationUser) {
      const msgs = getMessagesBetween(currentUser.id, activeConversationUser.user_id || activeConversationUser.id);
      setMessages(msgs);
      markMessagesAsRead(currentUser.id, activeConversationUser.user_id || activeConversationUser.id);
      setUnreadCount(getUnreadMessageCount(currentUser.id));
      scrollToBottom();
    }
  }, [currentUser, activeConversationUser]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUser || !activeConversationUser) return;

    sendMessage(currentUser, activeConversationUser, inputText.trim());
    setInputText('');
    
    // Refresh conversation thread
    const updatedMsgs = getMessagesBetween(currentUser.id, activeConversationUser.user_id || activeConversationUser.id);
    setMessages(updatedMsgs);
    refreshChat();
    scrollToBottom();
  };

  const handleSelectConversation = (otherId: string) => {
    const target = allProfiles.find(p => p.user_id === otherId || p.id === otherId);
    if (target) {
      setActiveConversationUser(target);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="fixed bottom-0 right-4 sm:right-8 z-50 flex flex-col items-end pointer-events-none">
      
      {/* Container wrapper */}
      <div className="w-80 sm:w-96 bg-white border border-slate-300 rounded-t-2xl shadow-2xl overflow-hidden pointer-events-auto transition-all duration-200">
        
        {/* Top Header Bar (LinkedIn Style) */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-12 bg-white px-3.5 flex items-center justify-between border-b border-slate-200 cursor-pointer select-none hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-7 h-7 rounded-full bg-[#087CF0] text-white flex items-center justify-center font-bold text-xs">
                {currentUser.user_metadata?.full_name?.charAt(0) || 'M'}
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800">Messaging</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#087CF0] text-white text-[10px] font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 hover:text-slate-600" />
            ) : (
              <ChevronUp className="w-4 h-4 hover:text-slate-600" />
            )}
          </div>
        </div>

        {/* Expanded Body Drawer */}
        {isExpanded && (
          <div className="h-96 flex flex-col bg-white">
            
            {/* If an active conversation is open */}
            {activeConversationUser ? (
              <div className="flex flex-col h-full">
                
                {/* Conversation Header */}
                <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      onClick={() => setActiveConversationUser(null)}
                      className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60"
                      title="Back to all conversations"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>

                    <div className="w-7 h-7 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-xs text-slate-700">
                      {activeConversationUser.profile_image ? (
                        <img src={activeConversationUser.profile_image} alt={activeConversationUser.full_name} className="w-full h-full object-cover" />
                      ) : (
                        activeConversationUser.full_name?.charAt(0) || 'U'
                      )}
                    </div>

                    <div className="min-w-0 leading-tight">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {activeConversationUser.full_name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {activeConversationUser.headline || activeConversationUser.title || 'SignTap Professional'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveConversationUser(null)}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Message Thread Scroll Area */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-slate-50/40">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400">
                      <MessageSquare className="w-8 h-8 text-slate-300 mb-2" />
                      <p className="text-xs font-semibold text-slate-600">No messages yet</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Send a message to start networking with {activeConversationUser.full_name}.
                      </p>
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isMe = m.sender_id === currentUser.id;
                      return (
                        <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <div 
                            className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-xs ${
                              isMe 
                                ? 'bg-[#087CF0] text-white rounded-br-xs' 
                                : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                            }`}
                          >
                            <p className="whitespace-pre-line">{m.content}</p>
                          </div>
                          <span className="text-[9px] text-slate-400 mt-0.5 px-1 font-mono">
                            {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Send Message Input Bar */}
                <form onSubmit={handleSendMessage} className="p-2 border-t border-slate-200 bg-white flex items-center gap-1.5">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Message ${activeConversationUser.full_name?.split(' ')[0]}...`}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#087CF0]"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="p-2 rounded-xl bg-[#087CF0] hover:bg-[#0668cc] text-white disabled:opacity-40 transition-all shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

              </div>
            ) : (
              // Conversation List View
              <div className="flex flex-col h-full">
                
                {/* Search Bar */}
                <div className="p-2 border-b border-slate-200 bg-slate-50">
                  <div className="flex items-center bg-white rounded-xl px-2.5 py-1.5 border border-slate-200 text-xs">
                    <Search className="w-3.5 h-3.5 text-slate-400 mr-2 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Search messages or people..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent w-full text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Conversations / People List */}
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                  {searchQuery ? (
                    // Search Results of People
                    allProfiles
                      .filter(p => p.user_id !== currentUser.id && (p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.username?.toLowerCase().includes(searchQuery.toLowerCase())))
                      .map(p => (
                        <div
                          key={p.id}
                          onClick={() => setActiveConversationUser(p)}
                          className="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-xs text-slate-700">
                              {p.profile_image ? (
                                <img src={p.profile_image} alt={p.full_name} className="w-full h-full object-cover" />
                              ) : (
                                p.full_name?.charAt(0) || 'U'
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">{p.full_name}</p>
                              <p className="text-[10px] text-slate-400 truncate">{p.headline || p.title}</p>
                            </div>
                          </div>
                          <button className="text-[10px] font-bold text-[#087CF0] px-2 py-0.5 rounded bg-blue-50">
                            Chat
                          </button>
                        </div>
                      ))
                  ) : conversations.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 space-y-1">
                      <p className="text-xs font-semibold text-slate-600">No active conversations</p>
                      <p className="text-[11px] text-slate-400">Search for professionals to send a direct message.</p>
                    </div>
                  ) : (
                    conversations.map((c) => (
                      <div
                        key={c.participant_id}
                        onClick={() => handleSelectConversation(c.participant_id)}
                        className="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative flex-shrink-0">
                            <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-bold text-xs text-slate-700">
                              {c.participant_avatar ? (
                                <img src={c.participant_avatar} alt={c.participant_name} className="w-full h-full object-cover" />
                              ) : (
                                c.participant_name?.charAt(0) || 'U'
                              )}
                            </div>
                            {c.unread_count > 0 && (
                              <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-[#087CF0] ring-2 ring-white" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`text-xs truncate ${c.unread_count > 0 ? 'font-bold text-slate-900' : 'font-semibold text-slate-800'}`}>
                                {c.participant_name}
                              </p>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate leading-snug">
                              {c.last_message || 'Start conversation'}
                            </p>
                          </div>
                        </div>

                        {c.last_message_time && (
                          <span className="text-[9px] text-slate-400 font-mono ml-2 flex-shrink-0">
                            {new Date(c.last_message_time).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
