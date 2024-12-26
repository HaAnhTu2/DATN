import axios from 'axios';
import { CartItem } from '../type/cart'; // Thay thế bằng kiểu dữ liệu phù hợp của bạn
import { Order } from '../type/order';       // Thay thế bằng kiểu dữ liệu của Order nếu cần
import { Cart } from '../type/cart';

// // Thêm sản phẩm vào giỏ hàng
export const addToCart = async (cart: Cart): Promise<CartItem[]> => {
    try {
        // Lấy token từ localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token not found');
        }

        // Kiểm tra xem cart và các thông tin cần thiết có hợp lệ không
        if (!cart || !cart.id || !cart.line_items || cart.line_items.length === 0) {
            throw new Error('Invalid cart or cart items are missing');
        }

        // Tạo một mảng để lưu kết quả của các sản phẩm được thêm vào giỏ hàng
        const addedItems: CartItem[] = [];

        // Lặp qua từng sản phẩm trong `line_items` và gửi yêu cầu API
        for (const cartItem of cart.line_items) {
            const response = await axios.post(
                `/cart/${cart.id}/add/${cartItem.product_id}`,
                {
                    cartquantity: cartItem.cartquantity,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Thêm sản phẩm đã thêm vào giỏ hàng vào mảng kết quả
            addedItems.push(response.data);
        }

        // Trả về mảng các sản phẩm đã được thêm vào giỏ hàng
        return addedItems;
    } catch (error) {
        console.error('Error adding item to cart:', error);
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
        const response = await axios.post(`/cart/${userId}`, null, {
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
