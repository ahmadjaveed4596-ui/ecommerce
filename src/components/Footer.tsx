import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Facebook, Instagram, Twitter, HelpCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, setSearchQuery } = useApp();

  return (
    <footer className="bg-zinc-950 text-gray-300 py-12 px-4 sm:px-6 lg:px-8 border-t border-zinc-850 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand description */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-bold tracking-tight">
            AURA<span className="text-emerald-500">.</span>
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed font-sans">
            Curated garments designed around minimalist, clean silhouettes and functional longevity. Bridging contemporary tailoring with Copenhagen sensibilities.
          </p>
          <div className="flex items-center gap-4 text-gray-400">
            <a href="#" className="hover:text-white transition-all"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="hover:text-white transition-all"><Facebook className="w-4 h-4" /></a>
            <a href="#" className="hover:text-white transition-all"><Twitter className="w-4 h-4" /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">Shop Collections</h4>
          <ul className="space-y-2.5 text-xs text-gray-400 font-sans">
            <li>
              <button 
                onClick={() => { setSearchQuery('women'); navigate('home'); }} 
                className="hover:text-white cursor-pointer transition-all"
              >
                Women's Curations
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setSearchQuery('men'); navigate('home'); }} 
                className="hover:text-white cursor-pointer transition-all"
              >
                Men's Tailoring
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setSearchQuery('Outerwear'); navigate('home'); }} 
                className="hover:text-white cursor-pointer transition-all"
              >
                Premium Outerwear
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setSearchQuery('Knitwear'); navigate('home'); }} 
                className="hover:text-white cursor-pointer transition-all"
              >
                Alpaca & Merino Knitwear
              </button>
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">Customer Care</h4>
          <ul className="space-y-2.5 text-xs text-gray-400 font-sans">
            <li><a href="#" className="hover:text-white transition-all">Sizing Companion</a></li>
            <li><a href="#" className="hover:text-white transition-all">Courier & Delivery Status</a></li>
            <li><a href="#" className="hover:text-white transition-all">Easy Returns & Exchanges</a></li>
            <li>
              <button onClick={() => navigate('user-dashboard')} className="hover:text-white cursor-pointer transition-all">
                Track Direct Order
              </button>
            </li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">Aura Gazette</h4>
          <p className="text-xs text-gray-400 mb-4 font-sans leading-relaxed">
            Subscribe for exclusive access to upcoming capsule drops and bespoke garment previews.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <input 
              type="email" 
              required
              placeholder="Your email address" 
              className="px-3.5 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-white text-white placeholder-gray-500 w-full"
            />
            <button 
              type="submit" 
              className="px-3.5 py-1.5 text-xs bg-white text-zinc-950 hover:bg-zinc-200 font-semibold rounded-lg transition-all whitespace-nowrap"
            >
              Sign Up
            </button>
          </form>
        </div>

      </div>

      {/* Credit and Disclaimer info */}
      <div className="max-w-7xl mx-auto border-t border-zinc-900 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 font-sans gap-4">
        <p>© 2026 Aura luxury fashion retail limit. Developed with complete client compliance.</p>
        <div className="flex items-center gap-1 bg-zinc-900 px-3 py-1 rounded-full text-zinc-400 border border-zinc-850">
          <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
          <span>Need support? Visit your Account desk to manage order returns anytime.</span>
        </div>
      </div>
    </footer>
  );
};
