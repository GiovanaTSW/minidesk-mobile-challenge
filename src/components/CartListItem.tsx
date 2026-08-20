import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { CartItem } from '../store/useCartStore';
import { useCartStore } from '../store/useCartStore';
import { QuantityStepper } from './QuantityStepper';

interface CartListItemProps {
  item: CartItem;
}

function CartListItemBase({ item }: CartListItemProps) {
    
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  return (
    <View style={styles.cartCard}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="contain" />
      </View>
      <View style={styles.productInfo}>
        <View style={styles.titleRow}>
          <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
          <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.deleteButton}>
            <Text style={styles.deleteIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.productCategory}>{item.category.toUpperCase()}</Text>

        <View style={styles.priceRow}>
          <QuantityStepper
            quantity={item.quantity}
            onIncrease={() => increaseQuantity(item.id)}
            onDecrease={() => decreaseQuantity(item.id)}
          />
          <Text style={styles.productPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
}

export const CartListItem = React.memo(CartListItemBase);

const styles = StyleSheet.create({
  cartCard: {
    flexDirection: 'row',
    backgroundColor: '#f2eee8',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  imageContainer: {
    width: 70,
    height: 70,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    padding: 4,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  productTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4e0a0b',
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    padding: 2,
  },
  deleteIcon: {
    fontSize: 16,
  },
  productCategory: {
    fontSize: 9,
    color: '#9dad71',
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '900',
    color: '#c95b6a',
  },
});