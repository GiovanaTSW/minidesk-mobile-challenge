import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function ShopScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            {/* Encabezado con título y botón de retorno */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/')} activeOpacity={0.7}>
                <Text style={styles.backButtonText}>Inicio</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Catálogo</Text>
                <View style={{ width: 60 }} />
            </View>

            {/* Cuerpo principal del catálogo */}
            <View style={styles.content}>
                <View style={styles.placeholderCard}>
                    <Text style={styles.title}></Text>
                    <Text style={styles.subtitle}></Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection:'row',
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
        color: '#F0D9E4',
        fontSize: 14,
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F0D9E4',
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderCard: {
        backgroundColor: '#201c29',
        padding: 24,
        borderRadius: 20,
        alignItems: 'center',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    title:{
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F0D9E4',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#C1A0AC',
        textAlign: 'center',
        lineHeight: 20,
    },
});