import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getProductDetailById, updateProductDetail } from "../../../../../../services/productService";

interface UpdateProductDetailProps {
  id: string;
}

export default function UpdateProductDetail({ id }: UpdateProductDetailProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    id_product: "",
    color: "",
    size: "",
    quantity: 0,
    price: 0,
    status: "",
  });

  useEffect(() => {
    if (id) {
      getProductDetailById(id)
        .then((data) => {
          setFormData({
            id_product: data.id_product,
            color: data.color || "",
            size: data.size || "",
            quantity: data.quantity || 0,
            price: data.price || 0,
            status: data.status || "instock",
          });
        })
        .catch((err) => {
          console.error("Error fetching product detail:", err);
          setError("Không thể tải chi tiết sản phẩm");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "price" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const form = new FormData();
      form.append("id_product", formData.id_product);
      form.append("color", formData.color);
      form.append("size", formData.size);
      form.append("quantity", String(formData.quantity));
      form.append("price", String(formData.price));
      form.append("status", formData.status);
      if (imageFile) {
        form.append("image", imageFile);
      }

      await updateProductDetail(id!, form);
      alert("Cập nhật thành công");
      navigate(`/productdetail/${formData.id_product}`);
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại");
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="card p-4">
      <h3 className="mb-3">Cập nhật chi tiết sản phẩm</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Màu sắc</label>
          <input
            type="text"
            name="color"
            className="form-control"
            value={formData.color}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Kích cỡ</label>
          <input
            type="text"
            name="size"
            className="form-control"
            value={formData.size}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Số lượng</label>
          <input
            type="number"
            name="quantity"
            className="form-control"
            value={formData.quantity}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Giá</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Trạng thái</label>
          <select
            name="status"
            className="form-control"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="instock">Còn hàng</option>
            <option value="outstock">Hết hàng</option>
            <option value="Ẩn">Ẩn</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Ảnh sản phẩm (tùy chọn)</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">Cập nhật</button>
      </form>
    </div>
  );
}
