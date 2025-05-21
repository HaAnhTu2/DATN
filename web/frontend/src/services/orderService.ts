import axios from 'axios';
import { Order, OrderDetail } from '../types/order';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token not found');
  return {
    Authorization: `Bearer ${token}`,
  };
};
export const createOrder = async (form: FormData): Promise<Order> => {
  const response = await axios.post('/api/order/create', form, { headers: getAuthHeaders() });
  return response.data.order;
};

export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  const response = await axios.get(`/api/order/user/${userId}`, { headers: getAuthHeaders() });
  return response.data.orders;
};

export const getOrderDetails = async (orderId: string): Promise<OrderDetail[]> => {
  const response = await axios.get(`/api/order/detail/${orderId}`, { headers: getAuthHeaders() });
  return response.data.details;
};

export const cancelOrder = async (orderId: string): Promise<Order> => {
  const response = await axios.put(`/api/order/cancel/${orderId}`, {}, { headers: getAuthHeaders() });
  return response.data.order;
};