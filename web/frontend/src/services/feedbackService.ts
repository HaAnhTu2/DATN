import axios from "axios";
import { Feedback } from "../types/feedback";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token not found');
  return {
    Authorization: `Bearer ${token}`,
  };
};
export const getFeedbacks = async (): Promise<Feedback[]> => {
  const response = await axios.get('/api/feedback');
  return response.data;
};
export const createFeedback = async (form: FormData): Promise<Feedback> => {
  const response = await axios.post('/api/feedback/create', form, { headers: getAuthHeaders() });
  return response.data;
};

export const updateFeedback = async (form: FormData): Promise<Feedback> => {
  const response = await axios.put('/api/feedback/update', form, { headers: getAuthHeaders() });
  return response.data;
};

export const deleteFeedback = async (idUser: string, idProduct: string): Promise<void> => {
  await axios.delete(`/api/feedback/delete/${idUser}/${idProduct}`, { headers: getAuthHeaders() });
};