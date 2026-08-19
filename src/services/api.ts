import { Product } from "../types/product";
import { MOCK_PRODUCTS } from "./mockProduct";

const BASE_URL = "https://fakestoreapi.com";

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        throw new Error(`Error en la API: ${res.status} ${res.statusText}`);
    }
    return res.json();
}

export const api = {
    getProducts: async(): Promise<Product[]> => {
        try {
            const res = await fetch(`${BASE_URL}/products`);
            return await handleResponse<Product[]>(res);
        } catch (error) {
            console.warn("Falla de red en getProducts, usando mocks locales...", error);
            return MOCK_PRODUCTS;
        }
    },
    getProduct: async (id: number): Promise<Product> => {
        try {
            const res = await fetch(`${BASE_URL}/products/${id}`);
            return await handleResponse<Product>(res);
        } catch (error) {
            console.warn(`Falla de red en getProduct(${id}), buscando en mocks locales...`, error);
            const found = MOCK_PRODUCTS.find((p) => p.id === id);
            if (!found) {
                throw new Error("Producto no encontrado en el servidor ni en mocks locales.");
            }
            return found;
        }
    }
};