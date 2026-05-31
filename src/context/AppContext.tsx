import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, CartItem, Order, Variation, ShippingAddress } from '../types';
import { initialProducts, initialCategories } from '../data/initialProducts';

interface AppContextType {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  taxRate: number;
  currentView: 'home' | 'product-details' | 'cart' | 'checkout' | 'user-dashboard' | 'admin-dashboard';
  selectedProductId: string | null;
  isAdmin: boolean;
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  addCategory: (c: Category) => void;
  deleteCategory: (id: string) => void;
  resetCatalog: (products: Product[], categories: Category[]) => void;
  addToCart: (product: Product, quantity: number, variation?: Variation, attributes?: { size?: string; color?: string }) => void;
  removeFromCart: (cartId: string) => void;
  updateCartQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  createOrder: (address: ShippingAddress, paymentMethod: 'Credit Card' | 'Cash on Delivery') => Order;
  updateOrderStatus: (orderId: string, status: Order['status'], paymentStatus?: Order['paymentStatus']) => void;
  setTaxRate: (rate: number) => void;
  navigate: (view: 'home' | 'product-details' | 'cart' | 'checkout' | 'user-dashboard' | 'admin-dashboard', productId?: string | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Customer properties
  user: { id: string; email: string; name: string } | null;
  userToken: string | null;
  loginUser: (email: string, password: string) => Promise<boolean>;
  registerUser: (name: string, email: string, password: string) => Promise<boolean>;
  logoutUser: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('aura_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('aura_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>([]);

  const [taxRate, setTaxRateState] = useState<number>(() => {
    const saved = localStorage.getItem('aura_tax_rate');
    return saved ? parseFloat(saved) : 8.0; // 8% default
  });

  const [currentView, setCurrentView] = useState<AppContextType['currentView']>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Customer credentials status
  const [user, setUser] = useState<{ id: string; email: string; name: string; wishlist?: string[]; cart?: any[] } | null>(null);
  const [userToken, setUserToken] = useState<string | null>(() => {
    return localStorage.getItem('aura_user_token');
  });

  // A1. Sync state to local storage on changes (cart, wishlist, and tax rate)
  useEffect(() => {
    localStorage.setItem('aura_cart', JSON.stringify(cart));
    if (userToken && user) {
      fetch('/api/auth/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ cart })
      }).catch((err) => console.error("Database cart sync fail", err));
    }
  }, [cart, userToken]);

  useEffect(() => {
    localStorage.setItem('aura_wishlist', JSON.stringify(wishlist));
    if (userToken && user) {
      fetch('/api/auth/wishlist', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ wishlist })
      }).catch((err) => console.error("Database wishlist sync fail", err));
    }
  }, [wishlist, userToken]);

  useEffect(() => {
    localStorage.setItem('aura_tax_rate', taxRate.toString());
  }, [taxRate]);

  // A2. Fetch catalog elements on first mount from Backend
  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const prodRes = await fetch('/api/products');
        if (prodRes.ok) {
          const fetched = await prodRes.ok ? await prodRes.json() : [];
          if (Array.isArray(fetched) && fetched.length > 0) {
            setProducts(fetched);
          } else {
            setProducts(initialProducts);
          }
        } else {
          setProducts(initialProducts);
        }
      } catch (e) {
        console.warn("Unable to fetch remote products, relying on fallback Catalog state.", e);
        setProducts(initialProducts);
      }

      try {
        const catRes = await fetch('/api/categories');
        if (catRes.ok) {
          const fetchedCats = await catRes.json();
          if (Array.isArray(fetchedCats) && fetchedCats.length > 0) {
            setCategories(fetchedCats);
          } else {
            setCategories(initialCategories);
          }
        } else {
          setCategories(initialCategories);
        }
      } catch (e) {
        console.warn("Unable to fetch remote categories, relying on fallback.", e);
        setCategories(initialCategories);
      }
    };
    loadCatalog();
  }, []);

  // A3. Check current authentication session and synchronise Orders
  useEffect(() => {
    const savedToken = localStorage.getItem('aura_admin_token');
    if (savedToken) {
      setIsAdmin(true);
    }
  }, []);

  // Fetch or verify customer profile
  useEffect(() => {
    if (userToken) {
      const getProfile = async () => {
        try {
          const res = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${userToken}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            if (data.user.wishlist) {
              setWishlist(data.user.wishlist);
            }
            if (data.user.cart && data.user.cart.length > 0) {
              setCart(data.user.cart);
            }
          } else {
            localStorage.removeItem('aura_user_token');
            setUserToken(null);
            setUser(null);
          }
        } catch (e) {
          console.error("Encountered user authentication me load failure", e);
        }
      };
      getProfile();
    } else {
      setUser(null);
    }
  }, [userToken]);

  useEffect(() => {
    if (isAdmin) {
      const syncAdminOrders = async () => {
        const token = localStorage.getItem('aura_admin_token');
        if (!token) return;
        try {
          const res = await fetch('/api/orders', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            setOrders(data);
          } else if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('aura_admin_token');
            setIsAdmin(false);
          }
        } catch (e) {
          console.error("Failed to sync admin orders database.", e);
        }
      };
      syncAdminOrders();
    } else if (userToken) {
      const syncUserOrders = async () => {
        try {
          const res = await fetch('/api/orders/my', {
            headers: {
              'Authorization': `Bearer ${userToken}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            setOrders(data);
          }
        } catch (e) {
          console.error("Failed to fetch customer specific purchase history.", e);
        }
      };
      syncUserOrders();
    } else {
      const savedOrders = localStorage.getItem('aura_orders');
      if (savedOrders) {
        try {
          setOrders(JSON.parse(savedOrders));
        } catch (e) {
          setOrders([]);
        }
      } else {
        setOrders([]);
      }
    }
  }, [isAdmin, userToken]);

  // Actions
  const addProduct = async (p: Product) => {
    const token = localStorage.getItem('aura_admin_token');
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(p)
      });
      if (res.ok) {
        const created = await res.json();
        setProducts((prev) => [created, ...prev]);
      } else {
        setProducts((prev) => [p, ...prev]);
      }
    } catch (e) {
      setProducts((prev) => [p, ...prev]);
    }
  };

  const updateProduct = async (p: Product) => {
    const token = localStorage.getItem('aura_admin_token');
    try {
      const res = await fetch(`/api/products/${p.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(p)
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      } else {
        setProducts((prev) => prev.map((item) => (item.id === p.id ? p : item)));
      }
    } catch (e) {
      setProducts((prev) => prev.map((item) => (item.id === p.id ? p : item)));
    }
  };

  const deleteProduct = async (id: string) => {
    const token = localStorage.getItem('aura_admin_token');
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((item) => item.id !== id));
      } else {
        setProducts((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (e) {
      setProducts((prev) => prev.filter((item) => item.id !== id));
    }
    // clean cart and wishlist of deleted item
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    setWishlist((prev) => prev.filter((pid) => pid !== id));
  };

  const addCategory = async (c: Category) => {
    const token = localStorage.getItem('aura_admin_token');
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(c)
      });
      if (res.ok) {
        const created = await res.json();
        setCategories((prev) => [...prev, created]);
      } else {
        setCategories((prev) => [...prev, c]);
      }
    } catch (e) {
      setCategories((prev) => [...prev, c]);
    }
  };

  const deleteCategory = async (id: string) => {
    const token = localStorage.getItem('aura_admin_token');
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
      } else {
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
      }
    } catch (e) {
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    }
  };

  const resetCatalog = (newProducts: Product[], newCategories: Category[]) => {
    setProducts(newProducts);
    setCategories(newCategories);
  };

  const addToCart = (
    product: Product,
    quantity: number,
    variation?: Variation,
    attributes?: { size?: string; color?: string }
  ) => {
    setCart((prevCart) => {
      // Build a unique identity for this cart item
      const cartId = variation 
        ? `${product.id}-${variation.id}` 
        : `${product.id}-simple`;

      const existingIndex = prevCart.findIndex((item) => item.cartId === cartId);

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            cartId,
            product,
            selectedVariation: variation,
            selectedAttributes: attributes,
            quantity,
          },
        ];
      }
    });
  };

  const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const updateCartQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.cartId === cartId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const createOrder = (address: ShippingAddress, paymentMethod: 'Credit Card' | 'Cash on Delivery'): Order => {
    const subtotal = cart.reduce((acc, item) => {
      const price = item.selectedVariation?.salePrice || item.selectedVariation?.price || item.product.salePrice || item.product.price;
      return acc + price * item.quantity;
    }, 0);

    const tax = Math.round((subtotal * (taxRate / 100)) * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;

    const isCOD = paymentMethod === 'Cash on Delivery';

    const tempOrder: Order = {
      id: `order-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...cart],
      createdAt: new Date().toISOString(),
      subtotal,
      tax,
      total,
      shippingAddress: address,
      status: isCOD ? 'processing' : 'pending',
      paymentMethod,
      paymentStatus: 'pending',
    };

    // Submit order asynchronously to back-end REST pipeline
    fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(userToken ? { 'Authorization': `Bearer ${userToken}` } : {})
      },
      body: JSON.stringify({
        items: tempOrder.items,
        shippingAddress: tempOrder.shippingAddress,
        paymentMethod: tempOrder.paymentMethod
      })
    })
      .then(async (res) => {
        if (res.ok) {
          const savedOrder = await res.json();
          setOrders((prev) => {
            const list = prev.map((o) => o.id === tempOrder.id ? { ...savedOrder, id: savedOrder.id } : o);
            if (!isAdmin && !userToken) {
              localStorage.setItem('aura_orders', JSON.stringify(list));
            }
            return list;
          });
        }
      })
      .catch((e) => console.error("Encountered remote connection checkout fail.", e));

    setOrders((prev) => {
      const list = [tempOrder, ...prev];
      if (!isAdmin && !userToken) {
        localStorage.setItem('aura_orders', JSON.stringify(list));
      }
      return list;
    });

    clearCart();
    return tempOrder;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status'], paymentStatus?: Order['paymentStatus']) => {
    const adminToken = localStorage.getItem('aura_admin_token');
    const isCustomerCancel = !isAdmin && userToken && status === 'cancelled';
    
    try {
      const endpoint = isCustomerCancel ? `/api/orders/${orderId}/cancel` : `/api/orders/${orderId}`;
      const token = isCustomerCancel ? userToken : adminToken;

      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status, paymentStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((order) => (order.id === orderId ? updated : order)));
      } else {
        setOrders((prev) =>
          prev.map((order) => {
            if (order.id === orderId) {
              const updated: Order = { ...order, status };
              if (paymentStatus) {
                updated.paymentStatus = paymentStatus;
              }
              return updated;
            }
            return order;
          })
        );
      }
    } catch (e) {
      setOrders((prev) =>
        prev.map((order) => {
          if (order.id === orderId) {
            const updated: Order = { ...order, status };
            if (paymentStatus) {
              updated.paymentStatus = paymentStatus;
            }
            return updated;
          }
          return order;
        })
      );
    }
  };

  const setTaxRate = (rate: number) => {
    setTaxRateState(rate);
  };

  const navigate = (view: AppContextType['currentView'], productId: string | null = null) => {
    setCurrentView(view);
    setSelectedProductId(productId);
    // Scroll to top elegantly
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('aura_user_token', data.token);
        setUserToken(data.token);
        setUser(data.user);
        if (data.user.wishlist) {
          setWishlist(data.user.wishlist);
        }
        if (data.user.cart && data.user.cart.length > 0) {
          setCart(data.user.cart);
        }
        return true;
      }
      return false;
    } catch (e) {
      console.error("Context customer login triggered fault.", e);
      return false;
    }
  };

  const registerUser = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('aura_user_token', data.token);
        setUserToken(data.token);
        setUser(data.user);
        setWishlist([]);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Context customer signup triggered fault.", e);
      return false;
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('aura_user_token');
    setUserToken(null);
    setUser(null);
    setWishlist([]);
    setOrders([]);
    setCart([]);
  };

  return (
    <AppContext.Provider
      value={{
        products,
        categories,
        cart,
        wishlist,
        orders,
        taxRate,
        currentView,
        selectedProductId,
        isAdmin,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        deleteCategory,
        resetCatalog,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        createOrder,
        updateOrderStatus,
        setTaxRate,
        navigate,
        setIsAdmin,
        searchQuery,
        setSearchQuery,
        user,
        userToken,
        loginUser,
        registerUser,
        logoutUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside an AppProvider');
  }
  return context;
};
