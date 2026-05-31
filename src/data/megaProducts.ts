import { Product, Category, Review, Variation } from '../types';

// The 25 Categories defined by the user
export const megaCategories: Category[] = [
  // Men
  { id: "mc-1", name: "T-Shirts", slug: "men-t-shirts" },
  { id: "mc-2", name: "Hoodies", slug: "men-hoodies" },
  { id: "mc-3", name: "Jackets", slug: "men-jackets" },
  { id: "mc-4", name: "Jeans", slug: "men-jeans" },
  { id: "mc-5", name: "Sneakers", slug: "men-sneakers" },
  { id: "mc-6", name: "Watches", slug: "men-watches" },
  { id: "mc-7", name: "Sunglasses", slug: "men-sunglasses" },
  { id: "mc-8", name: "Sportswear", slug: "men-sportswear" },
  { id: "mc-9", name: "Formal Wear", slug: "men-formal-wear" },
  { id: "mc-10", name: "Casual Wear", slug: "men-casual-wear" },
  // Women
  { id: "wc-1", name: "Dresses", slug: "women-dresses" },
  { id: "wc-2", name: "Tops", slug: "women-tops" },
  { id: "wc-3", name: "Handbags", slug: "women-handbags" },
  { id: "wc-4", name: "Heels", slug: "women-heels" },
  { id: "wc-5", name: "Sneakers (Women)", slug: "women-sneakers" },
  { id: "wc-6", name: "Jewelry", slug: "women-jewelry" },
  { id: "wc-7", name: "Skincare", slug: "women-skincare" },
  { id: "wc-8", name: "Activewear", slug: "women-activewear" },
  { id: "wc-9", name: "Winter Collection", slug: "women-winter" },
  { id: "wc-10", name: "Luxury Fashion", slug: "women-luxury" },
  // Unisex
  { id: "uc-1", name: "Accessories", slug: "unisex-accessories" },
  { id: "uc-2", name: "Caps", slug: "unisex-caps" },
  { id: "uc-3", name: "Bags", slug: "unisex-bags" },
  { id: "uc-4", name: "Streetwear", slug: "unisex-streetwear" },
  { id: "uc-5", name: "Perfumes", slug: "unisex-perfumes" },
];

const reviewerNames = [
  "Avery Thorne", "Julian Vance", "Seraphina Locke", "Dorian Hale", "Elena Rostova",
  "Marcus Sterling", "Siena Brooks", "Leo Kensington", "Maya Lin", "Alexander West",
  "Opal Sterling", "Thalia Vance", "Vivienne Westwood", "Luka Romero", "Zara Hadid"
];

const customerReviews = [
  "Absolutely flawless quality. The weave and stitching are pristine, easily rivaling high-end luxury fashion.",
  "Highly breathable and beautifully tailored. Truly fits like a bespoke piece.",
  "Indulgent texture and elegant drape. Got several compliments on the first day of wearing it.",
  "Superb. A perfect blend of comfort and structured high-fashion silhouette.",
  "The attention to detail in the packaging and materials is exceptional. Highly recommend.",
  "Exceptional styling and extremely high-converting look. Highly recommend.",
  "The material feels ultra premium, very comfortable for daily wear.",
  "A masterpiece of organic, sustainable materials. Double washed for maximum softness."
];

