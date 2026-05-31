import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, ArrowUpDown, RefreshCw, Layers } from 'lucide-react';
import { FashionHero } from './FashionHero';

export const HomeView: React.FC = () => {
  const { products, categories, searchQuery, setSearchQuery } = useApp();

  const [selectedGender, setSelectedGender] = useState<'all' | 'men' | 'women' | 'unisex'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'seo-score'>('default');

  // Dynamic filter combination logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Search Query filter (matches title, description, categories, gender or keywords)
      if (searchQuery) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesGender = p.gender.toLowerCase() === query;
        const matchesCategory = p.categories.some((cat) => cat.toLowerCase().includes(query));
        const matchesKeywords = p.seoKeywords?.some((kw) => kw.toLowerCase().includes(query)) || false;
        
        if (!matchesTitle && !matchesDesc && !matchesGender && !matchesCategory && !matchesKeywords) {
          return false;
        }
      }

      // 2. Gender filter
      if (selectedGender !== 'all') {
        if (p.gender !== selectedGender && p.gender !== 'unisex') {
          return false;
        }
      }

      // 3. Category filter
      if (selectedCategory !== 'all') {
        if (!p.categories.includes(selectedCategory)) {
          return false;
        }
      }

      return true;
    });
  }, [products, searchQuery, selectedGender, selectedCategory]);

  // Dynamic sorting combinations
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-asc') {
      list.sort((a, b) => {
        const pA = a.salePrice || a.price;
        const pB = b.salePrice || b.price;
        return pA - pB;
      });
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => {
        const pA = a.salePrice || a.price;
        const pB = b.salePrice || b.price;
        return pB - pA;
      });
    } else if (sortBy === 'seo-score') {
      list.sort((a, b) => (b.seoScore || 0) - (a.seoScore || 0));
    }
    return list;
  }, [filteredProducts, sortBy]);

  const handleResetFilters = () => {
    setSelectedGender('all');
    setSelectedCategory('all');
    setSortBy('default');
    setSearchQuery('');
  };

  return (
    <div className="space-y-10 pb-16">
      
      {/* Cinematic Animated Fashion Hero Section (only when no active search) */}
      {!searchQuery && (
        <FashionHero 
          onSelectGender={setSelectedGender} 
          onSelectCategory={setSelectedCategory} 
        />
      )}

      {/* Grid Filter Operations & Sort Navigation Controls */}
      <div id="catalog-controls-bar" className="bg-brand-white border border-brand-neutral/80 rounded-2xl p-6 shadow-md shadow-brand-neutral/30 space-y-4 scroll-mt-24 transition-all duration-300">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Gender Filter Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-dark/50 mr-2 flex items-center gap-1.5 font-sans">
              <SlidersHorizontal className="w-3.5 h-3.5 text-brand-dark/40" />
              Wear:
            </span>
            {(['all', 'women', 'men', 'unisex'] as const).map((gender) => (
              <button
                key={gender}
                id={`filter-gender-${gender}`}
                onClick={() => setSelectedGender(gender)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg capitalize transition-all duration-300 transform cursor-pointer border ${
                  selectedGender === gender
                    ? 'bg-brand-orange text-brand-white border-brand-orange shadow-md shadow-brand-orange/15 scale-105'
                    : 'bg-brand-neutral text-brand-dark/85 border-transparent hover:bg-brand-dark hover:text-brand-white hover:scale-102'
                }`}
              >
                {gender}
              </button>
            ))}
          </div>

          {/* Sorter Selector Menu */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-dark/50 flex items-center gap-1.5 font-sans">
              <ArrowUpDown className="w-3.5 h-3.5 text-brand-dark/40" />
              Order By:
            </span>
            <select
              id="sorting-select-dropdown"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1.5 pl-3.5 pr-8 text-xs font-bold border border-brand-neutral bg-brand-white rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange text-brand-dark/90 max-w-[200px] cursor-pointer transition-all duration-300"
            >
              <option value="default">Release Date</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="seo-score">Popularity (SEO score)</option>
            </select>

            {/* Clear Filters Shortcuts */}
            {(selectedGender !== 'all' || selectedCategory !== 'all' || sortBy !== 'default' || searchQuery) && (
              <button
                id="reset-all-filters-shortcut"
                onClick={handleResetFilters}
                className="p-1 px-3 py-1.5 text-xs font-bold text-brand-orange hover:text-brand-white bg-white hover:bg-brand-orange rounded-lg flex items-center gap-1.5 border border-brand-orange/30 transition-all duration-300 ml-auto lg:ml-0 cursor-pointer shadow-sm transform hover:scale-102"
              >
                <RefreshCw className="w-3 h-3" />
                Clear Filters
              </button>
            )}
          </div>

        </div>

        {/* Categories Pills Filters */}
        <div className="border-t border-brand-neutral pt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-dark/50 mr-2 flex items-center gap-1.5 font-sans">
            <Layers className="w-3.5 h-3.5 text-brand-dark/40" />
            Category:
          </span>
          <button
            id={`filter-cat-all`}
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.2 text-xs font-bold border rounded-lg transition-all duration-300 transform cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-brand-dark text-brand-white border-brand-dark shadow-sm scale-105'
                : 'bg-brand-neutral text-brand-dark/80 border-transparent hover:bg-brand-orange hover:text-brand-white hover:scale-[1.03]'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`filter-cat-${cat.id}`}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3.5 py-1.2 text-xs font-bold border rounded-lg transition-all duration-300 transform cursor-pointer ${
                selectedCategory === cat.name
                  ? 'bg-brand-dark text-brand-white border-brand-dark shadow-sm scale-105'
                  : 'bg-brand-neutral text-brand-dark/80 border-transparent hover:bg-brand-orange hover:text-brand-white hover:scale-[1.03]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Query Status Ribbon */}
      {searchQuery && (
        <div className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
          <span className="text-xs text-zinc-650 font-sans">
            Showing <strong className="text-zinc-950 font-bold">{sortedProducts.length}</strong> capsule garments matching search <strong className="text-zinc-950 font-bold">"{searchQuery}"</strong>
          </span>
          <button 
            onClick={() => setSearchQuery('')}
            className="text-xs font-bold text-red-600 hover:text-red-800 underline underline-offset-2 cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Master Grid list of Products */}
      {sortedProducts.length > 0 ? (
        <div 
          id="products-main-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {sortedProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        /* Empty Catalog display fallback */
        <div className="bg-zinc-50 rounded-3xl p-12 text-center border border-zinc-150 space-y-4 max-w-xl mx-auto py-16">
          <div className="w-16 h-16 bg-zinc-200 text-zinc-600 rounded-full flex items-center justify-center mx-auto shadow-inner text-xl">
            🔍
          </div>
          <h3 className="text-gray-900 font-bold text-lg tracking-tight">Empty Capsule Result</h3>
          <p className="text-xs text-gray-500 font-sans leading-relaxed max-w-md mx-auto">
            We couldn't locate any premium apparel matching your active filters. Click the button below to clear filters and view the complete collection.
          </p>
          <button
            id="empty-clear-filters-button"
            onClick={handleResetFilters}
            className="px-6 py-2 bg-black text-white hover:bg-gray-900 font-semibold text-xs rounded-xl transition-all cursor-pointer"
          >
            Show All Products
          </button>
        </div>
      )}

    </div>
  );
};
