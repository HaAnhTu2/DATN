import axios from 'axios';
import { Order, OrderDetail } from '../types/order';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token không tồn tại');
  return {
    Authorization: `Bearer ${token}`
  };
};

export const createOrder = async (order: Order, details: OrderDetail[]) => {
  const response = await axios.post(
    '/api/orders/create',
    { order, details },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const getOrdersByUserId = async (userId: string) => {
  const response = await axios.get(`/api/orders/user/${userId}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const getOrderDetails = async (orderId: string) => {
  const response = await axios.get(`/api/orders/detail/${orderId}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const confirmOrder = async (orderId: string) => {
  const response = await axios.put(`/api/orders/${orderId}/confirm`, {}, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const cancelOrder = async (orderId: string) => {
  const response = await axios.put(`/api/orders/${orderId}/cancel`, {}, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const getAllOrders = async () => {
  const response = await axios.get('/api/orders', {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const response = await axios.put(
    `/api/order/update-status/${orderId}`,
    { status },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const deleteOrder = async (orderId: string) => {
  const response = await axios.delete(`/api/order/delete/${orderId}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};
