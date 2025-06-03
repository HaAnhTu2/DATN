import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // nếu dùng React Router
import { ProductDetail } from "../../../../types/product";
import { Row, Card, Table, Button } from "react-bootstrap";
import { deleteCartItem } from "../../../../services/cartService";

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
  const totalAmount = items.reduce(
    (sum, item) => sum + item.cartQuantity * item.detail.price,
    0
  );
  const navigate = useNavigate(); 

  const handleRemoveProduct = async (userId: string, productDetailId: string) => {
    if (!window.confirm("Are you sure you want to delete this product detail?")) return;

    try {
      await deleteCartItem(userId, productDetailId);
      setItems(prev => prev.filter(cart => cart.detail.product_detail_id !== productDetailId));
    } catch (error) {
      console.error('Error deleting cart:', error);
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
  };


  const handlePlaceOrder = () => {
    // Lưu cart vào localStorage hoặc state management trước khi chuyển trang
    localStorage.setItem("checkout_cart", JSON.stringify(items));
    localStorage.setItem("checkout_user_id", userId);
    navigate(`/order/${userId}`);
  };

  return (
    <Row className="mt-4">
      <Card className="h-100 w-100">
        <div className="bg-white py-3 px-4 d-flex justify-content-between">
          <h4 className="mb-0">Giỏ hàng</h4>

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
                <td><img src={`http://localhost:3000/image/${item.detail.image}`} alt="" style={{ width: "100px", height: "auto", borderRadius: '5px' }} /></td>
                <td>{item.detail.color} / {item.detail.size}</td>
                <td>
                  <input
                    type="number"
                    min={1}
                    value={item.cartQuantity}
                    onChange={(e) => handleQuantityChange(item.detail.product_detail_id, parseInt(e.target.value))}
                    style={{ width: '70px' }}
                  />
                </td>
                <td>${item.detail.price.toFixed(2)}</td>
                <td>${(item.cartQuantity * item.detail.price).toFixed(2)}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    // onClick={() => handleUpdateProduct(product)}
                    className="me-2"
                  >
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
            <div>Tổng tiền cần thanh toán: {totalAmount}đ</div>
            <Button
              variant="primary"
              disabled={items.length === 0}
              onClick={handlePlaceOrder}
              className="mt-4"
            >
              Đặt hàng
            </Button>
          </tbody>
        </Table>
      </Card>
    </Row>
  );
};

export default CartList;
