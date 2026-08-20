import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface QuantityStepperProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  size?: 'small' | 'medium';
}

export function QuantityStepper({ quantity, onIncrease, onDecrease, size = 'small' }: QuantityStepperProps) {
  const isMedium = size === 'medium';

  return (
    <View style={[styles.container, isMedium && styles.containerMedium]}>
      <TouchableOpacity
        style={[styles.button, isMedium && styles.buttonMedium]}
        onPress={onDecrease}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={[styles.buttonText, isMedium && styles.buttonTextMedium]}>-</Text>
      </TouchableOpacity>
      <Text style={[styles.quantityText, isMedium && styles.quantityTextMedium]}>{quantity}</Text>
      <TouchableOpacity
        style={[styles.button, isMedium && styles.buttonMedium]}
        onPress={onIncrease}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={[styles.buttonText, isMedium && styles.buttonTextMedium]}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4e0a0b',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  containerMedium: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  buttonMedium: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  buttonText: {
    color: '#f2eee8',
    fontWeight: 'bold',
    fontSize: 13,
  },
  buttonTextMedium: {
    fontSize: 18,
  },
  quantityText: {
    color: '#f2eee8',
    paddingHorizontal: 6,
    fontWeight: 'bold',
    fontSize: 13,
  },
  quantityTextMedium: {
    paddingHorizontal: 20,
    fontSize: 16,
  },
});