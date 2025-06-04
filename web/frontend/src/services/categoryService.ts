import axios from "axios";
import { Category } from "../types/category";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token not found');
  return {
    Authorization: `Bearer ${token}`,
  };
};
export const getCategories = async (): Promise<Category[]> => {
  const response = await axios.get('/api/category');
  return response.data;
};

export const getCategoryById = async (id: string): Promise<Category> => {
    const response = await axios.get(`/api/category/${id}`);
    return response.data;
};

export const createCategory = async (form: FormData): Promise<Category> => {
  const response = await axios.post('/api/category/create', form, { headers: getAuthHeaders() });
  return response.data;
};

export const updateCategory = async (id: string, form: FormData): Promise<Category> => {
  const response = await axios.put(`/api/category/update/${id}`, form, { headers: getAuthHeaders() });
  return response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await axios.delete(`/api/category/delete/${id}`, { headers: getAuthHeaders() });
};