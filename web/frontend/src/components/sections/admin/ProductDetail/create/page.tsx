"use client";

import React, { ChangeEvent, useState } from "react";
import { createProductDetail } from "../../../../../services/productService";
import { useNavigate } from "react-router-dom";

interface CreateProductDetailFormProps {
  id: string ;
}

export default function CreateProductDetail({ id }: CreateProductDetailFormProps) {
  const navigate = useNavigate();

  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState("instock");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("color", color);
    formData.append("size", size);
    formData.append("quantity", quantity.toString());
    formData.append("price", price.toString());
    if (image) {
      formData.append("image", image);
    }
    formData.append("status", status);

    console.log(id);
    

    try {
      const res = await createProductDetail(id, formData); // ✅ đã sửa hàm gọi API
      console.log("Created:", res);
      navigate(`/productdetail/${id}`);
    } catch (err: any) {
      console.error(err);
      setError("Tạo chi tiết sản phẩm thất bại.");
    } finally {
      setLoading(false);
    }
  };

      const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
          const files = event.target.files;
          if (files && files.length > 0) {
              setImage(files[0]);
          }
      };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Tạo chi tiết sản phẩm</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Màu sắc</label>
          <input
            type="text"
            className="form-control"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Kích cỡ</label>
          <input
            type="text"
            className="form-control"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Trạng thái</label>
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="instock">Còn hàng</option>
            <option value="outofstock">Hết hàng</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Số lượng</label>
          <input
            type="number"
            className="form-control"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
            min={1}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Giá (VNĐ)</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            min={0}
          />
        </div>

        <div className="mb-3">
          <label>Ảnh:</label>
          <input type="file" className="form-control mb-3" accept="image/*" onChange={handleImageChange} required />
          <div className="col-auto">
            <button type="submit" className="btn btn-outline-dark" style={{ margin: '10px' }}>{'Tạo chi tiết sản phẩm'}</button>

          </div>
        </div>
      </form>
    </div>
  );
}
