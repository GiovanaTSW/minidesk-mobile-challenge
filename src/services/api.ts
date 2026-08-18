import {Product} from "../types/product";

const BASE_URL = "https://fakestoreapi.com";

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        throw new Error('Error en la API: ${res.status} ${res.statusText}');
    }
    return res.json();
}

export const api = {
    getProducts: async(): Promise<Product[]> => {
        const res = await fetch('${BASE_URL}/products');
        return handleResponse<Product[]>(res);
    },
    getProduct: async (id: number): Promise<Product> => {
        const res = await fetch('${BASE_URL}/products/${id}');
        return handleResponse<Product>(res);
    }
};