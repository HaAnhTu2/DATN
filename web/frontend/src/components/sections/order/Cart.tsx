import React, { useEffect, useState } from "react";
import { getCartItems ,removeItemFromCart } from "../../../api/cart"; // API cho giỏ hàng
import { CartItem } from "../../../type/order"; // Định nghĩa kiểu CartItem

interface CartListProps {
    setFormCart: (cartItem: CartItem) => void;
}

const CartList: React.FC<CartListProps> = ({ setFormCart }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const fetchedCartItems = await getCartItems(userid);
                setCartItems(fetchedCartItems);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching cart items:", error);
                setLoading(false);
            }
        };
        fetchCartItems();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleUpdateCartItem = (cartItem: CartItem) => {
        setFormCart(cartItem);
    };

    const handleDeleteCartItem = async (id: string) => {
        try {
            await removeItemFromCart(id);
            setCartItems(cartItems.filter(item => item.id !== id));
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
                    {cartItems.map(cartItem => (
                        <tr key={cartItem.id}>
                            <td>{cartItem.productname}</td>
                            <td>{cartItem.quantity}</td>
                            <td>${cartItem.price}</td>
                            <td>${cartItem.price * cartItem.quantity}</td>
                            <td>
                                <button
                                    type="button"
                                    className="btn btn-outline-dark"
                                    onClick={() => handleUpdateCartItem(cartItem)}
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-dark"
                                    onClick={() => handleDeleteCartItem(cartItem.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CartList;
