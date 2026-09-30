import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '../types/product';
import { wishlistApiService } from '../services/wishlistService';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: Product[];
  toggleWishlist: (product: Product) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  syncWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'hunting_projectors_wishlist';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const syncWishlist = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const localGuest = localStorage.getItem(WISHLIST_STORAGE_KEY);
      let localItems: Product[] = [];
      try {
        localItems = localGuest ? JSON.parse(localGuest) : [];
      } catch {
        localItems = [];
      }

      if (localItems.length > 0) {
        const productIds = localItems.map(p => p.id || p.slug);
        const serverItems = await wishlistApiService.mergeGuestWishlist(productIds);
        localStorage.removeItem(WISHLIST_STORAGE_KEY);
        setWishlist(mapServerItems(serverItems));
      } else {
        const serverItems = await wishlistApiService.getWishlist();
        setWishlist(mapServerItems(serverItems));
      }
    } catch (err) {
      console.warn('Backend wishlist sync failed:', err);
    }
  }, [isAuthenticated]);

  const mapServerItems = (items: any[]): Product[] => {
    return items.map(item => ({
      id: item.productId,
      slug: item.slug,
      name: item.name,
      subtitle: item.subtitle,
      tagline: '',
      price: item.price,
      compareAtPrice: item.compareAtPrice,
      stock: item.inStock ? 10 : 0,
      badge: undefined,
      images: {
        hero: item.image,
        ambient: item.image,
        angled: item.image,
        backPorts: item.image,
        top: item.image,
        transparent: item.image,
      },
      category: 'home-cinema',
      categoryLabel: item.category,
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
        connectivity: ['HDMI 2.1', 'Wi-Fi 6', 'BT 5.2'],
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
    } as unknown as Product));
  };

  useEffect(() => {
    if (isAuthenticated) {
      syncWishlist();
    }
  }, [isAuthenticated, syncWishlist]);

  useEffect(() => {
    if (!isAuthenticated) {
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
      } catch (e) {
        console.warn('Unable to persist wishlist to localStorage', e);
      }
    }
  }, [wishlist, isAuthenticated]);

  const toggleWishlist = async (product: Product) => {
    const exists = isInWishlist(product.id || product.slug);

    if (isAuthenticated) {
      try {
        if (exists) {
          const updated = await wishlistApiService.removeItem(product.id || product.slug);
          setWishlist(mapServerItems(updated));
        } else {
          const updated = await wishlistApiService.addItem(product.id || product.slug);
          setWishlist(mapServerItems(updated));
        }
      } catch (err: any) {
        alert(err.message || 'Could not update wishlist');
      }
    } else {
      setWishlist(prev => {
        if (exists) {
          return prev.filter(item => item.id !== product.id && item.slug !== product.slug);
        }
        return [...prev, product];
      });
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId || item.slug === productId);
  };

  const clearWishlist = () => setWishlist([]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        syncWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