// Product image banks - Curated Unsplash HD photos
const imageBank: Record<string, string[]> = {
  "T-Shirts": [
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600",
    "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=600"
  ],
  "Hoodies": [
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600",
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600",
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600",
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600"
  ],
  "Jackets": [
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600",
    "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?q=80&w=600",
    "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=600",
    "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600",
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600"
  ],
  "Jeans": [
    "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600",
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600",
    "https://images.unsplash.com/photo-1475178626620-a4d074967452?q=80&w=600",
    "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=600",
    "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?q=80&w=600"
  ],
  "Sneakers": [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600",
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600",
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=600",
    "https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=600"
  ],
  "Watches": [
    "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600",
    "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600",
    "https://images.unsplash.com/photo-1539874754764-5a96559165b0?q=80&w=600",
    "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=600"
  ],
  "Sunglasses": [
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600",
    "https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=600",
    "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=600",
    "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=600"
  ],
  "Sportswear": [
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600",
    "https://images.unsplash.com/photo-1483721310020-03333e577076?q=80&w=600",
    "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=600",
    "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=600",
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600"
  ],
  "Formal Wear": [
    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600",
    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=600",
    "https://images.unsplash.com/photo-1520975661595-6453be3f7070?q=80&w=600",
    "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=600"
  ],
  "Casual Wear": [
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600",
    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=600",
    "https://images.unsplash.com/photo-1626497746870-ab9d14fcbe65?q=80&w=600",
    "https://images.unsplash.com/photo-1505022610485-0249ba5b3675?q=80&w=600",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600"
  ],
  "Dresses": [
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600",
    "https://images.unsplash.com/photo-1539008835151-34322963006b?q=80&w=600",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600",
    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600"
  ],
  "Tops": [
    "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=600",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600",
    "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=600",
    "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=600",
    "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=600"
  ],
  "Handbags": [
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600",
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600",
    "https://images.unsplash.com/photo-1566150905458-1bf1fc15a490?q=80&w=600",
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600",
    "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=600"
  ],
  "Heels": [
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600",
    "https://images.unsplash.com/photo-1596609548086-85bbf8ddb6b9?q=80&w=600",
    "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=600",
    "https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=600",
    "https://images.unsplash.com/photo-1515605450882-71c1ef2ca488?q=80&w=600"
  ],
  "Sneakers (Women)": [
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600",
    "https://images.unsplash.com/photo-1512374382149-133422f428a5?q=80&w=600",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600",
    "https://images.unsplash.com/photo-1562183241-b937e95585b6?q=80&w=600",
    "https://images.unsplash.com/photo-1505784043884-3ed77554902a?q=80&w=600"
  ],
  "Jewelry": [
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600",
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600",
    "https://images.unsplash.com/photo-1512163143273-bde0e3cc7407?q=80&w=600",
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600",
    "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?q=80&w=600"
  ],
  "Skincare": [
    "https://images.unsplash.com/photo-1608248597481-496100c5c836?q=80&w=600",
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600",
    "https://images.unsplash.com/photo-1617155093730-a8bf47be792d?q=80&w=600",
    "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=600",
    "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600"
  ],
  "Activewear": [
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600",
    "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=600",
    "https://images.unsplash.com/photo-1483721310020-03333e577076?q=80&w=600",
    "https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=600",
    "https://images.unsplash.com/photo-1502904585520-fa21545e3dfc?q=80&w=600"
  ],
  "Winter Collection": [
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600",
    "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600",
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600"
  ],
  "Luxury Fashion": [
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600",
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600"
  ],
  "Accessories": [
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600",
    "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600",
    "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=600",
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600"
  ],
  "Caps": [
    "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600",
    "https://images.unsplash.com/photo-1534215754734-18e55d13e346?q=80&w=600",
    "https://images.unsplash.com/photo-1575424909138-46b05e5919ec?q=80&w=600",
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600",
    "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=600"
  ],
  "Bags": [
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600",
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600",
    "https://images.unsplash.com/photo-1566150905458-1bf1fc15a490?q=80&w=600",
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600",
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600"
  ],
  "Streetwear": [
    "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=600",
    "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=600",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600",
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600"
  ],
  "Perfumes": [
    "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600",
    "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600",
    "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=600",
    "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=600",
    "https://images.unsplash.com/photo-1615655404745-be00a74796a5?q=80&w=600"
  ]
};

