import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

//Creamos la instancia de TanStack Query para gestionar el caché de la API
const queryClient = new QueryClient();

export default function RootLayout() {
    return (
        <QueryClientProvider client= {queryClient}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(shop)" />
            </Stack>
        </QueryClientProvider>
    )
}