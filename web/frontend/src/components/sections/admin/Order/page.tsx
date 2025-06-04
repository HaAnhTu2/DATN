import React, { useEffect, useState } from "react";
import { cancelOrder, confirmOrder, getAllOrders } from "../../../../services/orderService";
import { Order } from "../../../../types/order";
import { useNavigate } from "react-router-dom";
import { Button, Card, Row, Table } from "react-bootstrap";

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", err);
    }
  };

  const handleConfirm = async (orderId: string) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xác nhận đơn hàng này?");
    if (!confirm) return;

    try {
      await confirmOrder(orderId);
      alert("Đã xác nhận đơn hàng.");
      fetchOrders();
    } catch (err) {
      console.error("Lỗi khi xác nhận đơn hàng:", err);
    }
  }

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
    <Row className="mt-4">
      <Card className="w-100 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0" style={{ fontSize: '2rem' }}>Quản lý đơn hàng</h4>
          </div>
          <Table className="table table-bordered mt-3">
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
              {orders ? (
                orders?.map((order) => (
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
                      <Button
                        variant="outline-info"
                        onClick={() => navigate(`/order/detail/${order.order_id}`)}
                        className="me-2"
                      >
                        Chi tiết
                      </Button>
                      {order.status != "cancelled" && order.status != "confirmed" ? (

                        <Button
                          variant="outline-primary"
                          onClick={() => handleConfirm(order.order_id)}
                          className="me-2"
                        >
                          Xác nhận
                        </Button>
                      ) : (null)}

                      {order.status != "cancelled" && order.status != "confirmed" ? (
                        <Button
                          variant="outline-danger"
                          onClick={() => handleCancel(order.order_id)}
                        >
                          Huỷ
                        </Button>
                      ) : (null)}

                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center">
                    Không có đơn hàng nào
                  </td>
                </tr>

              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Row>
  );
};

export default OrderManagement;
