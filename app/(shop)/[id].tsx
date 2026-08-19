import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../src/services/api';
import { Product } from '../../src/types/product';
import { useCartStore } from '../../src/store/useCartStore';

export default function ProductDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams(); // aquí se captura el ID de la URL dinámica
    const addToCart = useCartStore((state) => state.addToCart);

    // Consultamos el detalle del producto usando TanStack Query
    const { data: product, isLoading, isError, error } = useQuery<Product, Error>({
        queryKey: ['product', id],
        queryFn: () => api.getProduct(Number(id)),
        enabled: !!id, // Esto hace que sólo se ejecute si tenemos un ID válido
    });

    if (isLoading) {
        return(
            <SafeAreaView style={styles.centerContainer}>
                <StatusBar style="light" />
                <ActivityIndicator size="large" color="#f0d9e4" />
                <Text style={styles.loadingText}>Cargando detalle...</Text>
            </SafeAreaView>
        );
    }

    if (isError || !product) {
        return (
            <SafeAreaView style={styles.centerContainer}>
                <StatusBar style="light" />
                <Text style={styles.errorText}>No se pudo cargar el producto.</Text>
                <Text style={styles.errorSubText}>{error?.message}</Text>
                <TouchableOpacity style={styles.backButtonSimple} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Regresar</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            {/* Encabezado con botón de retorno */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
                    <Text style={styles.backButtonText}>← Catálogo</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>Detalle</Text>
                <View style={{ width: 70 }} />
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
                        <Text style={styles.ratingText}>✩ {product.rating.rate} ({product.rating.count} opiniones)</Text>
                    </View>

                    <Text style={styles.sectionTitle}>Descripción</Text>
                    <Text style={styles.productDescription}>{product.description}</Text>

                    {/* Botón de Añadir al Carrito */}
                    <TouchableOpacity 
                        style={styles.addButton} 
                        onPress={() => {
                            addToCart(product);
                            alert('¡Producto añadido al carrito!');
                        }}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.addButtonText}>Añadir al carrito</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#16131f',
    },
    centerContainer: {
        flex: 1,
        backgroundColor: '#16131f',
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
        borderBottomWidth: 1,
        borderBottomColor: '#201c29',
    },
    backButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#201c29',
        borderRadius: 10,
    },
    backButtonSimple: {
        marginTop: 16,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#201c29',
        borderRadius: 10,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#f0d9e4',
        fontSize: 14,
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f0d9e4',
    },
    scrollContent: {
        padding: 20,
    },
    imageContainer: {
        backgroundColor: '#fff',
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
        backgroundColor: '#201c29',
        borderRadius: 16,
        padding: 20,
    },
    productCategory: {
        fontSize: 12,
        color: '#c1a0ac',
        fontWeight: '700',
        marginBottom: 6,
    },
    productTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f0d9e4',
        marginBottom: 10,
    },
    productPrice: {
        fontSize: 22,
        fontWeight: '800',
        color: '#a78bfa',
        marginBottom: 12,
    },
    ratingContainer: {
        marginBottom: 16,
    },
    ratingText: {
        color: '#f0d9e4',
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#f0d9e4',
        marginBottom: 6,
        borderTopWidth: 1,
        borderTopColor: '#2d273a',
        paddingTop: 12,
    },
    productDescription: {
        fontSize: 14,
        color: '#c1a0ac',
        lineHeight: 20,
    },
    addButton: {
        backgroundColor: '#a78bfa',
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
        color: '#16131f',
        fontSize: 15,
        fontWeight: 'bold',
    },
    loadingText: {
        color: '#c1a0ac',
        marginTop: 12,
        fontSize: 14,
    },
    errorText: {
        color: '#ff6b6b',
        marginTop: 12,
        fontSize: 14,
        fontWeight: 'bold',
    },
    errorSubText: {
        color: '#c1a0ac',
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center',
    },
});