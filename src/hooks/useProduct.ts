import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Product } from '../types/product';

// Hook para el listado del catálogo.
export const useProducts = () => {
    return useQuery<Product[], Error>({
        queryKey: ['products'],
        queryFn: api.getProducts,
    });
};

// Hook para el detalle de un producto individual.
export const useProduct = (id: number) => {
    return useQuery<Product, Error>({
        queryKey: ['product', id],
        queryFn: () => api.getProduct(id),
        enabled: !!id,
    });
};