// Seed blueprint templates for 5 items per category
const designTemplates: Record<string, Array<{ title: string; basePrice: number; keywords: string[]; prefix: string }>> = {
  // Men
  "T-Shirts": [
    { title: "Minimalist Pima Organic Tee", basePrice: 48, keywords: ["pima tee", "organic cotton shirt", "relaxed fit crewneck"], prefix: "TEE" },
    { title: "Heavyweight Box-Fit Tee", basePrice: 55, keywords: ["heavyweight drop shoulder", "streetwear blank tee"], prefix: "TEE" },
    { title: "Japanese Slub Cotton Tee", basePrice: 65, keywords: ["textured slub shirt", "indigo luxury knit"], prefix: "TEE" },
    { title: "Vintage Mineral Enzyme Wash Tee", basePrice: 50, keywords: ["faded aesthetic top", "destressed vintage shirt"], prefix: "TEE" },
    { title: "Luxury Mulberry Silk Pocket Tee", basePrice: 85, keywords: ["mulberry silk blend", "designer lounge tee"], prefix: "TEE" }
  ],
  "Hoodies": [
    { title: "French Terry Raglan Hoodie", basePrice: 95, keywords: ["french terry", "drop-shoulder hoodie", "minimalist basic"], prefix: "HUD" },
    { title: "Premium Cashmere-Blend Knit Hoodie", basePrice: 165, keywords: ["cashmere hoodie", "cozy luxury lounger"], prefix: "HUD" },
    { title: "Heavyweight Waffle-Lined Zip Hoodie", basePrice: 110, keywords: ["thermal dual zip", "oversized street garment"], prefix: "HUD" },
    { title: "Urban Acid-Wash Distressed Hoodie", basePrice: 98, keywords: ["acid wash texture", "grunge aesthetic sweat"], prefix: "HUD" },
    { title: "Brushed Fleece Core Oversized Hoodie", basePrice: 85, keywords: ["extra plush fleece", "athleisure relaxed pullover"], prefix: "HUD" }
  ],
  "Jackets": [
    { title: "Classic Italian Leather Biker Jacket", basePrice: 380, keywords: ["italian cowhide leather", "moto vintage jacket"], prefix: "JKT" },
    { title: "Minimalist Sand Coach Jacket", basePrice: 145, keywords: ["tech coach jacket", "taslan nylon outerwear"], prefix: "JKT" },
    { title: "Suburban Herringbone Wool Overcoat", basePrice: 240, keywords: ["virgin wool coat", "tailored duster jacket"], prefix: "JKT" },
    { title: "Urban Distressed Denim Trucker Jacket", basePrice: 120, keywords: ["selvedge raw denim", "retro trucker outerwear"], prefix: "JKT" },
    { title: "Modular Technical Utility Shell Jacket", basePrice: 185, keywords: ["waterproof shell", "laser-cut pockets garment"], prefix: "JKT" }
  ],
  "Jeans": [
    { title: "Selvedge Raw Slim Straight Jeans", basePrice: 135, keywords: ["japanese selvedge indigo", "raw custom fades"], prefix: "JNS" },
    { title: "Classic Tapered Stone Wash Jeans", basePrice: 95, keywords: ["indigo stone wash denim", "comfy relaxed fit"], prefix: "JNS" },
    { title: "Urban Destressed Crop-Hem Jeans", basePrice: 110, keywords: ["ripped thigh denim", "frayed crop street wear"], prefix: "JNS" },
    { title: "Minimalist Coal Washed Black Jeans", basePrice: 110, keywords: ["ultra black denim", "stretch-yarn comfort denim"], prefix: "JNS" },
    { title: "Vintage Loose Fit Worker Denim", basePrice: 125, keywords: ["carpenter loose jeans", "indigo heavy canvas"], prefix: "JNS" }
  ],
  "Sneakers": [
    { title: "White Calfskin Court Sneakers", basePrice: 175, keywords: ["calfskin leather tennis", "minimal white kicks"], prefix: "SNK" },
    { title: "Retro Suede Vulcanized Low-Tops", basePrice: 95, keywords: ["hairy suede vulcanized", "skate classic retro"], prefix: "SNK" },
    { title: "Urban Mesh Aero Running Sneakers", basePrice: 145, keywords: ["ortholite tech runners", "aerodynamic breathable mesh"], prefix: "SNK" },
    { title: "Military High-Top Trainer Sneakers", basePrice: 195, keywords: ["tactical high top kicks", "military spec platform shoe"], prefix: "SNK" },
    { title: "Knit Fly-Stretch Comfort Slip-Ons", basePrice: 120, keywords: ["recycled knit slipon", "cloud elastic running footwear"], prefix: "SNK" }
  ],
  "Watches": [
    { title: "Elite Minimalist Chronograph Watch", basePrice: 220, keywords: ["stainless watch classic", "quarts chronograph dial"], prefix: "WCH" },
    { title: "Monolith Sandblasted Automatic Watch", basePrice: 355, keywords: ["miyota automatic movement", "sapphire crystal watch"], prefix: "WCH" },
    { title: "Bespoke Cognac Leather Vintage Watch", basePrice: 180, keywords: ["handmade leather strap", "gold plated retro bezel"], prefix: "WCH" },
    { title: "Active Tech Silicon Tactical Watch", basePrice: 145, keywords: ["shockproof tactical stopwatch", "black resin field model"], prefix: "WCH" },
    { title: "Titanium Ceramic Luxury Dress Watch", basePrice: 480, keywords: ["integrated titanium strap", "ceramic matte luxury chronograph"], prefix: "WCH" }
  ],
  "Sunglasses": [
    { title: "Classic Glossy Acetate Aviator Sunglasses", basePrice: 85, keywords: ["polarized pilot shades", "vintage tortoise shell frames"], prefix: "SGL" },
    { title: "Urban Hexagonal Metal Frame Glasses", basePrice: 95, keywords: ["geometric lightweight spectacles", "gold rim anti reflective lens"], prefix: "SGL" },
    { title: "Minimal D-Frame Solid Matte Sunglasses", basePrice: 75, keywords: ["square basic shades", "bio-acetate carbon zero"], prefix: "SGL" },
    { title: "Retro Round Keyhole Bridge Eyewear", basePrice: 80, keywords: ["preppy vintage glasses", "horn rim style filters"], prefix: "SGL" },
    { title: "Sport Hydrophobic Shield Sunglasses", basePrice: 110, keywords: ["uv400 wraparound shield", "rubberized runner spectacles"], prefix: "SGL" }
  ],
  "Sportswear": [
    { title: "Aero-Performance Training Tee", basePrice: 45, keywords: ["sweat wicking dry-fit", "chafeless athletic short sleeve"], prefix: "SPO" },
    { title: "Elite Compressive Recycled Tight Pants", basePrice: 65, keywords: ["compression heatkeep tights", "recycled polyester jogger"], prefix: "SPO" },
    { title: "Ultralight Wind-Breaker Trainer Jacket", basePrice: 95, keywords: ["packable wind breaker", "ripstop nylon active coat"], prefix: "SPO" },
    { title: "Dynamic Flex Unlined Training Shorts", basePrice: 42, keywords: ["4-way stretch shorts", "split seam runner short"], prefix: "SPO" },
    { title: "Thermal Mid-Layer Quarter Zip Pullover", basePrice: 75, keywords: ["merino blend grid fleece", "outdoor alpine climb wear"], prefix: "SPO" }
  ],
  "Formal Wear": [
    { title: "Imperial Italian Virgin Suit Blazer", basePrice: 320, keywords: ["notch lapel virgin blazer", "bespoke suit jacket"], prefix: "FRM" },
    { title: "Sartorial Crisp Egyptian Cotton Tux Shirt", basePrice: 95, keywords: ["french cuff pleated front", "luxury dress shirt white"], prefix: "FRM" },
    { title: "Slim-Fit Tailored Wool Dress Trousers", basePrice: 140, keywords: ["half-lined trouser slacks", "side-tab adjustments slacks"], prefix: "FRM" },
    { title: "Oxford Polished Whole-Cut Leather Dress Shoes", basePrice: 220, keywords: ["goodyear welted shoes", "fine box calf cognac shoe"], prefix: "FRM" },
    { title: "Mulberry Silk Fine-Weated Jacquard Tie", basePrice: 55, keywords: ["jacquard designer necktie", "silk pocket square suit"], prefix: "FRM" }
  ],
  "Casual Wear": [
    { title: "Vintage Indigo Chambray Work Shirt", basePrice: 78, keywords: ["faded blue chambray", "curved hem workwear"], prefix: "CSL" },
    { title: "Refined Stretch Cotton Slim Chinos", basePrice: 88, keywords: ["everyday khaki pants", "non iron cotton slacks"], prefix: "CSL" },
    { title: "Structured Pique Organic Polo Shirt", basePrice: 68, keywords: ["tennis pique knit polo", "soft tennis collar shirt"], prefix: "CSL" },
    { title: "Linen-Cotton Summer Deck Trousers", basePrice: 95, keywords: ["linen drawstring pants", "breathable cruise deck wear"], prefix: "CSL" },
    { title: "Suede Leather Moccasin Classic Loafers", basePrice: 155, keywords: ["hairy split suede loafer", "driving slip on footwear"], prefix: "CSL" }
  ],

  // Women
  "Dresses": [
    { title: "Mulberry Silk Asymmetrical Evening Dress", basePrice: 245, keywords: ["bias cut mulberry silk", "evening gala wrap drape"], prefix: "DRS" },
    { title: "Minimalist Ribbed Knit Midi Dress", basePrice: 125, keywords: ["merino wool columns shift", "cozy mock neck midi dress"], prefix: "DRS" },
    { title: "Boho Cotton Lace Tiered Maxi Dress", basePrice: 135, keywords: ["crochet summer dress", "embroidered beach resort"], prefix: "DRS" },
    { title: "Satin Cowl-Neck Slip Seduction Dress", basePrice: 110, keywords: ["cowl neck emerald slip dress", "cocktail hour backless dress"], prefix: "DRS" },
    { title: "Structured Tailored Double-Breasted Blazer Dress", basePrice: 185, keywords: ["modern blazer dress collar", "editorial power dressing dress"], prefix: "DRS" }
  ],
  "Tops": [
    { title: "Copenhagen organic Cotton Puff Sleeve Blouse", basePrice: 75, keywords: ["organic cotton poplin top", "volume sleeves chic top"], prefix: "TOP" },
    { title: "Fine Ribbed Mock-Neck Modal Sleeveless Top", basePrice: 38, keywords: ["seamless modal shell tank", "everyday minimal layer tank"], prefix: "TOP" },
    { title: "Asymmetrical Draped Crepe Silk Satin Cami", basePrice: 85, keywords: ["draped premium halter neck", "asymmetric luxury nightout top"], prefix: "TOP" },
    { title: "Oversized Classic Striped Linen Popover Shirt", basePrice: 85, keywords: ["breezy deck stripes linen", "resort relaxed fit vacation top"], prefix: "TOP" },
    { title: "Cashmere Cropped Rib Knit Cardigan", basePrice: 130, keywords: ["cropped fitted cashmere knit", "sweetheart cut winter tops"], prefix: "TOP" }
  ],
  "Handbags": [
    { title: "Nappa Leather Crescent Hobo Bag", basePrice: 220, keywords: ["nappa smooth crescent bag", "underarm minimalist hand clutch"], prefix: "BAG" },
    { title: "Architectural Trapeze Structured Tote", basePrice: 285, keywords: ["architectural boxy tote bag", "full grain pebble calfskin tote"], prefix: "BAG" },
    { title: "Micro Metallic Chain Crossbody Bag", basePrice: 145, keywords: ["evening envelope chain bag", "metallic golden hardware handbag"], prefix: "BAG" },
    { title: "Handwoven Straw Summer Resort Bag", basePrice: 95, keywords: ["raffia weave top handle bag", "premium resort beach look bag"], prefix: "BAG" },
    { title: "Convertible Multi-Compartment Bucket Sack", basePrice: 180, keywords: ["drawstring calfskin bucket", "casual urban street sack"], prefix: "BAG" }
  ],
  "Heels": [
    { title: "Sculpted Glass Hourglass Ankle Pumps", basePrice: 195, keywords: ["sculptural lucite heels", "patent leather glossy strap pumps"], prefix: "HEL" },
    { title: "Nude Velvet Suede Pointed Stilettos", basePrice: 180, keywords: ["dorsay pointed low cut", "high-traction designer dress heel"], prefix: "HEL" },
    { title: "Minimal Square-Toe Kitten Heel Sandals", basePrice: 135, keywords: ["strappy classic sandal heel", "nappa soft daily kitten shoes"], prefix: "HEL" },
    { title: "Ankle-Wrap Metallic Party Platform Heels", basePrice: 220, keywords: ["chunky disco night platform", "metallic leather strap wedding heels"], prefix: "HEL" },
    { title: "Woven Leather Slingback Formal Heels", basePrice: 165, keywords: ["woven hand-craft slingback", "casual corporate open-back shoe"], prefix: "HEL" }
  ],
  "Sneakers (Women)": [
    { title: "Pastel Color-Block Comfort Trainers", basePrice: 125, keywords: ["pastel chunky designer shoes", "mesh paneled dynamic platform"], prefix: "WSN" },
    { title: "Sleek Ecru Leather Low-Top Sneakers", basePrice: 145, keywords: ["offwhite minimal leather trainer", "ortho comfort gold eyelet series"], prefix: "WSN" },
    { title: "Tech Mesh High-Performance Active Runners", basePrice: 155, keywords: ["womens trail stride shoes", "responsive energy cushion trainer"], prefix: "WSN" },
    { title: "Distressed Vintage Starboard Street Sneakers", basePrice: 115, keywords: ["faded raw sole sneakers", "lifestyle everyday retro slipons"], prefix: "WSN" },
    { title: "Ultralight Recycled Sock-Knit Casual Sneakers", basePrice: 95, keywords: ["flexible high-stretch steps", "recycled fiber green footwear"], prefix: "WSN" }
  ],
  "Jewelry": [
    { title: "18k Gold Plated Organic Link Necklace", basePrice: 125, keywords: ["heirloom link chain 18k", "asymmetrical minimal choker collar"], prefix: "JWL" },
    { title: "Baroque Freshwater Pearl Drop Earrings", basePrice: 85, keywords: ["unique non-nucleated shell pearls", "sterling silver gold-wash drop set"], prefix: "JWL" },
    { title: "Sculpted Minimalist Bold Stacking Rings", basePrice: 65, keywords: ["brutalist dome stacking band", "solid recycled gold rim ring"], prefix: "JWL" },
    { title: "Dainty Celestial Diamond Inset Anklet", basePrice: 75, keywords: ["adjustable micro spacer link", "sparkling cz crystals jewelry"], prefix: "JWL" },
    { title: "Textured Heavy Metallic Statement Cuff Cuff", basePrice: 110, keywords: ["statement modern wrist armor", "pebble finish design wear"], prefix: "JWL" }
  ],
  "Skincare": [
    { title: "Intense Botanical Dew Hyaluronic Serum", basePrice: 68, keywords: ["botanical glow elixir bottle", "organic peptide moisture booster"], prefix: "SKN" },
    { title: "Squalane Saffron Night Recovery Balm Cream", basePrice: 85, keywords: ["nightly squalane rich nightcream", "soothing skin barrier recovery"], prefix: "SKN" },
    { title: "Matcha Willow-Bark Pore Clarifying Mask Toner", basePrice: 42, keywords: ["willow bark salicylic peel", "pore minimizing superfoods mud"], prefix: "SKN" },
    { title: "Ceramide Cloud Whipped Daily Moisturizer", basePrice: 54, keywords: ["barrier protective ceramide", "non greasy silky day gel moisturizer"], prefix: "SKN" },
    { title: "Vitamin C Rosehip Radiance Oil Mist", basePrice: 60, keywords: ["cold pressed rosehip extract", "radiance glowing face oil drops"], prefix: "SKN" }
  ],
  "Activewear": [
    { title: "Limitless Seamless Athletic Bra V", basePrice: 48, keywords: ["molded inner cups support", "recycled breathable yoga top"], prefix: "ACT" },
    { title: "Sculpt-Compress High Waisted Ribbed Leggings", basePrice: 75, keywords: ["interlock sculpt knit compression", "squat proof sweatproof joggers"], prefix: "ACT" },
    { title: "Active Tech Crop Half-Zip Pullover Sweater", basePrice: 85, keywords: ["crop performance light windstopper", "quick dry thumbhole tech wear"], prefix: "ACT" },
    { title: "Super-Flex 2-in-1 Running Athletic Shorts", basePrice: 48, keywords: ["womens trail utility pocket pocket", "elastic waist comfort athletic pants"], prefix: "ACT" },
    { title: "Organic Bamboo Loungewear Jogging Set Set", basePrice: 115, keywords: ["cloud yarn lightweight loose pants", "cozy home yoga sustainable fabrics"], prefix: "ACT" }
  ],
  "Winter Collection": [
    { title: "Premium Oversized Teddy Shearling Jacket Coat", basePrice: 280, keywords: ["cozy teddy pile shearling", "heavy insulation double layer"], prefix: "WNT" },
    { title: "Fisherman Cable-Knit Chunky Wool Muffler", basePrice: 85, keywords: ["extra long merino heavy scarf", "soft cable pattern neck warmer"], prefix: "WNT" },
    { title: "Pure Mongolian Cashmere Mockneck Sweater", basePrice: 195, keywords: ["sustainable fine cashmere sweater", "ribbed edges cozy warm clothing"], prefix: "WNT" },
    { title: "Insulated Heavy Duck-Down Puffer Parka", basePrice: 310, keywords: ["wind-resistant heavy winter protection", "detachable hood double protection coat"], prefix: "WNT" },
    { title: "Thermal Quilted Water-Resistant Puffer Vest", basePrice: 125, keywords: ["lightweight layer grid check check", "down-fill outdoor winter vest"], prefix: "WNT" }
  ],
  "Luxury Fashion": [
    { title: "Sartorial Double-Breasted Cashmere Trench Coat", basePrice: 495, keywords: ["luxury cashmere blend overcoat", "tailored duster formal wear outerwear"], prefix: "LUX" },
    { title: "Draped Silk Chiffon Editorial Pleated Gown", basePrice: 380, keywords: ["pleated fine chiffon designer gown", "red carpet couture gala evening clothing"], prefix: "LUX" },
    { title: "Minimalist Italian Suede Tailored Trench", basePrice: 420, keywords: ["premium ultra soft lambskin suede", "unstructured neutral resort wear jacket"], prefix: "LUX" },
    { title: "Heirloom Pearl Embroidered Velvet Corset Top", basePrice: 210, keywords: ["hand attached beads velvet luxury", "gothic haute design renaissance corset"], prefix: "LUX" },
    { title: "Tailored Double-Breasted Wool Tuxedo Blazer", basePrice: 320, keywords: ["satin notch lapel blacktie luxury", "womens formal wardrobe designer blazer"], prefix: "LUX" }
  ],

  // Unisex
  "Accessories": [
    { title: "Minimalist Premium Leather Card Holder Wallet", basePrice: 45, keywords: ["pebbled leather slip-card case", "rfid block sleek modern wallet"], prefix: "ACC" },
    { title: "Organic Flax Linen Lightweight Unisex Scarf", basePrice: 55, keywords: ["crinkled summer beach resort wrap", "belgian soft flax loose weave scarf"], prefix: "ACC" },
    { title: "Structured Core Utility Webbing Belt", basePrice: 38, keywords: ["tactical clasp nylon adjustable belt", "unisex rugged cargo belt series"], prefix: "ACC" },
    { title: "Bold Brass Retro Dome Signet Ring", basePrice: 65, keywords: ["chunky brass unisex classic band", "brutalist design metal accents"], prefix: "ACC" },
    { title: "Premium Canvas Minimalist Everyday Tote Case", basePrice: 44, keywords: ["thick raw cotton travel pouch", "leather base premium durable sack"], prefix: "ACC" }
  ],
  "Caps": [
    { title: "Classic Heavy Twill Unstructured Baseball Cap", basePrice: 32, keywords: ["washed cotton baseball hats", "adjustable brass slider retro cap"], prefix: "CAP" },
    { title: "Minimalist Sand Rib Knit Wool Beanie", basePrice: 38, keywords: ["fine knit cuff warm beanie", "wool blended stretch ski cap"], prefix: "CAP" },
    { title: "Urban Streetwear Technical Ripstop Cap", basePrice: 42, keywords: ["ripstop nylon waterproof 5-panel", "breathable campers quick-adjust closure"], prefix: "CAP" },
    { title: "Vintage Faded Corduroy Premium Cap", basePrice: 35, keywords: ["rich corduroy fine lines cap", "skate streetwear vintage aesthetic"], prefix: "CAP" },
    { title: "Linen Lightweight Sun Protector Bucket Hat", basePrice: 48, keywords: ["flexible wide brim holiday hat", "packable organic flax beige hat"], prefix: "CAP" }
  ],
  "Bags": [
    { title: "Modular Tech Commuter Canvas Backpack", basePrice: 145, keywords: ["repellent coated commuter laptop bag", "ergonomic harness active backpack"], prefix: "BAG" },
    { title: "Minimalist Pebbled Leather Urban Sling Sack", basePrice: 95, keywords: ["crossbody chest shoulder bag", "sleek chrome zip designer pouch"], prefix: "BAG" },
    { title: "Heavy Canvas Weekend Luggage Duffle Bag", basePrice: 185, keywords: ["overnight gym fitness duffle", "vegetable tanned leather handles bag"], prefix: "BAG" },
    { title: "Water-Repellent Crossbody Daily Chest Messenger", basePrice: 75, keywords: ["active wear dry sack case", "magnetic quick-release buckle bag"], prefix: "BAG" },
    { title: "Classic Roll-Top Urban Commuter Sack", basePrice: 120, keywords: ["rolltop cycling backpack waterproof", "retro urban explore travel gear"], prefix: "BAG" }
  ],
  "Streetwear": [
    { title: "Shadow Black Oversized Splatter Hoodie", basePrice: 95, keywords: ["retro heavyweight graphic hoodies", "punk streetwear raw edge cotton"], prefix: "STW" },
    { title: "Aero Multi-Pocket Combat Cargo Pants", basePrice: 125, keywords: ["taslan nylon cargo track pants", "drawstring utility techwear tactical"], prefix: "STW" },
    { title: "Heavyweight Slub Cotton Streetwear Henley", basePrice: 65, keywords: ["waffle weave drop shoulders tunic", "retro boxy skateboard pullover"], prefix: "STW" },
    { title: "Core Graphics Organic Acid Tee Wash", basePrice: 55, keywords: ["vintage distressed graphics shirt", "loose grunge rock aesthetic clothing"], prefix: "STW" },
    { title: "Refined Knit Spliced Heavyweight Sweatshirt", basePrice: 88, keywords: ["bicolor tech contrast stitch crew", "cozy oversized streetwear tops"], prefix: "STW" }
  ],
  "Perfumes": [
    { title: "Oasis Oud Eau De Parfum Splendid", basePrice: 145, keywords: ["dark exotic agarwood incense spray", "amber sandalwood rich unisex scent"], prefix: "PFM" },
    { title: "Citrus Sandalwood Summer Vibe Cologne", basePrice: 110, keywords: ["fresh bergamot ocean spray", "casual beach resort daytime perfume"], prefix: "PFM" },
    { title: "Smoked Vanilla Leather Midnight Scent", basePrice: 135, keywords: ["spicy cardamom vanilla tabac", "sexy nightout velvet leather scent"], prefix: "PFM" },
    { title: "Green Tea Vetiver Botanical Perfume", basePrice: 110, keywords: ["earthy moss grass fresh mist", "minimal clean unisex daily cologne"], prefix: "PFM" },
    { title: "Abstract Sea Minerals Airy Parfum", basePrice: 125, keywords: ["aquatic salted wood breezy spray", "unisex modern clean slate fragrance"], prefix: "PFM" }
  ]
};

