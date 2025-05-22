import axios from 'axios';
import { Product, ProductDetail } from '../types/product';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token not found');
    return {
        Authorization: `Bearer ${token}`
    };
};

export const getProducts = async (): Promise<Product[]> => {
    const response = await axios.get('/api/product/get');
    return response.data.products;
};

export const findNameProduct = async (name: string): Promise<Product> => {
    const response = await axios.get(`/product/${name}`, {
        headers: getAuthHeaders()
    });
    return response.data.product;
};

export const getProductById = async (id: string): Promise<Product> => {
    const response = await axios.get(`/api/product/get/${id}`);
    return response.data.product;
};

export const createProduct = async (newProduct: FormData): Promise<Product> => {
    const response = await axios.post('/api/product/create', newProduct, {
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data',
        }
    });
    return response.data.product;
};

export const updateProduct = async (id: string, product: Omit<Product, 'id'>): Promise<Product> => {
    const response = await axios.put(`/api/product/update/${id}`, product, {
        headers: getAuthHeaders()
    });
    return response.data.product;
};

export const deleteProduct = async (id: string): Promise<void> => {
    await axios.delete(`/api/product/delete/${id}`, {
        headers: getAuthHeaders()
    });
};

export const createProductDetail = async (form: FormData): Promise<any> => {
    const response = await axios.post('/api/product-detail', form, {
        headers: getAuthHeaders()
    });
    return response.data;
};

export const updateProductDetail = async (id: string, form: FormData): Promise<any> => {
    const response = await axios.put(`/api/product-detail/${id}`, form, {
        headers: getAuthHeaders()
    });
    return response.data;
};

export const deleteProductDetail = async (id: string): Promise<void> => {
    await axios.delete(`/api/product-detail/delete/${id}`, {
        headers: getAuthHeaders()
    });
};

export const getProductDetailsByProductId = async (productId: string): Promise<ProductDetail[]> => {
    const response = await axios.get(`/api/productdetail/product/${productId}`);
    return response.data; 
};

export const getProductDetailById = async (id: string): Promise<ProductDetail> => {
    const response = await axios.get(`/api/productdetail/get/${id}`);
    return response.data;
};
