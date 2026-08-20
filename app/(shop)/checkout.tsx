import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Alert, ImageBackground, } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCartStore } from '../../src/store/useCartStore';

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();

  // Estados de Pago
  const [fullName, setFullName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiration, setExpiration] = useState('');
  const [cvv, setCvv] = useState('');

  // Estados de Dirección (Nuevos campos inspirados en e-commerce real)
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0.0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCancelOrder = () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure to cancel the order?',
      [
        { text: 'NO', style: 'cancel' },
        {
          text: 'OK',
          style: 'destructive',
          onPress: () => {
            clearCart();
            router.replace('/(shop)' as any);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleConfirmPayment = () => {
    if (!fullName || !cardNumber || !expiration || !cvv || !address || !city || !zipCode) {
      Alert.alert('Incomplete Data', 'Please fill in all shipping and payment details.');
      return;
    }

    clearCart();
    router.replace('/success' as any);
  };

  return (
    <ImageBackground
      source={require('../../assets/images/fondo-vino.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}> ← </Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mercatto ☼</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Seccion de Dirección de Envío */}
          <View style={styles.cardSection}>
            <Text style={styles.sectionHeading}>Shipping Address</Text>

            <Text style={styles.inputLabel}>STREET ADDRESS</Text>
            <TextInput
              style={styles.input}
              placeholder="Main St 123"
              placeholderTextColor="#999"
              value={address}
              onChangeText={setAddress}
            />

            <View style={styles.rowInputs}>
              <View style={styles.halfInputContainer}>
                <Text style={styles.inputLabel}>CITY / DISTRICT</Text>
                <TextInput
                  style={styles.input}
                  placeholder="New York"
                  placeholderTextColor="#999"
                  value={city}
                  onChangeText={setCity}
                />
              </View>
              <View style={styles.halfInputContainer}>
                <Text style={styles.inputLabel}>ZIP CODE</Text>
                <TextInput
                  style={styles.input}
                  placeholder="12345"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={zipCode}
                  onChangeText={setZipCode}
                />
              </View>
            </View>

            <Text style={styles.inputLabel}>PHONE NUMBER</Text>
            <TextInput
              style={styles.input}
              placeholder="+52 000 000 0000"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {/* Seccion de Pago */}
          <View style={styles.cardSection}>
            <Text style={styles.sectionHeading}>Payment Details</Text>

            <Text style={styles.inputLabel}>FULL NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe Smith"
              placeholderTextColor="#999"
              value={fullName}
              onChangeText={setFullName}
            />

            <Text style={styles.inputLabel}>CARD NUMBER</Text>
            <TextInput
              style={styles.input}
              placeholder="0000 0000 0000 0000"
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={19}
              value={cardNumber}
              onChangeText={setCardNumber}
            />

            <View style={styles.rowInputs}>
              <View style={styles.halfInputContainer}>
                <Text style={styles.inputLabel}>EXPIRATION</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  placeholderTextColor="#999"
                  maxLength={5}
                  value={expiration}
                  onChangeText={setExpiration}
                />
              </View>
              <View style={styles.halfInputContainer}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                  value={cvv}
                  onChangeText={setCvv}
                />
              </View>
            </View>
          </View>

          {/* Resumen del Pedido */}
          <View style={styles.cardSection}>
            <Text style={styles.sectionHeading}>Order Summary</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>Subtotal ({totalItemsCount} items)</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>Shipping</Text>
              <Text style={styles.freeShippingText}>Free</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>Tax (Calculated)</Text>
              <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmPayment}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}> ⋆.˚✮ CONFIRM PAYMENT ✮˚.⋆ </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelOrder}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <Text style={styles.securityText}>Payments are secure and encrypted.</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f2eee8',
    borderRadius: 10,
  },
  backButtonText: {
    color: '#4e0a0b',
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#f2eee8',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  cardSection: {
    backgroundColor: '#f2eee8',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4e0a0b',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#4e0a0b',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0d8cf',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#4e0a0b',
    marginBottom: 14,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInputContainer: {
    width: '48%',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 14,
    color: '#4e0a0b',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4e0a0b',
  },
  freeShippingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9dad71',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0d8cf',
    marginVertical: 12,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4e0a0b',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4e0a0b',
  },
  confirmButton: {
    backgroundColor: '#4e0a0b',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#f2eee8',
    fontSize: 15,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#e38792',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#4e0a0b',
    fontSize: 14,
    fontWeight: 'bold',
  },
  securityText: {
    fontSize: 11,
    color: '#777',
    textAlign: 'center',
    marginTop: 12,
  },
});