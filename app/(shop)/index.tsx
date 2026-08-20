import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator, ImageBackground, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useProducts } from '../../src/hooks/useProduct';
import { Product } from '../../src/types/product';
import { useCartStore } from '../../src/store/useCartStore';
import { MOCK_PRODUCTS } from '../../src/services/mockProduct';
import { ProductListItem } from '../../src/components/ProductListItem';
import { OfflineBanner } from '../../src/components/OfflineBanner';

export default function ShopScreen() {
    const router = useRouter();

    const { data: apiProducts, isLoading, isError } = useProducts();

    // Selector escalar: este componente solo se re-renderiza cuando
    // totalItems() cambia de valor, no en cada mutación del store.
    const totalItems = useCartStore((state) => state.totalItems());

    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const products = isError ? MOCK_PRODUCTS : (apiProducts ?? []);

    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(product => product.category.toLowerCase() === selectedCategory.toLowerCase());

    const categories = [
        { label: 'All', value: 'all' },
        { label: 'Men', value: "men's clothing" },
        { label: 'Women', value: "women's clothing" },
        { label: 'Jewelery', value: 'jewelery' },
        { label: 'Electronics', value: 'electronics' },
    ];

    const renderProductItem = ({ item }: { item: Product }) => (
        <ProductListItem product={item} onPress={() => router.push(`/(shop)/product/${item.id}`)} />
    );

    return (
        <ImageBackground
            source={require('../../assets/images/fondo-vino.jpg')}
            style={styles.background}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.container}>
                <StatusBar style="light" />

                {isError && <OfflineBanner />}

                {/* Encabezado */}
                <View style={styles.header}>
                    <View style={styles.placeholderSpace} />
                    <Text style={styles.headerTitle}>Mercatto ☼︎</Text>

                    <TouchableOpacity
                        style={styles.cartButton}
                        onPress={() => router.push('/(shop)/cart')}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.cartButtonText}>🛒 {totalItems}</Text>
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
        paddingVertical: 20,
        paddingTop: 40,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(104, 20, 22, 0.5)',
    },
    placeholderSpace: {
        width: 40,
    },
    headerTitle: {
        fontSize: 30,
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
});