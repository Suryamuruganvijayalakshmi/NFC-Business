'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { 
  getCurrentUser,
  getAllProfiles, 
  getAllNFCCards, 
  getAllOrders,
  getAllProducts,
  getAdminActivities,
  saveNFCCard, 
  saveProfile,
  updateOrderStatus,
  updateOrderPaymentStatus,
  updateProductPrice,
  updateProfileVisibility,
  updateNFCCardStatus,
  issueNewNFCCard,
  createOrder,
  logAdminActivity,
  logoutUser,
  getAllPosts,
  deletePost,
  deleteProfile,
  toggleProfilePremium,
  isSuperAdminUser
} from '@/lib/store';
import { Profile, NFCCard, Order, Product, AdminActivity, OrderStatus, PostItem } from '@/lib/types';
import { 
  ShieldCheck, 
  Users, 
  Wifi, 
  BarChart3, 
  Search, 
  Plus, 
  CheckCircle2, 
  ExternalLink,
  Lock,
  Database,
  ArrowRight,
  Package,
  DollarSign,
  TrendingUp,
  Tag,
  KeyRound,
  Eye,
  EyeOff,
  Truck,
  Check,
  AlertCircle,
  LogOut,
  RefreshCw,
  Clock,
  Radio,
  ShieldAlert,
  Edit2,
  Trash2,
  Crown,
  Newspaper,
  Heart,
  MessageSquare
} from 'lucide-react';

