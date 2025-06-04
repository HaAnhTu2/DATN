import React, { useEffect, useState } from "react";
import {getAllProducers,deleteProducer} from "../../../../services/producerService";
import { Producer } from "../../../../types/producer";
import { Button, Card, Row, Table, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ProducerManagement: React.FC = () => {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducers = async () => {
      try {
        const fetchedProducers = await getAllProducers();
        setProducers(fetchedProducers);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách nhà sản xuất:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducers();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <span>Loading...</span>
      </div>
    );
  }
  const handleEditProducer = (producer: Producer) => {
    navigate(`/update/producer/${producer.producer_id}`);
  };

  const handleDeleteProducer = async (id: string) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xoá nhà sản xuất này?");
    if (!confirm) return;

    try {
      await deleteProducer(id);
      alert("Xoá thành công!");
      setProducers(prev => prev.filter(producer => producer.producer_id !== id));
    } catch (err) {
      console.error("Lỗi khi xoá nhà sản xuất:", err);
    }
  };

  return (
    <Row className="mt-4">
      <Card className="w-100 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">Quản lý nhà sản xuất</h4>
            <Button variant="primary" onClick={() => navigate("/create/producer")}>
              Tạo nhà sản xuất
            </Button>
          </div>
          <Form className="mb-3">
          </Form>
          <Table responsive bordered hover className="text-nowrap align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {producers.map(p => (
                <tr key={p.producer_id}>
                  <td>{p.producer_id}</td>
                  <td>{p.name}</td>
                  <td>{p.status === "active" ? "Hoạt động" : "Ngưng hoạt động"}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEditProducer(p)}
                      className="me-2"
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteProducer(p.producer_id)}
                    >
                      Xoá
                    </Button>
                  </td>
                </tr>
              ))}
              {producers?.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center">
                    Không có nhà sản xuất nào
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

export default ProducerManagement;
