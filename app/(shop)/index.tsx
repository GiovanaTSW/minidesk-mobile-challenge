import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator, Image, ImageBackground, ScrollView } from 'react-native';
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

    // Estado para la categoría seleccionada ('all' o la categoría específica)
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    // Si la API falla o da error de red, usamos nuestra copia local de respaldo
    const products = (isError || !apiProducts || apiProducts.length === 0) ? MOCK_PRODUCTS : apiProducts;

    // Filtrar productos según la categoría seleccionada
    const filteredProducts = selectedCategory === 'all' 
        ? products 
        : products.filter(product => product.category.toLowerCase() === selectedCategory.toLowerCase());

    const getProductQuantity = (productId: number) => {
        const found = items.find((item) => item.id === productId);
        return found ? found.quantity : 0;
    };

    // Categorías disponibles para los filtros
    const categories = [
        { label: 'All', value: 'all' },
        { label: 'Men', value: "men's clothing" },
        { label: 'Women', value: "women's clothing" },
        { label: 'Jewelery', value: 'jewelery' },
        { label: 'Electronics', value: 'electronics' },
    ];

    const renderProductItem = ({ item }: { item: Product }) => {
        const quantity = getProductQuantity(item.id);

        return (
            <TouchableOpacity 
                style={styles.productCard} 
                onPress={() => router.push(`/(shop)/product/${item.id}`)}
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
                                <Text style={styles.addButtonText}>+ Add</Text>
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
        <ImageBackground 
            source={require('../../assets/images/fondo-vino.jpg')} 
            style={styles.background}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.container}>
                <StatusBar style="light" />

                {/* Encabezado */}
                <View style={styles.header}>
                    <View style={styles.placeholderSpace} />
                    <Text style={styles.headerTitle}>Mercatto ☼︎</Text>
                    
                    <TouchableOpacity 
                        style={styles.cartButton} 
                        onPress={() => router.push('/(shop)/cart')}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.cartButtonText}>🛒 {totalItems()}</Text>
                    </TouchableOpacity>
                </View>

                {/* Barra de Filtros por Categoría */}
                <View style={styles.filterContainer}>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterScroll}
                    >
                        {categories.map((cat) => {
                            const isSelected = selectedCategory === cat.value;
                            return (
                                <TouchableOpacity
                                    key={cat.value}
                                    style={[styles.filterChip, isSelected && styles.filterChipSelected]}
                                    onPress={() => setSelectedCategory(cat.value)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[styles.filterText, isSelected && styles.filterTextSelected]}>
                                        {cat.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Cuerpo principal */}
                <View style={styles.content}>
                    {isLoading ? (
                        <View style={styles.centerContainer}>
                            <ActivityIndicator size="large" color="#e38792" />
                            <Text style={styles.loadingText}>Loading collection...</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={filteredProducts}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderProductItem}
                            contentContainerStyle={styles.listContainer}
                            showsVerticalScrollIndicator={false}
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
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(104, 20, 22, 0.5)',
    },
    placeholderSpace: {
        width: 40, 
    },
    headerTitle: {
        fontSize: 25,
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
    filterContainer: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(104, 20, 22, 0.3)',
        backgroundColor: 'rgba(78, 10, 11, 0.4)', 
    },
    filterScroll: {
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    filterChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#f2eee8',
        borderRadius: 10,
        marginRight: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    filterChipSelected: {
        backgroundColor: '#e38792',
    },
    filterText: {
        color: '#4e0a0b',
        fontSize: 13,
        fontWeight: '600',
    },
    filterTextSelected: {
        color: '#4e0a0b',
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
});