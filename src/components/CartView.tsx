import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, ArrowRight, Trash2, ArrowLeft, Ticket, Percent } from 'lucide-react';

export const CartView: React.FC = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    taxRate, 
    navigate 
  } = useApp();

  const [couponCode, setCouponCode] = useState('');
  const [activeDiscount, setActiveDiscount] = useState<number>(0); // percentage e.g. 10 for 10%
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'detail'; message: string } | null>(null);

  // Cart Subtotal Calculation
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const price = item.selectedVariation?.salePrice || item.selectedVariation?.price || item.product.salePrice || item.product.price;
      return acc + (price * item.quantity);
    }, 0);
  }, [cart]);

  // Handle promo codes
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponFeedback(null);

    const code = couponCode.trim().toUpperCase();
    if (code === 'AURA10') {
      setActiveDiscount(10);
      setCouponFeedback({ type: 'success', message: 'Promo code AURA10 applied! Enjoy 10% off your wardrobe.' });
    } else if (code === 'FREESHIP') {
      setCouponFeedback({ type: 'success', message: 'FREESHIP coupon active! Shipping fees waived.' });
    } else {
      setCouponFeedback({ type: 'detail', message: 'Invalid coupon. Try using "AURA10" for 10% off.' });
    }
  };

  // Pricing calculations
  const discountAmount = Math.round((subtotal * (activeDiscount / 100)) * 100) / 100;
  const taxableSubtotal = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round((taxableSubtotal * (taxRate / 100)) * 100) / 100;
  const grandTotal = Math.round((taxableSubtotal + taxAmount) * 100) / 100;

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-5 font-sans animate-fade-in">
        <div className="w-16 h-16 bg-brand-neutral text-brand-dark/40 rounded-full border border-brand-neutral flex items-center justify-center mx-auto text-xl shadow-inner">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h2 className="text-brand-dark font-black text-xl tracking-tight uppercase">Your Wardrobe-Bag is Empty</h2>
        <p className="text-xs text-brand-dark/50 max-w-sm mx-auto leading-relaxed">
          Looks like you haven't selected any premium apparel yet. Explore our latest Danish outerwear drapes and Alabaster knitwear lines to begin.
        </p>
        <button
          id="cart-start-shopping"
          onClick={() => navigate('home')}
          className="px-6 py-3 bg-brand-orange text-brand-white hover:bg-brand-dark font-black text-xs uppercase tracking-widest rounded-full shadow-lg shadow-brand-orange/20 transition-all duration-300 transform hover:scale-105 cursor-pointer"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 font-sans">
      
      {/* View Title */}
      <div className="border-b border-brand-neutral pb-4">
        <h1 className="text-2xl font-black text-brand-dark tracking-tight flex items-center gap-2 uppercase">
          Your Wardrobe Bag
          <span className="text-sm font-semibold text-brand-dark/40 font-mono">({cart.length} item categories)</span>
        </h1>
        <p className="text-xs text-brand-dark/45">Edit quantities and verify your measurements before checking out.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Product List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => {
            const currentItemPrice = item.selectedVariation?.salePrice || item.selectedVariation?.price || item.product.salePrice || item.product.price;

            return (
              <div 
                key={item.cartId}
                id={`cart-item-${item.cartId}`}
                className="flex flex-col sm:flex-row gap-4 p-5 bg-brand-white border border-brand-neutral rounded-2xl items-start sm:items-center relative shadow-sm hover:shadow-md hover:border-brand-orange/20 transition-all duration-300"
              >
                {/* Thumb */}
                <div 
                  onClick={() => navigate('product-details', item.product.id)}
                  className="w-18 h-18 bg-brand-neutral border border-brand-neutral/50 rounded-xl overflow-hidden cursor-pointer shrink-0"
                >
                  <img 
                    src={item.product.imageUrl} 
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Details info */}
                <div className="flex-1 space-y-1">
                  <h4 
                    onClick={() => navigate('product-details', item.product.id)}
                    className="font-bold text-brand-dark text-sm hover:text-brand-orange cursor-pointer leading-tight line-clamp-1 transition-colors duration-200"
                  >
                    {item.product.title}
                  </h4>
                  
                  {/* Variation Details */}
                  {item.selectedAttributes && (
                    <div className="flex gap-2.5 text-[11px] font-semibold text-brand-dark/40">
                      {item.selectedAttributes.size && (
                        <span>Size: <strong className="text-brand-dark font-bold">{item.selectedAttributes.size}</strong></span>
                      )}
                      {item.selectedAttributes.color && (
                        <span>Color: <strong className="text-brand-dark font-bold">{item.selectedAttributes.color}</strong></span>
                      )}
                    </div>
                  )}

                  <div className="text-[11px] font-mono text-brand-dark/40">
                    SKU: {item.selectedVariation?.sku || item.product.sku}
                  </div>
                </div>

                {/* Counter controls */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                  <div className="flex items-center border border-brand-neutral rounded-lg overflow-hidden bg-brand-white">
                    <button
                      onClick={() => updateCartQuantity(item.cartId, item.quantity - 1)}
                      className="px-2.5 py-1 text-brand-dark/60 hover:text-brand-orange font-bold hover:bg-brand-neutral text-xs border-r border-brand-neutral"
                    >
                      -
                    </button>
                    <span className="px-3.5 font-bold text-brand-dark text-xs text-center min-w-7">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.cartId, item.quantity + 1)}
                      className="px-2.5 py-1 text-brand-dark/60 hover:text-brand-orange font-bold hover:bg-brand-neutral text-xs border-l border-brand-neutral"
                    >
                      +
                    </button>
                  </div>

                  {/* Individual Item Pricing */}
                  <div className="text-right min-w-16">
                    <div className="font-extrabold text-brand-dark text-sm">
                      ${currentItemPrice * item.quantity}
                    </div>
                    {item.quantity > 1 && (
                      <div className="text-[10px] text-brand-dark/40 font-mono">
                        (${currentItemPrice} ea)
                      </div>
                    )}
                  </div>

                  {/* Trash action button */}
                  <button
                    id={`remove-cart-item-${item.cartId}`}
                    onClick={() => removeFromCart(item.cartId)}
                    className="p-1.5 text-brand-dark/40 hover:text-brand-orange rounded-lg hover:bg-brand-neutral transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}

          {/* Sorter Link back */}
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-dark/50 hover:text-brand-orange transition-colors duration-300 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Continue shopping more capsules
          </button>
        </div>

        {/* Right: Subtotal Order Summary Box */}
        <div className="lg:col-span-4 space-y-5 animate-fade-in">
          <div className="bg-brand-white border border-brand-neutral rounded-2xl p-6 shadow-md shadow-brand-dark/5 space-y-4">
            <h3 className="font-bold text-brand-dark text-sm tracking-tight border-b border-brand-neutral pb-3 uppercase">Wardrobe Summary</h3>
            
            <div className="space-y-2 text-xs leading-relaxed text-brand-dark/70">
              <div className="flex justify-between">
                <span>Garment Subtotal</span>
                <span className="font-mono text-brand-dark font-semibold">${subtotal}</span>
              </div>
              
              {/* Promo Discount line */}
              {activeDiscount > 0 && (
                <div className="flex justify-between text-brand-orange">
                  <span className="flex items-center gap-1 font-bold uppercase tracking-wide text-[10px]">
                    <Percent className="w-3 h-3" />
                    AURA10 Code ({activeDiscount}%)
                  </span>
                  <span className="font-mono font-extrabold">-${discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span>Shipping Courier</span>
                <span className="font-bold text-[10px] bg-brand-neutral text-brand-orange px-2 py-0.5 rounded font-mono tracking-widest uppercase">COMPLIMENTARY</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  Est. Sales Tax
                  <span className="text-[10px] bg-brand-neutral text-brand-dark/60 font-mono px-1 rounded">
                    {taxRate}%
                  </span>
                </span>
                <span className="font-mono text-brand-dark font-semibold">${taxAmount}</span>
              </div>
              
              <hr className="border-brand-neutral" />
              
              <div className="flex justify-between text-sm pt-1">
                <span className="font-bold text-brand-dark uppercase">Total Amount</span>
                <span id="cart-grand-total" className="font-black text-brand-dark font-mono text-base">${grandTotal}</span>
              </div>
            </div>

            {/* Checkout CTA triggers navigation */}
            <button
              id="cart-proceed-checkout"
              onClick={() => navigate('checkout')}
              className="w-full py-3 bg-brand-orange hover:bg-brand-dark text-brand-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:shadow-brand-orange/15 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer transform hover:scale-102"
            >
              Secure Checkout
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Coupon inputs */}
          <div className="bg-brand-white border border-brand-neutral rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-brand-dark/70 uppercase">
              <Ticket className="w-3.5 h-3.5 text-brand-dark/45" />
              <span>Have a promotional coupon?</span>
            </div>
            
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                id="cart-coupon-input"
                type="text"
                placeholder="PROMO CODE (e.g. AURA10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-brand-neutral border border-brand-neutral/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange text-brand-dark/95 placeholder-brand-dark/30 font-semibold"
              />
              <button
                id="cart-apply-coupon"
                type="submit"
                className="px-4 py-1.5 bg-brand-dark hover:bg-brand-orange text-brand-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300 cursor-pointer"
              >
                Apply
              </button>
            </form>

            {couponFeedback && (
              <p className={`text-[10px] leading-relaxed font-bold font-sans px-2.5 py-1.5 rounded ${
                couponFeedback.type === 'success' 
                  ? 'bg-brand-dark text-brand-white border border-brand-orange/20 shadow' 
                  : 'bg-brand-orange/10 text-brand-orange border border-brand-orange/30'
              }`}>
                {couponFeedback.message}
              </p>
            )}

            <p className="text-[10px] text-brand-dark/40 leading-normal font-medium">
              Apply coupon <strong className="text-brand-orange font-bold">AURA10</strong> for a 10% discount on entire cart order!
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
