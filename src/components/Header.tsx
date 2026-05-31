import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Search, User, ShieldCheck, LogOut, Heart } from 'lucide-react';
import { LoginModal } from './LoginModal';

export const Header: React.FC = () => {
  const { 
    cart, 
    wishlist, 
    currentView, 
    navigate, 
    isAdmin, 
    setIsAdmin, 
    searchQuery, 
    setSearchQuery,
    user
  } = useApp();

  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleAdminClick = () => {
    if (isAdmin) {
      navigate('admin-dashboard');
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleLogoutAdmin = () => {
    localStorage.removeItem('aura_admin_token');
    setIsAdmin(false);
    navigate('home');
  };

  return (
    <>
      {/* Top Banner Ticker */}
      <div className="w-full py-2.5 bg-brand-dark text-brand-white text-[11px] font-medium tracking-[0.25em] text-center uppercase border-b border-brand-orange/20">
        Complimentary courier on orders over $150 • Enjoy 10% off your initial purchase • Shop Safely
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-brand-white/90 backdrop-blur-md border-b border-brand-neutral py-4 px-4 sm:px-6 lg:px-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Category Navigation */}
          <div className="flex items-center justify-between md:justify-start gap-8">
            <button
              id="header-brand-logo"
              onClick={() => {
                setSearchQuery('');
                navigate('home');
              }}
              className="text-2xl font-black tracking-tighter text-brand-dark uppercase font-sans cursor-pointer flex items-center gap-1 hover:opacity-85"
            >
              AURA
              <span className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-ping"></span>
            </button>

            {/* Navigation links for filtering */}
            <nav className="hidden sm:flex items-center gap-6">
              <button
                id="header-nav-all"
                onClick={() => {
                  setSearchQuery('');
                  navigate('home');
                }}
                className={`text-xs font-bold uppercase tracking-widest transition-colors duration-200 cursor-pointer ${
                  currentView === 'home' && !searchQuery ? 'text-brand-orange underline underline-offset-4 decoration-2' : 'text-brand-dark/60 hover:text-brand-orange'
                }`}
              >
                Catalog
              </button>
              <button
                id="header-nav-women"
                onClick={() => {
                  setSearchQuery('women');
                  navigate('home');
                }}
                className={`text-xs font-bold uppercase tracking-widest transition-colors duration-200 cursor-pointer ${
                  searchQuery === 'women' ? 'text-brand-orange underline underline-offset-4 decoration-2' : 'text-brand-dark/60 hover:text-brand-orange'
                }`}
              >
                Women
              </button>
              <button
                id="header-nav-men"
                onClick={() => {
                  setSearchQuery('men');
                  navigate('home');
                }}
                className={`text-xs font-bold uppercase tracking-widest transition-colors duration-200 cursor-pointer ${
                  searchQuery === 'men' ? 'text-brand-orange underline underline-offset-4 decoration-2' : 'text-brand-dark/60 hover:text-brand-orange'
                }`}
              >
                Men
              </button>
            </nav>
          </div>

          {/* Search Inputs */}
          <div className="relative flex-1 max-w-md w-full mx-auto md:mx-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-brand-dark/40">
              <Search className="w-4 h-4" />
            </span>
            <input
              id="header-search-bar"
              type="text"
              placeholder="Search designer catalog..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentView !== 'home') {
                  navigate('home');
                }
              }}
              className="w-full py-2 pl-10 pr-4 text-xs border border-brand-neutral rounded-full focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange bg-brand-white text-brand-dark placeholder:text-brand-dark/40"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-brand-dark/60 hover:text-brand-orange bg-brand-neutral px-1.5 rounded-full"
              >
                Clear
              </button>
            )}
          </div>

          {/* User Control actions */}
          <div className="flex items-center justify-between sm:justify-start gap-4">
            
            {/* Wishlist Indicators */}
            <button
              id="header-wishlist-button"
              onClick={() => navigate('user-dashboard')}
              className="relative p-2 text-brand-dark/70 hover:text-brand-orange hover:bg-brand-neutral rounded-full transition-all"
              title="View your wishlist"
            >
              <Heart className="w-4.5 h-4.5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-brand-orange rounded-full animate-ping"></span>
              )}
            </button>

            {/* Cart Indicators */}
            <button
              id="header-cart-button"
              onClick={() => navigate('cart')}
              className="relative p-2 text-brand-dark/70 hover:text-brand-orange hover:bg-brand-neutral rounded-full transition-all flex items-center gap-1.5"
            >
              <div className="relative">
                <ShoppingBag className="w-4.5 h-4.5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-orange text-brand-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-brand-white">
                    {cartItemsCount}
                  </span>
                )}
              </div>
            </button>

            {/* Your Account Dashboard Trigger */}
            <button
              id="header-your-account-button"
              onClick={() => navigate('user-dashboard')}
              className={`flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold rounded-full border transition-all duration-300 transform hover:scale-[1.03] cursor-pointer ${
                currentView === 'user-dashboard'
                  ? 'bg-brand-orange text-brand-white border-brand-orange'
                  : 'bg-brand-white text-brand-dark border-brand-neutral hover:bg-brand-neutral'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              {user ? `Hello, ${user.name.split(' ')[0]}` : 'Your Account'}
            </button>

            {/* Admin Portal Gateway Trigger */}
            <div className="flex items-center gap-1 bg-brand-neutral/65 rounded-full p-1 border border-brand-neutral">
              <button
                id="header-admin-gateway"
                onClick={handleAdminClick}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full transition-all duration-300 transform hover:scale-[1.03] cursor-pointer ${
                  isAdmin 
                    ? 'bg-brand-dark text-brand-white shadow-md' 
                    : 'text-brand-dark/70 hover:text-brand-orange hover:bg-brand-white'
                }`}
                title="WordPress / WooCommerce Admin Suite"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin
              </button>
              
              {isAdmin && (
                <button
                  id="admin-logout-trigger"
                  onClick={handleLogoutAdmin}
                  className="p-1 text-brand-dark/50 hover:text-brand-orange rounded-full hover:bg-brand-white transition-all duration-300"
                  title="Logout Administrator"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Auth Portal Dialog */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};
