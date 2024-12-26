// src/api/api.ts
import axios from 'axios';

export const login = async (email: string, password: string): Promise<string> => {
    try {
        const response = await axios.post('api/login', {
            email,
            password,
        });
        const { token } = response.data;
        localStorage.setItem('token', token);
        return token;
        } catch (error) {
            throw new Error('Error logging in');
        }
};

export const logout = async (): Promise<void> => {
    try {
        await axios.delete('api/logout');
        localStorage.removeItem('token');
    } catch (error) {
        throw new Error('Error logging out');
    }
  };
// API lấy thông tin người dùng từ token
export const getUserByToken = async (token: string) => {
    const response = await axios.get('/api/users', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};


