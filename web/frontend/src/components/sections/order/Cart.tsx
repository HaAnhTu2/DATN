import React, { useState } from "react";
import { CartItem } from "../../../type/cart";
import { Row, Card, Table } from 'react-bootstrap';

interface CartListProps {
    userId: string;
    cartItems: CartItem[];
}

const CartList: React.FC<CartListProps> = ({ cartItems }) => {
    const [loading] = useState(false);

    const handleRemoveProduct = async (productId: string) => {
        try {
        } catch (error) {
            console.error('Error removing product:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Row className="mt-6">
            <Card className="h-100">
                <div className="bg-white py-4">
                    <h4 className="mb-0">Shopping Cart</h4>
                </div>
                <Table responsive className="text-nowrap">
                    <thead className="table-light">
                        <tr>
                            <th>Product ID</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Subtotal</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map(item => (
                            <tr key={item.id}>
                                <td>{item.product_id}</td>
                                <td>{item.cartquantity}</td>
                                <td>${item.price}</td>
                                <td>${item.subtotal}</td>
                                <td>
                                    <button
                                        className="btn btn-outline-dark"
                                        onClick={() => handleRemoveProduct(item.id)}
                                    >
                                        Remove
                                    </button>
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
