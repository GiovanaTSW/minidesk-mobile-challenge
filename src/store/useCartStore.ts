import { create } from 'zustand';
import { Product } from '../types/product';

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  
  addToCart: (product) => set((state) => {
    const existingItem = state.items.find((item) => item.id === product.id);
    if (existingItem) {
      return {
        items: state.items.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };
    }
    return { items: [...state.items, { ...product, quantity: 1 }] };
  }),

  removeFromCart: (productId) => set((state) => ({
    items: state.items.filter((item) => item.id !== productId),
  })),

  increaseQuantity: (productId) => set((state) => ({
    items: state.items.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    ),
  })),

  decreaseQuantity: (productId) => set((state) => {
    return {
      items: state.items
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0), // Si llega a 0, se elimina automáticamente
    };
  }),

  clearCart: () => set({ items: [] }),

  totalPrice: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),

  totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
}));