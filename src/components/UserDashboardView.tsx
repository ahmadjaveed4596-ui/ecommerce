import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { ShoppingBag, Heart, ListOrdered, Receipt, User, HelpCircle, RefreshCw, Calendar, Truck, ArrowRight, Check, XCircle, Printer, Clock, Sparkles, DollarSign, X, LogOut } from 'lucide-react';

export const UserDashboardView: React.FC = () => {
  const { 
    products, 
    cart, 
    wishlist, 
    orders, 
    navigate, 
    toggleWishlist,
    addToCart,
    updateOrderStatus,
    user,
    loginUser,
    registerUser,
    logoutUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wishlist' | 'cart'>('overview');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [userToast, setUserToast] = useState<string | null>(null);

  // Authenticated signin forms state
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Wishlisted product instances
  const wishlistedProducts = useMemo(() => {
    return products.filter((p) => wishlist.includes(p.id));
  }, [products, wishlist]);

  // Total Lifetime Expenditures
  const lifetimeSpend = useMemo(() => {
    return orders.reduce((acc, order) => acc + order.total, 0);
  }, [orders]);

  // Find active viewing invoice
  const activeInvoice = useMemo(() => {
    if (!selectedInvoiceId) return null;
    return orders.find((o) => o.id === selectedInvoiceId) || null;
  }, [orders, selectedInvoiceId]);

  const userInitials = useMemo(() => {
    if (!user) return 'GC';
    const parts = user.name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  }, [user]);

  if (!user) {
    const handleAuthSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError(null);
      setAuthSuccess(null);
      setIsLoading(true);

      try {
        if (authMode === 'signin') {
          const ok = await loginUser(authEmail, authPassword);
          if (ok) {
            setAuthSuccess("Welcome back. Loading your bespoke wardrobe...");
          } else {
            setAuthError("Failed to authenticate. Please verify your email and password.");
          }
        } else {
          if (!authName.trim()) {
            setAuthError("Please provide your full styling name.");
            setIsLoading(false);
            return;
          }
          const ok = await registerUser(authName, authEmail, authPassword);
          if (ok) {
            setAuthSuccess("Accolade! Your luxury styling account has been registered.");
          } else {
            setAuthError("Registration failed. A client profile may already exist with this email.");
          }
        }
      } catch (err) {
        setAuthError("A database connection fault occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-brand-white border border-brand-neutral rounded-3xl shadow-xl space-y-6 text-left animate-fade-in font-sans">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase font-black tracking-[0.3em] text-brand-orange">
            Aura Global Styling Hub
          </span>
          <h2 className="text-2xl font-black text-brand-dark uppercase tracking-tight">
            {authMode === 'signin' ? 'Bespoke Sign In' : 'Create Member Account'}
          </h2>
          <p className="text-xs text-brand-dark/45 leading-relaxed">
            {authMode === 'signin' 
              ? 'Enter your couture credentials to view styling status and past purchases.' 
              : 'Sign up to register persistent wishlists, carts, and order details in PostgreSQL.'}
          </p>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex border-b border-brand-neutral">
          <button
            type="button"
            onClick={() => { setAuthMode('signin'); setAuthError(null); }}
            className={`flex-1 pb-3 text-xs font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
              authMode === 'signin' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-brand-dark/40 hover:text-brand-dark'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setAuthError(null); }}
            className={`flex-1 pb-3 text-xs font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
              authMode === 'signup' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-brand-dark/40 hover:text-brand-dark'
            }`}
          >
            Register
          </button>
        </div>

        {authError && (
          <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-xl font-sans">
            {authError}
          </div>
        )}

        {authSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold rounded-xl font-sans">
            {authSuccess}
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {authMode === 'signup' && (
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-black tracking-widest text-brand-dark/60 block">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Charlotte Vane"
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
                className="w-full px-4 py-3 border border-brand-neutral rounded-xl text-xs bg-brand-neutral/10 text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange placeholder:text-brand-dark/20"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-black tracking-widest text-brand-dark/60 block">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="member@aura-luxury.com"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              className="w-full px-4 py-3 border border-brand-neutral rounded-xl text-xs bg-brand-neutral/30 text-brand-dark focus:outline-none focus:focus:ring-1 focus:ring-brand-orange focus:border-brand-orange placeholder:text-brand-dark/30"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-black tracking-widest text-brand-dark/60 block">
              Secure Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              className="w-full px-4 py-3 border border-brand-neutral rounded-xl text-xs bg-brand-neutral/30 text-brand-dark focus:outline-none focus:focus:ring-1 focus:ring-brand-orange focus:border-brand-orange placeholder:text-brand-dark/30"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-brand-dark hover:bg-brand-orange text-brand-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-brand-orange/15 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'Establishing Identity...' : authMode === 'signin' ? 'Sign In To Hub' : 'Register Bespoke Sizing'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-[10px] text-brand-dark/45 leading-normal">
            Your connection details are protected in PostgreSQL database backed by Insforge servers. Secure, private checkout is assured.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 font-sans">
      
      {/* Dashboard Headline Profile banner */}
      <div className="bg-brand-dark rounded-3xl p-6 sm:p-8 text-brand-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-xl relative overflow-hidden text-left">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-orange/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-brand-orange text-brand-white rounded-full flex items-center justify-center font-black text-xl uppercase shadow-md shrink-0">
            {userInitials}
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold tracking-tight uppercase">Welcome, {user.name}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-brand-white/10 rounded-full text-brand-orange border border-brand-orange/20">Active Member</span>
              <button 
                onClick={logoutUser}
                className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-1 text-brand-neutral hover:text-brand-orange underline underline-offset-2 transition-all cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Life summary metrics indicators */}
        <div className="flex items-center gap-6 divide-x divide-brand-neutral/20 text-left bg-brand-neutral/5 p-4 rounded-2xl border border-brand-neutral/10">
          <div className="space-y-0.5 pl-0">
            <span className="text-[9px] uppercase font-bold tracking-widest text-brand-neutral/40">Total Spent</span>
            <div className="text-sm font-black text-brand-orange font-mono">${lifetimeSpend}</div>
          </div>
          <div className="space-y-0.5 pl-5">
            <span className="text-[9px] uppercase font-bold tracking-widest text-brand-neutral/40">Orders placed</span>
            <div className="text-sm font-black text-brand-white font-mono">{orders.length}</div>
          </div>
          <div className="space-y-0.5 pl-5">
            <span className="text-[9px] uppercase font-bold tracking-widest text-brand-neutral/40">Wishlist Size</span>
            <div className="text-sm font-black text-brand-orange/90 font-mono">{wishlist.length}</div>
          </div>
        </div>
      </div>

      {/* Main layout: left tab sidebar - right actions pane */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Navigation tabs column */}
        <div className="md:col-span-3 flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => { setActiveTab('overview'); setSelectedInvoiceId(null); }}
            className={`flex items-center gap-2.5 px-4 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all whitespace-nowrap cursor-pointer w-full text-left ${
              activeTab === 'overview'
                ? 'bg-brand-orange text-brand-white shadow border-transparent'
                : 'text-brand-dark/50 hover:bg-brand-neutral'
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            Dashboard Overview
          </button>
          
          <button
            id="tab-purchased-orders"
            onClick={() => { setActiveTab('orders'); setSelectedInvoiceId(null); }}
            className={`flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all whitespace-nowrap cursor-pointer w-full text-left ${
              activeTab === 'orders'
                ? 'bg-brand-orange text-brand-white shadow border-transparent'
                : 'text-brand-dark/50 hover:bg-brand-neutral'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <ListOrdered className="w-4 h-4 shrink-0" />
              Purchase History
            </span>
            {orders.length > 0 && (
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === 'orders' ? 'bg-brand-white text-brand-orange' : 'bg-brand-orange text-brand-white'
              }`}>
                {orders.length}
              </span>
            )}
          </button>

          <button
            id="tab-wishlist"
            onClick={() => { setActiveTab('wishlist'); setSelectedInvoiceId(null); }}
            className={`flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all whitespace-nowrap cursor-pointer w-full text-left ${
              activeTab === 'wishlist'
                ? 'bg-brand-orange text-brand-white shadow border-transparent'
                : 'text-brand-dark/50 hover:bg-brand-neutral'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Heart className="w-4 h-4 shrink-0" />
              My Wishlist
            </span>
            {wishlist.length > 0 && (
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === 'wishlist' ? 'bg-brand-white text-brand-orange' : 'bg-brand-orange text-brand-white'
              }`}>
                {wishlist.length}
              </span>
            )}
          </button>

          <button
            id="tab-cart-preview"
            onClick={() => { setActiveTab('cart'); setSelectedInvoiceId(null); }}
            className={`flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all whitespace-nowrap cursor-pointer w-full text-left ${
              activeTab === 'cart'
                ? 'bg-brand-orange text-brand-white shadow border-transparent'
                : 'text-brand-dark/50 hover:bg-brand-neutral'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 shrink-0" />
              Active Shopping Bag
            </span>
            {cart.length > 0 && (
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === 'cart' ? 'bg-brand-white text-brand-orange' : 'bg-brand-orange text-brand-white'
              }`}>
                {cart.reduce((s,i)=>s+i.quantity,0)}
              </span>
            )}
          </button>
        </div>

        {/* Tab contents panel (Right) */}
        <div className="md:col-span-9 bg-brand-white border border-brand-neutral rounded-2xl p-6 shadow-md shadow-brand-dark/5 min-h-[360px]">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-brand-neutral pb-3">
                <h3 className="font-bold text-brand-dark text-base leading-snug uppercase">Account Hub Overview</h3>
                <p className="text-xs text-brand-dark/45">Instant summary tracking of custom garments, orders and selections.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 py-2">
                
                {/* Wishlist quick status board */}
                <div className="border border-brand-neutral rounded-2xl p-4 space-y-3 bg-brand-neutral/30">
                  <div className="flex items-center justify-between">
                    <span className="p-1.5 bg-brand-orange/10 text-brand-orange rounded-lg">
                      <Heart className="w-4 h-4 text-brand-orange" />
                    </span>
                    <button 
                      onClick={() => setActiveTab('wishlist')}
                      className="text-xs font-bold uppercase tracking-wider text-brand-orange hover:text-brand-dark flex items-center gap-1 cursor-pointer transition-colors duration-250"
                    >
                      View All
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xl font-black text-brand-dark font-mono">{wishlist.length}</h4>
                    <p className="text-xs text-brand-dark/45 font-sans">Garment designs saved in Wishlist catalog</p>
                  </div>
                </div>

                {/* Cart Active summary status board */}
                <div className="border border-brand-neutral rounded-2xl p-4 space-y-3 bg-brand-neutral/30 font-sans">
                  <div className="flex items-center justify-between">
                    <span className="p-1.5 bg-brand-orange text-brand-white rounded-lg">
                      <ShoppingBag className="w-4 h-4" />
                    </span>
                    <button 
                      onClick={() => navigate('cart')}
                      className="text-xs font-bold uppercase tracking-wider text-brand-orange hover:text-brand-dark flex items-center gap-1 cursor-pointer transition-colors duration-250"
                    >
                      Open Cart
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xl font-black text-brand-dark font-mono">
                      {cart.reduce((acc, item) => acc + item.quantity, 0)}
                    </h4>
                    <p className="text-xs text-brand-dark/45 font-sans">Apparel garments pending in secure bag</p>
                  </div>
                </div>

              </div>

              {/* Latest Order Receipt snippet (if any exist) */}
              {orders.length > 0 ? (
                <div className="border border-brand-neutral rounded-2xl p-5 bg-brand-neutral/40 space-y-3 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1 text-left">
                    <h4 className="font-bold text-brand-dark text-sm flex items-center gap-1.5 uppercase">
                      <span className="w-2 h-2 bg-brand-orange rounded-full animate-pulse"></span>
                      Latest Invoice Active
                    </h4>
                    <p className="text-xs text-brand-dark/70 leading-relaxed font-sans">
                      Order <strong className="font-bold text-brand-dark">#{orders[0].id}</strong> (${orders[0].total}) was placed on {new Date(orders[0].createdAt).toLocaleDateString()}. Shipment courier dispatch prepared.
                    </p>
                  </div>
                  <button
                    onClick={() => { setActiveTab('orders'); setSelectedInvoiceId(orders[0].id); }}
                    className="px-4 py-2 bg-brand-orange hover:bg-brand-dark text-brand-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all duration-300 cursor-pointer"
                  >
                    Track Invoice Receipt
                  </button>
                </div>
              ) : (
                <div className="border border-brand-neutral rounded-2xl p-5 bg-brand-neutral/10 text-center space-y-3 py-6">
                  <p className="text-xs text-brand-dark/50 max-w-sm mx-auto leading-relaxed">
                    You have not placed any orders during this session. Browse our collection, add items to your card, and complete checkout to see them listed here!
                  </p>
                  <button
                    onClick={() => navigate('home')}
                    className="px-5 py-2.5 bg-brand-orange text-brand-white text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 hover:scale-105 cursor-pointer shadow-md shadow-brand-orange/15 w-full font-semibold"
                  >
                    Start Shopping Online
                  </button>
                </div>
              )}
            </div>
          )}          {/* TAB 2: PURCHASE HISTORY (MY ORDERS) */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fade-in text-left">
              
              {/* Custom micro toast notify desk */}
              {userToast && (
                <div className="p-3.5 bg-brand-orange text-brand-white rounded-xl text-xs font-bold font-sans flex items-center gap-2 animate-bounce">
                  <Sparkles className="w-4 h-4 text-brand-white shrink-0" />
                  <span>{userToast}</span>
                </div>
              )}

              <div className="border-b border-brand-neutral pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="font-bold text-brand-dark text-base leading-snug uppercase">Purchase History & Receipts</h3>
                  <p className="text-xs text-brand-dark/45 font-sans">Review order dispatch statuses, track active couriers, or initiate refunds/cancellations.</p>
                </div>
                {selectedInvoiceId && (
                  <button 
                    onClick={() => { setSelectedInvoiceId(null); }}
                    className="text-xs font-bold uppercase tracking-wider text-brand-dark border border-brand-neutral bg-brand-white hover:bg-brand-neutral px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Back to History
                  </button>
                )}
              </div>

              {selectedInvoiceId && activeInvoice ? (
                <div id={`invoice-receipt-card-${activeInvoice.id}`} className="space-y-6 animate-fade-in border border-brand-neutral p-6 rounded-2xl relative bg-brand-white shadow text-left">
                  
                  {/* Luxury Receipt Status Header Banner */}
                  <div className="flex flex-wrap items-center justify-between bg-brand-neutral/40 -mx-6 -mt-6 p-4 rounded-t-2xl gap-3 border-b border-brand-neutral">
                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-brand-dark/40">Invoice Reference</span>
                      <h4 className="font-mono font-bold text-xs text-brand-dark">#{activeInvoice.id}</h4>
                    </div>
                    
                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-brand-dark/40">Booking Date</span>
                      <div className="text-xs font-bold text-brand-dark flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-brand-dark/45" />
                        {new Date(activeInvoice.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase font-bold tracking-brand text-brand-dark/40">Fulfillment Status</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          activeInvoice.status === 'pending' ? 'bg-amber-400 animate-pulse' :
                          activeInvoice.status === 'processing' ? 'bg-brand-orange animate-pulse' :
                          activeInvoice.status === 'shipped' ? 'bg-sky-500 animate-pulse' :
                          activeInvoice.status === 'delivered' ? 'bg-emerald-500' : 'bg-red-500'
                        }`}></span>
                        <span className="text-xs font-extrabold uppercase text-brand-dark tracking-wider">
                          {activeInvoice.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* HIGH ACCENT WARNING ALERT FOR ACTIVE COD ORDER */}
                  {activeInvoice.paymentMethod === 'Cash on Delivery' && activeInvoice.status !== 'cancelled' && activeInvoice.status !== 'delivered' && (
                    <div className="bg-brand-orange/5 border border-brand-orange/20 p-4 rounded-xl space-y-1">
                      <span className="text-[9px] uppercase tracking-widest text-brand-orange font-bold flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5" />
                        Cash on Delivery Outstanding settlement
                      </span>
                      <p className="text-[11px] font-semibold text-brand-dark/80 font-sans leading-relaxed">
                        Order #{activeInvoice.id} is routed via COD. Please keep cash amount of <strong className="text-brand-orange font-mono">${activeInvoice.total}</strong> on hand for the courier upon physical transit to sign off delivery!
                      </p>
                    </div>
                  )}

                  {/* VISUAL SHIPMENT LOGISTICS TRACKING STEPPER / TIMELINE */}
                  <div className="bg-brand-neutral/10 border border-brand-neutral rounded-xl p-4.5 space-y-4">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-brand-dark/40 block">Aura Global Shipment Tracker Matrix</span>
                    
                    {activeInvoice.status === 'cancelled' ? (
                      <div className="py-2 flex items-center gap-2.5 text-red-500 text-xs font-bold leading-relaxed">
                        <XCircle className="w-5 h-5" />
                        <span>Order Shipment Denied/Cancelled. No transit log generated.</span>
                      </div>
                    ) : (
                      <div className="relative pt-3 pb-2">
                        {/* Stepper Progress Pipeline Line */}
                        <div className="absolute top-6 left-5 right-5 h-0.5 bg-brand-neutral -z-10" />
                        
                        {/* Highlights pipeline line dynamically */}
                        <div className="absolute top-6 left-5 h-0.5 bg-brand-orange -z-10 transition-all duration-500" style={{
                          width: activeInvoice.status === 'pending' ? '0%' :
                                 activeInvoice.status === 'processing' ? '33%' :
                                 activeInvoice.status === 'shipped' ? '66%' : '100%'
                        }} />

                        {/* Stepper Nodes */}
                        <div className="flex justify-between items-center text-center font-sans">
                          {/* Step 1: Placed */}
                          <div className="space-y-1.5 flex flex-col items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border transition-all ${
                              activeInvoice.status !== 'pending' ? 'bg-brand-orange text-brand-white border-brand-orange' : 'bg-brand-orange/15 text-brand-orange border-brand-orange'
                            }`}>
                              {activeInvoice.status !== 'pending' ? <Check className="w-3.5 h-3.5 text-brand-white" /> : '1'}
                            </div>
                            <span className="text-[10px] font-bold text-brand-dark uppercase">Placed</span>
                          </div>

                          {/* Step 2: Processing */}
                          <div className="space-y-1.5 flex flex-col items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border transition-all ${
                              activeInvoice.status === 'shipped' || activeInvoice.status === 'delivered'
                                ? 'bg-brand-orange text-brand-white border-brand-orange'
                                : activeInvoice.status === 'processing'
                                ? 'bg-brand-orange/15 text-brand-orange border-brand-orange scale-105 animate-pulse'
                                : 'bg-brand-white text-brand-dark/30 border-brand-neutral'
                            }`}>
                              {activeInvoice.status === 'shipped' || activeInvoice.status === 'delivered' ? <Check className="w-3.5 h-3.5 text-brand-white" /> : '2'}
                            </div>
                            <span className="text-[10px] font-bold text-brand-dark uppercase">Processed</span>
                          </div>

                          {/* Step 3: Shipped */}
                          <div className="space-y-1.5 flex flex-col items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border transition-all ${
                              activeInvoice.status === 'delivered'
                                ? 'bg-brand-orange text-brand-white border-brand-orange'
                                : activeInvoice.status === 'shipped'
                                ? 'bg-brand-orange/15 text-brand-orange border-brand-orange scale-105 animate-pulse'
                                : 'bg-brand-white text-brand-dark/30 border-brand-neutral'
                            }`}>
                              {activeInvoice.status === 'delivered' ? <Check className="w-3.5 h-3.5 text-brand-white" /> : '3'}
                            </div>
                            <span className="text-[10px] font-bold text-brand-dark uppercase">Shipped</span>
                          </div>

                          {/* Step 4: Delivered */}
                          <div className="space-y-1.5 flex flex-col items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border transition-all ${
                              activeInvoice.status === 'delivered'
                                ? 'bg-brand-orange text-brand-white border-brand-orange scale-110'
                                : 'bg-brand-white text-brand-dark/30 border-brand-neutral'
                            }`}>
                              4
                            </div>
                            <span className="text-[10px] font-bold text-brand-dark uppercase">Delivered</span>
                          </div>
                        </div>

                        {/* Tracker Sub-Message */}
                        <p className="text-[10px] text-brand-dark/50 text-center pt-4 font-semibold">
                          {activeInvoice.status === 'pending' && "🔒 Payment verification checkpoint. Waiting for final launch."}
                          {activeInvoice.status === 'processing' && "📦 Apparel tailoring desk. Packaging garments to dispatch."}
                          {activeInvoice.status === 'shipped' && "✈️ In transit with Aura Air. Local tracking will become active soon."}
                          {activeInvoice.status === 'delivered' && "🤝 Order delivered! Cash payload has been received safely."}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Recipient delivery coordinate breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs text-brand-dark/70 leading-relaxed border-b border-brand-neutral pb-4.5 font-medium font-sans">
                    <div className="space-y-1 text-left">
                      <span className="text-[9px] uppercase tracking-widest font-bold text-brand-orange/80">Physical Delivery coordinate</span>
                      <p className="font-bold text-brand-dark text-sm">{activeInvoice.shippingAddress.name}</p>
                      <p>{activeInvoice.shippingAddress.address}, {activeInvoice.shippingAddress.city}</p>
                      <p>{activeInvoice.shippingAddress.zip}, {activeInvoice.shippingAddress.country}</p>
                      <p className="text-brand-dark/50 pt-1 font-mono">Ph: {activeInvoice.shippingAddress.phone || 'N/A'}</p>
                    </div>
                    
                    <div className="space-y-1 text-left">
                      <span className="text-[9px] uppercase tracking-widest font-bold text-brand-orange/80">Invoice Ledger Details</span>
                      <p>Payment Mode: <strong className="text-brand-dark font-bold font-mono">{activeInvoice.paymentMethod}</strong></p>
                      <p>Payment status: <strong className="text-brand-orange uppercase">{activeInvoice.paymentStatus || 'Pending'}</strong></p>
                      <p>Assigned Logistics: <strong className="text-brand-dark font-bold">Aura Premium Air Courier Ltd</strong></p>
                    </div>
                  </div>

                  {/* Receipt Items Grid Panel */}
                  <div className="space-y-3 pb-3 border-b border-brand-neutral text-left">
                    <div className="text-[9px] uppercase font-bold text-brand-dark/40 tracking-widest">Selected Wardrobe Garments</div>
                    <div className="space-y-3">
                      {activeInvoice.items.map((item, idx) => {
                        const originalPrice = item.selectedVariation?.salePrice || item.selectedVariation?.price || item.product.salePrice || item.product.price;
                        return (
                          <div key={idx} className="flex items-center justify-between text-xs font-sans border-b border-brand-neutral/30 pb-2 last:border-b-0 last:pb-0">
                            <div className="flex items-center gap-3">
                              <img 
                                src={item.product.imageUrl} 
                                alt="" 
                                className="w-10 h-10 object-cover rounded-lg border border-brand-neutral/50 shrink-0 shadow-sm"
                                referrerPolicy="no-referrer"
                              />
                              <div className="space-y-0.5">
                                <span className="font-bold text-brand-dark uppercase block leading-tight">{item.product.title}</span>
                                <div className="flex gap-2 text-[10px] text-brand-dark/45 font-semibold">
                                  <span>Quantity: {item.quantity}</span>
                                  {item.selectedAttributes && (
                                    <span className="text-brand-orange font-mono">({item.selectedAttributes.size} • {item.selectedAttributes.color})</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <span className="font-mono font-extrabold text-brand-dark">${originalPrice * item.quantity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ledger summary pricing */}
                  <div className="space-y-1.5 text-xs text-brand-dark/70 font-sans">
                    <div className="flex justify-between">
                      <span>Gross Subtotal</span>
                      <span className="font-mono text-brand-dark font-semibold">${activeInvoice.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Complimentary Shipping cargo Fee</span>
                      <span className="text-[9px] font-bold text-brand-orange bg-brand-orange/10 px-1.5 py-0.2 rounded font-mono">COMPLIMENTARY</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes Est. (VAT)</span>
                      <span className="font-mono text-brand-dark font-semibold">${activeInvoice.tax}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-brand-dark pt-2.5 border-t border-brand-neutral uppercase">
                      <span>Total Invoice</span>
                      <span className="font-mono text-base font-black text-brand-orange">${activeInvoice.total}</span>
                    </div>
                  </div>

                  {/* LOWER ACTIONS BUTTON CONTROLS */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-brand-neutral">
                    {/* Prints or downloads invoice */}
                    <button
                      type="button"
                      onClick={() => {
                        window.print();
                        setUserToast("Boutique physical invoice generated cleanly for reference.");
                        setTimeout(() => setUserToast(null), 3000);
                      }}
                      className="px-4 py-2 bg-brand-neutral hover:bg-brand-neutral/80 text-brand-dark font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Print Receipt (PDF)
                    </button>

                    <div className="flex items-center gap-2">
                      {/* Cancel order button if pending or processing */}
                      {(activeInvoice.status === 'pending' || activeInvoice.status === 'processing') && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm("Are you sure you want to cancel this pending capsule order?")) {
                              updateOrderStatus(activeInvoice.id, 'cancelled', 'cancelled');
                              setUserToast("Your wardrobe courier booking was successfully cancelled.");
                              setTimeout(() => setUserToast(null), 3500);
                            }
                          }}
                          className="px-4 py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 font-bold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                        >
                          Cancel Booking
                        </button>
                      )}

                      {/* Reorder Products button */}
                      <button
                        type="button"
                        onClick={() => {
                          activeInvoice.items.forEach((it) => {
                            addToCart(it.product, it.quantity, it.selectedVariation, it.selectedAttributes);
                          });
                          setUserToast("Success! Copied entire invoice Items back to your shopping bag.");
                          setTimeout(() => {
                            setUserToast(null);
                            navigate('cart');
                          }, 1500);
                        }}
                        className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow"
                      >
                        <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                        Reorder Products
                      </button>
                    </div>
                  </div>

                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div 
                      key={order.id}
                      onClick={() => setSelectedInvoiceId(order.id)}
                      className="border border-brand-neutral hover:border-brand-orange/30 p-4 rounded-xl flex items-center justify-between gap-4 cursor-pointer hover:bg-brand-neutral/30 transition-all duration-300 bg-brand-white shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-brand-neutral/40 text-brand-dark/70 rounded-lg border border-brand-neutral">
                          <Receipt className="w-5 h-5 text-brand-dark" />
                        </div>
                        <div className="space-y-1 text-left font-sans">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-brand-dark text-sm">Order #{order.id}</h4>
                            <span className="text-[10px] bg-brand-neutral text-brand-dark/70 font-mono font-bold px-1.5 py-0.2 rounded uppercase">
                              {order.paymentMethod}
                            </span>
                          </div>
                          <p className="text-[11px] text-brand-dark/45 font-semibold">
                            Ordered: {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} garments selection
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 font-sans">
                        <div className="text-right">
                          <div className="font-black text-brand-dark font-mono text-sm">${order.total}</div>
                          <span className={`inline-block text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border tracking-wide uppercase ${
                            order.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                            order.status === 'processing' ? 'bg-orange-50 text-brand-orange border-orange-200 animate-pulse' :
                            order.status === 'shipped' ? 'bg-sky-50 text-sky-600 border-sky-200' :
                            order.status === 'delivered' ? 'bg-emerald-50 text-emerald-650 border-emerald-200' :
                            'bg-rose-50 text-rose-500 border-rose-250 font-bold'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-brand-dark/30 shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty orders list */
                <div className="text-center py-10 space-y-3.5 max-w-md mx-auto animate-fade-in font-sans">
                  <div className="text-3xl">📦</div>
                  <h4 className="font-bold text-brand-dark text-sm uppercase">No Purchase Transactions Found</h4>
                  <p className="text-xs text-brand-dark/50 leading-relaxed mt-1">
                    You have not completed any wardrobe purchase payments yet. Add capsule goods to your shopping cart to execute order deliveries!
                  </p>
                  <button
                    onClick={() => navigate('home')}
                    className="px-5 py-2.5 bg-brand-orange text-brand-white text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 hover:scale-105 cursor-pointer shadow-md shadow-brand-orange/15 w-full font-semibold"
                  >
                    Browse Collections
                  </button>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="border-b border-brand-neutral pb-3">
                <h3 className="font-bold text-brand-dark text-base leading-snug uppercase">My Saved Closet Wishlist</h3>
                <p className="text-xs text-brand-dark/45 font-sans">Maintain a tailored layout check of your future wardrobe additions.</p>
              </div>

              {wishlistedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistedProducts.map((prod) => (
                    <div key={prod.id} className="relative group/wish">
                      <ProductCard product={prod} />
                      
                      {/* Shortcut to remove from wishlist */}
                      <button
                        id={`wishlist-dash-remove-${prod.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(prod.id);
                        }}
                        className="absolute bottom-4 right-4 px-3 py-1.5 bg-brand-dark/90 hover:bg-brand-orange text-brand-white rounded-lg transition-all duration-300 font-sans text-[10px] font-bold uppercase tracking-widest z-10 cursor-pointer shadow"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 space-y-4 max-w-sm mx-auto font-sans">
                  <Heart className="w-10 h-10 text-brand-dark/20 mx-auto fill-none" />
                  <h4 className="font-bold text-brand-dark text-sm uppercase">Closet Wishlist is Empty</h4>
                  <p className="text-xs text-brand-dark/45 mt-1 leading-relaxed font-sans">
                    Have any design catch your attention? Place them in your wishlist catalog by clicking the heart button on any visual card.
                  </p>
                  <button
                    onClick={() => navigate('home')}
                    className="px-5 py-2.5 bg-brand-orange text-brand-white text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 hover:scale-105 cursor-pointer shadow-md shadow-brand-orange/15 w-full"
                  >
                    Return to Store
                  </button>
                </div>
              )}

            </div>
          )}

          {/* TAB 4: ACTIVE CART PREVIEW */}
          {activeTab === 'cart' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="border-b border-brand-neutral pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-brand-dark text-base leading-snug uppercase">Active Bag Closet Preview</h3>
                  <p className="text-xs text-brand-dark/45 font-sans">Quick check on selected garments before security checkouts.</p>
                </div>
                {cart.length > 0 && (
                  <button 
                    onClick={() => navigate('cart')}
                    className="text-xs font-bold uppercase tracking-widest text-brand-white bg-brand-dark hover:bg-brand-orange px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer"
                  >
                    Manage Fully
                  </button>
                )}
              </div>

              {cart.length > 0 ? (
                <div className="space-y-4 font-sans">
                  <div className="divide-y divide-brand-neutral border border-brand-neutral rounded-2xl bg-brand-neutral/30 p-5 space-y-3">
                    {cart.map((item, idx) => {
                      const price = item.selectedVariation?.salePrice || item.selectedVariation?.price || item.product.salePrice || item.product.price;
                      return (
                        <div key={idx} className="flex items-center justify-between text-xs py-2 first:pt-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-brand-dark/40 font-bold">{item.quantity}x</span>
                            <span className="font-bold text-brand-dark uppercase truncate max-w-[180px] sm:max-w-xs">{item.product.title}</span>
                            {item.selectedAttributes && (
                              <span className="text-[10px] bg-brand-white border border-brand-neutral px-1.5 font-mono text-brand-dark/70 rounded font-bold">
                                {item.selectedAttributes.size} • {item.selectedAttributes.color}
                              </span>
                            )}
                          </div>
                          <span className="font-mono font-extrabold text-brand-dark">${price * item.quantity}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary row */}
                  <div className="flex justify-between items-center bg-brand-neutral/40 border border-brand-neutral p-4 rounded-xl">
                    <div className="space-y-0.5 text-left">
                      <span className="text-[9px] text-brand-dark/40 font-bold uppercase tracking-widest">Estimated Subtotal</span>
                      <h4 className="text-sm font-black text-brand-dark font-mono">
                        ${cart.reduce((s, item) => s + (item.selectedVariation?.salePrice || item.selectedVariation?.price || item.product.salePrice || item.product.price) * item.quantity, 0)}
                      </h4>
                    </div>

                    <button
                      onClick={() => navigate('checkout')}
                      className="px-5 py-2.5 bg-brand-orange text-brand-white font-bold text-xs uppercase tracking-widest rounded-xl flex items-center gap-1.5 shadow-md shadow-brand-orange/15 transition-all duration-300 cursor-pointer hover:bg-brand-dark"
                    >
                      Instant checkout
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 space-y-4 max-w-sm mx-auto font-sans">
                  <div className="text-2xl">👜</div>
                  <h4 className="font-bold text-brand-dark text-sm uppercase">Shopping Bag feels Empty</h4>
                  <p className="text-xs text-brand-dark/45 leading-relaxed">
                    You have not designated any stylish items to buy. Access our designer pages and add options!
                  </p>
                  <button
                    onClick={() => navigate('home')}
                    className="px-5 py-2.5 bg-brand-orange text-brand-white text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 hover:scale-105 cursor-pointer shadow-md shadow-brand-orange/15 w-full"
                  >
                    Load Clothing Store
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
