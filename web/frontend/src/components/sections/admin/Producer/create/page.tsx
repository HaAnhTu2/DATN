import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProducer } from "../../../../../services/producerService";

export default function ProducerCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    status: "active", // mặc định
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newProducer = new FormData();
    newProducer.append("name", formData.name);
    newProducer.append("status", formData.status);

    try {
      await createProducer(newProducer);
      alert("Tạo nhà sản xuất thành công!");
      navigate("/producers");
    } catch (error) {
      alert("Tạo nhà sản xuất thất bại!");
      console.error(error);
    }
  };

  return (
    <div className="d-flex ps-3">
      <form onSubmit={handleSubmit} className="m-3" style={{ width: "400px" }}>
        <h4 className="mb-4">Tạo nhà sản xuất mới</h4>
        <div className="mb-3">
          <label>Tên nhà sản xuất</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label>Trạng thái</label>
          <select
            name="status"
            className="form-select"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn trạng thái --</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>

        <button type="submit" className="btn btn-success me-2">Tạo mới</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate("/update/producer")}>Quay lại</button>
      </form>
    </div>
  );
}
