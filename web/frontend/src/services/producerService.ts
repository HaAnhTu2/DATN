import axios from "axios";
import { Producer } from "../types/producer";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token not found');
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getAllProducers = async (): Promise<Producer[]> => {
  const response = await axios.get('/api/producer');
  return response.data.producers;
};

export const getProducerById = async (id: string): Promise<Producer> => {
    const response = await axios.get(`/api/producer/${id}`, {
        headers: getAuthHeaders()
    });
    return response.data;
};

export const createProducer = async (newProducer: FormData): Promise<Producer> => {
  const response = await axios.post("/api/producer/create", newProducer, { headers: getAuthHeaders() });
  return response.data;
};

export const updateProducer = async (id: string, form: FormData): Promise<Producer> => {
  const response = await axios.put(`/api/producer/update/${id}`, form, { headers: getAuthHeaders() });
  return response.data;
};

export const deleteProducer = async (id: string): Promise<void> => {
  await axios.delete(`/api/producer/delete/${id}`, { headers: getAuthHeaders() });
};
