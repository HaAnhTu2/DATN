import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategoryById, updateCategory } from "../../../../../services/categoryService";
import { Category } from "../../../../../types/category";

interface UpdateCategoryProps {
  id: string;
}

export default function UpdateCategory({ id }: UpdateCategoryProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    status: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getCategoryById(id)
        .then((category: Category) => {
          setFormData({
            name: category.name,
            status: category.status,
          });
        })
        .catch((err) => {
          console.error("❌ Lỗi khi lấy category:", err);
          alert("Không tìm thấy loại sản phẩm!");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

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

      await updateCategory(id, form);
      alert("✅ Cập nhật thành công!");
      navigate("/category");
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật:", error);
      alert("❌ Cập nhật thất bại!");
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="d-flex justify-content-center">
      <form onSubmit={handleSubmit} className="m-3" style={{ width: "400px" }}>
        <h4 className="mb-4">Cập nhật loại sản phẩm</h4>

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
            <option value="Hiển thị">Hiển thị</option>
            <option value="Ẩn">Ẩn</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary me-2">Cập nhật</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate("/category")}>Quay lại</button>
      </form>
    </div>
  );
}
