import { create } from 'zustand';
import { Product } from '../types/product';

interface CartItem extends Product {
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    totalPrice: () => number; 
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
  totalPrice: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
}));