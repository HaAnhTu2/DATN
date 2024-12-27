import React, { useState } from "react";
import { CartItem } from "../../../types/cart";
import { Row, Card, Table, Button } from 'react-bootstrap';

interface CartListProps {
    userId: string;
    cartItems: CartItem[];
}

const CartList: React.FC<CartListProps> = ({ cartItems }) => {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState(cartItems);

    const handleRemoveProduct = async (productId: string) => {
        setLoading(true);
        try {
            setItems(prevItems => prevItems.filter(item => item.id !== productId));
        } catch (error) {
            console.error('Error removing product:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row className="mt-4">
            <Card className="h-100 w-100">
                <div className="bg-white py-3 px-4">
                    <h4 className="mb-0">Shopping Cart</h4>
                </div>
                <Table responsive className="text-nowrap">
                    <thead className="table-light">
                        <tr>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Subtotal</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id}>
                                <td>{item.productname || "Unknown"}</td>
                                <td>{item.cartquantity}</td>
                                <td>${item.price.toFixed(2)}</td>
                                <td>${(item.cartquantity * item.price).toFixed(2)}</td>
                                <td>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        disabled={loading}
                                        onClick={() => handleRemoveProduct(item.id)}
                                    >
                                        {loading ? 'Removing...' : 'Remove'}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </Row>
    );
};

export default CartList;
