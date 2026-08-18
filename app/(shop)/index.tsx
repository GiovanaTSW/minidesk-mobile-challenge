import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useProducts } from '../../src/hooks/useProduct';
import { Product } from '../../src/types/product';

export default function ShopScreen() {
    const router = useRouter();

    //Consumimos el hook de TanStack Query
    const { data: products, isLoading, isError, error } = useProducts();

    //Renderizado de cada tarjeta de producto individual
    const renderProductItem = ({ item }: { item: Product }) => (
        <View style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="contain" />
            <View style={styles.productInfo}>
                <Text style={styles.productCategory}>{item.category.toUpperCase()}</Text>
                <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            {/* Encabezado con título y botón de retorno */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/')} activeOpacity={0.7}>
                    <Text style={styles.backButtonText}>← Inicio</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Catálogo de Productos</Text>
                <View style={{ width: 60 }} />
            </View>

            {/* Cuerpo principal con estados de carga, error o lista */}
            <View style={styles.content}>
                {isLoading ? (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size='large' color="#f0d9e4" />
                        <Text style={styles.loadingText}>Cargando productos...</Text>
                    </View>
                ): isError ? (
                    <View style={styles.centerContainer}>
                        <Text style={styles.errorText}>Error al cargar:</Text>
                        <Text style={styles.errorSubText}>{error?.message}</Text>
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
        backgroundColor: '#16131f',
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
    backButtonText: {
        color: '#f0d9e4',
        fontSize: 14,
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#f0d9e4',
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
        color: '#c1a0ac',
        marginTop: 12,
        fontSize: 14,
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorSubText: {
        color: '#c1a0ac',
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center',
    },
    listContainer: {
        paddingVertical: 16,
    },
    productCard: {
        flexDirection: 'row',
        backgroundColor: '#201c29',
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    productImage: {
        width: 70,
        height: 70,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginRight: 12,
    },
    productInfo: {
        flex: 1,
    },
    productCategory: {
        fontSize: 10,
        color: '#c1a0ac',
        fontWeight: '700',
        marginBottom: 4,
    },
    productTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#f0d9e4',
        marginBottom: 6,
    },
    productPrice: {
        fontSize: 15,
        fontWeight: '800',
        color: '#a78bfa',
    },
});