import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function OfflineBanner() {
  return (
    <View style={styles.banner}>
      <Text style={styles.text}>⚠ Sin conexión con el servidor. Mostrando catálogo offline.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: 'rgba(78, 10, 11, 0.85)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  text: {
    color: '#f2eee8',
    fontSize: 12,
    fontWeight: '600',
  },
});