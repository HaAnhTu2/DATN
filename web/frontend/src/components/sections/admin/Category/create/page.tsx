import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCategory } from "../../../../../services/categoryService";

export default function CreateCategory() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    status: "",
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

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("status", formData.status);

      await createCategory(form);
      alert("✅ Tạo loại sản phẩm thành công!");
      navigate("/update/category");
    } catch (error) {
      console.error("❌ Lỗi khi tạo loại sản phẩm:", error);
      alert("❌ Tạo loại sản phẩm thất bại!");
    }
  };

  return (
    <div className="d-flex ps-3">
      <form onSubmit={handleSubmit} className="m-3" style={{ width: "400px" }}>
        <h4 className="mb-4">Tạo loại sản phẩm mới</h4>

        <div className="mb-3">
          <label>Tên loại sản phẩm</label>
          <input
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
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
            <option value="active">Hiển thị</option>
            <option value="inactive">Ẩn</option>
          </select>
        </div>

        <button type="submit" className="btn btn-success me-2">Tạo mới</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate("/update/category")}>Quay lại</button>
      </form>
    </div>
  );
}
