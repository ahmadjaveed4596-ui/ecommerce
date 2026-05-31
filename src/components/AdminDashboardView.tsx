import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Variation, Category } from '../types';
import { 
  Plus, Edit3, Trash2, Database, Percent, Star, AlertCircle, 
  Sparkles, Check, CheckCircle2, RefreshCw, Layers, Sliders, DollarSign, ArrowLeftRight 
} from 'lucide-react';
import { generate125Products, megaCategories } from '../data/megaProducts';

export const AdminDashboardView: React.FC = () => {
  const { 
    products, 
    categories, 
    taxRate, 
    setTaxRate, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    addCategory, 
    deleteCategory,
    resetCatalog,
    orders,
    updateOrderStatus
  } = useApp();

  // Active form section: 'list' (catalog review) or 'form' (add / edit product)
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'list' | 'add-product' | 'categories-tax' | 'ai-populator' | 'orders'>('list');
  
  // AI Crawler UI states
  const [crawledProduct, setCrawledProduct] = useState<Product | null>(null);
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlLogs, setCrawlLogs] = useState<string[]>([]);
  const [crawlerCategory, setCrawlerCategory] = useState('T-Shirts');
  const [crawlerGender, setCrawlerGender] = useState<'men' | 'women' | 'unisex'>('unisex');
  const [crawlerQuery, setCrawlerQuery] = useState('');

  // Is editing product status
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Core Product Form fields
  const [title, setTitle] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedGender, setSelectedGender] = useState<'men' | 'women' | 'unisex'>('unisex');
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [productType, setProductType] = useState<'simple' | 'variable'>('simple');

  // Variation builder states (if productType === 'variable')
  const [variationsList, setVariationsList] = useState<Variation[]>([]);
  const [varSize, setVarSize] = useState('M');
  const [varColor, setVarColor] = useState('Silver');
  const [varPrice, setVarPrice] = useState<number>(0);
  const [varSalePrice, setVarSalePrice] = useState<number | undefined>(undefined);
  const [varSku, setVarSku] = useState('');
  const [varStock, setVarStock] = useState<number>(10);

  // Dynamic Category state builder
  const [newCatName, setNewCatName] = useState('');

  // WooCommerce & Rank Math states
  const [focusKeyword, setFocusKeyword] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState<string[]>([]);
  const [seoTips, setSeoTips] = useState<string[]>([
    "Add a focus keyword to check precise content keyword density.",
    "Ensure your product description has more than 100 characters to score highly."
  ]);
  const [seoScore, setSeoScore] = useState<number>(50);

  // Gemini loading assist
  const [isGeminiAnalyzing, setIsGeminiAnalyzing] = useState(false);
  const [geminiStatusMessage, setGeminiStatusMessage] = useState<string | null>(null);

  // Multi sales stats configurations
  const statsOverview = useMemo(() => {
    return {
      totalProductsCount: products.length,
      variableProductsCount: products.filter((p) => p.type === 'variable').length,
      averageBasePrice: Math.round(products.reduce((acc, p) => acc + p.price, 0) / (products.length || 1)),
      totalCategoriesCount: categories.length
    };
  }, [products, categories]);

  // Handle adding custom built variations to variable fields
  const handleAddVariationToDraftModel = () => {
    if (!varSku.trim()) {
      alert('Provide a unique custom SKU for this sizing variant.');
      return;
    }

    // Check if duplicate variation exists
    const duplicate = variationsList.find((v) => v.attributes.size === varSize && v.attributes.color === varColor);
    if (duplicate) {
      alert('Selected size and color combination already registered in this Draft.');
      return;
    }

    const nextVar: Variation = {
      id: `v-draft-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      attributes: { size: varSize, color: varColor },
      price: varPrice > 0 ? varPrice : undefined,
      salePrice: varSalePrice && varSalePrice > 0 ? varSalePrice : undefined,
      sku: varSku,
      stock: varStock
    };

    setVariationsList([...variationsList, nextVar]);
    // Reset inputs
    setVarSku('');
    setVarPrice(0);
    setVarSalePrice(undefined);
  };

  const handleRemoveVariationFromDraftModel = (tempId: string) => {
    setVariationsList(variationsList.filter((v) => v.id !== tempId));
  };

  // Live client-side Rank Math Heuristic analyzer
  const handleCalculateLocalSeoScore = (
    currentTitle: string, 
    currentDesc: string, 
    currentFk: string
  ) => {
    let score = 40;
    if (currentTitle.length >= 25 && currentTitle.length <= 60) score += 15;
    if (currentDesc.length >= 100 && currentDesc.length <= 160) score += 15;
    
    if (currentFk.trim()) {
      score += 5;
      const fkw = currentFk.toLowerCase().trim();
      if (currentTitle.toLowerCase().includes(fkw)) score += 15;
      if (currentDesc.toLowerCase().includes(fkw)) score += 10;
    }

    const calculated = Math.min(score, 100);
    setSeoScore(calculated);
    return calculated;
  };

  // Invoke Gemini Rank Math AI Copywriter back-end route
  const handleInvokeGeminiAIAssistant = async () => {
    if (!title.trim() || !description.trim()) {
      alert('Please fill out the Product Title and Product Description to let Gemini generate optimization recommendations.');
      return;
    }

    setIsGeminiAnalyzing(true);
    setGeminiStatusMessage('Connecting to WordPress Rank Math AI Assistant...');

    try {
      const response = await fetch('/api/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category: selectedCats[0] || 'General Clothing',
          focusKeyword
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const result = await response.json();
      
      // Update metadata inputs from returned AI results
      setSeoTitle(result.seoTitle || `${title} - Tailored Capsule | Aura`);
      setSeoDescription(result.seoDescription || description.substring(0, 140));
      setSeoKeywords(result.seoKeywords || [title.toLowerCase()]);
      setSeoScore(result.seoScore || 85);
      setSeoTips(result.tips || ["Review content density metrics."]);

      if (result.isFallback) {
        setGeminiStatusMessage('Pre-optimized via local assistant. (Configure GEMINI_API_KEY in Secrets for the live Gemini AI engine!)');
      } else {
        setGeminiStatusMessage('Success! Rank Math suggestions successfully generated by Gemini 3.5.');
      }

    } catch (err) {
      console.error('Gemini Optimization invocation failed:', err);
      // local fallback on errors
      const fallbackScore = handleCalculateLocalSeoScore(title, description, focusKeyword);
      setSeoTitle(`${title} - Classic Capsule | Aura Store`);
      setSeoDescription(description.substring(0, 135));
      setSeoKeywords([title.toLowerCase().split(/\s+/)[0], 'capsule wear']);
      setSeoScore(fallbackScore);
      setSeoTips([
        "Connecting to backend Gemini AI failed. Checking via local heuristics.",
        "Add focus keywords to the very first paragraph of item summaries."
      ]);
      setGeminiStatusMessage('Checked via quick local SEO checker module.');
    } finally {
      setIsGeminiAnalyzing(false);
      setTimeout(() => {
        setGeminiStatusMessage(null);
      }, 5500);
    }
  };

  // Handle Editing click
  const handleTriggerEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setTitle(prod.title);
    setSku(prod.sku);
    setDescription(prod.description);
    setPrice(prod.price);
    setSalePrice(prod.salePrice);
    setImageUrl(prod.imageUrl);
    setSelectedGender(prod.gender);
    setSelectedCats(prod.categories);
    setProductType(prod.type);
    setVariationsList(prod.variations || []);
    
    // SEO fields
    setFocusKeyword(prod.focusKeyword || '');
    setSeoTitle(prod.seoTitle || '');
    setSeoDescription(prod.seoDescription || '');
    setSeoKeywords(prod.seoKeywords || []);
    setSeoScore(prod.seoScore || 70);

    setActiveAdminSubTab('add-product');
  };

  // Submit master form (either Add or Edit)
  const handleFormProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !sku.trim() || !description.trim() || !imageUrl.trim()) {
      alert('Provide Title, SKU, Description and Image URL values.');
      return;
    }

    if (productType === 'variable' && variationsList.length === 0) {
      alert('Please add at least one Size/Color Variation option since Type is set to Variable.');
      return;
    }

    const calculatedScore = handleCalculateLocalSeoScore(title, description, focusKeyword);

    const productPayload: Product = {
      id: editingProductId || `prod-custom-${Date.now()}`,
      title,
      description,
      price: Number(price),
      salePrice: salePrice && salePrice > 0 ? Number(salePrice) : undefined,
      sku,
      type: productType,
      categories: selectedCats.length > 0 ? selectedCats : ['Uncategorized'],
      gender: selectedGender,
      imageUrl,
      variations: productType === 'variable' ? variationsList : undefined,
      focusKeyword,
      seoTitle: seoTitle || `${title} - Premium Outfits | Aura`,
      seoDescription: seoDescription || description.substring(0, 140),
      seoKeywords: seoKeywords.length > 0 ? seoKeywords : [title.toLowerCase()],
      seoScore: seoScore || calculatedScore
    };

    if (editingProductId) {
      updateProduct(productPayload);
      alert('Product saved successfully in catalog.');
    } else {
      addProduct(productPayload);
      alert('New product successfully launched into catalog.');
    }

    // Clear and navigate back to list view
    handleResetProductForm();
    setActiveAdminSubTab('list');
  };

  const handleResetProductForm = () => {
    setEditingProductId(null);
    setTitle('');
    setSku('');
    setDescription('');
    setPrice(0);
    setSalePrice(undefined);
    setImageUrl('');
    setSelectedGender('unisex');
    setSelectedCats([]);
    setProductType('simple');
    setVariationsList([]);
    setFocusKeyword('');
    setSeoTitle('');
    setSeoDescription('');
    setSeoKeywords([]);
    setSeoScore(50);
    setSeoTips([
      "Add focus keywords to review content density metrics.",
      "Ensure descriptions has more than 100 characters to score highly."
    ]);
  };

  // Handle Tax submittal
  const handleUpdateTaxRate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const rate = Number(data.get('tax-input-rate'));
    if (!isNaN(rate) && rate >= 0 && rate <= 100) {
      setTaxRate(rate);
      alert(`WooCommerce Tax rates modified to ${rate}% successfully.`);
    }
  };

  // Handle Category Creation submittal
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const slug = newCatName.toLowerCase().trim().replace(/\s+/g, '-');
    const exists = categories.some((c) => c.slug === slug || c.name.toLowerCase() === newCatName.toLowerCase());

    if (exists) {
      alert('Category of same name is already registered.');
      return;
    }

    addCategory({
      id: `cat-custom-${Date.now()}`,
      name: newCatName.trim(),
      slug
    });

    setNewCatName('');
    alert('WooCommerce category added successfully.');
  };

  return (
    <div className="space-y-8 pb-16 font-sans">
      
      {/* WordPress-like admin header banner */}
      <div className="bg-[#111] text-zinc-100 p-6 rounded-3xl border border-zinc-900 flex flex-col md:flex-row md:items-center md:justify-between gap-5 shadow-lg">
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 bg-zinc-800 text-white border border-zinc-700 rounded-xl flex items-center justify-center font-bold text-lg text-emerald-450">
            W
          </div>
          <div className="space-y-0.5">
            <h1 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
              WooCommerce Admin Panel
              <span className="text-[10px] bg-zinc-800 border border-zinc-750 text-zinc-400 p-1 py-0.5 rounded font-mono uppercase tracking-widest font-bold">
                CORE VERSION 6.9
              </span>
            </h1>
            <p className="text-xs text-zinc-400">Manage products, modify tax rates, define multi-sizing product variations and run SEO Rank Math audits.</p>
          </div>
        </div>

        {/* Action switch buttons */}
        <div className="flex flex-wrap gap-2.5">
          <button
            id="admin-subtab-catalog"
            onClick={() => { setActiveAdminSubTab('list'); handleResetProductForm(); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeAdminSubTab === 'list'
                ? 'bg-white text-zinc-950 shadow'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            All Products
          </button>
          
          <button
            id="admin-subtab-add"
            onClick={() => { handleResetProductForm(); setActiveAdminSubTab('add-product'); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeAdminSubTab === 'add-product' && !editingProductId
                ? 'bg-white text-zinc-950 shadow'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Add New Product
          </button>
          
          <button
            id="admin-subtab-tax"
            onClick={() => setActiveAdminSubTab('categories-tax')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeAdminSubTab === 'categories-tax'
                ? 'bg-white text-zinc-950 shadow'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            Tax & Category Desk
          </button>

          <button
            id="admin-subtab-ai-populator"
            onClick={() => { handleResetProductForm(); setActiveAdminSubTab('ai-populator'); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeAdminSubTab === 'ai-populator'
                ? 'bg-white text-zinc-950 shadow'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-orange animate-pulse" />
            AI Catalog Populator
          </button>

          <button
            id="admin-subtab-orders"
            onClick={() => { handleResetProductForm(); setActiveAdminSubTab('orders'); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer relative ${
              activeAdminSubTab === 'orders'
                ? 'bg-white text-zinc-950 shadow'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            <span>Orders Manager</span>
            {orders.filter(o => o.status === 'pending').length > 0 && (
              <span className="absolute -top-1.5 -right-1 text-[8px] bg-brand-orange text-white px-1.5 py-0.2 rounded-full border border-zinc-950 animate-bounce">
                {orders.filter(o => o.status === 'pending').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Stats Board Overviews widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white border border-gray-150 p-4 rounded-2xl text-left space-y-1 shadow-sm">
          <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400">Registered Clothes</span>
          <div className="text-2xl font-black text-gray-950 font-mono">{statsOverview.totalProductsCount} items</div>
        </div>

        <div className="bg-white border border-gray-150 p-4 rounded-2xl text-left space-y-1 shadow-sm">
          <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400">Variable Product types</span>
          <div className="text-2xl font-black text-gray-950 font-mono">{statsOverview.variableProductsCount} units</div>
        </div>

        <div className="bg-white border border-gray-150 p-4 rounded-2xl text-left space-y-1 shadow-sm">
          <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400">Mean Catalog Price</span>
          <div className="text-2xl font-black text-gray-950 font-mono">${statsOverview.averageBasePrice}</div>
        </div>

        <div className="bg-white border border-gray-150 p-4 rounded-2xl text-left space-y-1 shadow-sm">
          <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400">System Categories</span>
          <div className="text-2xl font-black text-gray-950 font-mono">{statsOverview.totalCategoriesCount} tags</div>
        </div>
      </div>

      {/* SUBTAB CONTENT 1: LISTING */}
      {activeAdminSubTab === 'list' && (
        <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-3 text-left">
            <h3 className="font-extrabold text-sm text-gray-900 tracking-tight">Active WooCommerce Products Catalog</h3>
            <p className="text-xs text-gray-500">Review, modify, or delete existing storefront inventory items.</p>
          </div>

          <div className="overflow-x-auto border border-gray-100 rounded-xl">
            <table className="w-full text-xs font-sans text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] font-bold border-b border-gray-100">
                  <th className="p-4">Visual Thumbnail</th>
                  <th className="p-4">SKU / Code</th>
                  <th className="p-4">Product Details</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Gender</th>
                  <th className="p-4">Base Pricing</th>
                  <th className="p-4">SEO Rating</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    
                    {/* Thumbnail */}
                    <td className="p-4">
                      <div className="w-10 h-10 bg-gray-55 border border-gray-150 rounded-lg overflow-hidden shrink-0">
                        <img 
                          src={p.imageUrl} 
                          alt="" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Sku */}
                    <td className="p-4 font-mono font-semibold text-gray-650">{p.sku}</td>

                    {/* Details */}
                    <td className="p-4 max-w-xs">
                      <div className="font-bold text-gray-900 text-sm truncate">{p.title}</div>
                      <div className="text-[10px] text-gray-400 truncate mt-0.5">{p.categories.join(', ')}</div>
                    </td>

                    {/* Type */}
                    <td className="p-4 uppercase font-bold font-mono text-[10px]">
                      {p.type === 'variable' ? (
                        <span className="text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                          Variable [{p.variations?.length}]
                        </span>
                      ) : (
                        <span className="text-gray-600 bg-gray-100 border border-gray-150 px-2 py-0.5 rounded-full">
                          Simple
                        </span>
                      )}
                    </td>

                    {/* Gender */}
                    <td className="p-4 uppercase font-bold text-gray-500 text-[10px]">{p.gender}</td>

                    {/* Pricing */}
                    <td className="p-4">
                      <div className="font-semibold text-gray-900 text-sm font-mono">
                        ${p.salePrice || p.price}
                      </div>
                      {p.salePrice && (
                        <div className="text-[10px] text-gray-400 line-through font-mono">
                          ${p.price}
                        </div>
                      )}
                    </td>

                    {/* SEO score indicator block */}
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          (p.seoScore || 65) >= 80 ? 'bg-emerald-500' : (p.seoScore || 65) >= 60 ? 'bg-orange-500' : 'bg-red-500'
                        }`}></div>
                        <span className="font-mono font-bold text-gray-700">{p.seoScore || 70}/100</span>
                      </div>
                    </td>

                    {/* Actions button list */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          id={`admin-edit-product-${p.id}`}
                          onClick={() => handleTriggerEditProduct(p)}
                          className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit WooCommerce values"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          id={`admin-delete-product-${p.id}`}
                          onClick={() => {
                            if (confirm(`Are you sure you want to completely erase "${p.title}" from the catalog?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Erase SKU"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB CONTENT 2: ADD / EDIT PRODUCT FORM */}
      {activeAdminSubTab === 'add-product' && (
        <form onSubmit={handleFormProductSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Left Block: Essential fields */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm text-gray-900 tracking-tight flex items-center gap-1.5 border-b border-gray-100 pb-3">
                <Database className="w-4.5 h-4.5 text-zinc-500" />
                {editingProductId ? 'Edit Custom WooCommerce Product' : 'Create New Product Configuration'}
              </h3>

              <div className="space-y-4">
                
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Product Title</label>
                  <input
                    id="product-input-title"
                    type="text"
                    required
                    placeholder="e.g. Premium Wool Winter Cardigan"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      handleCalculateLocalSeoScore(e.target.value, description, focusKeyword);
                    }}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-black focus:border-black outline-none bg-white text-gray-905"
                  />
                </div>

                {/* SKU & Category options in grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Garment SKU Code</label>
                    <input
                      id="product-input-sku"
                      type="text"
                      required
                      placeholder="e.g. KNIT-CRD-008"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-black focus:border-black outline-none bg-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Applicable Wearers</label>
                    <select
                      id="product-input-gender"
                      value={selectedGender}
                      onChange={(e) => setSelectedGender(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-black focus:border-black outline-none bg-white text-gray-700"
                    >
                      <option value="unisex">Unisex drapes</option>
                      <option value="women">Women's apparel</option>
                      <option value="men">Men's tailoring</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Type classification</label>
                    <select
                      id="product-input-type"
                      value={productType}
                      onChange={(e) => setProductType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-black focus:border-black outline-none bg-white text-gray-700"
                    >
                      <option value="simple">Simple (no variations)</option>
                      <option value="variable">Variable Product (sizes/colors)</option>
                    </select>
                  </div>
                </div>

                {/* Base Image URL Input */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Primary Product Image CDN URL</label>
                  <input
                    id="product-input-image"
                    type="url"
                    required
                    placeholder="Provide image URL starting with http:// or https://"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-black focus:border-black outline-none bg-white text-gray-950 font-mono"
                  />
                  <p className="text-[10px] text-gray-400 leading-none">
                    Hint: Use Unsplash clothing links such as <em>https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600</em>
                  </p>
                </div>

                {/* Product Description */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Product Detailed Description</label>
                  <textarea
                    id="product-input-desc"
                    required
                    rows={4}
                    placeholder="Explain materials, fabrics, sizing tips, care instructions, and drapes..."
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      handleCalculateLocalSeoScore(title, e.target.value, focusKeyword);
                    }}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-black focus:border-black outline-none bg-white text-gray-901 leading-relaxed"
                  />
                </div>

                {/* Conditional Pricing Blocks based on item type */}
                {productType === 'simple' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-55/45 p-4 rounded-xl border border-gray-150">
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                        Regular Price ($)
                      </label>
                      <input
                        id="product-input-price"
                        type="number"
                        min={0}
                        required={productType === 'simple'}
                        placeholder="e.g. 120"
                        value={price || ''}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white text-gray-900 font-mono"
                      />
                    </div>
                    
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                        <Percent className="w-3.5 h-3.5 text-gray-400" />
                        Sale Price (Optional, $)
                      </label>
                      <input
                        id="product-input-sale"
                        type="number"
                        min={0}
                        placeholder="e.g. 95"
                        value={salePrice || ''}
                        onChange={(e) => setSalePrice(e.target.value ? Number(e.target.value) : undefined)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white text-gray-900 font-mono"
                      />
                    </div>
                  </div>
                ) : (
                  /* Variable Product: Interactive variation builder list */
                  <div className="border border-gray-150 rounded-2xl p-5 bg-indigo-50/15 space-y-4 text-left">
                    <div className="border-b border-indigo-100/50 pb-2.5 flex items-center justify-between">
                      <h4 className="font-bold text-xs text-gray-900 uppercase tracking-wide flex items-center gap-1">
                        <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                        Variable Sizing & Variations Builder
                      </h4>
                      <span className="text-[10px] text-gray-400">Add size/color variation units</span>
                    </div>

                    {/* Active variations Draft block builder inputs */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-normal">Size</label>
                        <select
                          value={varSize}
                          onChange={(e) => setVarSize(e.target.value)}
                          className="w-full px-2 py-1.5 border border-gray-250 bg-white rounded text-[11px]"
                        >
                          <option>XS</option>
                          <option>S</option>
                          <option>M</option>
                          <option>L</option>
                          <option>XL</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-normal">Color</label>
                        <input
                          type="text"
                          placeholder="e.g. Alabaster"
                          value={varColor}
                          onChange={(e) => setVarColor(e.target.value)}
                          className="w-full px-2 py-1.5 border border-gray-250 bg-white rounded text-[11px]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-normal">Stock</label>
                        <input
                          type="number"
                          value={varStock}
                          onChange={(e) => setVarStock(Number(e.target.value))}
                          className="w-full px-2 py-1 border border-gray-250 bg-white rounded text-[11px] font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-normal">Variation SKU</label>
                        <input
                          type="text"
                          placeholder="e.g. OUT-TRN-S-CH"
                          value={varSku}
                          onChange={(e) => setVarSku(e.target.value)}
                          className="w-full px-2 py-1 border border-gray-250 bg-white rounded text-[11px] font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-normal">Unit Price ($)</label>
                        <input
                          type="number"
                          placeholder="If different"
                          value={varPrice || ''}
                          onChange={(e) => setVarPrice(Number(e.target.value))}
                          className="w-full px-2 py-1 border border-gray-250 bg-white rounded text-[11px] font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-normal">Unit Sale ($)</label>
                        <input
                          type="number"
                          placeholder="If on sale"
                          value={varSalePrice || ''}
                          onChange={(e) => setVarSalePrice(e.target.value ? Number(e.target.value) : undefined)}
                          className="w-full px-2 py-1 border border-gray-250 bg-white rounded text-[11px] font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2 pt-4">
                        <button
                          type="button"
                          onClick={handleAddVariationToDraftModel}
                          className="w-full py-1.8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Variation SKU
                        </button>
                      </div>
                    </div>

                    {/* Active variations units list */}
                    {variationsList.length > 0 ? (
                      <div className="space-y-2 pt-2 border-t border-indigo-100/50">
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Configured Variation SKUs ({variationsList.length})</span>
                        <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                          {variationsList.map((v) => (
                            <div key={v.id} className="flex items-center justify-between p-2 bg-white border border-gray-150 rounded-lg text-xs font-mono">
                              <div className="flex items-center gap-2">
                                <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-1.5 rounded text-[10px] font-bold font-sans">
                                  {v.attributes.size} / {v.attributes.color}
                                </span>
                                <span className="text-gray-400">SKU:</span>
                                <span className="font-semibold text-gray-800">{v.sku}</span>
                                <span className="text-gray-400">Stock:</span>
                                <span className="text-gray-800 font-semibold">{v.stock}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-gray-900">${v.salePrice || v.price || price}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveVariationFromDraftModel(v.id)}
                                  className="text-red-500 hover:text-red-700 font-bold font-sans text-[10px] border border-red-50 hover:bg-red-50 p-1 px-1.5 rounded"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-indigo-50/40 text-center text-[11px] text-zinc-500 rounded border border-indigo-100/50">
                        No variations defined yet. Sizing variations models are required for the Variable product type.
                      </div>
                    )}

                  </div>
                )}

              </div>
            </div>

            {/* Master save actions buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { handleResetProductForm(); setActiveAdminSubTab('list'); }}
                className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
              >
                Cancel modifications
              </button>
              
              <button
                id="admin-submit-product-button"
                type="submit"
                className="flex-1 py-3 bg-black hover:bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow"
              >
                {editingProductId ? 'Save WooCommerce Product' : 'Launch New Product'}
              </button>
            </div>

          </div>

          {/* Right Side Block: Category, Taxonomy and Rank Math SEO Assister and Gemini */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Categorize Product selection */}
            <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm text-left space-y-3.5">
              <h4 className="font-bold text-gray-900 text-sm tracking-tight border-b border-gray-100 pb-2 flex items-center gap-1">
                <Layers className="w-4 h-4 text-gray-500" />
                Product Categorization
              </h4>

              <div className="space-y-2">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Select Categories:</span>
                <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                  {categories.map((cat) => {
                    const isChecked = selectedCats.includes(cat.name);
                    return (
                      <label 
                        key={cat.id} 
                        className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer select-none hover:text-black"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedCats(selectedCats.filter((c) => c !== cat.name));
                            } else {
                              setSelectedCats([...selectedCats, cat.name]);
                            }
                          }}
                          className="w-4 h-4 text-black focus:ring-0 rounded cursor-pointer border-gray-300"
                        />
                        <span>{cat.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. Rank Math SEO AI Assistant widget & dynamically index keywords */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm text-left space-y-4">
              <div className="border-b border-gray-150 pb-2.5 flex items-center justify-between">
                <h4 className="font-bold text-gray-900 text-sm tracking-tight flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  Rank Math SEO Suite
                </h4>
                
                {/* Dynamically calculated score badge */}
                <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                  seoScore >= 80 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : seoScore >= 60 
                      ? 'bg-orange-50 text-orange-855 border border-orange-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  Score: {seoScore}/100
                </div>
              </div>

              {/* Gemini Trigger Button */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 text-white rounded-xl p-4 space-y-3.5 border border-zinc-950 shadow">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
                    <span className="text-xs font-bold font-sans">Gemini AI Copywriter Assist</span>
                  </div>
                  <p className="text-[10px] text-zinc-300 leading-normal">
                    Let Gemini write highly optimized Meta titles, high CTR description and search keywords automatically.
                  </p>
                </div>

                <button
                  id="admin-trigger-gemini-assistant"
                  type="button"
                  onClick={handleInvokeGeminiAIAssistant}
                  disabled={isGeminiAnalyzing}
                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-500 disabled:from-zinc-800 disabled:to-zinc-800 hover:brightness-105 active:scale-[0.98] transition-all text-zinc-950 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-md cursor-pointer disabled:cursor-not-allowed"
                >
                  {isGeminiAnalyzing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Optimizing Content...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Analyze & Optimize with AI
                    </>
                  )}
                </button>

                {geminiStatusMessage && (
                  <p className="text-[10px] py-1 text-amber-450 font-mono text-center leading-relaxed">
                    {geminiStatusMessage}
                  </p>
                )}
              </div>

              {/* SEO parameters input fields */}
              <div className="space-y-3 pt-1">
                
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-gray-550">
                    <label>Focus Keyword</label>
                    <span className="text-gray-400 font-mono text-[9px]">Rank Math Primary Rules</span>
                  </div>
                  <input
                    id="seo-input-focus-kw"
                    type="text"
                    placeholder="e.g. Wool Blazer"
                    value={focusKeyword}
                    onChange={(e) => {
                      setFocusKeyword(e.target.value);
                      handleCalculateLocalSeoScore(title, description, e.target.value);
                    }}
                    className="w-full px-2.5 py-1.8 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-black focus:border-black bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-550">Meta Title Recommendation</label>
                  <input
                    id="seo-input-title"
                    type="text"
                    placeholder="Suggest high CTR search meta title..."
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full px-2.5 py-1.8 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-black focus:border-black bg-white"
                  />
                  <span className="text-[10px] font-mono text-gray-400 block text-right">
                    {seoTitle.length} / 60 chars
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-550">Meta Description Optimization</label>
                  <textarea
                    id="seo-input-desc"
                    rows={2}
                    placeholder="Suggest high CTR meta description (max 150 chars)..."
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    className="w-full px-2.5 py-1.8 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-black focus:border-black bg-white text-gray-902 leading-normal"
                  />
                  <span className="text-[10px] font-mono text-gray-400 block text-right">
                    {seoDescription.length} / 150 chars
                  </span>
                </div>

              </div>

              {/* Tips panel checklist */}
              <div className="border-t border-gray-100 pt-3 space-y-2">
                <span className="text-[11px] font-bold text-gray-450 uppercase tracking-wide">Rank Math Audit Checklist:</span>
                <div className="space-y-2 animate-fade-in pl-1">
                  {seoTips.map((tip, idx) => (
                    <div key={idx} className="flex gap-2 text-[11.5px] leading-relaxed text-zinc-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </form>
      )}

      {/* SUBTAB CONTENT 3: CATEGORIES & TAX RATES MANAGEMENT CONTROL */}
      {activeAdminSubTab === 'categories-tax' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start text-left">
          
          {/* WooCommerce Tax Settings */}
          <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-gray-950 tracking-tight flex items-center gap-1.5 border-b border-gray-100 pb-3">
              <Percent className="w-4.5 h-4.5 text-zinc-650" />
              WooCommerce Tax Settings
            </h3>
            
            <p className="text-xs text-gray-500 leading-relaxed font-sans">
              Define the percentage standard value used globally across Cart estimated taxes calculations, shipping bills, and receipts checkout drapes.
            </p>

            <form onSubmit={handleUpdateTaxRate} className="space-y-4 pt-1">
              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Standard Sales Tax Rate (%)</label>
                <div className="relative max-w-[200px]">
                  <input
                    id="tax-input-rate"
                    name="tax-input-rate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    required
                    defaultValue={taxRate}
                    className="w-full pr-10 pl-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white text-gray-950 font-mono"
                  />
                  <span className="absolute inset-y-0 right-4 flex items-center text-xs text-gray-400 font-bold font-mono">
                    %
                  </span>
                </div>
              </div>

              <button
                id="tax-save-submit"
                type="submit"
                className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-805 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer"
              >
                Save Tax Modifications
              </button>
            </form>
          </div>

          {/* WooCommerce Categories setup */}
          <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-gray-950 tracking-tight flex items-center gap-1.5 border-b border-gray-100 pb-3">
              <Plus className="w-4.5 h-4.5 text-zinc-650" />
              Store Product Categories Setup
            </h3>

            <p className="text-xs text-gray-500 leading-relaxed font-sans">
              Add custom categories. Registered categories can instantly be assigned on items builder to group catalog collections.
            </p>

            <form onSubmit={handleCreateCategory} className="flex gap-2.5 pt-1">
              <input
                id="category-input-name"
                type="text"
                placeholder="e.g. Denim Outfits"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                required
                className="flex-1 px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-black focus:border-black outline-none bg-white text-gray-901"
              />
              <button
                id="category-submit"
                type="submit"
                className="px-5 py-2 bg-black hover:bg-zinc-90 w-auto text-white text-xs font-bold rounded-xl shadow cursor-pointer"
              >
                Register Category
              </button>
            </form>

            <div className="space-y-2 pt-2 text-left">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Active categories:</span>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <div 
                    key={cat.id} 
                    className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg text-xs"
                  >
                    <span className="font-semibold text-gray-700">{cat.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Do you want to delete category "${cat.name}"? This won't affect the products, but they will become uncategorized.`)) {
                          deleteCategory(cat.id);
                        }
                      }}
                      className="text-gray-400 hover:text-red-500 font-bold ml-1"
                      title="Delete category"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUBTAB CONTENT 4: ADVANCED AI PRODUCT POPULATOR & CRAWLER */}
      {activeAdminSubTab === 'ai-populator' && (
        <div id="ai-populator-section" className="space-y-8 text-left">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl border border-zinc-850 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-96 bg-brand-orange/10 rounded-full filter blur-3xl opacity-30 -mr-20 -mt-20 pointer-events-none" />
            <div className="max-w-xl space-y-2">
              <span className="text-[9px] bg-brand-orange text-white px-2.5 py-1 rounded font-mono uppercase tracking-widest font-bold">
                INTELLIGENT FASHION POPULATOR ENGINE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
                AI Store Curation & Batch Seeds
              </h2>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                Automatically populate your entire boutique with 125 ready-made luxury catalog listings, or launch an active AI crawler that analyzes Pinterest aesthetics and Amazon models to draft high-converting seasonal wear.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Mega 125 batch trigger */}
            <div className="lg:col-span-5 bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm text-gray-950 tracking-tight flex items-center gap-1.5 border-b border-gray-100 pb-3">
                <Database className="w-4.5 h-4.5 text-brand-orange" />
                Mega Catalog Seeds (All 25 Categories)
              </h3>
              
              <p className="text-xs text-gray-500 leading-relaxed font-sans">
                Seeding this option clears your current item configuration and deploys <strong>exactly 125 premium products</strong> (5 items per category) across <strong>all 25 required clothing departments</strong>.
              </p>

              <div className="bg-zinc-50 border border-zinc-150 p-4 rounded-xl space-y-2 text-xs font-sans">
                <div className="font-bold text-zinc-800">Seeded categories mapping outline:</div>
                <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[10px] text-zinc-500 font-mono">
                  <div>• Men T-Shirts</div>
                  <div>• Women Dresses</div>
                  <div>• Men Hoodies</div>
                  <div>• Women Handbags</div>
                  <div>• Men Jackets</div>
                  <div>• Women Heels</div>
                  <div>• Men Jeans</div>
                  <div>• Women Sneakers</div>
                  <div>• Men Sneakers</div>
                  <div>• Women Jewelry</div>
                  <div>• Men Watches</div>
                  <div>• Women Skincare</div>
                  <div>• Men Sunglasses</div>
                  <div>• Women Activewear</div>
                  <div>• Men Sportswear</div>
                  <div>• Women Winter Collection</div>
                  <div>• Men Formal Wear</div>
                  <div>• Women Luxury Series</div>
                  <div>• Unisex Accessories</div>
                  <div>• Unisex Streetwear</div>
                  <div>• Unisex Caps</div>
                  <div>• Unisex Perfumes</div>
                  <div>• Unisex Bags</div>
                  <div>+ All spec/metadata layouts</div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  id="btn-mega-seed"
                  onClick={() => {
                    if (confirm("Are you sure you want to re-seed the entire store with 125 professionally-curated luxury products? This will clean up the current inventory state.")) {
                      setIsCrawling(true);
                      setCrawlLogs([
                        "[SYSTEM] Clearing existing catalog listings context...",
                        "[SYSTEM] Deploying 25 requested departments (Men, Women, Unisex)...",
                        "[SYSTEM] Programmatically building 125 distinct designer products (5 per category)...",
                        "[SYSTEM] Injecting sizing matrices, color swatches and unique SKUs...",
                        "[SYSTEM] Creating comprehensive technical specifications and material tags...",
                        "[SYSTEM] Synthesizing SEO keywords, meta definitions and Rank Math headers...",
                        "[SYSTEM] Adding verified customer reviews with rating indices...",
                        "[SUCCESS] Catalog populated! Redirecting you to the catalog view."
                      ]);
                      setTimeout(() => {
                        const productsSeeded = generate125Products();
                        resetCatalog(productsSeeded, megaCategories);
                        setIsCrawling(false);
                        alert("Success! 125 realistic products across all 25 categories successfully generated and populated.");
                        setActiveAdminSubTab('list');
                      }, 2500);
                    }
                  }}
                  disabled={isCrawling}
                  className="w-full py-3 bg-zinc-950 hover:bg-zinc-850 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isCrawling ? 'animate-spin' : ''}`} />
                  Launch All 25 Categories (125 Items)
                </button>
              </div>
            </div>

            {/* Right Column: Live crawler tool */}
            <div className="lg:col-span-7 bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="font-extrabold text-sm text-gray-950 tracking-tight flex items-center gap-1.5 border-b border-gray-100 pb-3">
                  <Sparkles className="w-4.5 h-4.5 text-brand-orange animate-pulse" />
                  Live Pinterest & Amazon Trend-Crawler
                </h3>
                <p className="text-xs text-gray-500 font-sans">Gather fashion trends dynamically and use Gemini to generate custom boutique capsule garments.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Target Category</label>
                  <select
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white text-gray-950 focus:outline-none"
                    value={crawlerCategory}
                    onChange={(e) => setCrawlerCategory(e.target.value)}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Ideal Styling Wear</label>
                  <select
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white text-gray-950 focus:outline-none"
                    value={crawlerGender}
                    onChange={(e) => setCrawlerGender(e.target.value as any)}
                  >
                    <option value="unisex">Unisex Wear</option>
                    <option value="men">Menswear Profile</option>
                    <option value="women">Womenswear Profile</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-sans">Custom Trend Bias / Search Angle</label>
                <input
                  type="text"
                  placeholder="e.g. Minimalist Belgian Linen Overcoat with raw shell accents"
                  value={crawlerQuery}
                  onChange={(e) => setCrawlerQuery(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white text-gray-950 focus:outline-none"
                />
              </div>

              <button
                type="button"
                id="btn-run-crawl"
                disabled={isCrawling}
                onClick={async () => {
                  setIsCrawling(true);
                  setCrawlLogs([
                    "[CRAWLER] Resolving scraper endpoints...",
                    "[SCRAPE] Contacting Pinterest.com web gateways...",
                    `[SCRAPE] Fetching pins associated with clothing trends: "${crawlerQuery || crawlerCategory}"...`
                  ]);

                  try {
                    const response = await fetch('/api/crawl-trends', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        categoryName: crawlerCategory,
                        gender: crawlerGender,
                        extraQuery: crawlerQuery
                      })
                    });

                    if (!response.ok) {
                      throw new Error("Proxy connection failed.");
                    }

                    const result = await response.json();
                    
                    if (result.logs) {
                      // Stagger logs display for a realistic, pleasant experience
                      let lIdx = 0;
                      const interval = setInterval(() => {
                        if (lIdx < result.logs.length) {
                          setCrawlLogs((prev) => [...prev, result.logs[lIdx]]);
                          lIdx++;
                        } else {
                          clearInterval(interval);
                          addProduct(result.product);
                          setCrawledProduct(result.product);
                          setIsCrawling(false);
                        }
                      }, 400);
                    } else {
                      addProduct(result.product);
                      setCrawledProduct(result.product);
                      setIsCrawling(false);
                    }

                  } catch (err: any) {
                    setCrawlLogs((prev) => [...prev, `[ERROR] Scraper failed: ${err?.message || 'Connection lost'}`]);
                    setIsCrawling(false);
                  }
                }}
                className="w-full py-3 bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow shadow-brand-orange/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isCrawling ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    AI Crawler Working...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Search Grounding & Populate (Single Item)
                  </>
                )}
              </button>

              {/* Progress and Crawl status logs terminal console */}
              {crawlLogs.length > 0 && (
                <div className="space-y-2 text-left font-sans">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Live Tracking Terminal Console</span>
                    <span className="text-[8px] bg-red-100 text-red-650 px-1.5 py-0.5 rounded animate-pulse font-mono tracking-widest">
                      ACTIVE
                    </span>
                  </div>
                  <div className="bg-zinc-950 font-mono text-[10px] text-emerald-400 p-4 rounded-xl space-y-1 max-h-[160px] overflow-y-auto border border-zinc-850 shadow-inner leading-relaxed">
                    {crawlLogs.map((log, lIdx) => (
                      <div key={lIdx} className="opacity-90">
                        <span className="text-zinc-500 mr-2 font-semibold">[{new Date().toLocaleTimeString()}]</span>
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Crawled Product Card Preview banner */}
              {crawledProduct && (
                <div className="border border-brand-orange/25 bg-brand-neutral/25 rounded-2xl p-4 flex gap-4 text-left items-start">
                  <img
                    src={crawledProduct.imageUrl}
                    alt=""
                    className="w-20 h-20 rounded-xl object-cover border border-gray-200 shadow-sm"
                  />
                  <div className="space-y-1 flex-1">
                    <span className="text-[8px] tracking-widest uppercase font-bold text-brand-orange">
                      Recently Synced Capsule
                    </span>
                    <h4 className="font-extrabold text-xs text-gray-901 leading-snug uppercase">
                      {crawledProduct.title}
                    </h4>
                    <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2">
                      {crawledProduct.description}
                    </p>
                    <div className="flex items-center gap-4 pt-1">
                      <span className="font-mono text-xs font-black text-gray-950">${crawledProduct.price}</span>
                      <span className="text-[10px] text-gray-400 font-mono">SKU: {crawledProduct.sku}</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* SUBTAB CONTENT 5: COMPREHENSIVE ORDERS MANAGER */}
      {activeAdminSubTab === 'orders' && (
        <div id="admin-orders-tab" className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-6 text-left">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-extrabold text-sm text-gray-901 tracking-tight uppercase">Active Customer Orders Matrix</h3>
            <p className="text-xs text-gray-500">Track shipment progressions, update fulfillment states, or complete Cash on Delivery collections.</p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <p className="text-sm font-bold text-gray-600">No Orders in the System</p>
              <p className="text-xs text-gray-400">When users checkout garments via Credit Card or COD, their records will pop here.</p>
            </div>
          ) : (
            <div className="space-y-6 font-sans">
              
              {/* Filter helpers or status widgets */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-gray-50 border border-gray-150 p-3 rounded-xl">
                  <span className="text-[9px] uppercase font-bold text-gray-400 block">Pending Checkpoint</span>
                  <span className="text-lg font-black font-mono text-amber-500">{orders.filter(o => o.status === 'pending').length}</span>
                </div>
                <div className="bg-gray-50 border border-gray-150 p-3 rounded-xl">
                  <span className="text-[9px] uppercase font-bold text-gray-400 block">In Processing</span>
                  <span className="text-lg font-black font-mono text-brand-orange">{orders.filter(o => o.status === 'processing').length}</span>
                </div>
                <div className="bg-gray-50 border border-gray-150 p-3 rounded-xl">
                  <span className="text-[9px] uppercase font-bold text-gray-400 block">Transit Cargo</span>
                  <span className="text-lg font-black font-mono text-sky-500">{orders.filter(o => o.status === 'shipped').length}</span>
                </div>
                <div className="bg-gray-50 border border-gray-150 p-3 rounded-xl">
                  <span className="text-[9px] uppercase font-bold text-gray-400 block">Delivered Base</span>
                  <span className="text-lg font-black font-mono text-emerald-500">{orders.filter(o => o.status === 'delivered').length}</span>
                </div>
                <div className="bg-gray-50 border border-gray-150 p-3 rounded-xl">
                  <span className="text-[9px] uppercase font-bold text-gray-400 block">COD Outstanding</span>
                  <span className="text-lg font-black font-mono text-indigo-500">
                    {orders.filter(o => o.paymentMethod === 'Cash on Delivery' && o.paymentStatus === 'pending').length}
                  </span>
                </div>
              </div>

              {/* Table of Orders */}
              <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[9px] font-bold border-b border-gray-100">
                      <th className="p-4">Reference ID</th>
                      <th className="p-4">Recipient Coord</th>
                      <th className="p-4">Payment Info</th>
                      <th className="p-4">Net Ledger</th>
                      <th className="p-4">Transit Status</th>
                      <th className="p-4 text-right">Fulfillment Settings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                        
                        {/* Reference ID */}
                        <td className="p-4 font-mono">
                          <div className="font-bold text-gray-900">#{o.id}</div>
                          <div className="text-[9px] text-gray-400 font-sans">Date: {new Date(o.createdAt).toLocaleDateString()}</div>
                        </td>

                        {/* Recipient Coordinates */}
                        <td className="p-4">
                          <div className="font-bold text-gray-900">{o.shippingAddress.name}</div>
                          <div className="text-[10px] text-gray-500 leading-snug">{o.shippingAddress.address}, {o.shippingAddress.city}</div>
                          <div className="text-[10px] font-mono text-gray-400">Ph: {o.shippingAddress.phone || 'N/A'}</div>
                        </td>

                        {/* Payment Info */}
                        <td className="p-4">
                          <div className="font-bold text-gray-800">{o.paymentMethod}</div>
                          <div className="mt-1 flex gap-1">
                            <span className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded ${
                              o.paymentStatus === 'completed'
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                : 'bg-amber-50 text-amber-600 border border-amber-100'
                            }`}>
                              {o.paymentStatus}
                            </span>
                          </div>
                        </td>

                        {/* Net Ledger */}
                        <td className="p-4 font-mono font-extrabold text-gray-950 text-sm">
                          ${o.total}
                        </td>

                        {/* Transit Status */}
                        <td className="p-4">
                          <span className={`inline-block text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border tracking-wide uppercase ${
                            o.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                            o.status === 'processing' ? 'bg-orange-50 text-brand-orange border-orange-200 animate-pulse' :
                            o.status === 'shipped' ? 'bg-sky-50 text-sky-600 border-sky-200' :
                            o.status === 'delivered' ? 'bg-emerald-50 text-emerald-650 border-emerald-200' :
                            'bg-rose-50 text-rose-500 border-rose-250'
                          }`}>
                            {o.status}
                          </span>
                        </td>

                        {/* Fulfillment Settings */}
                        <td className="p-4 text-right">
                          <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-1.5">
                            
                            {/* Fast update status select element */}
                            <select
                              value={o.status}
                              onChange={(e) => {
                                const nextStatus = e.target.value as any;
                                // If status is updated to delivered, set payment status to completed for COD
                                const nextPaymentStatus = nextStatus === 'delivered' ? 'completed' : o.paymentStatus;
                                updateOrderStatus(o.id, nextStatus, nextPaymentStatus);
                              }}
                              className="px-2 py-1.5 border border-gray-200 rounded text-[11px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
                            >
                              <option value="pending">Set Pending</option>
                              <option value="processing">Set Processing</option>
                              <option value="shipped">Set Shipped</option>
                              <option value="delivered">Set Delivered</option>
                              <option value="cancelled">Set Cancelled</option>
                            </select>

                            {/* COD fast confirm button when courier has collected the payload code */}
                            {o.paymentMethod === 'Cash on Delivery' && o.paymentStatus !== 'completed' && o.status !== 'cancelled' && (
                              <button
                                type="button"
                                onClick={() => {
                                  updateOrderStatus(o.id, 'delivered', 'completed');
                                  alert(`Successfully closed order #${o.id}. Payment marked as COMPLETED and order fulfilled as DELIVERED.`);
                                }}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase rounded transition-all cursor-pointer"
                              >
                                Collect Cash
                              </button>
                            )}

                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
