import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '../types/product';
import { cartApiService, BackendCartCalculation } from '../services/cartService';
import { useAuth } from './AuthContext';

export interface CartItem {
  id?: string;
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'hunting_projectors_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [backendMeta, setBackendMeta] = useState<{
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
  } | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Helper to map backend items to frontend CartItem[]
  const mapBackendItems = (calc: BackendCartCalculation): CartItem[] => {
    return calc.items.map(item => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.productId,
        slug: item.slug,
        name: item.productName,
        subtitle: '',
        tagline: '',
        price: item.unitPrice,
        compareAtPrice: item.compareAtPrice,
        stock: item.availableStock,
        badge: item.discountPerUnit > 0 ? 'SPECIAL OFFER' : undefined,
        images: {
          hero: item.image || '/assets/products/hunting-h900-hero.svg',
          ambient: item.image || '/assets/products/hunting-h900-hero.svg',
          angled: item.image || '/assets/products/hunting-h900-hero.svg',
          backPorts: item.image || '/assets/products/hunting-h900-hero.svg',
          top: item.image || '/assets/products/hunting-h900-hero.svg',
          transparent: item.image || '/assets/products/hunting-h900-hero.svg',
        },
        category: 'home-cinema',
        categoryLabel: 'Home Cinema',
        specifications: {
          resolution: '4K UHD',
          brightness: '800 ANSI Lumens',
          lightSource: 'ALPD Laser',
          displayTechnology: 'DLP Cinema Engine',
          contrastRatio: '3000:1 Native',
          projectionSize: '80" – 150"',
          throwRatio: '1.2:1',
          operatingSystem: 'Android TV 11',
          audio: 'Dolby Atmos Hi-Fi',
          connectivity: ['HDMI 2.1', 'eARC', 'USB 3.0', 'Wi-Fi 6', 'BT 5.2'],
          dimensions: '220 x 220 x 150 mm',
          weight: '3.8 kg',
          powerConsumption: '140W',
          noiseLevel: '< 24 dB',
          focusType: 'Omnidirectional AI Autofocus',
          keystoneCorrection: 'Auto Keystone',
        },
        features: [],
        highlights: [],
        whatsIncluded: [],
        recommendedUse: [],
      } as unknown as Product,
    }));
  };

  // Sync cart with backend when authenticated
  const syncCart = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      // Check if there are local guest items to merge
      const localGuest = localStorage.getItem(CART_STORAGE_KEY);
      let localItems: CartItem[] = [];
      try {
        localItems = localGuest ? JSON.parse(localGuest) : [];
      } catch {
        localItems = [];
      }

      if (localItems.length > 0) {
        const mergePayload = localItems.map(item => ({
          productId: item.product.id || item.product.slug,
          quantity: item.quantity,
        }));
        const calc = await cartApiService.mergeGuestCart(mergePayload);
        localStorage.removeItem(CART_STORAGE_KEY);
        setCart(mapBackendItems(calc));
        setBackendMeta({
          subtotal: calc.subtotal,
          discount: calc.discount,
          shipping: calc.shipping,
          total: calc.total,
        });
      } else {
        const calc = await cartApiService.getCart();
        setCart(mapBackendItems(calc));
        setBackendMeta({
          subtotal: calc.subtotal,
          discount: calc.discount,
          shipping: calc.shipping,
          total: calc.total,
        });
      }
    } catch (err) {
      console.warn('Backend cart sync failed:', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      syncCart();
    }
  }, [isAuthenticated, syncCart]);

  // Save guest cart to localStorage when unauthenticated
  useEffect(() => {
    if (!isAuthenticated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (e) {
        console.warn('Unable to persist cart to localStorage', e);
      }
    }
  }, [cart, isAuthenticated]);

  const addToCart = async (product: Product, quantity = 1) => {
    if (isAuthenticated) {
      try {
        const calc = await cartApiService.addItem(product.id || product.slug, quantity);
        setCart(mapBackendItems(calc));
        setBackendMeta({
          subtotal: calc.subtotal,
          discount: calc.discount,
          shipping: calc.shipping,
          total: calc.total,
        });
      } catch (err: any) {
        alert(err.message || 'Could not add item to cart');
      }
    } else {
      setCart(prev => {
        const existing = prev.find(item => item.product.id === product.id || item.product.slug === product.slug);
        if (existing) {
          return prev.map(item =>
            (item.product.id === product.id || item.product.slug === product.slug)
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { product, quantity }];
      });
    }
    setIsCartOpen(true);
  };

  const removeFromCart = async (productId: string) => {
    if (isAuthenticated) {
      try {
        const calc = await cartApiService.removeItem(productId);
        setCart(mapBackendItems(calc));
        setBackendMeta({
          subtotal: calc.subtotal,
          discount: calc.discount,
          shipping: calc.shipping,
          total: calc.total,
        });
      } catch (err) {
        console.warn('Backend remove cart item failed:', err);
      }
    } else {
      setCart(prev => prev.filter(item => item.product.id !== productId && item.product.slug !== productId));
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    if (isAuthenticated) {
      try {
        const calc = await cartApiService.updateQuantity(productId, quantity);
        setCart(mapBackendItems(calc));
        setBackendMeta({
          subtotal: calc.subtotal,
          discount: calc.discount,
          shipping: calc.shipping,
          total: calc.total,
        });
      } catch (err: any) {
        alert(err.message || 'Could not update quantity');
      }
    } else {
      setCart(prev =>
        prev.map(item =>
          (item.product.id === productId || item.product.slug === productId)
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        const calc = await cartApiService.clearCart();
        setCart(mapBackendItems(calc));
        setBackendMeta(null);
      } catch (err) {
        console.warn('Backend clear cart failed:', err);
      }
    } else {
      setCart([]);
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = backendMeta ? backendMeta.subtotal : cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = backendMeta ? backendMeta.discount : 0;
  const shipping = backendMeta ? backendMeta.shipping : 0;
  const total = backendMeta ? backendMeta.total : subtotal + shipping;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        discount,
        shipping,
        total,
        isCartOpen,
        setIsCartOpen,
        syncCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
