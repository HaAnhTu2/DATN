import axios from "axios";
import { Producer } from "../types/producer";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token not found');
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const createProducer = async (form: FormData): Promise<Producer> => {
  const response = await axios.post('/api/producer/create', form, { headers: getAuthHeaders() });
  return response.data.producer;
};

export const updateProducer = async (id: string, form: FormData): Promise<Producer> => {
  const response = await axios.put(`/api/producer/update/${id}`, form, { headers: getAuthHeaders() });
  return response.data.producer;
};

export const deleteProducer = async (id: string): Promise<void> => {
  await axios.delete(`/api/producer/delete/${id}`, { headers: getAuthHeaders() });
};
