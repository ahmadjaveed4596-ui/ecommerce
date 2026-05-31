import { Product, Category } from '../types';

export const initialCategories: Category[] = [
  { id: 'cat-1', name: 'Outerwear', slug: 'outerwear' },
  { id: 'cat-2', name: 'Tops & Shirts', slug: 'tops-shirts' },
  { id: 'cat-3', name: 'Dresses & Suits', slug: 'dresses-suits' },
  { id: 'cat-4', name: 'Knitwear', slug: 'knitwear' },
];

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    title: 'Minimalist Charcoal Trench Coat',
    description: 'Elevate your seasonal wardrobe with our signature tencel-blend trench coat. Featuring a clean, unstructured profile, tailored horn buttons, a structured storm flap, and adjustable wrist straps. Designed in Copenhagen, it offers an elegant drape that is both wind-resistant and highly breathable. Ideal for smart layering over suits or premium knitwear.',
    price: 245,
    salePrice: 195,
    sku: 'OUT-TRN-001',
    type: 'variable',
    categories: ['Outerwear'],
    gender: 'unisex',
    imageUrl: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600&auto=format&fit=crop',
    focusKeyword: 'Charcoal Trench Coat',
    seoTitle: 'Charcoal Trench Coat - Minimalist Premium Outerwear | Aura',
    seoDescription: 'Shop our Minimalist Charcoal Trench Coat at Aura. Built with durable tencel-blend drapes and Scandinavian utility. Fast shipping worldwide.',
    seoKeywords: ['trench coat', 'minimalist coat', 'charcoal coat', 'unisex trench coat', 'sustainable fashion'],
    seoScore: 88,
    variations: [
      { id: 'v-1-1', attributes: { size: 'S', color: 'Charcoal' }, price: 245, salePrice: 195, sku: 'OUT-TRN-001-S-CH', stock: 12 },
      { id: 'v-1-2', attributes: { size: 'M', color: 'Charcoal' }, price: 245, salePrice: 195, sku: 'OUT-TRN-001-M-CH', stock: 18 },
      { id: 'v-1-3', attributes: { size: 'L', color: 'Charcoal' }, price: 255, salePrice: 205, sku: 'OUT-TRN-001-L-CH', stock: 5 },
      { id: 'v-1-4', attributes: { size: 'XL', color: 'Charcoal' }, price: 255, salePrice: 205, sku: 'OUT-TRN-001-XL-CH', stock: 2 }
    ]
  },
  {
    id: 'prod-2',
    title: 'Classic Wool Designer Blazer',
    description: 'A structural masterpiece made from pure Italian virgin wool. This timeless blazer is tailored with a slight oversized silhouette, dynamic padded shoulders, notched lapels, and double-welt front pockets. Its satin-lined interior ensures smooth layering. Crafted with precise sewing to transition from office commands to evening receptions seamlessly.',
    price: 280,
    sku: 'SUIT-BLZ-002',
    type: 'variable',
    categories: ['Dresses & Suits'],
    gender: 'women',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop',
    focusKeyword: 'Wool Blazer',
    seoTitle: 'Classic Wool Blazer for Women | Luxury Outerwear',
    seoDescription: 'The Aura virigin wool blazer is the ultimate tailored outer piece. Features dynamic shoulder padding and notch lapels. Elevate your wardrobe.',
    seoKeywords: ['wool blazer', 'women suit jacket', 'virgin wool blazer', 'luxury formal wear'],
    seoScore: 92,
    variations: [
      { id: 'v-2-1', attributes: { size: 'XS', color: 'Midnight Black' }, price: 280, sku: 'SUIT-BLZ-002-XS-BK', stock: 4 },
      { id: 'v-2-2', attributes: { size: 'S', color: 'Midnight Black' }, price: 280, sku: 'SUIT-BLZ-002-S-BK', stock: 9 },
      { id: 'v-2-3', attributes: { size: 'M', color: 'Midnight Black' }, price: 280, sku: 'SUIT-BLZ-002-M-BK', stock: 15 },
      { id: 'v-2-4', attributes: { size: 'L', color: 'Midnight Black' }, price: 290, sku: 'SUIT-BLZ-002-L-BK', stock: 6 }
    ]
  },
  {
    id: 'prod-3',
    title: 'Linen Casual Summer Shirt',
    description: 'Stay crisply ventilated under any sun. Handcrafted from organic European flax, this casual linen shirt has gone through double enzyme washing for unparalleled softness on the skin. It features a relaxed resort collar, custom natural mother-of-pearl buttons, and a single breast pocket. Breathable drapes that improve in character with every single wash.',
    price: 85,
    salePrice: 65,
    sku: 'TOP-LIN-003',
    type: 'simple',
    categories: ['Tops & Shirts'],
    gender: 'men',
    imageUrl: '/src/assets/images/linen_shirt_main_1779705565310.png',
    images: [
      '/src/assets/images/linen_shirt_main_1779705565310.png',
      '/src/assets/images/linen_shirt_detail_1779705588644.png',
      '/src/assets/images/linen_shirt_alt_1779705613185.png'
    ],
    focusKeyword: 'Linen Summer Shirt',
    seoTitle: 'Casual Linen Summer Shirt for Men - Breathable Flax | Aura',
    seoDescription: 'Discover our breathable organic linen casual resort shirts. Double washed for extreme comfort, classic button closures, relaxed holiday collar.',
    seoKeywords: ['men linen shirt', 'summer beach shirt', 'organic linen apparel', 'resort collar shirt'],
    seoScore: 84
  },
  {
    id: 'prod-4',
    title: 'Emerald Silk Slip Midi Dress',
    description: 'Intricately bi-cut to follow your natural silhouette. Made of ultra-luxury Mulberry silk with 5% elastane for seamless fluid movement. It features delicate adjustable spaghetti shoulder straps, a classic cowl neck, and an alluring low scoop back with minimalist cross-tie laces. Radiates pure effortless elegance at summer cocktail hours and luxury banquets.',
    price: 190,
    sku: 'DRESS-SLK-004',
    type: 'simple',
    categories: ['Dresses & Suits'],
    gender: 'women',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop',
    focusKeyword: 'Emerald Silk Dress',
    seoTitle: 'Emerald Silk Slip Midi Dress - Luxury Mulberry | Aura',
    seoDescription: 'Indulge in absolute luxury with our bi-cut Mulberry Silk slipped midi dress. Radiates high elegance with customized cowl necks and low scoop back laces.',
    seoKeywords: ['silk midi dress', 'emerald wedding guest dress', 'mulberry silk slip', 'elegant evening dress'],
    seoScore: 90
  },
  {
    id: 'prod-5',
    title: 'Chunky Knit Merino Sweater',
    description: 'Combat the winter wind with pure, dense warmth. Our chunky knit sweater is made of 100% fine Merino wool fibers. Knitted using classic fishermen cable patterns, it retains air pockets to act as an supreme heat insulator while remaining breathable. Trimmed with ribbed cuffs and double-thickness mock neck details.',
    price: 165,
    sku: 'KNIT-MER-005',
    type: 'variable',
    categories: ['Knitwear'],
    gender: 'men',
    imageUrl: 'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=600&auto=format&fit=crop',
    focusKeyword: 'Merino Wool Sweater',
    seoTitle: 'Chunky Knit Merino Wool Sweater - Heavy Winter Knitwear',
    seoDescription: 'Browse the Aura chunky merino wool fisherman cable sweater. Maximum natural temperature regulation, cozy ribbing, and soft non-scratch fibers.',
    seoKeywords: ['merino sweater men', 'fisherman cable knit', 'heavy wool sweater', 'cozy winter top'],
    seoScore: 85,
    variations: [
      { id: 'v-5-1', attributes: { size: 'S', color: 'Alabaster White' }, price: 165, stock: 8, sku: 'KNIT-MER-005-S-W' },
      { id: 'v-5-2', attributes: { size: 'M', color: 'Alabaster White' }, price: 165, stock: 12, sku: 'KNIT-MER-005-M-W' },
      { id: 'v-5-3', attributes: { size: 'L', color: 'Alabaster White' }, price: 175, stock: 7, sku: 'KNIT-MER-005-L-W' }
    ]
  },
  {
    id: 'prod-6',
    title: 'Premium Biker Leather Jacket',
    description: 'An iconic classic, handcrafted to endure. Created using full-grain drum-dyed lambskin leather that develops an elegant custom patina over years of wear. Designed with asymmetrical heavy zippers, polished silver snap collars, zipped utility pockets, and classic padded shoulders. Lined with breathable athletic mesh for luxurious comfort.',
    price: 399,
    salePrice: 349,
    sku: 'OUT-LTH-006',
    type: 'simple',
    categories: ['Outerwear'],
    gender: 'men',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop',
    focusKeyword: 'Biker Leather Jacket',
    seoTitle: 'Premium Asymmetrical Biker Leather Jacket | Aura',
    seoDescription: 'Buy our handcrafted drum-dyed lambskin biker leather jacket. Luxurious asymmetric silver hardware, heavy military zippers, custom lifelong patina.',
    seoKeywords: ['classic moto jacket', 'lambskin leather jacket', 'men biker jacket', 'black leather outerwear'],
    seoScore: 91
  },
  {
    id: 'prod-7',
    title: 'French Floral Ruffle Summer Dress',
    description: 'Vibrant, romantic, and beautifully light. Modeled around classical Parisian spring dress lines, this chiffon floral dress is accented with multiple tiers of delicate ruffles and deep back cutouts. Its adjustable drawstring waist allows for a customizable shape, whilst the lightweight lining guarantees full confidence during breezy strolls.',
    price: 135,
    sku: 'DRESS-FLR-007',
    type: 'simple',
    categories: ['Dresses & Suits'],
    gender: 'women',
    imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop',
    focusKeyword: 'Floral Chiffon Dress',
    seoTitle: 'French Chiffon Floral Summer Dress - Parisian Collection',
    seoDescription: 'Shop our botanical print French Floral Chiffon Summer Dress. Features elegant ruffles, drawstring tie line, and breathable lightweight Parisian drape.',
    seoKeywords: ['floral summer dress', 'ruffle slip midi', 'parisian clothing online', 'chiffon resort dress'],
    seoScore: 89
  },
  {
    id: 'prod-8',
    title: 'Beige Cozy Knit Cardigan',
    description: 'Wrap yourself in soft Parisian coziness. Expertly knit with a premium blend of superfine alpaca and organic cotton, this cardigan features a relaxed shoulder slump, deep ribbed V-necks, and oversized buttons. A beautiful slouchy silhouette that layers over dresses, camisoles, or classic linen trousers beautifully.',
    price: 145,
    sku: 'KNIT-CRD-008',
    type: 'simple',
    categories: ['Knitwear'],
    gender: 'women',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop',
    focusKeyword: 'Knit Cardigan',
    seoTitle: 'Beige Cozy Alpaca Knit Cardigan | Premium Knitwear',
    seoDescription: 'Our slouchy V-neck knit cardigan is blended with premium soft alpaca wool and organic cotton. Includes heavy cozy buttons and tailored pockets.',
    seoKeywords: ['slouchy knit cardigan', 'beige wrap cardigan', 'alpaca cotton sweater', 'french cozy knitwear'],
    seoScore: 86
  }
];
