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
  const [discountAmount, setDiscountAmount] = useState(0);
  const [voucherCode, setVoucherCode] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = localStorage.getItem("checkout_cart");
    const storedUserId = localStorage.getItem("checkout_user_id");
    const storedDiscount = localStorage.getItem("checkout_discount");
    const storedVoucher = localStorage.getItem("checkout_voucher");

    if (storedCart && storedUserId) {
      setCartItems(JSON.parse(storedCart));
      setUserId(storedUserId);
    } else {
      navigate("/cart");
    }

    if (storedDiscount) {
      setDiscountAmount(parseFloat(storedDiscount));
    }

    if (storedVoucher) {
      try {
        const voucher = JSON.parse(storedVoucher);
        if (voucher && voucher.code) {
          setVoucherCode(voucher.code);
        }
      } catch {
        setVoucherCode(null);
      }
    }
  }, [navigate]);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.cartQuantity * item.detail.price,
    0
  );

  const finalAmount = totalAmount - discountAmount > 0 ? totalAmount - discountAmount : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const order: Order = {
        order_id: "",
        id_user: userId,
        fullname: formData.fullname,
        phone: formData.phone,
        order_date: new Date().toISOString(),
        shipping_address: formData.shipping_address,
        shipping_method: formData.shipping_method,
        payment_method: formData.payment_method,
        total_amount: finalAmount,
        status: "pending",
        note: formData.note,
      };

      const details: OrderDetail[] = cartItems.map((item) => ({
        id_order: "",
        id_product_detail: item.detail.product_detail_id,
        quantity: item.cartQuantity,
        price: item.detail.price
      }));

      await createOrder(order, details);

      localStorage.removeItem("checkout_cart");
      localStorage.removeItem("checkout_user_id");
      localStorage.removeItem("checkout_discount");
      localStorage.removeItem("checkout_voucher");

      navigate("/order/success");
    } catch (err: any) {
      console.error(err);
      alert("Lỗi khi đặt hàng: " + err.message);
    }
  };


  return (
    <Container className="d-flex ps-3">
      <div className="d-flex gap-4">
        <Form className="m-3" style={{ flex: 1, width: "800px" }} onSubmit={handleSubmit}>
          <h3>Thông tin giao hàng</h3>

          <Form.Group className="mb-3">
            <Form.Label>Họ và tên</Form.Label>
            <Form.Control
              value={formData.fullname}
              onChange={(e) =>
                setFormData({ ...formData, fullname: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Địa chỉ giao hàng</Form.Label>
            <Form.Control
              value={formData.shipping_address}
              onChange={(e) =>
                setFormData({ ...formData, shipping_address: e.target.value })
              }
              required
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

          <Form.Group className="mb-3">
            <Form.Label>
              Tổng tiền: {totalAmount.toLocaleString()}đ
            </Form.Label>
            {discountAmount > 0 && (
              <div style={{ color: "green" }}>
                Đã giảm: {discountAmount.toLocaleString()}đ (Voucher: {voucherCode})
              </div>
            )}
            <div>
              <strong>Tổng thanh toán: {finalAmount.toLocaleString()}đ</strong>
            </div>
          </Form.Group>

          <Button className="m-4" type="submit">
            Xác nhận đặt hàng
          </Button>
        </Form>
        <div className="m-3" style={{ width: "500px" }}>
          {formData.payment_method === "bank" && (
            <div className="mb-3 text-center">
              <h4>Quét mã QR để chuyển khoản:</h4>
              <img src={`https://api.vietqr.io/image/970407-19036388272010-hf2xjZk.jpg?amount=${finalAmount}&accountName=HAANHTU&addInfo=thanh%20toan%20don%20hang`} />
              <div className="mt-2" style={{ fontSize: "14px", color: "#555" }}>
                <p>Ngân hàng: Techcombank</p>
                <p>Số tài khoản: 19036388272010</p>
                <p>Chủ tài khoản: Hà Anh Tú</p>
                <p>Nội dung: Thanh toán đơn hàng</p>
                <p>Số tiền: {finalAmount.toLocaleString()}đ</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default OrderPage;
