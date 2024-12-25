import axios from 'axios';
import { CartItem } from '../type/order'; // Thay thế bằng kiểu dữ liệu phù hợp của bạn
import { Order } from '../type/order';       // Thay thế bằng kiểu dữ liệu của Order nếu cần

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (cartItem: CartItem): Promise<CartItem> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token not found');
        }
        const response = await axios.post('/api/cart/addtocart', cartItem, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data as CartItem;
    } catch (error) {
        throw new Error('Error adding item to cart');
    }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeItemFromCart = async (cartItemId: string): Promise<void> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token not found');
        }
        await axios.post('/api/cart/removeitem', { id: cartItemId }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        throw new Error('Error removing item from cart');
    }
};

// Lấy danh sách sản phẩm trong giỏ hàng
export const getCartItems = async (userId: string): Promise<CartItem[]> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token not found');
        }
        const response = await axios.post(`/api/cart/listcart/${userId}`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data as CartItem[];
    } catch (error) {
        throw new Error('Error fetching cart items');
    }
};

// Thanh toán giỏ hàng
export const checkoutCart = async (userId: string): Promise<Order> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token not found');
        }
        const response = await axios.post(`/api/cart/cartcheckout/${userId}`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data as Order;
    } catch (error) {
        throw new Error('Error checking out cart');
    }
};

// Mua ngay một sản phẩm (instant buy)
export const instantBuy = async (cartItem: CartItem): Promise<Order> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token not found');
        }
        const response = await axios.post('/api/cart/instantbuy', cartItem, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data as Order;
    } catch (error) {
        throw new Error('Error performing instant buy');
    }
};
