import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductDetail } from "../../../../types/product";
import { Voucher, ApplyVoucherRequest } from "../../../../types/voucher";
import { Row, Card, Table, Button, Form, InputGroup } from "react-bootstrap";
import { deleteCartItem } from "../../../../services/cartService";
import { applyVoucher } from "../../../../services/voucherService";

interface CartProduct {
  detail: ProductDetail;
  cartQuantity: number;
}

interface CartListProps {
  userId: string;
  cartItems: CartProduct[];
}

const CartList: React.FC<CartListProps> = ({ userId, cartItems }) => {
  const [items, setItems] = useState<CartProduct[]>(cartItems);
  const [voucherCode, setVoucherCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const navigate = useNavigate();

  const totalAmount = items.reduce(
    (sum, item) => sum + item.cartQuantity * item.detail.price,
    0
  );

  const finalAmount = totalAmount - discountAmount;

  const handleRemoveProduct = async (userId: string, productDetailId: string) => {
    if (!window.confirm("Are you sure you want to delete this product detail?")) return;

    try {
      await deleteCartItem(userId, productDetailId);
      setItems(prev => prev.filter(cart => cart.detail.product_detail_id !== productDetailId));
      // Nếu sản phẩm bị xóa làm cho voucher không còn hợp lệ thì reset voucher
      if (appliedVoucher && finalAmount < appliedVoucher.min_order_value) {
        setAppliedVoucher(null);
        setDiscountAmount(0);
        alert("Tổng đơn hàng đã giảm xuống dưới giá trị tối thiểu của voucher. Voucher bị huỷ.");
      }
    } catch (error) {
      console.error("Error deleting cart:", error);
    }
  };

  const handleQuantityChange = (productDetailId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setItems(prev =>
      prev.map(item =>
        item.detail.product_detail_id === productDetailId
          ? { ...item, cartQuantity: newQuantity }
          : item
      )
    );

    // Nếu voucher đang áp dụng, kiểm tra lại điều kiện tối thiểu
    if (appliedVoucher) {
      const newTotal = items.reduce(
        (sum, item) =>
          item.detail.product_detail_id === productDetailId
            ? sum + newQuantity * item.detail.price
            : sum + item.cartQuantity * item.detail.price,
        0
      );
      if (newTotal < appliedVoucher.min_order_value) {
        setAppliedVoucher(null);
        setDiscountAmount(0);
        alert("Tổng đơn hàng đã giảm xuống dưới giá trị tối thiểu của voucher. Voucher bị huỷ.");
      }
    }
  };

  const handleApplyVoucher = async () => {
    if (!voucherCode) {
      alert("Vui lòng nhập mã voucher");
      return;
    }
    try {
      const request: ApplyVoucherRequest = {
        user_id: userId,
        code: voucherCode.trim(),
      };
      const response = await applyVoucher(request);
      const voucher = response;

      if (totalAmount < voucher.min_order_value) {
        alert(`Đơn hàng tối thiểu phải từ ${voucher.min_order_value}đ để sử dụng voucher này.`);
        setDiscountAmount(0);
        setAppliedVoucher(null);
        return;
      }
      let discount = 0;
      if (voucher.value < 100) {
        discount = (voucher.value / 100) * totalAmount;
      } else {
        discount = voucher.value;
      }
      
      if (discount > totalAmount) discount = totalAmount;

      setDiscountAmount(discount);
      setAppliedVoucher(voucher);
      alert(`Áp dụng voucher thành công! Giảm ${discount.toFixed(0)}đ`);
    } catch (error) {
      alert("Mã voucher không hợp lệ hoặc đã hết hạn.");
      setDiscountAmount(0);
      setAppliedVoucher(null);
      console.error("Voucher error:", error);
    }
  };

  const handlePlaceOrder = () => {
    if (appliedVoucher && finalAmount < appliedVoucher.min_order_value) {
      alert(`Tổng tiền sau giảm phải lớn hơn hoặc bằng ${appliedVoucher.min_order_value}đ`);
      return;
    }
    localStorage.setItem("checkout_cart", JSON.stringify(items));
    localStorage.setItem("checkout_user_id", userId);
    localStorage.setItem("checkout_discount", discountAmount.toString());
    localStorage.setItem("checkout_voucher", JSON.stringify(appliedVoucher));
    navigate(`/order/${userId}`);
  };

  return (
    <Row className="mt-4">
      <Card className="h-100 w-100">
        <div className="bg-white py-3 px-4 d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Giỏ hàng</h4>
          <InputGroup style={{ maxWidth: 300 }}>
            <Form.Control
              placeholder="Nhập mã voucher"
              value={voucherCode}
              onChange={e => setVoucherCode(e.target.value)}
            />
            <Button variant="outline-success" onClick={handleApplyVoucher}>
              Áp dụng
            </Button>
          </InputGroup>
        </div>

        <Table responsive className="text-nowrap">
          <thead className="table-light">
            <tr>
              <th>Ảnh</th>
              <th>Màu sắc / Kích thước</th>
              <th>Số lượng</th>
              <th>Giá</th>
              <th>Tổng</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.detail.product_detail_id}>
                <td>
                  <img
                    src={`http://localhost:3000/image/${item.detail.image}`}
                    alt=""
                    style={{ width: "100px", height: "auto", borderRadius: "5px" }}
                  />
                </td>
                <td>
                  {item.detail.color} / {item.detail.size}
                </td>
                <td>
                  <input
                    type="number"
                    min={1}
                    value={item.cartQuantity}
                    onChange={e =>
                      handleQuantityChange(item.detail.product_detail_id, parseInt(e.target.value))
                    }
                    style={{ width: "70px" }}
                  />
                </td>
                <td>{item.detail.price}đ</td>
                <td>{(item.cartQuantity * item.detail.price)}đ</td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-2" disabled>
                    Sửa
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleRemoveProduct(userId, item.detail.product_detail_id)}
                  >
                    Xoá
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="text-end fw-bold">
                Tổng tiền cần thanh toán:
              </td>
              <td colSpan={2} className="fw-bold">
                {finalAmount}đ
                {appliedVoucher && (
                  <div style={{ fontSize: "0.85rem", color: "green" }}>
                    (Đã giảm {discountAmount}đ bằng voucher {appliedVoucher.code})
                  </div>
                )}
              </td>
            </tr>
            <tr>
              <td colSpan={6} className="text-end">
                <Button
                  variant="primary"
                  disabled={items.length === 0}
                  onClick={handlePlaceOrder}
                  className="mt-3"
                >
                  Đặt hàng
                </Button>
              </td>
            </tr>
          </tfoot>
        </Table>
      </Card>
    </Row>
  );
};

export default CartList;
