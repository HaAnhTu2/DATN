import React, { useState, useEffect } from "react";
import { getCartItems } from "../../services/cartService";
import { CartItem } from "../../types/cart";
import CartList from "../../components/sections/user/Cart";
import { getUserByToken } from "../../services/authService";
import { User } from "../../types/user";

const CartPage: React.FC = () => {
    const [cart, setCart] = useState<{ lineItems: CartItem[], total: number } | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found. Please log in.');
                setLoading(false);
                return;
            }

            try {
                const fetchedUser = await getUserByToken(token);
                setUser(fetchedUser.user);
            } catch (err) {
                console.error('Error fetching user:', err);
                setError('Failed to fetch user information.');
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (user) {
            const fetchCart = async () => {
                try {
                    const fetchedCartItems = await getCartItems(user.id);
                    setCart(fetchedCartItems);
                } catch (err) {
                    console.error("Failed to fetch cart:", err);
                    setError('Failed to fetch cart items.');
                } finally {
                    setLoading(false);
                }
            };
            fetchCart();
        }
    }, [user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!cart || !user) {
        return <div>No cart items available.</div>;
    }

    return (
        <div className="section">
            <header className="container">
                <div className="row">
                    <div className="col-md-12">
                        <p>User: {user.email}</p>
                        <CartList userId={user.id} cartItems={cart.lineItems} />
                    </div>
                </div>
            </header>
        </div>
    );
};

export default CartPage;
