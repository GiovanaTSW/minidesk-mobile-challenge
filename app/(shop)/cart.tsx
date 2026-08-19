import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useCartStore } from '../../src/store/useCartStore';
import { useRouter } from 'expo-router';

export default function CartScreen() {
    const { items, removeFromCart, totalPrice } = useCartStore();
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Tu Carrito</Text>
            <FlatList
                data={items}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.text}>{item.title} (x{item.quantity})</Text>
                        <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                            <Text style={{color: 'red'}}>Eliminar</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
            <Text style={styles.total}>Total: ${totalPrice().toFixed(2)}</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#16131f',
        padding: 20,
    },
    title: {
        color: '#f0d9e4',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#201c29',
    },
    text: {
        color: '#f0d9e4',
    },
    total: {
        color: '#a78bfa',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
    },
});