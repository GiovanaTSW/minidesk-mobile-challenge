import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, ImageBackground, Image, } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function SuccessScreen() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState('123456');
  const [deliveryRange, setDeliveryRange] = useState('Oct 24 - Oct 26');

  useEffect(() => {
    //Aquí Genera un número de orden aleatorio único para cada que sea exitosa
    const randomOrder = Math.floor(100000 + Math.random() * 900000).toString();
    setOrderNumber(randomOrder);

    //Aquí se calcula fechas dinámicas basadas en el día actual
    const today = new Date();
    
    const startDelivery = new Date(today);
    startDelivery.setDate(today.getDate() + 2);

    const endDelivery = new Date(today);
    endDelivery.setDate(today.getDate() + 5);

    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const startStr = startDelivery.toLocaleDateString('en-US', options);
    const endStr = endDelivery.toLocaleDateString('en-US', options);

    setDeliveryRange(`${startStr} - ${endStr}`);
  }, []);

  const handleBackToCatalog = () => {
    // Redirige al catálogo principal y reemplaza la vista para que no pueda regresar con el botón atrás
    router.replace('/(shop)');
  };

  return (
    <ImageBackground
      source={require('../../assets/images/fondo-vino.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Encabezado superior pequeño */}
          <Text style={styles.topSubtitle}>Thank you very much for purchasing from</Text>
          <Text style={styles.topTitle}>Mercatto ☼</Text>

          {/* Tarjeta Principal Estilo Crema */}
          <View style={styles.cardSection}>
            {/* Ícono de Palomita Verde */}
            <View style={styles.iconContainer}>
              <Image
                source={require('../../assets/images/success-icon.png')}
                style={styles.successIcon}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.mainHeading}>Payment completed successfully!</Text>
            <Text style={styles.descriptionText}>
              Your order has been processed correctly and is being prepared for shipping.
            </Text>

            {/* Recuadro Interno de Detalles */}
            <View style={styles.receiptContainer}>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Order Number</Text>
                <Text style={styles.receiptValue}>#{orderNumber}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Estimated Delivery</Text>
                <Text style={styles.receiptValue}>{deliveryRange}</Text>
              </View>
            </View>

            {/* Botón Rosa de Regreso al Catálogo */}
            <TouchableOpacity
              style={styles.catalogButton}
              onPress={handleBackToCatalog}
              activeOpacity={0.8}
            >
              <Text style={styles.catalogButtonText}> ⋆.˚✮ BACK TO CATALOG ✮˚.⋆ </Text>
            </TouchableOpacity>
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
  scrollContent: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
    paddingTop: 120,
  },
  topSubtitle: {
    fontSize: 16,
    color: '#f2eee8',
    textAlign: 'center',
    marginBottom: 4,
    opacity: 0.9,
  },
  topTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#f2eee8',
    textAlign: 'center',
    marginBottom: 20,
  },
  cardSection: {
    backgroundColor: '#f2eee8',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  iconContainer: {
    width: 70,
    height: 70,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    width: '100%',
    height: '100%',
  },
  mainHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4e0a0b',
    textAlign: 'center',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 13,
    color: '#4e0a0b',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 10,
    lineHeight: 18,
    opacity: 0.85,
  },
  receiptContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e38792',
    padding: 16,
    width: '100%',
    marginBottom: 24,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  receiptLabel: {
    fontSize: 13,
    color: '#4e0a0b',
    fontWeight: '500',
  },
  receiptValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4e0a0b',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0e6e6',
    marginVertical: 8,
  },
  catalogButton: {
    backgroundColor: '#e38792', // Tono rosado que definiste en tus botones anteriores
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  catalogButtonText: {
    color: '#4e0a0b',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});