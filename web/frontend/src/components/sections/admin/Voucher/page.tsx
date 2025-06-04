import React, { useEffect, useState } from "react";
import { getVouchers, deleteVoucher } from "../../../../services/voucherService";
import { Voucher } from "../../../../types/voucher";
import { Button, Card, Row, Table, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const VoucherManagement: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const data = await getVouchers();
        setVouchers(data);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách voucher:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVouchers();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xoá voucher này?");
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      await deleteVoucher(id);
      alert("Xoá thành công!");
      setVouchers((prev) => prev.filter((v) => v.voucher_id !== id));
    } catch (error) {
      console.error("Lỗi khi xoá voucher:", error);
      alert("Xoá thất bại!");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredVouchers = vouchers.filter(v =>
    v.code.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <Row className="mt-4">
      <Card className="w-100 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0" style={{ fontSize: '2rem' }}>Quản lý mã giảm giá</h4>
            <Button variant="primary" onClick={() => navigate("/create/voucher")}>
              Tạo mã giảm giá
            </Button>
          </div>

          <Form className="mb-3">
            <Form.Control
              type="text"
              placeholder="Tìm theo mã voucher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Form>

          <Table responsive bordered hover className="text-nowrap align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Mã</th>
                <th>Giá trị</th>
                <th>Giá trị đơn tối thiểu</th>
                <th>Hết hạn</th>
                <th>Mô tả</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredVouchers.map(v => (
                <tr key={v.voucher_id}>
                  <td>{v.voucher_id}</td>
                  <td>{v.code}</td>
                  <td>{v.value}%</td>
                  <td>{v.min_order_value} đ</td>
                  <td>{v.exprired_time}</td>
                  <td>{v.description}</td>
                  <td>{v.status === "active" ? "Hoạt động" : "Không hoạt động"}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => navigate(`/update/voucher/${v.voucher_id}`)}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(v.voucher_id)}
                      disabled={deletingId === v.voucher_id}
                    >
                      {deletingId === v.voucher_id ? "Đang xoá..." : "Xoá"}
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredVouchers.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center">
                    {search ? "Không tìm thấy voucher phù hợp" : "Không có voucher nào"}
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

export default VoucherManagement;
