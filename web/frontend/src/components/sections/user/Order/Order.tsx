import React, { useEffect, useState } from "react";
import { getOrdersByUserId, cancelOrder } from "../../../../services/orderService";
import { Order } from "../../../../types/order";
import { useNavigate } from "react-router-dom";

interface OrderUserProps {
  id: string;
}

export default function OrderUser({ id }: OrderUserProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [id]);

  const fetchOrders = async () => {
    try {
      const data = await getOrdersByUserId(id);
      setOrders(data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", err);
    }
  };

  const handleCancel = async (orderId: string) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn huỷ đơn hàng này?");
    if (!confirm) return;

    try {
      await cancelOrder(orderId);
      alert("Đã huỷ đơn hàng.");
      fetchOrders();
    } catch (err) {
      console.error("Lỗi khi huỷ đơn hàng:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Đơn hàng của tôi</h3>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Người nhận</th>
            <th>SĐT</th>
            <th>Ngày đặt</th>
            <th>Địa chỉ</th>
            <th>Tổng tiền</th>
            <th>Phương thức</th>
            <th>trạng thái</th>
            <th>Ghi chú</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => (
            <tr key={order.order_id}>
              <td>{order.order_id}</td>
              <td>{order.fullname}</td>
              <td>{order.phone}</td>
              <td>{new Date(order.order_date).toLocaleString()}</td>
              <td>{order.shipping_address}</td>
              <td>{order.total_amount.toLocaleString()}₫</td>
              <td>
                {order.shipping_method} / {order.payment_method}
              </td>
              <td>{order.status}</td>
              <td>{order.note}</td>
              <td>
                <button
                  className="btn btn-info btn-sm me-2"
                  onClick={() => navigate(`/order/detail/${order.order_id}`)}
                >
                  Chi tiết
                </button>
                {order.status != "cancelled" ? (
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleCancel(order.order_id)}
                  >
                    Huỷ
                  </button>
                ) : (null)}

              </td>
            </tr>
          ))}
          {!orders && (
            <tr>
              <td colSpan={9} className="text-center">
                Không có đơn hàng nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};