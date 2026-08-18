import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import {StatusBar} from 'expo-status-bar';

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.content}>
                <Text style={styles.brand}>FakeStore</Text>
                <Text style={styles.subtitle}>
                    Soluciones especiales de primera calidad, entregadas en su puerta.
                </Text>

                <TouchableOpacity style={styles.button} onPress={() => router.replace('/(shop)/')}>
                    <Text style={styles.buttonText}>Ir a la Tienda</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#16131F',
        justifyContent: 'space-between',
    },
    content: {
        padding: 24,
        paddingBottom: 48,
        backgroundColor: 'rgba(79, 22, 22, 0.85)',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    brand: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#aaaaaa',
        marginBottom: 24,
        lineHeight: 22,
    },
    button: {
        backgroundColor: '#4f46e5',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});