export default function AdminConsolePage() {
  const router = useRouter();

  // Authentication check
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'orders' | 'cards' | 'profiles' | 'posts' | 'products' | 'activity'>('overview');

  // Core Data
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [cards, setCards] = useState<NFCCard[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [allPosts, setAllPosts] = useState<PostItem[]>([]);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [profileSearch, setProfileSearch] = useState('');
  const [postSearch, setPostSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals & Sub-forms
  const [showIssueCardModal, setShowIssueCardModal] = useState(false);
  const [newCardUID, setNewCardUID] = useState('');
  const [newCardOwnerProfileId, setNewCardOwnerProfileId] = useState('');
  const [newCardName, setNewCardName] = useState('');

  // Edit Price Modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newPriceInput, setNewPriceInput] = useState<number>(0);

  // Tracking Number Input State
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    const user = getCurrentUser();
    // Strictly restricted to vmsurya2007@gmail.com and signbridge.aiauto@gmail.com
    if (!isSuperAdminUser(user)) {
      router.push('/dashboard');
      return;
    }
    setCurrentUser(user);

    refreshData();
  }, [router]);

  const refreshData = () => {
    setProfiles(getAllProfiles());
    setCards(getAllNFCCards());
    setOrders(getAllOrders());
    setProducts(getAllProducts());
    setActivities(getAdminActivities());
    setAllPosts(getAllPosts());
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDeletePost = (postId: string) => {
    if (confirm('Are you sure you want to permanently delete this post?')) {
      deletePost(postId);
      refreshData();
      showToast('Post removed successfully.');
    }
  };

  const handleDeleteProfile = (profileId: string, name: string) => {
    if (confirm(`Are you sure you want to delete profile for "${name}"? This action cannot be undone.`)) {
      deleteProfile(profileId);
      refreshData();
      showToast(`Profile for ${name} deleted.`);
    }
  };

  const handleTogglePremium = (profileId: string) => {
    toggleProfilePremium(profileId);
    refreshData();
    showToast('Updated SignTap Premium status (₹1,000/yr).');
  };

  // 1. Metric Calculations
  const totalCustomers = profiles.length;
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'order_received' || o.status === 'payment_pending').length;
  const activeCardsCount = cards.filter(c => c.status === 'activated' || c.status === 'active').length;
  const totalRevenue = orders
    .filter(o => o.payment_status === 'verified')
    .reduce((acc, curr) => acc + (curr.total_amount || 0), 0);

  // 2. Order Management Handlers
  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    const tracking = trackingInputs[orderId];
    updateOrderStatus(orderId, newStatus, tracking);
    refreshData();
    showToast(`Order status updated to ${newStatus.replace('_', ' ')}`);
  };

  const handleVerifyPayment = (orderId: string) => {
    updateOrderPaymentStatus(orderId, 'verified');
    refreshData();
    showToast(`Manual payment verified for order ${orderId}!`);
  };

  // 3. Card Management Handlers
  const handleIssueCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardUID.trim() || !newCardOwnerProfileId) return;

    const targetProfile = profiles.find(p => p.id === newCardOwnerProfileId);
    if (!targetProfile) return;

    issueNewNFCCard(
      newCardUID.trim().toUpperCase(),
      targetProfile.user_id,
      targetProfile.id,
      newCardName.trim() || `${targetProfile.full_name}'s Provisioned Smart Card`
    );

    refreshData();
    setShowIssueCardModal(false);
    setNewCardUID('');
    setNewCardName('');
    showToast(`Card ${newCardUID.toUpperCase()} successfully issued and assigned to ${targetProfile.full_name}`);
  };

  const handleToggleCardStatus = (card: NFCCard) => {
    const nextStatus = card.status === 'activated' || card.status === 'active' ? 'inactive' : 'activated';
    updateNFCCardStatus(card.id, nextStatus);
    refreshData();
    showToast(`Card ${card.card_uid} is now ${nextStatus}`);
  };

  const handleBlockCard = (card: NFCCard) => {
    updateNFCCardStatus(card.id, 'blocked');
    refreshData();
    showToast(`Card ${card.card_uid} has been marked as BLOCKED`);
  };

  // 4. Product Price Handler
  const handleSavePrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProductPrice(editingProduct.id, Number(newPriceInput));
    refreshData();
    setEditingProduct(null);
    showToast(`Price for ${editingProduct.name} updated to $${newPriceInput}`);
  };

  // 5. Profile Visibility Handler
  const handleToggleProfilePublish = (profileId: string, currentPublished: boolean) => {
    updateProfileVisibility(profileId, !currentPublished);
    refreshData();
    showToast(`Profile visibility toggled to ${!currentPublished ? 'Published' : 'Unpublished'}`);
  };

  const handleLogout = () => {
    logoutUser();
    router.push('/admin/login');
  };

  // Filters
  const filteredProfiles = profiles.filter(p => 
    p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter(o => {
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchesSearch = o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.customer_email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFD] text-slate-800 font-sans">
      
      {/* Toast Notice */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 p-4 rounded-2xl bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-8 h-18 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <Logo theme="light" size="sm" />
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#087CF0]/10 text-[#087CF0] border border-[#087CF0]/20 text-[10px] font-mono font-bold uppercase tracking-wider">
            Super Admin Console
          </span>
        </div>

        {/* Tab Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'profiles', label: 'Profiles & Users', icon: Eye },
            { id: 'posts', label: 'Feed & Posts', icon: Newspaper, badge: allPosts.length > 0 ? allPosts.length : null },
            { id: 'orders', label: 'Orders', icon: Package, badge: pendingOrdersCount > 0 ? pendingOrdersCount : null },
            { id: 'cards', label: 'NFC Cards', icon: Wifi },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'products', label: 'Products & Pricing', icon: Tag },
            { id: 'activity', label: 'Audit Log', icon: Clock },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#087CF0] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#FF7900] text-white text-[10px] font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Admin User Info & Sign Out */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex flex-col text-right leading-none">
            <span className="text-xs font-bold text-slate-900">{currentUser?.email}</span>
            <span className="text-[10px] text-emerald-600 font-mono mt-0.5">Master Administrator</span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition-colors"
            title="Sign Out of Admin Console"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-8">
        
        {/* ===================================================================
            TAB 1: OVERVIEW DASHBOARD
        =================================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Header Banner */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-[#087CF0] font-bold uppercase tracking-wider">
                  Platform Telemetries
                </span>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
                  <span>SignTap Platform Administration</span>
                  <ShieldCheck className="w-6 h-6 text-[#087CF0]" />
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                  Manage registered digital identities, manual order payment verifications, and physical NFC hardware provisioning.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setShowIssueCardModal(true)}
                  className="py-2.5 px-4 rounded-xl bg-[#087CF0] hover:bg-[#0668cc] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Issue NFC Card</span>
                </button>

                <button
                  onClick={refreshData}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors"
                  title="Refresh Telemetry"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 5 Core Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              
              {/* Total Customers */}
              <div 
                onClick={() => setActiveTab('customers')}
                className="cursor-pointer p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#087CF0]/40 shadow-xs transition-all"
              >
                <div className="flex items-center justify-between text-slate-500 text-xs">
                  <span className="font-bold uppercase tracking-wider">Total Customers</span>
                  <Users className="w-4 h-4 text-[#087CF0]" />
                </div>
                <p className="text-3xl font-extrabold text-slate-900 mt-3 font-sans">{totalCustomers}</p>
                <p className="text-[11px] text-slate-400 mt-1">Registered users</p>
              </div>

              {/* Total Orders */}
              <div 
                onClick={() => setActiveTab('orders')}
                className="cursor-pointer p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#087CF0]/40 shadow-xs transition-all"
              >
                <div className="flex items-center justify-between text-slate-500 text-xs">
                  <span className="font-bold uppercase tracking-wider">Total Orders</span>
                  <Package className="w-4 h-4 text-purple-500" />
                </div>
                <p className="text-3xl font-extrabold text-slate-900 mt-3 font-sans">{totalOrdersCount}</p>
                <p className="text-[11px] text-slate-400 mt-1">Lifetime customer orders</p>
              </div>

              {/* Pending Orders */}
              <div 
                onClick={() => setActiveTab('orders')}
                className="cursor-pointer p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#FF7900]/40 shadow-xs transition-all"
              >
                <div className="flex items-center justify-between text-slate-500 text-xs">
                  <span className="font-bold uppercase tracking-wider">Pending Orders</span>
                  <Clock className="w-4 h-4 text-[#FF7900]" />
                </div>
                <p className="text-3xl font-extrabold text-[#FF7900] mt-3 font-sans">{pendingOrdersCount}</p>
                <p className="text-[11px] text-slate-400 mt-1">Requires manual review</p>
              </div>

              {/* Active NFC Cards */}
              <div 
                onClick={() => setActiveTab('cards')}
                className="cursor-pointer p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-500/40 shadow-xs transition-all"
              >
                <div className="flex items-center justify-between text-slate-500 text-xs">
                  <span className="font-bold uppercase tracking-wider">Active Cards</span>
                  <Wifi className="w-4 h-4 text-emerald-500 rotate-90" />
                </div>
                <p className="text-3xl font-extrabold text-emerald-600 mt-3 font-sans">{activeCardsCount}</p>
                <p className="text-[11px] text-slate-400 mt-1">Provisioned & linked</p>
              </div>

              {/* Total Revenue */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs">
                  <span className="font-bold uppercase tracking-wider">Recorded Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-3xl font-extrabold text-slate-900 mt-3 font-sans">${totalRevenue}.00</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">Verified payments</p>
              </div>

            </div>

            {/* Recent Orders Overview */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900">Recent Customer Orders</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-semibold text-[#087CF0] hover:underline"
                >
                  View all orders &rarr;
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="text-[10px] uppercase font-mono tracking-wider text-slate-500 border-b border-slate-200/80 bg-slate-50/70">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4 text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.slice(0, 5).map(ord => (
                      <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{ord.order_number}</td>
                        <td className="py-3.5 px-4 font-medium text-slate-700">{ord.customer_name}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">${ord.total_amount}.00</td>
                        <td className="py-3.5 px-4 capitalize">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 font-mono text-[10px] text-slate-700">
                            {ord.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ord.payment_status === 'verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {ord.payment_status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {ord.payment_status === 'pending' && (
                            <button
                              onClick={() => handleVerifyPayment(ord.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-[11px] font-semibold transition-colors"
                            >
                              Verify Payment
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ===================================================================
            TAB 2: CUSTOMER MANAGEMENT
        =================================================================== */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Customer Management</h2>
                <p className="text-xs text-slate-500">Search and oversee all registered customer profiles and hardware links.</p>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, or username..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                />
              </div>
            </div>

            {/* Customers Table */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="text-[10px] uppercase font-mono tracking-wider text-slate-500 border-b border-slate-200/80 bg-slate-50/70">
                  <tr>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Username & URL</th>
                    <th className="py-3 px-4">Title & Company</th>
                    <th className="py-3 px-4">Assigned NFC Cards</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProfiles.map(prof => {
                    const userCards = cards.filter(c => c.profile_id === prof.id || c.owner_user_id === prof.user_id);
                    return (
                      <tr key={prof.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prof.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                              alt={prof.full_name}
                              className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200"
                            />
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{prof.full_name}</p>
                              <p className="text-slate-500 text-[11px]">{prof.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-[#087CF0]">
                          <a 
                            href={`/u/${prof.username}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="hover:underline flex items-center gap-1 font-semibold"
                          >
                            <span>/u/{prof.username}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>

                        <td className="py-3.5 px-4">
                          <p className="font-medium text-slate-800">{prof.title || 'Pioneer'}</p>
                          <p className="text-[11px] text-[#FF7900] font-semibold">{prof.company || prof.business_name || 'Individual'}</p>
                        </td>

                        <td className="py-3.5 px-4">
                          {userCards.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {userCards.map(c => (
                                <span key={c.id} className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 font-mono text-[10px] text-emerald-700 font-bold">
                                  {c.card_uid}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">No cards assigned</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            prof.published ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {prof.published ? 'Published' : 'Private'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleToggleProfilePublish(prof.id, prof.published)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                          >
                            {prof.published ? 'Unpublish' : 'Publish'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 3: ORDERS MANAGEMENT
        =================================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Orders Management</h2>
                <p className="text-xs text-slate-500">Review orders, verify manual payments, and update production statuses.</p>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: 'All Orders' },
                  { id: 'payment_pending', label: 'Payment Pending' },
                  { id: 'confirmed', label: 'Confirmed' },
                  { id: 'in_production', label: 'In Production' },
                  { id: 'shipped', label: 'Shipped' },
                  { id: 'delivered', label: 'Delivered' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setOrderStatusFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      orderStatusFilter === f.id
                        ? 'bg-[#087CF0] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="text-[10px] uppercase font-mono tracking-wider text-slate-500 border-b border-slate-200/80 bg-slate-50/70">
                  <tr>
                    <th className="py-3 px-4">Order Ref</th>
                    <th className="py-3 px-4">Customer Details</th>
                    <th className="py-3 px-4">Items & Customization</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status Workflow</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map(ord => (
                    <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                      
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {ord.order_number}
                        <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                          {new Date(ord.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{ord.customer_name}</p>
                        <p className="text-slate-500 text-[11px]">{ord.customer_email}</p>
                        <p className="text-slate-400 text-[10px]">{ord.shipping_address.city}, {ord.shipping_address.country}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        {ord.items.map((item, i) => (
                          <div key={i} className="text-slate-700">
                            <span className="font-semibold text-slate-900">{item.product_name}</span> ({item.quantity}x)
                            {item.custom_name_to_print && (
                              <p className="text-[10px] text-[#087CF0] font-semibold">Engrave: &ldquo;{item.custom_name_to_print}&rdquo;</p>
                            )}
                          </div>
                        ))}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        ${ord.total_amount}.00
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ord.payment_status === 'verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {ord.payment_status}
                          </span>
                          {ord.payment_status === 'pending' && (
                            <div>
                              <button
                                onClick={() => handleVerifyPayment(ord.id)}
                                className="mt-1 px-2 py-0.5 rounded bg-emerald-600 text-white font-semibold text-[10px] hover:bg-emerald-700 transition-colors"
                              >
                                Verify Payment
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateStatus(ord.id, e.target.value as OrderStatus)}
                          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#087CF0]"
                        >
                          <option value="order_received">Order Received</option>
                          <option value="payment_pending">Payment Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="in_production">In Production</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {ord.status === 'shipped' && !ord.tracking_number && (
                          <div className="flex items-center gap-1 justify-end">
                            <input
                              type="text"
                              placeholder="Tracking #"
                              value={trackingInputs[ord.id] || ''}
                              onChange={(e) => setTrackingInputs({ ...trackingInputs, [ord.id]: e.target.value })}
                              className="px-2 py-1 rounded bg-slate-50 border border-slate-200 text-[10px] w-24 text-slate-800"
                            />
                            <button
                              onClick={() => handleUpdateStatus(ord.id, 'shipped')}
                              className="px-2 py-1 rounded bg-[#087CF0] text-white text-[10px] font-bold"
                            >
                              Save
                            </button>
                          </div>
                        )}
                        {ord.tracking_number && (
                          <span className="font-mono text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                            {ord.tracking_number}
                          </span>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 4: NFC CARD MANAGEMENT
        =================================================================== */}
        {activeTab === 'cards' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">NFC Hardware Registry</h2>
                <p className="text-xs text-slate-500">Oversee physical chip assignments, activate/deactivate cards, and block lost tags.</p>
              </div>

              <button
                onClick={() => setShowIssueCardModal(true)}
                className="py-2.5 px-4 rounded-xl bg-[#087CF0] hover:bg-[#0668cc] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Issue & Assign Card</span>
              </button>
            </div>

            {/* Cards Table */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="text-[10px] uppercase font-mono tracking-wider text-slate-500 border-b border-slate-200/80 bg-slate-50/70">
                  <tr>
                    <th className="py-3 px-4">Card UID</th>
                    <th className="py-3 px-4">Card Name</th>
                    <th className="py-3 px-4">Activation Code</th>
                    <th className="py-3 px-4">Assigned Profile</th>
                    <th className="py-3 px-4">Tap Count</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cards.map(card => {
                    const assignedProfile = profiles.find(p => p.id === card.profile_id);
                    return (
                      <tr key={card.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          {card.card_uid}
                        </td>

                        <td className="py-3.5 px-4 font-medium text-slate-700">
                          {card.card_name}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-amber-700 font-semibold">
                          {card.activation_code || 'N/A'}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-[#087CF0]">
                          {assignedProfile ? (
                            <a href={`/u/${assignedProfile.username}`} target="_blank" rel="noopener noreferrer" className="hover:underline font-semibold">
                              /u/{assignedProfile.username} ({assignedProfile.full_name})
                            </a>
                          ) : (
                            <span className="text-slate-400 italic">Unassigned</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-bold text-emerald-700 font-mono">
                          {card.tap_count || 0}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            card.status === 'activated' || card.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : card.status === 'blocked'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {card.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right space-x-2">
                          <a
                            href={`/t/${card.card_uid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                          >
                            Test Tap
                          </a>

                          <button
                            onClick={() => handleToggleCardStatus(card)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                          >
                            {card.status === 'activated' || card.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>

                          {card.status !== 'blocked' && (
                            <button
                              onClick={() => handleBlockCard(card)}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-semibold transition-colors"
                            >
                              Block
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 5: PROFILES MANAGEMENT
        =================================================================== */}
        {activeTab === 'profiles' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Digital Profiles &amp; Users Management</h2>
                <p className="text-xs text-slate-500">Moderate public visibility, grant/revoke Premium (₹1,000/yr), and audit user accounts.</p>
              </div>

              <div className="flex items-center bg-white border border-slate-200/80 rounded-xl px-3 py-2 w-full sm:w-72 shadow-2xs">
                <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by name or username..."
                  value={profileSearch}
                  onChange={(e) => setProfileSearch(e.target.value)}
                  className="bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles
                .filter(p => !profileSearch || p.full_name?.toLowerCase().includes(profileSearch.toLowerCase()) || p.username?.toLowerCase().includes(profileSearch.toLowerCase()) || p.email?.toLowerCase().includes(profileSearch.toLowerCase()))
                .map(prof => (
                <div key={prof.id} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-[#087CF0]/40 transition-all space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#087CF0] uppercase font-bold">
                        /u/{prof.username}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {prof.is_premium && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-300 flex items-center gap-1">
                            <Crown className="w-3 h-3 fill-amber-500" />
                            <span>PREMIUM</span>
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          prof.published ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {prof.published ? 'Published' : 'Private'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {prof.profile_image ? (
                        <img
                          src={prof.profile_image}
                          alt={prof.full_name}
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#087CF0] to-[#FF7900] flex items-center justify-center text-white font-bold text-sm">
                          {prof.full_name?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 text-base truncate flex items-center gap-1.5">
                          <span>{prof.full_name}</span>
                          {prof.is_premium && <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />}
                        </h4>
                        <p className="text-xs text-slate-500 truncate">{prof.headline || prof.title}</p>
                        <p className="text-[11px] text-[#FF7900] font-semibold truncate">{prof.company || prof.email}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {prof.about || prof.bio || 'No biography provided.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <a
                        href={`/u/${prof.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#087CF0] hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Preview Profile</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => handleToggleProfilePublish(prof.id, prof.published)}
                        className="py-1 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors"
                      >
                        {prof.published ? 'Set Private' : 'Set Public'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                      <button
                        onClick={() => handleTogglePremium(prof.id)}
                        className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors ${
                          prof.is_premium
                            ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <Crown className="w-3 h-3" />
                        <span>{prof.is_premium ? 'Revoke Premium' : 'Grant Premium'}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteProfile(prof.id, prof.full_name)}
                        className="p-1 px-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold flex items-center gap-1 transition-colors"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 6: POSTS & FEED MODERATION
        =================================================================== */}
        {activeTab === 'posts' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Posts &amp; Community Moderation</h2>
                <p className="text-xs text-slate-500">
                  Inspect and purge community posts, milestones, or announcements across all accounts.
                </p>
              </div>

              <div className="flex items-center bg-white border border-slate-200/80 rounded-xl px-3 py-2 w-full sm:w-64 shadow-2xs">
                <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Filter posts or authors..."
                  value={postSearch}
                  onChange={(e) => setPostSearch(e.target.value)}
                  className="bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none w-full"
                />
              </div>
            </div>

            {allPosts.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white border border-slate-200/80 space-y-2">
                <Newspaper className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No Posts Found</h3>
                <p className="text-xs text-slate-500">No active posts are published across the platform.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allPosts
                  .filter(p => !postSearch || p.content.toLowerCase().includes(postSearch.toLowerCase()) || p.author_name.toLowerCase().includes(postSearch.toLowerCase()))
                  .map(post => (
                    <div key={post.id} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-[#087CF0]/40 transition-all space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#087CF0]/10 text-[#087CF0] flex items-center justify-center font-bold text-xs">
                              {post.author_name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">{post.author_name}</p>
                              <p className="text-[10px] text-slate-400">@{post.author_username}</p>
                            </div>
                          </div>

                          <span className="text-[10px] font-mono text-slate-400">
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 leading-relaxed line-clamp-3">
                          {post.content}
                        </p>

                        {post.media_url && (
                          <div className="h-28 rounded-xl overflow-hidden border border-slate-200">
                            <img src={post.media_url} alt="Post attachment" className="w-full h-full object-cover" />
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5 text-rose-500" />
                            <span>{post.likes_count || 0}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                            <span>{post.comments_count || 0}</span>
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <a
                          href={`/u/${post.author_username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#087CF0] hover:underline flex items-center gap-1 font-semibold"
                        >
                          <span>Author Profile</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="py-1 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Post</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 7: PRODUCT MANAGEMENT & DYNAMIC PRICING
        =================================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Product Catalogue & Dynamic Pricing</h2>
              <p className="text-xs text-slate-500">
                Configure prices and hardware descriptions. Updates directly sync to the public homepage and order flow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(prod => (
                <div key={prod.id} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-[#087CF0]/40 transition-all space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#087CF0] bg-blue-50 px-2 py-0.5 rounded-md">
                        {prod.category}
                      </span>
                      <span className="text-xs font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">In Stock</span>
                    </div>

                    <h3 className="font-bold text-lg text-slate-900">{prod.name}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{prod.short_description}</p>
                    <p className="text-[11px] text-slate-400 font-mono">Material: {prod.material}</p>

                    <div className="pt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900 font-sans">${prod.price}</span>
                      <span className="text-xs text-slate-500 font-mono uppercase">{prod.currency}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setEditingProduct(prod);
                        setNewPriceInput(prod.price);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#087CF0] hover:bg-[#0668cc] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Configure Price</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 8: AUDIT LOG
        =================================================================== */}
        {activeTab === 'activity' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Administrative Audit Log</h2>
              <p className="text-xs text-slate-500">Timestamped record of administrative actions, card issuances, and order verifications.</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs divide-y divide-slate-100">
              {activities.map((act) => (
                <div key={act.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{act.action}</span>
                      <span className="px-2 py-0.2 rounded-full bg-slate-100 border border-slate-200 text-[10px] text-slate-600 font-mono">
                        {act.admin_email}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs">{act.details}</p>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* MODAL: Issue NFC Card */}
      {showIssueCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Wifi className="w-5 h-5 text-[#087CF0] rotate-90" />
                <span>Issue & Provision NFC Card</span>
              </h3>
              <button
                onClick={() => setShowIssueCardModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIssueCardSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1">
                  Card UID / Token *
                </label>
                <input
                  type="text"
                  required
                  value={newCardUID}
                  onChange={(e) => setNewCardUID(e.target.value)}
                  placeholder="e.g. SB-NFC-9901"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1">
                  Assign to Customer Profile *
                </label>
                <select
                  required
                  value={newCardOwnerProfileId}
                  onChange={(e) => setNewCardOwnerProfileId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                >
                  <option value="">-- Choose Customer --</option>
                  {profiles.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.full_name} (@{p.username} - {p.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1">
                  Card Label / Name
                </label>
                <input
                  type="text"
                  value={newCardName}
                  onChange={(e) => setNewCardName(e.target.value)}
                  placeholder="e.g. Executive Titanium Card"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIssueCardModal(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-[#087CF0] hover:bg-[#0668cc] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Issue Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Configure Product Price */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Update Product Price</h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Editing price for <b className="text-slate-900">{editingProduct.name}</b>.
            </p>

            <form onSubmit={handleSavePrice} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1">
                  New Price in USD *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={newPriceInput}
                    onChange={(e) => setNewPriceInput(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087CF0]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-[#087CF0] hover:bg-[#0668cc] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Update Catalog Price
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
