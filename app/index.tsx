import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <ImageBackground 
            source={require('../assets/images/welcome-bg.png')} // Aquí coloqué la ruta de la imagen de fondo
            style={styles.background}
            resizeMode="cover"
        >
            <StatusBar style="light" />
            <SafeAreaView style={styles.container}>
                <View style={styles.overlay}>
                    <View style={styles.contentContainer}>
                        <Text style={styles.brandTitle}>Mercatto ☼</Text>
                        <Text style={styles.brandSubtitle}>
                            Todo lo que necesitas con la mejor calidad, hasta la puerta de tu hogar con sólamente un click. ☆⋆｡
                        </Text>

                        <TouchableOpacity 
                            style={styles.shopButton} 
                            onPress={() => router.push('/(shop)')}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.shopButtonText}>Ir a la Tienda</Text>
                        </TouchableOpacity>
                    </View>
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
        justifyContent: 'flex-end',
    },
    overlay: {
        width: '100%',
        backgroundColor: 'rgba(78, 10, 11, 0.9)', // Garnet (#4e0a0b) en rgba para incluirle la opacidad
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 50,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        borderTopWidth: 2,
        borderTopColor: '#e38792', // Cotton candy
    },
    contentContainer: {
        alignItems: 'flex-start',
    },
    brandTitle: {
        fontSize: 34,
        fontWeight: '900',
        color: '#f2eee8', // Dusty white
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    brandSubtitle: {
        fontSize: 15,
        color: '#e38792', // Cotton candy
        lineHeight: 22,
        marginBottom: 30,
    },
    shopButton: {
        width: '100%',
        backgroundColor: '#e38792', // Cotton candy
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    shopButtonText: {
        color: '#4e0a0b', // Garnet
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});