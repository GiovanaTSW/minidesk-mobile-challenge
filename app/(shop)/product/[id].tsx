import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, ScrollView, ActivityIndicator, ImageBackground } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../src/services/api';
import { Product } from '../../../src/types/product';
import { useCartStore } from '../../../src/store/useCartStore';

export default function ProductDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    
    // Obtenemos los métodos y los items del carrito
    const { items, addToCart, increaseQuantity, decreaseQuantity } = useCartStore();

    const { data: product, isLoading, isError, error } = useQuery<Product, Error>({
        queryKey: ['product', id],
        queryFn: () => api.getProduct(Number(id)),
        enabled: !!id,
    });

    // Calculamos el total de productos en el carrito para la insignia del icono
    const totalCartItems = items.reduce((sum, item) => sum + item.quantity, 0);

    // Buscamos si este producto ya está en el carrito para saber su cantidad actual
    const cartItem = product ? items.find((item) => item.id === product.id) : undefined;
    const quantity = cartItem ? cartItem.quantity : 0;

    return (
        <ImageBackground 
            source={require('../../../assets/images/fondo-vino.jpg')} 
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.container}>
                <StatusBar style="light" />

                {isLoading ? (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color="#e38792" />
                        <Text style={styles.loadingText}>Loading product detail...</Text>
                    </View>
                ) : isError || !product ? (
                    <View style={styles.centerContainer}>
                        <Text style={styles.errorText}>Failed to load product.</Text>
                        <Text style={styles.errorSubText}>{error?.message}</Text>
                        <TouchableOpacity style={styles.backButtonSimple} onPress={() => router.back()}>
                            <Text style={styles.backButtonText}>Back</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {/* Encabezado con botón de retorno y acceso directo al carrito */}
                        <View style={styles.header}>
                            <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
                                <Text style={styles.backButtonText}> ← </Text>
                            </TouchableOpacity>
                            <Text style={styles.headerTitle} numberOfLines={1}>Mercatto ☼</Text>
                            
                            {/* Botón de acceso directo al carrito con la cantidad de productos */}
                            <TouchableOpacity 
                                style={styles.cartHeaderButton} 
                                onPress={() => router.push('/cart' as any)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.cartHeaderIcon}>🛒 {totalCartItems}</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                            {/* Imagen destacada */}
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="contain" />
                            </View>

                            {/* Información del producto */}
                            <View style={styles.infoContainer}>
                                <Text style={styles.productCategory}>{product.category.toUpperCase()}</Text>
                                <Text style={styles.productTitle}>{product.title}</Text>
                                <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>

                                {/* Calificación */}
                                <View style={styles.ratingContainer}>
                                    <Text style={styles.ratingText}> ✩ {product.rating.rate} ({product.rating.count} opinions)</Text>
                                </View>

                                <Text style={styles.sectionTitle}>Description</Text>
                                <Text style={styles.productDescription}>{product.description}</Text>

                                {/* Sección dinámica: Botón Add to cart o Contador */}
                                {quantity === 0 ? (
                                    <TouchableOpacity 
                                        style={styles.addButton} 
                                        onPress={() => addToCart(product)}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.addButtonText}>⋆.˚✮ ADD TO CART ✮˚.⋆</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <View style={styles.counterWrapper}>
                                        <View style={styles.counterContainer}>
                                            <TouchableOpacity 
                                                style={styles.counterButton} 
                                                onPress={() => decreaseQuantity(product.id)}
                                            >
                                                <Text style={styles.counterButtonText}>-</Text>
                                            </TouchableOpacity>
                                            <Text style={styles.counterText}>{quantity}</Text>
                                            <TouchableOpacity 
                                                style={styles.counterButton} 
                                                onPress={() => increaseQuantity(product.id)}
                                            >
                                                <Text style={styles.counterButtonText}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </ScrollView>
                    </>
                )}
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
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingTop: 40,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.15)',
    },
    backButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#f2eee8',
        borderRadius: 10,
    },
    cartHeaderButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#e38792',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartHeaderIcon: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4e0a0b',
    },
    backButtonSimple: {
        marginTop: 16,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#f2eee8',
        borderRadius: 10,
        alignItems: 'center',
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
    scrollContent: {
        padding: 20,
    },
    imageContainer: {
        backgroundColor: '#f2eee8',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    productImage: {
        width: '100%',
        height: 250,
    },
    infoContainer: {
        backgroundColor: '#f2eee8',
        borderRadius: 16,
        padding: 20,
    },
    productCategory: {
        fontSize: 12,
        color: '#9dad71',
        fontWeight: '700',
        marginBottom: 6,
    },
    productTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4e0a0b',
        marginBottom: 10,
    },
    productPrice: {
        fontSize: 22,
        fontWeight: '800',
        color: '#e38792',
        marginBottom: 12,
    },
    ratingContainer: {
        marginBottom: 16,
    },
    ratingText: {
        color: '#4e0a0b',
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4e0a0b',
        marginBottom: 6,
        borderTopWidth: 1,
        borderTopColor: '#e0d8cf',
        paddingTop: 12,
    },
    productDescription: {
        fontSize: 14,
        color: '#4e0a0b',
        lineHeight: 20,
    },
    addButton: {
        backgroundColor: '#e38792',
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    addButtonText: {
        color: '#4e0a0b',
        fontSize: 15,
        fontWeight: 'bold',
    },
    counterWrapper: {
        marginTop: 20,
        alignItems: 'center',
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4e0a0b',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        justifyContent: 'center',
        alignSelf: 'stretch',
    },
    counterButton: {
        paddingHorizontal: 16,
        paddingVertical: 4,
    },
    counterButtonText: {
        color: '#f2eee8',
        fontWeight: 'bold',
        fontSize: 18,
    },
    counterText: {
        color: '#f2eee8',
        paddingHorizontal: 20,
        fontWeight: 'bold',
        fontSize: 16,
    },
    loadingText: {
        color: '#f2eee8',
        marginTop: 12,
        fontSize: 14,
    },
    errorText: {
        color: '#e38792',
        marginTop: 12,
        fontSize: 14,
        fontWeight: 'bold',
    },
    errorSubText: {
        color: '#f2eee8',
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center',
    },
});