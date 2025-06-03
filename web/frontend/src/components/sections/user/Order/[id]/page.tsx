import { useEffect, useState } from 'react';
import { Product, ProductDetail } from '../../../../../types/product';
import { OrderDetail } from '../../../../../types/order';
import { getOrderDetails } from '../../../../../services/orderService';
import { getProductById, getProductDetailById } from '../../../../../services/productService';

interface FullOrderItem {
  detail: OrderDetail;
  product: Product;
  productDetail: ProductDetail;
}

interface OrderInfoProps {
  id: string;
}

export default function OrderInfo({ id }: OrderInfoProps) {
  const [items, setItems] = useState<FullOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  console.log("items: ", items);
  console.log("id: ", id);


  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!id) return;
        const orderDetails: OrderDetail[] | null = await getOrderDetails(id);
        if (!orderDetails || !Array.isArray(orderDetails)) {
          console.error("Không có dữ liệu chi tiết đơn hàng.");
          setItems([]);
          return;
        }
        const fullItems: FullOrderItem[] = await Promise.all(
          orderDetails.map(async (detail) => {
            const productDetail: ProductDetail = await getProductDetailById(detail.id_product_detail);
            const product: Product = await getProductById(productDetail.id_product);
            return { detail, productDetail, product };
          })
        );

        setItems(fullItems);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) return <div>Đang tải chi tiết đơn hàng...</div>;

  return (
    <div className="container mt-4">
      <h2>Chi tiết đơn hàng #{id}</h2>
      {items?.length === 0 ? (
        <p>Không có sản phẩm nào trong đơn hàng.</p>
      ) : (
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Sản phẩm</th>
              <th>Màu</th>
              <th>Kích thước</th>
              <th>Số lượng</th>
              <th>Giá</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item) => (
              <tr key={item.detail.id_product_detail}>
                <td>
                  {item.productDetail.image ? (
                    <img
                      src={`http://localhost:3000/image/${item.productDetail.image}`}
                      alt={item.product.name}
                      style={{ maxWidth: 100, maxHeight: 100, objectFit: 'cover'}}

                    />
                  ) : ("Không có ảnh")}
                </td>
                <td>{item.product.name}</td>
                <td>{item.productDetail.color}</td>
                <td>{item.productDetail.size}</td>
                <td>{item.detail.quantity}</td>
                <td>{item.detail.price.toLocaleString()} đ</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

