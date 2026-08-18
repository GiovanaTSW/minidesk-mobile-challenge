import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Product } from '../types/product';

export const useProducts = () => {
    return useQuery<Product[], Error>({
        queryKey: ['products'],
        queryFn: api.getProducts,
    });
};