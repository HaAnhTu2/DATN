import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import { CartProduct } from "../../../types/cart";
import { Order, OrderDetail } from "../../../types/order";
import { createOrder } from "../../../services/orderService";

const OrderPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    shipping_address: "",
    shipping_method: "standard",
    payment_method: "cod",
    note: ""
  });

  const [cartItems, setCartItems] = useState<CartProduct[]>([]);
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = localStorage.getItem("checkout_cart");
    const storedUserId = localStorage.getItem("checkout_user_id");

    if (storedCart && storedUserId) {
      setCartItems(JSON.parse(storedCart));
      setUserId(storedUserId);
    } else {
      // Nếu không có dữ liệu thì quay lại giỏ hàng
      navigate("/cart");
    }
  }, [navigate]);

  const handleSubmit = async () => {
    try {
      const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.cartQuantity * item.detail.price,
        0
      );

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

      const details: OrderDetail[] = cartItems.map((item) => ({
        id_order: "", // backend sẽ tự gán
        id_product_detail: item.detail.product_detail_id,
        quantity: item.cartQuantity,
        price: item.detail.price
      }));

      await createOrder(order, details);

      // Xóa localStorage và chuyển trang
      localStorage.removeItem("checkout_cart");
      localStorage.removeItem("checkout_user_id");
      navigate("/order/success");
    } catch (err: any) {
      console.error(err);
      alert("Lỗi khi đặt hàng: " + err.message);
    }
  };

  return (
    <Container className="mt-4">
      <h3>Thông tin giao hàng</h3>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Họ và tên</Form.Label>
          <Form.Control
            value={formData.fullname}
            onChange={(e) =>
              setFormData({ ...formData, fullname: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Số điện thoại</Form.Label>
          <Form.Control
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Địa chỉ giao hàng</Form.Label>
          <Form.Control
            value={formData.shipping_address}
            onChange={(e) =>
              setFormData({ ...formData, shipping_address: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Phương thức giao hàng</Form.Label>
          <Form.Select
            value={formData.shipping_method}
            onChange={(e) =>
              setFormData({ ...formData, shipping_method: e.target.value })
            }
          >
            <option value="standard">Tiêu chuẩn</option>
            <option value="express">Nhanh</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Phương thức thanh toán</Form.Label>
          <Form.Select
            value={formData.payment_method}
            onChange={(e) =>
              setFormData({ ...formData, payment_method: e.target.value })
            }
          >
            <option value="cod">Thanh toán khi nhận hàng</option>
            <option value="bank">Chuyển khoản ngân hàng</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Ghi chú</Form.Label>
          <Form.Control
            as="textarea"
            value={formData.note}
            onChange={(e) =>
              setFormData({ ...formData, note: e.target.value })
            }
          />
        </Form.Group>
        <Button onClick={handleSubmit}>Xác nhận đặt hàng</Button>
      </Form>
    </Container>
  );
};

export default OrderPage;
