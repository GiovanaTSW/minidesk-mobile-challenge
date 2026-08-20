import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Product } from '../types/product';
import { useCartItem } from '../hooks/useCartItem';
import { QuantityStepper } from './QuantityStepper';

interface ProductListItemProps {
  product: Product;
  onPress: () => void;
}

function ProductListItemBase({ product, onPress }: ProductListItemProps) {
  const { quantity, increase, decrease } = useCartItem(product.id);

  return (
    <TouchableOpacity style={styles.productCard} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="contain" />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productCategory}>{product.category.toUpperCase()}</Text>
        <Text style={styles.productTitle} numberOfLines={2}>{product.title}</Text>
        <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>

        <View style={styles.cardActions} onStartShouldSetResponder={() => true}>
          {quantity === 0 ? (
            <TouchableOpacity style={styles.addButton} onPress={() => increase(product)}>
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          ) : (
            <QuantityStepper quantity={quantity} onIncrease={() => increase(product)} onDecrease={decrease} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export const ProductListItem = React.memo(ProductListItemBase);

const styles = StyleSheet.create({
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#f2eee8',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  imageContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    padding: 4,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    flex: 1,
  },
  productCategory: {
    fontSize: 10,
    color: '#9dad71',
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4e0a0b',
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: '#e38792',
    marginBottom: 8,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#4e0a0b',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#f2eee8',
    fontSize: 12,
    fontWeight: 'bold',
  },
});