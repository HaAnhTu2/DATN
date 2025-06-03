import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Order, OrderDetail } from "../../../../types/order";
import { ProductDetail } from "../../../../types/product";
import { createOrder } from "../../../../services/orderService";
interface CartProduct {
    detail: ProductDetail;
    cartQuantity: number;
}
interface OrderFormModalProps {
    show: boolean;
    onHide: () => void;
    onSuccess: () => void;
    userId: string;
    cartItems: CartProduct[];
}

const OrderFormModal: React.FC<OrderFormModalProps> = ({ show, onHide, onSuccess, userId, cartItems }) => {
    const [formData, setFormData] = useState({
        fullname: "",
        phone: "",
        shipping_address: "",
        shipping_method: "standard",
        payment_method: "cod",
        note: ""
    });

    const handleSubmit = async () => {
        try {
            const totalAmount = cartItems.reduce((sum, item) => sum + item.cartQuantity * item.detail.price, 0);

            const order: Order = {
                order_id: "",
                id_user: userId,
                fullname: formData.fullname,
                phone: formData.phone,
                order_date: new Date().toISOString(),
                shipping_address: formData.shipping_address,
                shipping_method: formData.shipping_method,
                payment_method: formData.payment_method,
                total_amount: totalAmount,
                status: "pending",
                note: formData.note
            };

            const details: OrderDetail[] = cartItems.map(item => ({
                id_order: "",
                id_product_detail: item.detail.product_detail_id,
                quantity: item.cartQuantity,
                price: item.detail.price
            }));

            await createOrder(order, details); 

            onSuccess();
        } catch (err: any) {
            console.error(err);
            alert("Lỗi khi đặt hàng: " + err.message);
        }
    };


    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Thông tin đặt hàng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Họ và tên</Form.Label>
                        <Form.Control value={formData.fullname} onChange={(e) => setFormData({ ...formData, fullname: e.target.value })} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Số điện thoại</Form.Label>
                        <Form.Control value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Địa chỉ giao hàng</Form.Label>
                        <Form.Control value={formData.shipping_address} onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Ghi chú</Form.Label>
                        <Form.Control value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Hủy</Button>
                <Button variant="primary" onClick={handleSubmit}>Xác nhận đặt hàng</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderFormModal;
