import React, { useState, useEffect } from "react";
import { getCartItems } from "../../api/cart";
import { CartItem } from "../../type/cart";
import CartList from "../../components/sections/order/Cart";  // Đảm bảo đường dẫn đúng với cấu trúc của bạn
import { getUserByToken } from "../../api/api";
import { User } from "../../type/user";

const CartPage: React.FC = () => {
    const [cart, setCart] = useState<{ lineItems: CartItem[], total: number } | null>(null);
    const [user, setUser] = useState<User | null>(null);

    // Kiểm tra nếu không có người dùng thì không hiển thị trang
    if (!user._id) {
        console.error('User not found');
        return <div>Loading user...</div>;
    }

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            try {
                const fetchedUser = await getUserByToken(token);
                setUser(fetchedUser.user);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (user?._id) {
            const fetchCart = async () => {
                try {
                    const fetchedCartItems = await getCartItems(user._id);
                    setCart(fetchedCartItems);
                } catch (error) {
                    console.error("Failed to fetch cart:", error);
                }
            };
            fetchCart();
        }
    }, [user]);

    if (!cart) {
        return <div>Loading cart...</div>;
    }

    return (
        <div className="section">
            <header className="container">
                <div className="row">
                    <div className="col-md-12">
                        {/* Truyền giỏ hàng vào CartList */}
                        <CartList userId={user._id} cartItems={cart.lineItems} />
                    </div>
                </div>
            </header>
        </div>
    );
};

export default CartPage;
