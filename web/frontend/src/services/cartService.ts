import axios from "axios";
import { Cart } from "../types/cart";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token not found');
  return {
    Authorization: `Bearer ${token}`,
  };
};
export const addToCart = async (form: FormData): Promise<any> => {
  const response = await axios.post('/api/cart', form, { headers: getAuthHeaders() });
  return response.data;
};

export const getCartByUserId = async (userId: string): Promise<Cart[]> => {
  const response = await axios.get(`/api/cart/${userId}`, { headers: getAuthHeaders() });
  return response.data.cart;
};

export const updateCartQuantity = async (form: FormData): Promise<any> => {
  const response = await axios.put('/api/cart/quantity', form, { headers: getAuthHeaders() });
  return response.data;
};

export const deleteCartItem = async (form: FormData): Promise<void> => {
  await axios.delete('/api/cart', { data: form, headers: getAuthHeaders() });
};

export const clearCart = async (userId: string): Promise<void> => {
  await axios.delete(`/api/cart/clear/${userId}`, { headers: getAuthHeaders() });
};