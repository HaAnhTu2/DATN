import React, { useEffect, useState } from "react";
import {
  getAllProducers,
  createProducer,
  updateProducer,
  deleteProducer,
} from "../../../../services/producerService";
import { Producer } from "../../../../types/producer";
import { Button } from "react-bootstrap";

const ProducerManagement: React.FC = () => {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");
  const [editingProducerId, setEditingProducerId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducers();
  }, []);

  const fetchProducers = async () => {
    try {
      const data = await getAllProducers();
      setProducers(data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách nhà sản xuất:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newProducer = new FormData();
      newProducer.append('name', name);
      newProducer.append('status', status);
      if (editingProducerId) {
        await updateProducer(editingProducerId, newProducer);
        alert("Cập nhật thành công!");
      } else {
        await createProducer(newProducer);
        alert("Thêm mới thành công!");
      }
      resetForm();
      fetchProducers();
    } catch (err) {
      console.error("Lỗi khi lưu nhà sản xuất:", err);
    }
  };

  const handleEdit = (producer: Producer) => {
    setName(producer.name);
    setStatus(producer.status);
    setEditingProducerId(producer.producer_id);
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xoá nhà sản xuất này?");
    if (!confirm) return;

    try {
      await deleteProducer(id);
      alert("Xoá thành công!");
      fetchProducers();
    } catch (err) {
      console.error("Lỗi khi xoá nhà sản xuất:", err);
    }
  };

  const resetForm = () => {
    setName("");
    setStatus("active");
    setEditingProducerId(null);
  };

  return (
    <div className="container mt-4">
      <h3>Quản lý Nhà Sản Xuất</h3>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Tên nhà sản xuất</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Trạng thái</label>
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="active">Hoạt động</option>
            <option value="inactive">Ngưng hoạt động</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary me-2">
          {editingProducerId ? "Cập nhật" : "Thêm mới"}
        </button>
        {editingProducerId && (
          <button type="button" className="btn btn-secondary" onClick={resetForm}>
            Huỷ
          </button>
        )}
      </form>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {producers.map((p) => (
            <tr key={p.producer_id}>
              <td>{p.producer_id}</td>
              <td>{p.name}</td>
              <td>{p.status === "active" ? "Hoạt động" : "Ngưng hoạt động"}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleEdit(p)}
                  className="me-2"
                >
                  Sửa
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(p.producer_id)}
                >
                  Xoá
                </Button>
              </td>
            </tr>
          ))}
          {producers.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center">
                Không có nhà sản xuất nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProducerManagement;
