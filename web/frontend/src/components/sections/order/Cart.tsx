import React, { useEffect, useState } from "react";
import { getCartItems, removeItemFromCart } from "../../../api/cart"; // API cho giỏ hàng
import { CartItem } from "../../../type/order"; // Định nghĩa kiểu CartItem
import { getUserByToken } from "../../../api/api";
import { User } from "../../../type/user";
import { Cart } from "../../../type/cart";

interface CartListProps {
    setFormCart: (cart: Cart) => void;
}

const CartList: React.FC<CartListProps> = ({ setFormCart }) => {
    const [cartItems, setCartItems] = useState<Cart[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
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
        if (!user) return;

        const fetchCartItems = async () => {
            try {
                const fetchedCartItems = await getCartItems(user.id);
                setCartItems(fetchedCartItems);
            } catch (error) {
                console.error("Error fetching cart items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [user]);


    if (!loading && cartItems.length === 0) {
        return <div>Your cart is empty!</div>;
    }

    // const handleUpdateCartItem = (cartItem: CartItem) => {
    //     setFormCart(cart);
    // };

    const handleDeleteCartItem = async (cartId: string, lineItemId: string) => {
        try {
            await removeItemFromCart(lineItemId);
            setCartItems(cartItems.map(cart => ({
                ...cart,
                line_items: cart.line_items.filter(item => item.id !== lineItemId),
            })));
        } catch (error) {
            console.error("Error deleting cart item:", error);
        }
    };


    return (
        <div>
            <div className="col-md-12">
                <h4 className="mb-0">Cart Items</h4>
            </div>
            <table>
                <thead className="table-light">
                    <tr>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map(cart => (
                        <React.Fragment key={cart.id}>
                            {cart.line_items.map(cartItem => (
                                <tr key={cartItem.id}>
                                    <td>{cartItem.productname}</td>
                                    <td>{cartItem.cartquantity}</td>
                                    <td>${cartItem.price.toFixed(2)}</td>
                                    <td>${cartItem.subtotal.toFixed(2)}</td>
                                    <td>
                                        <button onClick={() => handleDeleteCartItem(cart.id, cartItem.id)}>Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

        </div>
    );
};

export default CartList;