// Generates exactly 125 high-quality products across the list
export const generate125Products = (): Product[] => {
  const allGenerated: Product[] = [];

  // Iterate over every category setup
  megaCategories.forEach((catObj) => {
    // Check if we have templates. Let's find template bank map.
    // Notice "Sneakers (Women)" maps to template source "Sneakers (Women)" and "T-Shirts" to "T-Shirts" etc.
    const key = catObj.name === "Sneakers (Women)" ? "Sneakers (Women)" :
                 catObj.name === "Sneakers" ? "Sneakers" : catObj.name;
    const templates = designTemplates[key] || [];

    // Category's images list
    const images = imageBank[key] || [
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600"
    ];

    templates.forEach((temp, index) => {
      const prodId = `megaprod-${catObj.id}-${index + 1}`;
      const imgUrl = images[index % images.length];

      // Original vs Sale Pricing logic
      const basePrice = temp.basePrice;
      const onSale = index % 2 === 0; // Alternating sale items
      const salePrice = onSale ? Math.round(basePrice * 0.8) : undefined;
      
      // Determine Gender alignment
      let gender: 'men' | 'women' | 'unisex' = 'unisex';
      if (catObj.slug.startsWith('men-')) {
        gender = 'men';
      } else if (catObj.slug.startsWith('women-')) {
        gender = 'women';
      }

      // Specifications Map builder
      const materialMap: Record<string, string> = {
        "T-Shirts": "100% GOTS Seed-to-Garment Organic Cotton, combed spun threads",
        "Hoodies": "450 GSM Heavy French Cotton Terry Wool Blend, premium loops",
        "Jackets": "High-Grade Italian Aniline Nappa Leather / Custom Double Layer Wool Woven",
        "Jeans": "14 oz Authentic Kuroki Selvedge Denim, premium dark wash",
        "Sneakers": "Grade-A Full Calfskin Leather, Ortholite Premium Memory Cushioning Insole",
        "Watches": "High-Tough 316L Surgical Stainless Steel casing, sapphire dome protective lens",
        "Sunglasses": "Recycled Biodegradable Italian Bio-Acetate frames, Polarized Polycarbonate",
        "Sportswear": "88% Recycled Ocean Clean Polyester, 12% High Stretchy Elastane yarns",
        "Formal Wear": "100% Super-Fine Italian Merino Virgin Wool, anti wrinkle, breathable",
        "Casual Wear": "Double Enzyme Washed Organic European Flax Linen & combed Cotton blend",
        "Dresses": "Pure Mulberry Natural Silk threads with 5% flexible comfort weave elastane",
        "Tops": "Extra Breathable Cotton Poplin, eco-friendly dyed micro fibers",
        "Handbags": "Buttery Smooth Nappa Pebble-Grain Leather outer, pure linen interior lining",
        "Heels": "Vegetable Tanned Natural Suede Calf-Skin, high compression latex padding heel",
        "Sneakers (Women)": "Eco Knit Stretch fiber paneling, high-elastic TPU shock-absorber outsoles",
        "Jewelry": "Recycled 18K Yellow Gold vermeil plating over Sterling 925 core",
        "Skincare": "Intense Cold-Pressed Squalane and Bio-Active plant peptide ingredients",
        "Activewear": "92% Organic Bamboo fiber, 8% premium stretching spandex elements",
        "Winter Collection": "100% Fine Mongolian Cashmere & premium high loft Duck-down filling block",
        "Luxury Fashion": "High-Couture Cashmere-Silk woven capsule, strictly bespoke luxury standards",
        "Accessories": "Hand-Sewn Vegetable Tanned Full-Grain Cow Leather, anti scratch",
        "Caps": "Washed combed heavy Twill Cotton yarn with adjustable copper closures",
        "Bags": "1000D Ballistic Cordura waterproof fabrics with matte carbon accents",
        "Streetwear": "Heavy Slub French Terry loops, double-stitched reinforcements",
        "Perfumes": "Intense Pure Sandalwood, Oud, Cardamom, and bergamot essential oils blend"
      };

      const fitMap: Record<string, string> = {
        "T-Shirts": "Relaxed Boxy Silhouette",
        "Hoodies": "Oversized street profile comfort",
        "Jackets": "Tailored jacket cut with structured shoulders",
        "Jeans": "Slim Tapered fit with comfort thighs",
        "Sneakers": "Ergonomic comfort cupsole - True to size",
        "Watches": "Universal adjustable size",
        "Dresses": "Fluid drape contours",
        "Activewear": "Compressive supportive stretch"
      };

      const specFabric = materialMap[key] || "Premium organic blend fabrics, bespoke construction and weaving standards";
      const specFit = fitMap[key] || "Regular fit, architectural tailoring alignment - Universal wearable sizing";
      const specWeight = index % 2 === 0 ? "Mediumweight luxury drape" : "Heavyweight robust thread weave density";
      const specCare = index % 3 === 0 
        ? "Professional eco-friendly dry clean only to maintain fiber shine and structure"
        : "Delicate machine wash cold, dry flat in shade. Do not bleach or tumble dry.";

      // Sizing variation lists based on category
      const sizeOptions = catObj.name === "Watches" || catObj.name === "Sunglasses" || catObj.name === "Perfumes"
        ? ["OS (One Size)"]
        : catObj.name.includes("Sneakers") || catObj.name === "Heels"
        ? ["38", "39", "40", "41", "42", "43"]
        : ["S", "M", "L", "XL"];

      // Color variations
      const colorOptions = index % 3 === 0 
        ? ["Offwhite Sand", "Oatmeal Beige"] 
        : index % 3 === 1 
        ? ["Midnight Black", "Slate Charcoal"] 
        : ["Terracotta Rust", "Forest Olive"];

      // Reviews generator
      const totalReviewsCount = 3 + (onSale ? 2 : 0);
      const generatedReviews: Review[] = [];
      let starsSum = 0;

      for (let rIdx = 0; rIdx < totalReviewsCount; rIdx++) {
        const ratingVal = 4 + (rIdx % 2); // alternating 4 and 5 stars
        starsSum += ratingVal;
        
        generatedReviews.push({
          id: `rev-${prodId}-${rIdx}`,
          author: reviewerNames[(index * 2 + rIdx) % reviewerNames.length],
          rating: ratingVal,
          comment: customerReviews[(index + rIdx) % customerReviews.length],
          date: new Date(Date.now() - (rIdx * 5 + index) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });
      }

      const meanRating = Math.round((starsSum / totalReviewsCount) * 10) / 10;

      // Variations builder for variable items
      const isVariable = index % 2 === 0; // alternating simpler and variables
      const variations: Variation[] = [];

      if (isVariable) {
        let varCount = 0;
        sizeOptions.slice(0, 3).forEach((sz) => {
          colorOptions.slice(0, 2).forEach((col) => {
            varCount++;
            variations.push({
              id: `v-${prodId}-${varCount}`,
              attributes: { size: sz, color: col },
              price: basePrice,
              salePrice: salePrice,
              sku: `${temp.prefix}-${sz}-${col.substring(0,2).toUpperCase()}-${300 + index}`,
              stock: 8 + (varCount * 3) % 15
            });
          });
        });
      }

      // Tags and Styling Tags list
      const stylingTagOptions = [
        ["Minimalist", "Resort Collar", "Classic Tailoring"],
        ["Streetwear", "Avant-Garde", "Raw Distress"],
        ["Retro Athletic", "Comfort Core", "Urban Runway"],
        ["High-End Luxury", "Bespoke Evening", "Editorial Silhouette"],
        ["Modern Techwear", "All-Weather Utility", "Active Gorpcore"]
      ];

      const chosenStyling = stylingTagOptions[index % stylingTagOptions.length];

      allGenerated.push({
        id: prodId,
        title: temp.title,
        description: `Indulge in our classic, curated ${temp.title.toLowerCase()}. Crafted under high-fashion design guidelines, this garment represents the peak of modern ${catObj.name.toLowerCase()} trends with deep styling properties. Double finished for extreme color retention, maximum fiber handfeel resilience, and a luxury drape structure. Engineered precisely for everyday capsule wear or standout editorial appeal.`,
        shortDescription: `A premium luxury ${temp.title.toLowerCase()} featuring organic weaves, elegant fit shapes and standard climate-neutral tailoring from Copenhagen.`,
        price: basePrice,
        salePrice: salePrice,
        sku: `${temp.prefix}-SKU-${1000 + index}`,
        type: isVariable ? 'variable' : 'simple',
        categories: [catObj.name],
        gender: gender,
        imageUrl: imgUrl,
        images: [imgUrl, images[(index + 1) % images.length], images[(index + 2) % images.length]],
        variations: isVariable ? variations : undefined,
        focusKeyword: temp.title.split(' ').slice(-2).join(' '),
        seoTitle: `${temp.title} - Luxury Premium Apparel | Aura Store`,
        seoDescription: `Shop our premium ${temp.title} online at Aura. Built with sustainable double-combed materials and modern tailoring. Free global express courier options.`,
        seoKeywords: [catObj.name.toLowerCase(), ...temp.keywords],
        seoScore: 82 + (index * 4) % 18,
        tags: [catObj.name.toLowerCase(), "capsule-wear", gender, "designer-series"],
        reviews: generatedReviews,
        rating: meanRating,
        stylingTags: chosenStyling,
        specifications: {
          material: specFabric,
          fit: specFit,
          weight: specWeight,
          care: specCare
        }
      });
    });
  });

  return allGenerated;
};
