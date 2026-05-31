/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ProductDetailView } from './components/ProductDetailView';
import { CartView } from './components/CartView';
import { CheckoutView } from './components/CheckoutView';
import { UserDashboardView } from './components/UserDashboardView';
import { AdminDashboardView } from './components/AdminDashboardView';

const SubViewSwitcher: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="w-full transition-all duration-300 animate-fade-in py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1">
      {currentView === 'home' && <HomeView />}
      {currentView === 'product-details' && <ProductDetailView />}
      {currentView === 'cart' && <CartView />}
      {currentView === 'checkout' && <CheckoutView />}
      {currentView === 'user-dashboard' && <UserDashboardView />}
      {currentView === 'admin-dashboard' && <AdminDashboardView />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-brand-white flex flex-col justify-between text-brand-dark antialiased font-sans">
        
        {/* Header Navigation Module */}
        <Header />

        {/* Dynamic Inner Swarp panel */}
        <main className="flex-1 flex flex-col">
          <SubViewSwitcher />
        </main>

        {/* Global Footer Layout */}
        <Footer />
        
      </div>
    </AppProvider>
  );
}
