import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { Product, Variation } from '../types';
import { ShoppingCart, Heart, ArrowLeft, Check, AlertTriangle, ShieldCheck, HelpCircle, Star } from 'lucide-react';

export const ProductDetailView: React.FC = () => {
  const { 
    products, 
    selectedProductId, 
    navigate, 
    addToCart, 
    wishlist, 
    toggleWishlist 
  } = useApp();

  const product = useMemo(() => {
    return products.find((p) => p.id === selectedProductId) || null;
  }, [products, selectedProductId]);

  if (!product) {
    return (
      <div className="py-16 text-center space-y-4 font-sans">
        <h3 className="text-gray-900 font-bold text-lg">Garment Not Found</h3>
        <p className="text-xs text-gray-500">The referenced SKU or product ID does not exist in the catalog.</p>
        <button 
          onClick={() => navigate('home')}
          className="px-5 py-2 hover:bg-zinc-900 bg-black text-white text-xs font-semibold rounded-xl"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  // Find all sizing and color options in product variations
  const sizes = useMemo(() => {
    if (product.type !== 'variable' || !product.variations) return [];
    const set = new Set<string>();
    product.variations.forEach((v) => {
      if (v.attributes.size) set.add(v.attributes.size);
    });
    return Array.from(set);
  }, [product]);

  const colors = useMemo(() => {
    if (product.type !== 'variable' || !product.variations) return [];
    const set = new Set<string>();
    product.variations.forEach((v) => {
      if (v.attributes.color) set.add(v.attributes.color);
    });
    return Array.from(set);
  }, [product]);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string>(product.imageUrl);

  // Set default variation selections initially
  useEffect(() => {
    if (sizes.length > 0) setSelectedSize(sizes[0]);
    if (colors.length > 0) setSelectedColor(colors[0]);
    setQuantity(1);
    setToastMessage(null);
    setActiveImage(product.imageUrl);
  }, [product, sizes, colors]);

  // Find active variation matching current parameters
  const activeVariation = useMemo(() => {
    if (product.type !== 'variable' || !product.variations) return null;
    return product.variations.find((v) => {
      const matchSize = !selectedSize || v.attributes.size === selectedSize;
      const matchColor = !selectedColor || v.attributes.color === selectedColor;
      return matchSize && matchColor;
    }) || null;
  }, [product, selectedSize, selectedColor]);

  // Determine pricing based on selected variation or default product values
  const currentPrice = useMemo(() => {
    if (product.type === 'variable' && activeVariation) {
      return activeVariation.salePrice || activeVariation.price || product.salePrice || product.price;
    }
    return product.salePrice || product.price;
  }, [product, activeVariation]);

  const originalPrice = useMemo(() => {
    if (product.type === 'variable' && activeVariation) {
      return activeVariation.salePrice ? (activeVariation.price || product.price) : undefined;
    }
    return product.salePrice ? product.price : undefined;
  }, [product, activeVariation]);

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    if (product.type === 'variable' && !activeVariation) {
      setToastMessage('Error: Selected sizing combination is temporarily unavailable.');
      return;
    }

    const variation = activeVariation as Variation;

    addToCart(
      product, 
      quantity, 
      product.type === 'variable' ? variation : undefined,
      product.type === 'variable' ? { size: selectedSize, color: selectedColor } : undefined
    );

    setToastMessage(`Success: Added ${quantity} item(s) to your bag!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Find related products (same category or same gender, excluding current product)
  const relatedProducts = useMemo(() => {
    return products
      .filter((p) => p.id !== product.id && (p.gender === product.gender || p.categories.some((c) => product.categories.includes(c))))
      .slice(0, 4);
  }, [products, product]);

  const activeSku = activeVariation?.sku || product.sku;
  const activeStock = activeVariation ? activeVariation.stock : 15; // default simple stock simulated

  return (
    <div className="space-y-12 pb-16 font-sans">
      
      {/* Back to Home Button */}
      <div>
        <button
          id="detail-back-to-catalog"
          onClick={() => navigate('home')}
          className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-dark/50 hover:text-brand-orange cursor-pointer transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
          Back to Catalog
        </button>
      </div>

      {/* Main Grid: Left Column (Image) - Right Column (Info) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        
        {/* Left Side: Product Image Display */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square bg-brand-neutral/20 rounded-2xl overflow-hidden border border-brand-neutral relative shadow-sm hover:shadow-md transition-all">
            <img 
              id="detail-main-image"
              src={activeImage || product.imageUrl} 
              alt={product.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700 ease-out"
            />
            {product.salePrice && (
              <span className="absolute top-5 left-5 bg-brand-orange text-brand-white text-[11px] uppercase font-black tracking-widest px-3 py-1 rounded shadow-md shadow-brand-orange/20 animate-pulse">
                Sale Offer
              </span>
            )}
          </div>

          {/* Gallery thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex flex-wrap gap-3 py-1">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImage === img 
                      ? 'border-brand-orange shadow-md shadow-brand-orange/15' 
                      : 'border-brand-neutral hover:border-brand-dark/30 bg-brand-neutral/20'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} gallery thumbnail ${index + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details & Cart controls */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            
            {/* Classifications */}
            <div className="flex items-center gap-2.5">
              <span className="text-[9px] uppercase font-bold tracking-widest text-brand-orange bg-brand-neutral px-2.5 py-1 rounded border border-brand-neutral">
                {product.gender}
              </span>
              <span className="text-xs text-brand-dark/50 font-semibold tracking-wider">
                {product.categories.join(' • ')}
              </span>
            </div>

            <h1 id="detail-product-title" className="text-2xl sm:text-3.5xl font-black tracking-tight text-brand-dark uppercase">
              {product.title}
            </h1>

            {/* Price display with optional original strikethrough */}
            <div className="flex items-baseline gap-3 pt-1">
              <span id="detail-product-price" className="text-2xl font-black text-brand-dark">
                ${currentPrice}
              </span>
              {originalPrice && (
                <span className="text-brand-dark/40 text-base line-through font-medium">
                  ${originalPrice}
                </span>
              )}
            </div>
          </div>

          <hr className="border-brand-neutral" />

          {/* Sizing description */}
          {product.shortDescription && (
            <p className="text-xs font-serif italic text-brand-dark/50 leading-relaxed border-l-2 border-brand-orange/40 pl-3">
              "{product.shortDescription}"
            </p>
          )}

          <p id="detail-product-description" className="text-sm leading-relaxed text-brand-dark/75 font-sans">
            {product.description}
          </p>

          <hr className="border-brand-neutral" />

          {/* Custom controls based on Product Type (Simple or Variable) */}
          {product.type === 'variable' && (
            <div className="space-y-4.5">
              
              {/* Color selectors */}
              {colors.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs uppercase font-bold tracking-widest text-brand-dark/45 block">
                    Selected Color: <strong className="text-brand-dark ml-1">{selectedColor}</strong>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`text-xs px-3.5 py-1.5 rounded-lg border font-bold transition-all transform hover:scale-[1.03] cursor-pointer ${
                          selectedColor === color
                            ? 'bg-brand-orange text-brand-white border-brand-orange shadow-md shadow-brand-orange/20'
                            : 'bg-brand-white text-brand-dark/85 border-brand-neutral hover:bg-brand-neutral'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizing selectors */}
              {sizes.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs uppercase font-bold tracking-widest text-brand-dark/45 block">
                    Selected Size: <strong className="text-brand-dark ml-1">{selectedSize}</strong>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`text-xs px-4 py-2 border rounded-lg font-bold transition-all transform hover:scale-[1.03] cursor-pointer ${
                          selectedSize === size
                            ? 'bg-brand-orange text-brand-white border-brand-orange shadow-md shadow-brand-orange/20'
                            : 'bg-brand-white text-brand-dark/85 border-brand-neutral hover:bg-brand-neutral hover:border-brand-dark/20'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Stock availability indicator */}
          <div className="flex items-center gap-2 text-xs">
            {activeStock <= 0 ? (
              <span className="text-brand-orange font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Temporarily Out of Stock
              </span>
            ) : activeStock <= 5 ? (
              <span className="text-brand-orange font-bold flex items-center gap-1.5 animate-pulse">
                <AlertTriangle className="w-4 h-4" /> Hurry! Only {activeStock} left in stock.
              </span>
            ) : (
              <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span> In stock (shipment ready)
              </span>
            )}
          </div>

          {/* Action button selectors for cart */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            
            {/* Quantity counters */}
            <div className="flex items-center border border-brand-neutral rounded-xl overflow-hidden bg-brand-white w-full sm:w-auto self-start">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 text-brand-dark/60 hover:text-brand-orange font-bold hover:bg-brand-neutral text-sm transition-all border-r border-brand-neutral"
              >
                -
              </button>
              <span className="px-5 font-bold text-brand-dark text-sm min-w-10 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(activeStock || 25, quantity + 1))}
                className="px-4 py-3 text-brand-dark/60 hover:text-brand-orange font-bold hover:bg-brand-neutral text-sm transition-all border-l border-brand-neutral"
              >
                +
              </button>
            </div>

            {/* Add to Bag Button */}
            <button
              id="detail-add-to-cart-button"
              onClick={handleAddToCart}
              disabled={activeStock <= 0}
              className={`flex-1 py-3.5 px-6 font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 transform cursor-pointer ${
                activeStock <= 0
                  ? 'bg-brand-neutral text-brand-dark/30 border border-brand-neutral cursor-not-allowed shadow-none'
                  : 'bg-brand-orange text-brand-white hover:bg-brand-dark hover:scale-[1.02] hover:shadow-lg hover:shadow-brand-orange/20 active:scale-[0.98]'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              Add To Bag
            </button>

            {/* Wishlist Icon selector */}
            <button
              id="detail-wishlist-button"
              onClick={() => toggleWishlist(product.id)}
              className={`p-3.5 border rounded-xl shadow-sm transition-all duration-300 text-center flex items-center justify-center cursor-pointer transform hover:scale-[1.04] ${
                isWishlisted
                  ? 'text-brand-white border-brand-orange bg-brand-orange hover:bg-brand-dark hover:border-brand-dark'
                  : 'text-brand-dark/40 border-brand-neutral bg-brand-white hover:text-brand-orange hover:bg-brand-neutral'
              }`}
              title="Add to Wishlist"
            >
              <Heart className="w-4.5 h-4.5 fill-current" />
            </button>

          </div>

          {/* Feedback alerts */}
          {toastMessage && (
            <div className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs font-bold animate-fade-in ${
              toastMessage.startsWith('Error')
                ? 'bg-brand-orange/10 text-brand-orange border-brand-orange/30'
                : 'bg-brand-dark text-brand-white border-brand-orange/40 shadow-lg shadow-brand-orange/10'
            }`}>
              <Check className="w-4 h-4 text-brand-orange" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Metadata Specifications list */}
          <div className="border-t border-brand-neutral pt-5 space-y-2.5 text-xs font-mono text-brand-dark/60">
            <div>SKU Code: <strong className="text-brand-dark font-semibold">{activeSku}</strong></div>
            <div>Drape Classification: <strong className="text-brand-dark font-semibold">{product.type === 'simple' ? 'Simple Product (Stand-alone)' : 'Variable Product (Multi-Sizing)'}</strong></div>
          </div>

          {/* Sizing & Styling tag badges */}
          {product.stylingTags && product.stylingTags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 text-left">
              <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-400 self-center">Theme:</span>
              {product.stylingTags.map((style) => (
                <span key={style} className="text-[10px] bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold px-2 py-0.5 rounded transition-all">
                  #{style}
                </span>
              ))}
            </div>
          )}

          {/* Specifications Box */}
          {product.specifications && (
            <div className="border-t border-brand-neutral pt-5 space-y-3 text-left">
              <span className="text-xs uppercase font-extrabold tracking-widest text-brand-dark/75 block">Technical Specification Bench</span>
              <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                <div className="bg-brand-neutral/30 p-2.5 rounded-lg space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-brand-dark/45">Fabric / Material</span>
                  <p className="text-brand-dark font-medium leading-normal">{product.specifications.material}</p>
                </div>
                <div className="bg-brand-neutral/30 p-2.5 rounded-lg space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-brand-dark/45">Fit Silhouette</span>
                  <p className="text-brand-dark font-medium leading-normal">{product.specifications.fit}</p>
                </div>
                <div className="bg-brand-neutral/30 p-2.5 rounded-lg space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-brand-dark/45">Thread Weight</span>
                  <p className="text-brand-dark font-medium leading-normal">{product.specifications.weight}</p>
                </div>
                <div className="bg-brand-neutral/30 p-2.5 rounded-lg space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-brand-dark/45">Garment Care</span>
                  <p className="text-brand-dark font-medium leading-normal">{product.specifications.care}</p>
                </div>
              </div>
            </div>
          )}

          {/* Reviews list */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="border-t border-brand-neutral pt-5 space-y-3.5 text-left">
              <span className="text-xs uppercase font-extrabold tracking-widest text-brand-dark/75 block">
                Boutique Customer Reviews ({product.reviews.length})
              </span>
              <div className="space-y-3">
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="bg-white border border-brand-neutral/65 rounded-xl p-3.5 space-y-1.5 shadow-sm text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-gray-900 font-bold font-sans">{rev.author}</strong>
                      <span className="text-[10px] text-gray-400 font-mono">{rev.date}</span>
                    </div>
                    <div className="flex text-amber-500 gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current text-amber-500' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <p className="text-gray-650 leading-relaxed font-sans">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* WordPress & Rank Math SEO Audits Box */}
      <div className="bg-brand-neutral/20 border border-brand-neutral/60 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-brand-neutral/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-orange rounded-full animate-ping"></div>
            <h3 className="font-bold text-sm text-brand-dark font-sans tracking-tight uppercase font-sans">WordPress E-Commerce SEO Meta (Rank Math Rules)</h3>
          </div>
          <div className="bg-brand-orange text-brand-white px-2.5 py-1 rounded-full text-[10px] font-bold border border-brand-orange flex items-center gap-1 font-mono hover:scale-105 transition-all">
            <Star className="w-3 h-3 fill-current text-white" />
            <span>SEO Score: {product.seoScore || 85}/100</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed font-sans">
          
          {/* Rank Math keyword analysis */}
          <div className="space-y-1.5 border-b md:border-b-0 md:border-r border-brand-neutral pb-3 md:pb-0 pr-0 md:pr-4">
            <div className="font-bold uppercase text-[10px] tracking-widest text-brand-dark/50 font-sans">Focus Keyword</div>
            <p className="bg-brand-neutral/60 px-2.5 py-1 text-xs font-bold rounded text-brand-dark border border-brand-neutral inline-block font-mono">
              {product.focusKeyword || "Not Set"}
            </p>
            <div className="text-[11px] text-brand-dark/50 pt-1 leading-normal font-medium font-sans">
              Keyword exists in product Title and Description. Excellent density!
            </div>
          </div>

          {/* Google Search Listing Meta Title mockup */}
          <div className="space-y-1.5 border-b md:border-b-0 md:border-r border-brand-neutral pb-3 md:pb-0 px-0 md:px-4">
            <div className="font-bold uppercase text-[10px] tracking-widest text-brand-dark/50 font-sans">Google Search Listing Snippet Preview</div>
            <div className="space-y-1 bg-brand-white p-3.5 rounded-lg border border-brand-neutral shadow-sm">
              <div className="text-brand-orange hover:underline font-bold text-[13px] leading-snug truncate">
                {product.seoTitle || `${product.title} - Aura`}
              </div>
              <div className="text-brand-dark/50 text-[11px] leading-tight truncate font-mono">
                https://aura-store.com/garment/{product.id}
              </div>
              <p className="text-brand-dark/70 text-[11px] leading-normal line-clamp-2">
                {product.seoDescription || product.description.substring(0, 120)}
              </p>
            </div>
          </div>

          {/* Google ranking Indexing tags */}
          <div className="space-y-2 pl-0 md:pl-4">
            <div className="font-bold uppercase text-[10px] tracking-widest text-brand-dark/50 font-sans">Index Search Keywords</div>
            <div className="flex flex-wrap gap-1.5">
              {product.seoKeywords && product.seoKeywords.length > 0 ? (
                product.seoKeywords.map((kw, idx) => (
                  <span key={idx} className="bg-brand-white px-2 py-0.5 text-[10px] font-bold rounded border border-brand-neutral font-mono text-brand-dark/70 hover:border-brand-orange transition-colors">
                    #{kw}
                  </span>
                ))
              ) : (
                <span className="text-brand-dark/40 italic font-sans animate-pulse">No search keywords assigned yet.</span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Styled Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="border-b border-brand-neutral pb-3">
            <h3 className="text-lg font-bold tracking-tight text-brand-dark uppercase">
              Elegantly Matched Capsules
            </h3>
            <p className="text-xs text-brand-dark/55 font-semibold">Related designs hand-curated to elevate your active choices.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
