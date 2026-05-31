import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, ShoppingCart, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { wishlist, toggleWishlist, addToCart, navigate } = useApp();

  const isWishlisted = wishlist.includes(product.id);
  const discountPercent = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const currentPrice = product.salePrice || product.price;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.type === 'variable' && product.variations && product.variations.length > 0) {
      // For variable products, navigate to detailing to choose size/color
      navigate('product-details', product.id);
    } else {
      addToCart(product, 1);
    }
  };

  return (
    <div 
      id={`product-card-${product.id}`}
      onClick={() => navigate('product-details', product.id)}
      className="group relative flex flex-col bg-brand-white border border-brand-neutral rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1.5 hover:border-brand-orange/35 transition-all duration-300 cursor-pointer animate-fade-in"
    >
      {/* Product Image Area */}
      <div className="relative aspect-square w-full bg-brand-neutral/30 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
        />

        {/* Wishlist Heart Overlay */}
        <button
          id={`wishlist-toggle-${product.id}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3.5 right-3.5 p-2 bg-brand-white/95 hover:bg-brand-orange hover:text-brand-white backdrop-blur-sm rounded-full transition-all duration-300 border shadow-sm ${
            isWishlisted 
              ? 'text-brand-orange border-brand-orange/40 bg-brand-white' 
              : 'text-brand-dark/40 hover:text-brand-white border-brand-neutral bg-brand-white'
          }`}
        >
          <Heart className="w-4 h-4 fill-current" />
        </button>

        {/* Discount Sale Tag Overlay */}
        {product.salePrice && (
          <span className="absolute top-3.5 left-3.5 bg-brand-orange text-brand-white text-[9px] uppercase font-black tracking-widest px-2.5 py-1 rounded shadow-sm">
            Sale -{discountPercent}%
          </span>
        )}

        {/* Quick Add To Cart Button Overlay */}
        <div className="absolute inset-x-0 bottom-4 px-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            id={`quick-add-to-cart-${product.id}`}
            type="button"
            onClick={handleQuickAdd}
            className="w-full py-2.5 bg-brand-orange hover:bg-brand-dark text-brand-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {product.type === 'variable' ? 'Select Options' : 'Quick Add'}
          </button>
        </div>
      </div>

      {/* Product Information Area */}
      <div className="p-4.5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Gender and Categories info */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] uppercase font-bold tracking-widest text-brand-dark/70 bg-brand-neutral px-1.5 py-0.5 rounded border border-brand-neutral/45 font-mono">
              {product.gender}
            </span>
            <span className="text-[10px] text-brand-dark/50 font-sans">
              {product.categories.join(', ')}
            </span>
          </div>

          <h4 className="font-bold text-brand-dark text-sm tracking-tight group-hover:text-brand-orange transition-colors duration-200 line-clamp-1">
            {product.title}
          </h4>
        </div>

        {/* Prices and SEO rating indicators */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-brand-dark text-base">
              ${currentPrice}
            </span>
            {product.salePrice && (
              <span className="text-brand-dark/40 text-xs line-through font-medium">
                ${product.price}
              </span>
            )}
          </div>

          {/* Rank Math SEO indicators for customer trust */}
          {product.seoScore && product.seoScore >= 80 && (
            <div className="flex items-center gap-0.5 bg-brand-neutral text-brand-dark/70 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-brand-neutral/50">
              <Star className="w-2.5 h-2.5 fill-current text-brand-orange" />
              <span>Perfect Choice</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
