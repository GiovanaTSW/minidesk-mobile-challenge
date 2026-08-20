import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCartStore, CartItem } from '../../src/store/useCartStore';
import { useCartTotals } from '../../src/hooks/useCartTotals';
import { CartListItem } from '../../src/components/CartListItem';

export default function CartScreen() {
    const router = useRouter();
    const items = useCartStore((state) => state.items);
    const { subtotal, tax, total } = useCartTotals();

    const renderCartItem = ({ item }: { item: CartItem }) => <CartListItem item={item} />;

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
                    {items.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Your cart is empty</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={items}
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
                                        <Text style={styles.summaryLabel}>Tax (10%)</Text>
                                        <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
                                    </View>

                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Shipping</Text>
                                        <Text style={styles.shippingCalculated}>Free</Text>
                                    </View>

                                    <View style={styles.divider} />

                                    <View style={styles.summaryRow}>
                                        <Text style={styles.totalLabel}>Total</Text>
                                        <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
                                    </View>

                                    <TouchableOpacity
                                        style={styles.paymentButton}
                                        onPress={() => router.push('/(shop)/checkout')}
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
        fontSize: 12,
        fontWeight: '600',
        color: '#9dad71',
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