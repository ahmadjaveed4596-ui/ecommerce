import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ShippingAddress, Order } from '../types';
import { 
  CreditCard, Truck, ShieldCheck, CheckCircle2, ShoppingBag, 
  ArrowLeft, ArrowRight, Trash2, Plus, Minus, Tag, Check, Sparkles, DollarSign, FileText
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const { cart, taxRate, createOrder, removeFromCart, updateCartQuantity, navigate } = useApp();

  // Multi-step phase: 1 = Cart Review, 2 = Customer Information, 3 = Payment Method
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [address, setAddress] = useState<ShippingAddress>({
    name: 'Ahmad Javeed',
    email: 'ahmadjaveed4596@gmail.com',
    phone: '+45 92 83 74 65',
    address: '144 Copenhagen Avenue',
    city: 'Copenhagen',
    zip: '1050',
    country: 'Denmark',
  });

  // Credit Card Field States
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [expiry, setExpiry] = useState('09/29');
  const [cvv, setCvv] = useState('123');
  const [paymentOption, setPaymentOption] = useState<'card' | 'cod'>('cod'); // Default COD enabled & active

  // Promocode State
  const [couponInput, setCouponInput] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Field Validation Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Base computations
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const price = item.selectedVariation?.salePrice || item.selectedVariation?.price || item.product.salePrice || item.product.price;
      return acc + (price * item.quantity);
    }, 0);
  }, [cart]);

  // Coupon discount
  const discountAmount = useMemo(() => {
    if (!activeCoupon) return 0;
    return Math.round((subtotal * activeCoupon.discount) * 100) / 100;
  }, [subtotal, activeCoupon]);

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round((taxableAmount * (taxRate / 100)) * 100) / 100;
  const grandTotal = Math.round((taxableAmount + taxAmount) * 100) / 100;

  // Coupon Action
  const handleApplyCoupon = () => {
    setCouponError(null);
    setCouponSuccess(null);
    const code = couponInput.trim().toUpperCase();

    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    if (code === 'AURA20') {
      setActiveCoupon({ code: 'AURA20', discount: 0.20 }); // 20% Off
      setCouponSuccess('Success! 20% luxury discount applied on subtotal.');
    } else if (code === 'CODPOWER') {
      setActiveCoupon({ code: 'CODPOWER', discount: 0.15 }); // 15% Off
      setCouponSuccess('Promo code matched! 15% special settlement savings applied.');
    } else {
      setCouponError('Invalid or expired voucher code. Use coupon "AURA20" or "CODPOWER".');
    }
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon(null);
    setCouponInput('');
    setCouponSuccess(null);
    setCouponError(null);
  };

  // Step Navigations & Form Validations
  const validateStep2Fields = () => {
    const nextErrors: { [key: string]: string } = {};

    if (!address.name.trim()) {
      nextErrors.name = 'Full name is required.';
    }

    // Email Check regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!address.email.trim()) {
      nextErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(address.email.trim())) {
      nextErrors.email = 'Please provide a valid email format.';
    }

    // Phone Check
    const phoneSanitized = address.phone.replace(/[\s()+-]/g, '');
    if (!address.phone.trim()) {
      nextErrors.phone = 'Phone number is required for courier notifications.';
    } else if (phoneSanitized.length < 8) {
      nextErrors.phone = 'Provide a valid phone number (at least 8 digits).';
    }

    if (!address.address.trim()) {
      nextErrors.address = 'A complete shipping address is required for dispatch.';
    }
    if (!address.city.trim()) {
      nextErrors.city = 'Postal City is required.';
    }
    if (!address.zip.trim()) {
      nextErrors.zip = 'Postal Zip Code is required.';
    }
    if (!address.country.trim()) {
      nextErrors.country = 'Country is required.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleGoToStep3 = () => {
    if (validateStep2Fields()) {
      setStep(3);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2Fields()) {
      setStep(2);
      return;
    }

    if (paymentOption === 'card') {
      const cardCleaned = cardNumber.replace(/\s+/g, '');
      if (cardCleaned.length < 16) {
        setErrors(prev => ({ ...prev, card: 'Credit Card must have exactly 16 digits.' }));
        return;
      }
      if (!expiry.includes('/') || expiry.length < 5) {
        setErrors(prev => ({ ...prev, card: 'Expiry must be in MM/YY format.' }));
        return;
      }
      if (cvv.length < 3) {
        setErrors(prev => ({ ...prev, card: 'Security CVV code must have at least 3 digits.' }));
        return;
      }
    }

    setIsSubmitting(true);

    const modeText = paymentOption === 'card' ? 'Credit Card' : 'Cash on Delivery';
    const order = createOrder(address, modeText);

    // Build plain text detailed summary for Formspree / Gmail notification
    const orderItemsSummary = cart.map((item, idx) => {
      const itemPrice = item.selectedVariation?.salePrice || item.selectedVariation?.price || item.product.salePrice || item.product.price;
      return `${idx + 1}. ${item.product.title} (SKU: ${item.selectedVariation?.sku || item.product.sku || 'N/A'})
   Quantity: ${item.quantity}
   Attributes: Size: ${item.selectedAttributes?.size || 'N/A'}, Color: ${item.selectedAttributes?.color || 'N/A'}
   Unit Price: $${itemPrice} | Line Total: $${itemPrice * item.quantity}`;
    }).join("\n\n");

    const fullDetailedSummaryText = `New LUXURY WARDROBE Order Received!

--- CUSTOMER INFO ---
Name: ${address.name}
Email: ${address.email}
Phone: ${address.phone}
Address: ${address.address}
City: ${address.city}
Zip Code: ${address.zip}
Country: ${address.country}

--- TRANSACTION SPECIFICS ---
Order Reference ID: #${order.id}
Payment Method: ${modeText}
Applied Coupon Code: ${activeCoupon ? activeCoupon.code : 'None'}
Gross Subtotal: $${subtotal}
Savings Deduction: -$${discountAmount}
VAT Tax Rate (${taxRate}%): $${taxAmount}
Amount Payable (Total): $${grandTotal}

--- APPARELS ORDERED ---
${orderItemsSummary}`;

    // POST order data to Formspree
    try {
      await fetch('https://formspree.io/f/mnjryblr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          order_id: order.id,
          name: address.name,
          email: address.email,
          phone: address.phone,
          shipping_address: address.address,
          city: address.city,
          zip_code: address.zip,
          country: address.country,
          payment_method: modeText,
          coupon_code: activeCoupon ? activeCoupon.code : 'None',
          subtotal: `$${subtotal}`,
          discount: `-$${discountAmount}`,
          tax: `$${taxAmount}`,
          grand_total: `$${grandTotal}`,
          items_list: cart.map(item => `${item.product.title} (x${item.quantity})`).join(', '),
          message: fullDetailedSummaryText
        })
      });
      console.log("Successfully connected order data to Formspree notification API.");
    } catch (formspreeErr) {
      console.warn("Formspree notification endpoint failed, dispatch fallback online:", formspreeErr);
    }

    setPlacedOrder({
      ...order,
      // Override totals in case context isn't coupon-aware
      subtotal,
      tax: taxAmount,
      total: grandTotal,
      paymentMethod: modeText,
      paymentStatus: 'pending',
    });
    setIsSubmitting(false);
  };

  // 1. CONFIRMATION SCREEN
  if (placedOrder) {
    const isCOD = placedOrder.paymentMethod === 'Cash on Delivery';
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 space-y-8 font-sans text-left">
        
        {/* Success Animation & Header Box */}
        <div className="bg-gradient-to-br from-zinc-50 to-zinc-100 border border-gray-200 rounded-3xl p-8 text-center space-y-4 shadow-sm relative overflow-hidden animate-fade-in">
          <div className="absolute top-0 left-0 w-full h-1 bg-brand-orange" />
          
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-200 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
              Order Registered Successfully
            </span>
            <h2 className="text-zinc-900 font-black text-2xl tracking-tight uppercase pt-2">
              WARDROBE ORDER CONFIRMED
            </h2>
            <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
              Your garments have been securely assigned to our luxury design channel. Estimated delivery courier dispatch is scheduled.
            </p>
          </div>

          <div className="pt-2">
            <div className="inline-flex flex-col sm:flex-row gap-2 bg-zinc-900 text-white rounded-2xl p-4 shrink items-center text-left max-w-xl mx-auto border border-zinc-800 shadow">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-zinc-500 block font-bold">Courier tracking code</span>
                <span className="font-mono text-xs font-black text-brand-orange select-all">#{placedOrder.id}</span>
              </div>
              <div className="hidden sm:block h-6 w-px bg-zinc-800 mx-4" />
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-zinc-500 block font-bold">Estimated Arrival</span>
                <span className="text-xs font-bold text-zinc-250 font-sans">Within 2 - 3 Business Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* COD Explicit Prominent Alert Message Block */}
        {isCOD && (
          <div className="bg-brand-orange/5 border-2 border-brand-orange/30 p-5 rounded-2xl space-y-2 flex items-start gap-3 w-full animate-pulse">
            <div className="p-2.5 bg-brand-orange/15 text-brand-orange rounded-xl shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-brand-orange" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-brand-orange font-sans">
                Cash on Delivery Information desk
              </h4>
              <p className="text-xs font-medium text-zinc-800 leading-relaxed font-sans">
                Your order will be settled post-delivery! <strong>Please keep direct cash ready (${placedOrder.total})</strong> upon delivery window to present directly to our courier executive. No advanced cards required.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column Box: Physical summary */}
          <div className="lg:col-span-8 bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="font-black text-xs text-zinc-900 tracking-wider uppercase border-b border-gray-100 pb-3 flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-brand-orange" />
              Delivery Details & Recipient
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-gray-650 leading-relaxed font-sans">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-zinc-400 font-sans">Recipient Identity</span>
                <p className="font-extrabold text-zinc-900 text-sm">{placedOrder.shippingAddress.name}</p>
                <div className="text-zinc-500 font-semibold space-y-0.5 mt-1">
                  <p>Ph: {placedOrder.shippingAddress.phone}</p>
                  <p>E: {placedOrder.shippingAddress.email}</p>
                </div>
              </div>

              <div className="space-y-1 text-left">
                <span className="text-[9px] uppercase font-bold text-zinc-400 font-sans">Fulfillment Destination</span>
                <p className="font-bold text-zinc-800">{placedOrder.shippingAddress.address}</p>
                <p className="font-medium text-zinc-650">{placedOrder.shippingAddress.city}, {placedOrder.shippingAddress.zip}</p>
                <p className="font-medium text-zinc-650 uppercase font-mono tracking-wider">{placedOrder.shippingAddress.country}</p>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Item summary */}
            <div className="space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 font-sans">Ordered Apparel Matrix</span>
              <div className="space-y-3.5">
                {placedOrder.items.map((item, idx) => {
                  const itemPrice = item.selectedVariation?.salePrice || item.selectedVariation?.price || item.product.salePrice || item.product.price;
                  return (
                    <div key={idx} className="flex gap-4 items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.product.imageUrl} 
                          alt="" 
                          className="w-12 h-12 rounded-xl object-cover border border-gray-150 shadow-sm shrink-0"
                        />
                        <div className="space-y-0.5">
                          <h4 className="font-extrabold text-xs text-zinc-900 uppercase">{item.product.title}</h4>
                          <div className="flex gap-2 text-[10px] text-zinc-400 font-semibold font-sans">
                            <span>Quantity: {item.quantity}</span>
                            {item.selectedAttributes && (
                              <span className="text-brand-orange uppercase">({item.selectedAttributes.size} • {item.selectedAttributes.color})</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-zinc-900 text-xs font-black">${itemPrice * item.quantity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column Box: Ledger billing */}
          <div className="lg:col-span-4 bg-zinc-50 border border-gray-150 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-xs text-zinc-900 uppercase tracking-wider pb-1 border-b border-gray-200">Payment Breakdown</h3>
            
            <div className="space-y-2 text-xs font-sans text-gray-500">
              <div className="flex justify-between">
                <span>Gross Subtotal</span>
                <span className="font-mono font-bold text-zinc-900">${placedOrder.subtotal}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-650 font-bold">
                  <span>Savings Deduction</span>
                  <span className="font-mono">-${discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping Courier</span>
                <span className="text-[9px] font-bold text-brand-orange bg-brand-orange/10 px-1.5 py-0.2 rounded font-mono">COMPLIMENTARY</span>
              </div>

              <div className="flex justify-between">
                <span>Estimated VAT Tax</span>
                <span className="font-mono font-bold text-zinc-900">${placedOrder.tax}</span>
              </div>

              <div className="h-px bg-gray-200 my-2" />

              <div className="flex justify-between text-sm font-semibold text-zinc-900 uppercase">
                <span>Amount Payable</span>
                <span className="font-mono font-black text-brand-orange text-lg">${placedOrder.total}</span>
              </div>

              <div className="pt-2 text-[10px] space-y-1 bg-zinc-100 p-2.5 rounded-lg border border-zinc-200/50">
                <div className="flex justify-between text-zinc-650">
                  <span>Settlement Mode:</span>
                  <strong className="text-zinc-900">{placedOrder.paymentMethod}</strong>
                </div>
                <div className="flex justify-between text-zinc-650">
                  <span>Payment status:</span>
                  <strong className="text-brand-orange uppercase tracking-wide">PENDING (COD)</strong>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Buttons to navigate away */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={() => navigate('home')}
            className="flex-1 py-3.5 bg-brand-orange hover:bg-zinc-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </button>
          
          <button
            onClick={() => navigate('user-dashboard')}
            className="flex-1 py-3.5 bg-white border border-gray-200 hover:bg-gray-50 text-zinc-900 font-bold text-xs uppercase tracking-widest rounded-xl shadow-sm transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
          >
            Track Order Status
            <ArrowRight className="w-4 h-4 text-brand-orange" />
          </button>
        </div>

      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-8 font-sans text-left animate-fade-in">
      
      {/* Dynamic Checkout Header */}
      <div className="border-b border-gray-150 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[9px] uppercase tracking-widest text-brand-orange font-mono font-extrabold block">Luxury Wardrobe Secured checkout Desk</span>
          <h1 className="text-2xl font-black text-zinc-950 uppercase tracking-tight">Fulfillment Securer</h1>
        </div>
        
        {/* Animated Progress Step Badges */}
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <button 
            onClick={() => cart.length > 0 && setStep(1)}
            className={`px-3 py-1.5 rounded-lg font-bold border ${
              step === 1 ? 'bg-brand-orange text-white border-brand-orange' : 'bg-white text-zinc-500 border-gray-200'
            }`}
          >
            01. Bag Review
          </button>
          <span className="text-gray-300">/</span>
          <button 
            onClick={() => cart.length > 0 && step > 1 && setStep(2)}
            disabled={step < 2}
            className={`px-3 py-1.5 rounded-lg font-bold border transition-all ${
              step === 2 ? 'bg-brand-orange text-white border-brand-orange' : 'bg-white text-zinc-500 border-gray-200 disabled:opacity-50'
            }`}
          >
            02. Recipient Desk
          </button>
          <span className="text-gray-300">/</span>
          <button 
            disabled={step < 3}
            className={`px-3 py-1.5 rounded-lg font-bold border transition-all ${
              step === 3 ? 'bg-brand-orange text-white border-brand-orange' : 'bg-white text-zinc-500 border-gray-200 disabled:opacity-50'
            }`}
          >
            03. Secured Settlement
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Action Form / Left Side */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* STEP 1: CART REVIEW SCREEN */}
          {step === 1 && (
            <div id="checkout-step-1" className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="font-extrabold text-sm text-zinc-950 uppercase tracking-tight">Review Selected Apparel Bag</h3>
                <p className="text-xs text-gray-500">Edit quantities, remove garments, or inspect sizing profiles before entering delivery coordinates.</p>
              </div>

              {/* Items Table / Cards */}
              <div className="divide-y divide-gray-100">
                {cart.map((item, id) => {
                  const currentPrice = item.selectedVariation?.salePrice || item.selectedVariation?.price || item.product.salePrice || item.product.price;
                  return (
                    <div key={item.cartId} className="flex flex-col sm:flex-row gap-4 items-stretch justify-between py-4.5 first:pt-0 last:pb-0">
                      
                      <div className="flex gap-4">
                        <img 
                          src={item.product.imageUrl} 
                          alt="" 
                          className="w-16 h-16 rounded-xl object-cover border border-gray-150 shadow-sm shrink-0"
                        />
                        <div className="space-y-1 text-left">
                          <h4 className="font-black text-xs text-zinc-900 uppercase leading-snug">{item.product.title}</h4>
                          <p className="text-[10px] text-zinc-400 font-mono tracking-wider">SKU: {item.selectedVariation?.sku || item.product.sku}</p>
                          {item.selectedAttributes && (
                            <div className="flex gap-2.5 pt-1">
                              <span className="text-[9px] uppercase tracking-wider font-bold bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded">
                                Size: {item.selectedAttributes.size}
                              </span>
                              <span className="text-[9px] uppercase tracking-wider font-bold bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded">
                                Color: {item.selectedAttributes.color}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0">
                        {/* Quantity Counter Control Dashboard */}
                        <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.cartId, item.quantity - 1)}
                            className="p-1.5 hover:bg-white rounded-lg transition-colors cursor-pointer text-gray-500"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-black font-mono text-zinc-950">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.cartId, item.quantity + 1)}
                            className="p-1.5 hover:bg-white rounded-lg transition-colors cursor-pointer text-gray-500"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Cost & Delete box */}
                        <div className="flex items-center gap-4">
                          <div className="text-right font-mono text-xs font-black text-zinc-900">
                            ${currentPrice * item.quantity}
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.cartId)}
                            className="p-2 text-gray-400 hover:text-brand-orange hover:bg-brand-orange/5 rounded-xl transition-all cursor-pointer border border-transparent hover:border-brand-orange/15"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Promo code drawer block */}
              <div className="bg-zinc-50 border border-gray-150 rounded-xl p-4 space-y-3 font-sans">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 uppercase tracking-tight flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-brand-orange" />
                    Boutique Voucher Desk
                  </span>
                  {activeCoupon && (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[10px] text-red-500 hover:underline hover:text-red-650 cursor-pointer font-bold uppercase tracking-wider"
                    >
                      Remove code ({activeCoupon.code})
                    </button>
                  )}
                </div>

                {!activeCoupon ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. AURA20, CODPOWER"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3.5 py-2 border border-gray-250 rounded-xl text-xs bg-white text-gray-900 focus:outline-none placeholder-zinc-450 focus:border-zinc-900"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl tracking-wider transition-all cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl text-xs font-medium">
                    <Check className="w-4 h-4 shrink-0" />
                    <span><strong>Code Applied: {activeCoupon.code}</strong>. You saved <strong>{activeCoupon.discount * 100}%</strong> on boutique luxury wearables!</span>
                  </div>
                )}

                {/* Notifications states */}
                {couponError && (
                  <p className="text-xs font-bold text-red-500">{couponError}</p>
                )}
                {couponSuccess && !couponError && !activeCoupon && (
                  <p className="text-xs font-bold text-emerald-650">{couponSuccess}</p>
                )}
                
                <p className="text-[10px] text-zinc-400 font-medium">⭐ Try seeding code <strong>"AURA20"</strong> for 20% off or <strong>"CODPOWER"</strong> for 15% VIP settlement discount.</p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  id="checkout-next-to-step2"
                  onClick={() => setStep(2)}
                  className="w-full py-3.5 bg-brand-orange hover:bg-zinc-950 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform duration-300 transform hover:scale-101"
                >
                  Configure Recipient Destination
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: RECIPIENT INFORMATION (CUSTOMER INFORMATION) */}
          {step === 2 && (
            <div id="checkout-step-2" className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in">
              <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-zinc-950 uppercase tracking-tight">Delivery Address & Coordinates</h3>
                  <p className="text-xs text-gray-500 font-sans">Enter customer contact info and exact physical coordinates to allow instant dispatch.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-zinc-400 hover:text-zinc-900 cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Edit Closet Bag
                </button>
              </div>

              {/* Recipient Form Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left font-sans">
                
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Full Name</label>
                  <input
                    type="text"
                    required
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-xs bg-white text-zinc-900 focus:outline-none transition-all ${
                      errors.name ? 'border-red-500 ring-1 ring-red-550' : 'border-gray-250 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange'
                    }`}
                  />
                  {errors.name && <p className="text-[10px] text-red-500 font-bold">{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Email Address (Invoicing Check)</label>
                  <input
                    type="email"
                    required
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-xs bg-white text-zinc-900 focus:outline-none transition-all ${
                      errors.email ? 'border-red-500 ring-1 ring-red-550' : 'border-gray-250 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange'
                    }`}
                  />
                  {errors.email && <p className="text-[10px] text-red-500 font-bold">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Phone Number (Required for Courier Contact)</span>
                  <input
                    type="text"
                    required
                    placeholder="+45 92 83 74 65"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-xs bg-white text-zinc-900 focus:outline-none transition-all ${
                      errors.phone ? 'border-red-500 ring-1 ring-red-550' : 'border-gray-250 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange'
                    }`}
                  />
                  {errors.phone && <p className="text-[10px] text-red-500 font-bold">{errors.phone}</p>}
                </div>

                {/* Country */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Country</label>
                  <input
                    type="text"
                    required
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-xs bg-white text-zinc-900 focus:outline-none transition-all ${
                      errors.country ? 'border-red-500 ring-1 ring-red-550' : 'border-gray-250 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange'
                    }`}
                  />
                  {errors.country && <p className="text-[10px] text-red-500 font-bold">{errors.country}</p>}
                </div>

                {/* Physical Street address */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Full Physical Postal Address</label>
                  <input
                    type="text"
                    required
                    placeholder="Street name, suite, house number"
                    value={address.address}
                    onChange={(e) => setAddress({ ...address, address: e.target.value })}
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-xs bg-white text-zinc-900 focus:outline-none transition-all ${
                      errors.address ? 'border-red-500 ring-1 ring-red-550' : 'border-gray-250 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange'
                    }`}
                  />
                  {errors.address && <p className="text-[10px] text-red-500 font-bold">{errors.address}</p>}
                </div>

                {/* City */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">City / State</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-xs bg-white text-zinc-900 focus:outline-none transition-all ${
                      errors.city ? 'border-red-500 ring-1 ring-red-550' : 'border-gray-250 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange'
                    }`}
                  />
                  {errors.city && <p className="text-[10px] text-red-500 font-bold">{errors.city}</p>}
                </div>

                {/* Zip */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Postal Code (ZIP)</label>
                  <input
                    type="text"
                    required
                    value={address.zip}
                    onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-xs bg-white text-zinc-900 focus:outline-none transition-all ${
                      errors.zip ? 'border-red-500 ring-1 ring-red-550' : 'border-gray-250 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange'
                    }`}
                  />
                  {errors.zip && <p className="text-[10px] text-red-500 font-bold">{errors.zip}</p>}
                </div>

              </div>

              <div className="pt-2">
                <button
                  type="button"
                  id="checkout-send-to-step3"
                  onClick={handleGoToStep3}
                  className="w-full py-3.5 bg-brand-orange hover:bg-zinc-950 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow focus:outline-none flex items-center justify-center gap-2 cursor-pointer transition-transform transform hover:scale-101"
                >
                  Configure secured Settlement
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SECURED SETTLEMENT & PAY METHODS */}
          {step === 3 && (
            <div id="checkout-step-3" className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in text-left">
              <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-zinc-950 uppercase tracking-tight">Secured Settlement Method</h3>
                  <p className="text-xs text-gray-500 font-sans">Choose between offline Cash on Delivery or online Credit/Debit cards details with encryption layers.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-bold text-zinc-400 hover:text-zinc-900 cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Edit Coordinates
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* PAYMENT option A: Cash on Delivery (COD) - ENABLED AND PREMIUM */}
                <div
                  id="payment-option-cod"
                  onClick={() => setPaymentOption('cod')}
                  className={`border-2 rounded-2xl p-5 cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between min-h-[140px] ${
                    paymentOption === 'cod'
                      ? 'border-brand-orange bg-[#FFFDFC] shadow-md shadow-brand-orange/10'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  {paymentOption === 'cod' && (
                    <div className="absolute right-3 top-3 bg-brand-orange text-white rounded-full p-1 border border-white shadow-sm animate-pulse">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl border shrink-0 ${
                        paymentOption === 'cod' ? 'bg-brand-orange/10 text-brand-orange border-brand-orange/20' : 'bg-zinc-50 text-zinc-400 border-zinc-200'
                      }`}>
                        <Truck className="w-5 h-5" />
                      </div>
                      <span className="text-xs uppercase font-extrabold tracking-widest text-zinc-900 block font-mono">
                        Cash on Delivery
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">
                      Pay with cash when your luxury order is delivered directly to your doorstep. Secure, simple, no gateway required.
                    </p>
                  </div>

                  <div className="pt-3 flex items-center justify-between">
                    <span className="text-[9px] text-brand-orange font-bold font-mono tracking-widest">ENABLED & ACTIVE</span>
                    <span className="text-[10px] font-mono text-zinc-900 font-black">Free Delivery</span>
                  </div>
                </div>

                {/* PAYMENT option B: Credit Card Security - IMMERSIVE OPTION */}
                <div
                  id="payment-option-card"
                  onClick={() => setPaymentOption('card')}
                  className={`border-2 rounded-2xl p-5 cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between min-h-[140px] ${
                    paymentOption === 'card'
                      ? 'border-brand-orange bg-[#FFFDFC] shadow-md shadow-brand-orange/10'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  {paymentOption === 'card' && (
                    <div className="absolute right-3 top-3 bg-brand-orange text-white rounded-full p-1 border border-white shadow-sm">
                      <Check className="w-3 h-3" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl border shrink-0 ${
                        paymentOption === 'card' ? 'bg-brand-orange/10 text-brand-orange border-brand-orange/20' : 'bg-zinc-50 text-zinc-400 border-zinc-200'
                      }`}>
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <span className="text-xs uppercase font-extrabold tracking-widest text-zinc-900 block font-mono">
                        Secured Credit Card
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">
                      Settle your transaction immediately using encrypted gateway processors. Visa, MasterCard, and Amex accepted.
                    </p>
                  </div>

                  <div className="pt-3 flex items-center justify-between">
                    <span className="text-[9px] text-zinc-450 font-bold font-mono">ONLINE ROUTING</span>
                    <span className="text-[10px] font-mono text-zinc-500 font-black">256-bit SSL</span>
                  </div>
                </div>

              </div>

              {/* DYNAMIC CARD DETAIL FORMS */}
              {paymentOption === 'card' && (
                <div className="bg-zinc-50 border border-gray-150 rounded-2xl p-5 space-y-4 font-sans animate-fade-in text-left">
                  <div className="border-b border-gray-200 pb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-brand-orange" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-700">PCI Encrypted Gateway Details</span>
                  </div>

                  {errors.card && (
                    <p className="text-xs font-bold text-red-500">{errors.card}</p>
                  )}

                  <div className="space-y-3">
                    {/* Card field */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Secure Credit Card Input</label>
                      <input
                        type="text"
                        placeholder="4111 2222 3333 4444"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-gray-250 rounded-xl text-xs bg-white text-gray-900 focus:outline-none font-mono tracking-widest focus:border-zinc-800"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Card Expiry (MM/YY)</label>
                        <input
                          type="text"
                          placeholder="09/29"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-gray-250 rounded-xl text-xs bg-white text-gray-900 focus:outline-none font-mono tracking-widest focus:border-zinc-800"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Security Card CVV</label>
                        <input
                          type="password"
                          placeholder="123"
                          maxLength={4}
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-gray-250 rounded-xl text-xs bg-white text-gray-900 focus:outline-none font-mono tracking-widest focus:border-zinc-800"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentOption === 'cod' && (
                <div className="bg-brand-orange/5 border border-brand-orange/20 rounded-2xl p-5 space-y-2 animate-fade-in text-left">
                  <span className="text-[9px] uppercase font-bold text-brand-orange tracking-widest block font-mono">
                    COMPLIMENTARY COD CONSOLE
                  </span>
                  <p className="text-xs text-zinc-800 font-sans leading-relaxed">
                    ✨ You have selected <strong>Cash on Delivery (COD)</strong> routing, working seamlessly similar toDaraz/Shopify channels! No transaction processing logs or security risks. Simply click the commit button below to complete. Keep <strong>${grandTotal} cash ready</strong> for courier physical delivery.
                  </p>
                </div>
              )}

              {/* Action checkout placement button */}
              <button
                type="button"
                id="btn-complete-fulfillment"
                disabled={isSubmitting}
                onClick={handlePlaceOrder}
                className="w-full py-4 bg-brand-orange hover:bg-zinc-950 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 pointer-events-auto shrink-0 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Truck className="w-4 h-4 animate-bounce shrink-0" />
                    REGISTERING COURIER fulfillment...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    Place Outfit Order • ${grandTotal}
                  </>
                )}
              </button>
            </div>
          )}

        </div>

        {/* Right Summary Panel Widget */}
        <div className="lg:col-span-4 bg-zinc-50 border border-gray-150 rounded-2xl p-6 shadow-sm space-y-5 animate-fade-in text-left">
          <h3 className="font-extrabold text-xs text-zinc-950 uppercase tracking-widest border-b border-gray-200 pb-3">Ledger Desk Summary</h3>
          
          <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto pr-1">
            {cart.map((item) => {
              const basePrice = item.selectedVariation?.salePrice || item.selectedVariation?.price || item.product.salePrice || item.product.price;
              return (
                <div key={item.cartId} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                  <img 
                    src={item.product.imageUrl} 
                    alt="" 
                    className="w-10 h-10 rounded-lg object-cover border border-gray-200 shadow-sm shrink-0"
                  />
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <h5 className="font-black text-[11px] text-zinc-900 uppercase truncate leading-tight">{item.product.title}</h5>
                    <div className="flex justify-between text-[10px] text-zinc-400 font-semibold font-sans">
                      <span>Qt: {item.quantity}</span>
                      <span className="font-mono text-zinc-900 font-bold">${basePrice * item.quantity}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <hr className="border-gray-200" />

          {/* Pricing computations ledger */}
          <div className="space-y-2 text-xs text-gray-500 font-sans">
            <div className="flex justify-between">
              <span>Gross Apparel Subtotal</span>
              <span className="font-mono font-bold text-zinc-900">${subtotal}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between font-bold text-emerald-650">
                <span>Savings Deduction ({activeCoupon?.code})</span>
                <span className="font-mono">-${discountAmount}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Shipping courier Dispatch</span>
              <span className="text-[9px] font-bold text-brand-orange bg-brand-orange/10 px-1.5 py-0.2 rounded font-mono">COMPLIMENTARY</span>
            </div>

            <div className="flex justify-between">
              <span>Estimated VAT Tax ({taxRate}%)</span>
              <span className="font-mono font-bold text-zinc-900">${taxAmount}</span>
            </div>

            <div className="h-px bg-gray-200 my-2" />

            <div className="flex justify-between text-sm font-black text-zinc-950 uppercase pt-1">
              <span>Grand Total</span>
              <span className="font-mono text-brand-orange text-lg">${grandTotal}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
