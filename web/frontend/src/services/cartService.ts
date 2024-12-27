import axios from 'axios';
import { CartItem } from '../types/cart';
import { Order } from '../types/order';
import { Cart } from '../types/cart';

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (cart: Cart): Promise<CartItem[]> => {
    try {
        // Lấy token từ localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token not found');
        }

        if (!cart.id || !cart.cart_id || !cart.line_items || cart.line_items.length === 0) {
            throw new Error('Invalid cart or cart items are missing');
        }

        // Tạo các yêu cầu API để thêm sản phẩm vào giỏ hàng
        const addItemPromises = cart.line_items.map(async (cartItem) => {
            try {
                // Gửi yêu cầu thêm sản phẩm vào giỏ hàng
                const response = await axios.post(
                    `/api/cart/add/${cart.id}/${cartItem.product_id}`,
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
                return response.data; // Trả về sản phẩm đã được thêm vào giỏ hàng
            } catch (error) {
                console.error(`Error adding product ${cartItem.product_id} to cart:`, error);
                throw new Error(`Error adding product ${cartItem.product_id} to cart`);
            }
        });
        const addedItems = await Promise.all(addItemPromises);
        return addedItems;
    } catch (error) {
        console.error('Error adding items to cart:', error);
        throw new Error('Error adding items to cart');
    }
};


// Xóa sản phẩm khỏi giỏ hàng
export const removeItemFromCart = async (userId: string, productId: string): Promise<void> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token not found');
        }
        if (!userId || !productId) {
            throw new Error('Invalid userId or productId');
        }

        // Gửi yêu cầu tới API để xóa sản phẩm khỏi giỏ hàng
        await axios.delete(`/api/cart/delete/${userId}/${productId}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(`Product ${productId} removed from cart successfully.`);
    } catch (error) {
        console.error(`Error removing item from cart: ${error}`);
        throw new Error(`Error removing item from cart: ${error}`);
    }
};

// Lấy danh sách sản phẩm trong giỏ hàng
export const getCartItems = async (userId: string): Promise<{ lineItems: CartItem[], total: number }> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token not found');
        }
        const response = await axios.get(`/api/cart/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
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
