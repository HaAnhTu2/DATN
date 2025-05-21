import axios from "axios";
import { Voucher } from "../types/voucher";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token not found');
  return {
    Authorization: `Bearer ${token}`,
  };
};
export const createVoucher = async (form: FormData): Promise<Voucher> => {
  const response = await axios.post('/api/voucher/create', form, { headers: getAuthHeaders() });
  return response.data.voucher;
};

export const updateVoucher = async (id: string, form: FormData): Promise<Voucher> => {
  const response = await axios.put(`/api/voucher/update/${id}`, form, { headers: getAuthHeaders() });
  return response.data.voucher;
};

export const deleteVoucher = async (id: string): Promise<void> => {
  await axios.delete(`/api/voucher/delete/${id}`, { headers: getAuthHeaders() });
};