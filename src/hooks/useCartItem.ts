import { useCartStore } from '../store/useCartStore';
import { Product } from '../types/product';

export function useCartItem(productId: number) {
  const quantity = useCartStore(
    (state) => state.items.find((item) => item.id === productId)?.quantity ?? 0
  );
  const addToCart = useCartStore((state) => state.addToCart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  const increase = (product: Product) => {
    if (quantity === 0) {
      addToCart(product);
    } else {
      increaseQuantity(productId);
    }
  };

  const decrease = () => decreaseQuantity(productId);

  return { quantity, increase, decrease };
}