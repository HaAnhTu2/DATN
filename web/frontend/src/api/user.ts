import axios from 'axios';
import { Signup, User } from '../type/user';

export const getUsers = async (): Promise<User[]> => {
    const response = await axios.get('/api/user/get')
    return response.data.users;
};

export const signup = async (newUser: FormData): Promise<Signup> => {
    try {
        const response = await axios.post('/api/signup', newUser, {
        });
        return response.data as Signup;
    } catch (error) {
        throw new Error('Error creating user');
    }
};

export const createUser = async (newUser: FormData): Promise<User> => {
    try {
        const response = await axios.post('/api/user/create', newUser, {
        });
        return response.data as User;
    } catch (error) {
        throw new Error('Error creating user');
    }
};

export const updateUser = async (id: string, user: Omit<User, 'id'>): Promise<User> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token not found');
        }
        const response = await axios.put(`/api/user/update/${id}`, user, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Error updating user');
    }
};

export const deleteUser = async (id: string): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Token not found');
    }
    const response = await axios.delete(`/api/user/delete/${id}`, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        }
    });
    return response.data
};