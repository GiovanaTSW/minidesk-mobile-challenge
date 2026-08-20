import { useMemo } from 'react';
import { useCartStore } from '../store/useCartStore';

const TAX_RATE = 0.1;
const SHIPPING = 0; // envío gratis en este alcance (mock)

export function useCartTotals() {
  const items = useCartStore((state) => state.items);

  return useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + SHIPPING + tax;

    return { subtotal, tax, shipping: SHIPPING, total, totalItems };
  }, [items]);
}