import axios from 'axios';
import { Product } from '../type/product';

export const getProducts = async (): Promise<Product[]> => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Token not found');
    }
    const response = await axios.get('/api/product/get', {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        },
    })
    return response.data.products;
};

export const findNameProduct = async (name: string): Promise<Product> => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Token not found');
    }
    const response = await axios.get(`/product/${name}`, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        },
    })
    return response.data.products;
};
export const getProductById = async (id: string): Promise<Product> => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Token not found');
    }
    const response = await axios.get(`/api/product/get/${id}`, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.product;
};
export const createProduct = async (newProduct: FormData): Promise<Product> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token not found');
        }
        const response = await axios.post('/api/product/create', newProduct, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data as Product;
    } catch (error) {
        throw new Error('Error creating product');
    }
};

export const updateProduct = async (id: string, product: Omit<Product, 'id'>): Promise<Product> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token not found');
        }
        const response = await axios.put(`/api/product/update/${id}`, product, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Error updating user');
    }
};

export const deleteProduct = async (id: string): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Token not found');
    }
    const response = await axios.delete(`/api/product/delete/${id}`, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        }
    });
    return response.data
}