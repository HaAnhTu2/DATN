import React, { useState, useEffect } from "react";
import { getCartByUserId } from "../../../services/cartService";
import { getUserByToken } from "../../../services/authService";
import { User } from "../../../types/user";
import { getProductDetailById } from "../../../services/productService";
import { ProductDetail } from "../../../types/product";
import CartList from "../../../components/sections/user/Cart/Cart";

interface CartProduct {
  detail: ProductDetail;
  cartQuantity: number;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartProduct[] | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Không tìm thấy mã thông báo. Vui lòng đăng nhập.");
        setLoading(false);
        return;
      }

      try {
        const fetchedUser = await getUserByToken(token);
        setUser(fetchedUser.user);
      } catch (err) {
        console.error("Lỗi tìm người dùng:", err);
        setError("Không thể lấy thông tin người dùng.");
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchCartWithDetails = async () => {
      if (!user) return;

      try {
        const fetchedCart = await getCartByUserId(user?.user_id);

        const cartProducts: CartProduct[] = await Promise.all(
          fetchedCart.map(async (cartItem) => {
            const detail: ProductDetail = await getProductDetailById(cartItem.id_product_detail);
            return {
              detail,
              cartQuantity: cartItem.quantity,
            };
          })
        );

        setCartItems(cartProducts);
      } catch (err) {
        console.error("Không thể lấy thông tin giỏ hàng hoặc sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCartWithDetails();
  }, [user]);


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!cartItems || !user) return <div className="section">
    <header className="container">
      <div className="row">
        <div className="col-md-12">
          <h5>Không có sản phẩm nào trong giỏ hàng.</h5>
        </div>
      </div>
    </header>
  </div>;

  return (
    <div className="section">
      <header className="container">
        <div className="row">
          <div className="col-md-12">
            <CartList userId={user.user_id} cartItems={cartItems} />
          </div>
        </div>
      </header>
    </div>
  );
};

export default CartPage;
