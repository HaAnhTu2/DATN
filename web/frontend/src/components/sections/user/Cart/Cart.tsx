import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // nếu dùng React Router
import { ProductDetail } from "../../../../types/product";
import { Row, Card, Table, Button } from "react-bootstrap";

interface CartProduct {
  detail: ProductDetail;
  cartQuantity: number;
}

interface CartListProps {
  userId: string;
  cartItems: CartProduct[];
}

const CartList: React.FC<CartListProps> = ({ userId, cartItems }) => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<CartProduct[]>(cartItems);

  const navigate = useNavigate(); // nếu dùng React Router

  const handleRemoveProduct = async (productDetailId: string) => {
    setLoading(true);
    try {
      setItems(prev => prev.filter(item => item.detail.product_detail_id !== productDetailId));
    } catch (error) {
      console.error("Error removing product:", error);
    } finally {
      setLoading(false);
    }
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
          <h4 className="mb-0">Shopping Cart</h4>
          <Button
            variant="primary"
            disabled={items.length === 0}
            onClick={handlePlaceOrder}
          >
            Đặt hàng
          </Button>
        </div>
        <Table responsive className="text-nowrap">
          <thead className="table-light">
            <tr>
              <th>Color / Size</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.detail.product_detail_id}>
                <td>{item.detail.color} / {item.detail.size}</td>
                <td>{item.cartQuantity}</td>
                <td>${item.detail.price.toFixed(2)}</td>
                <td>${(item.cartQuantity * item.detail.price).toFixed(2)}</td>
                <td>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    disabled={loading}
                    onClick={() => handleRemoveProduct(item.detail.product_detail_id)}
                  >
                    {loading ? "Removing..." : "Remove"}
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
