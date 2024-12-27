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
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token not found');
        }
        const logout = await axios.delete('api/logout', {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            }
        });
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


