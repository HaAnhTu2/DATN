import axios from 'axios';
import { Signup, User } from '../types/user';

// Helper để lấy token
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token not found');
    return {
        Authorization: `Bearer ${token}`
    };
};

export const getUsers = async (): Promise<User[]> => {
    const response = await axios.get('/api/user/get', {
        headers: getAuthHeaders()
    });
    return response.data.users;
};
export const getUserById = async (id: string): Promise<User> => {
    const response = await axios.get(`/api/user/get/${id}`, {
        headers: getAuthHeaders()
    });
    return response.data;
};

// Đăng ký user mới (không cần token)
export const signup = async (newUser: FormData): Promise<Signup> => {
    try {
        const response = await axios.post('/api/signup', newUser, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Error creating user');
    }
};

// Tạo user (chỉ admin, cần token nếu cần xác thực)
export const createUser = async (newUser: FormData): Promise<User> => {
    try {
        const response = await axios.post('/api/user/create', newUser, {
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Error creating user');
    }
};

// Cập nhật user (có thể là admin hoặc người dùng tự cập nhật)
export const updateUser = async (id: string, user: Omit<User, 'id'>): Promise<User> => {
    try {
        const response = await axios.put(`/api/user/update/${id}`, user, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        throw new Error('Error updating user');
    }
};

// Xóa user
export const deleteUser = async (id: string): Promise<void> => {
    await axios.delete(`/api/user/delete/${id}`, {
        headers: getAuthHeaders()
    });
};
