import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useProducts } from '../../src/hooks/useProduct';
import { Product } from '../../src/types/product';
import { useCartStore } from '../../src/store/useCartStore';
import { MOCK_PRODUCTS } from '../../src/services/mockProduct';

export default function ShopScreen() {
    const router = useRouter();
    
    const { data: apiProducts, isLoading, isError } = useProducts();
    const { items, addToCart, increaseQuantity, decreaseQuantity, totalItems } = useCartStore();

    // Si la API falla o da error de red, usamos nuestra copia local de respaldo
    const products = (isError || !apiProducts || apiProducts.length === 0) ? MOCK_PRODUCTS : apiProducts;

    const getProductQuantity = (productId: number) => {
        const found = items.find((item) => item.id === productId);
        return found ? found.quantity : 0;
    };

    const renderProductItem = ({ item }: { item: Product }) => {
        const quantity = getProductQuantity(item.id);

        return (
            <TouchableOpacity 
                style={styles.productCard} 
                onPress={() => router.push(`/(shop)/${item.id}`)}
                activeOpacity={0.85}
            >
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="contain" />
                </View>
                <View style={styles.productInfo}>
                    <Text style={styles.productCategory}>{item.category.toUpperCase()}</Text>
                    <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>

                    {/* Controles rápidos de cantidad (+ / -) */}
                    <View style={styles.cardActions} onStartShouldSetResponder={() => true}>
                        {quantity === 0 ? (
                            <TouchableOpacity 
                                style={styles.addButton} 
                                onPress={() => addToCart(item)}
                            >
                                <Text style={styles.addButtonText}>+ Añadir</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.counterContainer}>
                                <TouchableOpacity 
                                    style={styles.counterButton} 
                                    onPress={() => decreaseQuantity(item.id)}
                                >
                                    <Text style={styles.counterButtonText}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.counterText}>{quantity}</Text>
                                <TouchableOpacity 
                                    style={styles.counterButton} 
                                    onPress={() => increaseQuantity(item.id)}
                                >
                                    <Text style={styles.counterButtonText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            {/* Encabezado con paleta Garnet */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/')} activeOpacity={0.7}>
                    <Text style={styles.backButtonText}>← Inicio</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Catálogo de Moda</Text>
                
                <TouchableOpacity 
                    style={styles.cartButton} 
                    onPress={() => router.push('/(shop)/cart')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.cartButtonText}>🛒 {totalItems()}</Text>
                </TouchableOpacity>
            </View>

            {/* Cuerpo principal */}
            <View style={styles.content}>
                {isLoading ? (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color="#e38792" />
                        <Text style={styles.loadingText}>Cargando colección...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={products}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderProductItem}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4e0a0b',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#681416',
    },
    backButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#f2eee8',
        borderRadius: 10,
    },
    backButtonText:{
        color: '#4e0a0b',
        fontSize: 13,
        fontWeight: 'bold',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f2eee8',
        letterSpacing: 0.5,
    },
    cartButton: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        backgroundColor: '#e38792',
        borderRadius: 10,
    },
    cartButtonText: {
        color: '#4e0a0b',
        fontSize: 14,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#f2eee8',
        marginTop: 12,
        fontSize: 14,
    },
    listContainer: {
        paddingVertical: 16,
    },
    productCard: {
        flexDirection: 'row',
        backgroundColor: '#f2eee8',
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4
        },
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
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4e0a0b',
        borderRadius: 8,
        padding: 4,
    },
    counterButton: {
        backgroundColor: '#e38792',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    counterButtonText: {
        color: '#4e0a0b',
        fontWeight: 'bold',
        fontSize: 14,
    },
    counterText: {
        color: '#f2eee8',
        paddingHorizontal: 12,
        fontWeight: 'bold',
        fontSize: 14,
    },
});