export interface Variation {
  id: string;
  attributes: {
    size?: string;
    color?: string;
    [key: string]: string | undefined;
  };
  price?: number;
  salePrice?: number;
  sku: string;
  stock: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  salePrice?: number;
  sku: string;
  type: 'simple' | 'variable';
  categories: string[];
  gender: 'men' | 'women' | 'unisex';
  imageUrl: string;
  images?: string[];
  variations?: Variation[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  seoScore?: number;
  focusKeyword?: string;
  
  // Advanced Fashion Extended Fields
  shortDescription?: string;
  specifications?: {
    material: string;
    fit: string;
    weight: string;
    care: string;
    [key: string]: string;
  };
  tags?: string[];
  reviews?: Review[];
  rating?: number;
  stylingTags?: string[];
}

export interface CartItem {
  cartId: string; // unique cart identifier, e.g. productId-variationId
  product: Product;
  selectedVariation?: Variation;
  selectedAttributes?: {
    size?: string;
    color?: string;
  };
  quantity: number;
}

export interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  createdAt: string;
  subtotal: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'Credit Card' | 'Cash on Delivery';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'cancelled';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface GlobalState {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  wishlist: string[]; // list of productIds
  orders: Order[];
  taxRate: number; // percentage, e.g. 8 for 8%
  currentView: 'home' | 'product-details' | 'cart' | 'checkout' | 'user-dashboard' | 'admin-dashboard';
  selectedProductId: string | null;
  isAdmin: boolean;
}
