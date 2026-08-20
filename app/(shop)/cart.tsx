import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, Image, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCartStore } from '../../src/store/useCartStore';
import { Product } from '../../src/types/product';

type CartItem = Product & { quantity: number };

export default function CartScreen() {
    const router = useRouter();
    const { items, increaseQuantity, decreaseQuantity, removeFromCart } = useCartStore();

    const cartItems = items as CartItem[];

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 0.00; // O el cálculo que manejes
    const total = subtotal + shipping;

    const renderCartItem = ({ item }: { item: CartItem }) => (
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
                    {/* Contador con el estilo armonioso requerido */}
                    <View style={styles.counterContainer}>
                        <TouchableOpacity 
                            style={styles.counterButton} 
                            onPress={() => decreaseQuantity(item.id)}
                        >
                            <Text style={styles.counterButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.counterText}>{item.quantity}</Text>
                        <TouchableOpacity 
                            style={styles.counterButton} 
                            onPress={() => increaseQuantity(item.id)}
                        >
                            <Text style={styles.counterButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.productPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <ImageBackground 
            source={require('../../assets/images/fondo-vino.jpg')} 
            style={styles.background}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.container}>
                <StatusBar style="light" />

                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
                        <Text style={styles.backButtonText}> ← </Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}> Mercatto ☼ </Text>
                    <View style={styles.placeholderSpace} />
                </View>

                <View style={styles.content}>
                    {cartItems.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Your cart is empty</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={cartItems}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderCartItem}
                            contentContainerStyle={styles.listContainer}
                            ListFooterComponent={
                                <View style={styles.summaryContainer}>
                                    <Text style={styles.summaryTitle}>Order Summary</Text>
                                    
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Subtotal</Text>
                                        <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
                                    </View>
                                    
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Shipping</Text>
                                        <Text style={styles.shippingCalculated}>Calculated at next step</Text>
                                    </View>

                                    <View style={styles.divider} />

                                    <View style={styles.summaryRow}>
                                        <Text style={styles.totalLabel}>Total</Text>
                                        <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
                                    </View>

                                    {/* Botón actualizado para navegar al Checkout */}
                                    <TouchableOpacity 
                                        style={styles.paymentButton} 
                                        onPress={() => router.push('/checkout' as any)}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.paymentButtonText}> ⋆.˚✮ PROCEED TO PAYMENT ✮˚.⋆ </Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        />
                    )}
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
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
        paddingVertical: 16,
        paddingTop: 40,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(104, 20, 22, 0.5)',
    },
    backButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#f2eee8',
        borderRadius: 10,
    },
    backButtonText: {
        color: '#4e0a0b',
        fontWeight: 'bold',
        fontSize: 12,
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#f2eee8',
        letterSpacing: 0.5,
    },
    placeholderSpace: {
        width: 60,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    listContainer: {
        paddingVertical: 12,
    },
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
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4e0a0b',
        borderRadius: 8,
        paddingHorizontal: 4,
        paddingVertical: 2,
    },
    counterButton: {
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    counterButtonText: {
        color: '#f2eee8',
        fontWeight: 'bold',
        fontSize: 13,
    },
    counterText: {
        color: '#f2eee8',
        paddingHorizontal: 6,
        fontWeight: 'bold',
        fontSize: 13,
    },
    productPrice: {
        fontSize: 15,
        fontWeight: '900',
        color: '#c95b6a',
    },
    summaryContainer: {
        backgroundColor: '#f2eee8',
        borderRadius: 20,
        padding: 16,
        marginTop: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 5,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4e0a0b',
        marginBottom: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 13,
        color: '#4e0a0b',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4e0a0b',
    },
    shippingCalculated: {
        fontSize: 11,
        fontStyle: 'italic',
        color: '#666',
    },
    divider: {
        height: 1,
        backgroundColor: '#dcd6ce',
        marginVertical: 8,
    },
    totalLabel: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#4e0a0b',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: '900',
        color: '#c95b6a',
    },
    paymentButton: {
        backgroundColor: '#4e0a0b',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 14,
    },
    paymentButtonText: {
        color: '#f2eee8',
        fontWeight: 'bold',
        fontSize: 13,
        letterSpacing: 0.5,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#f2eee8',
        fontSize: 16,
    },
});