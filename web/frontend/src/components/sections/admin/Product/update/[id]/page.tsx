import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "../../../../../../types/product";
import { getProductById, updateProduct } from "../../../../../../services/productService";
import { getCategories } from "../../../../../../services/categoryService";
import { getAllProducers } from "../../../../../../services/producerService";
import { Category } from "../../../../../../types/category";
import { Producer } from "../../../../../../types/producer";

interface UpdateProductProps {
  id: string;
}

export default function ProductUpdate({ id }: UpdateProductProps) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [producers, setProducers] = useState<Producer[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [formData, setFormData] = useState({
    id_producer: "",
    id_category: "",
    name: "",
    description: "",
    information: "",
    status: "",
    price: 0,
  });

  useEffect(() => {
    if (id) {
      getProductById(id)
        .then((data) => {
          setProduct(data);
          setFormData({
            id_producer: data.id_producer || "",
            id_category: data.id_category || "",
            name: data.name || "",
            description: data.description || "",
            information: data.information || "",
            status: data.status || "",
            price: data.price || 0,
          });
        })
        .catch((err) => console.error("Error fetching product:", err));
    }
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedCategories, fetchedProducers] = await Promise.all([
          getCategories(),
          getAllProducers(),
        ]);
        setCategories(fetchedCategories);
        setProducers(fetchedProducers);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      await updateProduct(product.product_id, { ...product, ...formData });
      alert("✅ Cập nhật sản phẩm thành công!");
      navigate("/update/product");
    } catch (err) {
      console.error("❌ Lỗi cập nhật sản phẩm:", err);
      alert("❌ Cập nhật thất bại");
    }
  };

  if (loading) return <div>Đang tải dữ liệu sản phẩm...</div>;
  if (!product) return <div>Không tìm thấy sản phẩm.</div>;

  return (
    <div className="d-flex justify-content-center">
      <form onSubmit={handleSubmit} className="m-3" style={{ width: "500px" }}>
        <h4 className="mb-4">Cập nhật sản phẩm</h4>

        <div className="mb-3">
          <label>Nhà sản xuất:</label>
          <select
            className="form-control"
            name="id_producer"
            value={formData.id_producer}
            onChange={handleChange}
            required
          >
            <option value="">Chọn nhà sản xuất</option>
            {producers.map((producer) => (
              <option key={producer.producer_id} value={producer.producer_id}>
                {producer.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Loại sản phẩm:</label>
          <select
            className="form-control"
            name="id_category"
            value={formData.id_category}
            onChange={handleChange}
            required
          >
            <option value="">Chọn loại sản phẩm</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Tên sản phẩm</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>Mô tả</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            rows={3}
          />
        </div>

        <div className="mb-3">
          <label>Thông tin chi tiết</label>
          <textarea
            name="information"
            value={formData.information}
            onChange={handleChange}
            className="form-control"
            rows={3}
          />
        </div>

        <div className="mb-3">
          <label>Trạng thái</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">-- Chọn trạng thái --</option>
            <option value="Còn hàng">Còn hàng</option>
            <option value="Hết hàng">Hết hàng</option>
            <option value="Ẩn">Ẩn</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Giá</label>
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary me-2">
          Cập nhật
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/product")}
        >
          Quay lại
        </button>
      </form>
    </div>
  );
}
