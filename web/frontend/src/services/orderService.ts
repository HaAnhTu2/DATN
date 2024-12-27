import axios from 'axios';

const createOrder = async (orderData: any) => {
  const response = await axios.post('/api/orders', orderData);
  return response.data;
};

const getOrderById = async (orderId: string) => {
  const response = await axios.get(`/api/orders/${orderId}`);
  return response.data;
};

export { createOrder, getOrderById };
