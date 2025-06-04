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
  const handleRemoveItem = (indexToRemove: number) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(indexToRemove, 1);
    setCartItems(updatedCart);
    localStorage.setItem("checkout_cart", JSON.stringify(updatedCart));
  };

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
        id_order: "", // backend sẽ tự gán
        id_product_detail: item.detail.product_detail_id,
        quantity: item.cartQuantity,
        price: item.detail.price
      }));

      await createOrder(order, details);

      // Xóa localStorage và chuyển trang
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
              Tổng tiền: {totalAmount}đ
            </Form.Label>
            {discountAmount > 0 && (
              <div style={{ color: "green" }}>
                Đã giảm: {discountAmount}đ (Voucher: {voucherCode})
              </div>
            )}
            <div>
              <strong>Tổng tiền cần thanh toán: {finalAmount}đ</strong>
            </div>
          </Form.Group>
          <Button className="m-4" type="submit">
            Xác nhận đặt hàng
          </Button>
        </Form>
      </div>
      {/* <div className="m-3" style={{width: "500px" }}>
        <h3>Giỏ hàng</h3>
        {cartItems.map((item, index) => (
          <div key={index} className="border rounded p-3 mb-3 bg-light">
            <div className="d-flex align-items-center">
              <div style={{ marginRight: "16px" }}>
                <img
                  src={`http://localhost:3000/image/${item.detail.image}`}
                  alt=""
                  style={{ width: "100px", height: "auto", objectFit: "cover", borderRadius: "5px" }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <p className="mb-1"><strong>Màu - Size:</strong> {item.detail.color} - {item.detail.size}</p>
                <p className="mb-1"><strong>Số lượng:</strong> {item.cartQuantity}</p>
                <p className="mb-1"><strong>Đơn giá:</strong> {item.detail.price.toLocaleString()}đ</p>
                <p className="mb-0"><strong>Thành tiền:</strong> {(item.cartQuantity * item.detail.price).toLocaleString()}đ</p>
              </div>
              <Button
                variant="outline-danger"
                size="sm"
                className="ms-3"
                onClick={() => handleRemoveItem(index)}
              >
                Xóa
              </Button>
            </div>
          </div>
        ))}
      </div> */}
    </Container>
  );
};

export default OrderPage;
