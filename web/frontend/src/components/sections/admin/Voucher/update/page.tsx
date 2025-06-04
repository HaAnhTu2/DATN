import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVoucherById, updateVoucher } from "../../../../../services/voucherService";

interface UpdateVoucherProps {
  id: string;
}

export default function VoucherUpdate({ id }: UpdateVoucherProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    code: "",
    value: "",
    min_order_value: "",
    exprired_time: "",
    description: "",
    status: "active",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getVoucherById(id);
        setFormData({
          code: data.code,
          value: data.value.toString(),
          min_order_value: data.min_order_value.toString(),
          exprired_time: data.exprired_time, // format yyyy-mm-dd
          description: data.description,
          status: data.status,
        });
      } catch (error) {
        console.error("Lỗi khi tải voucher:", error);
        alert("Không thể tải dữ liệu voucher!");
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append("code", formData.code);
    form.append("value", formData.value);
    form.append("min_order_value", formData.min_order_value);
    form.append("exprired_time", formData.exprired_time);
    form.append("description", formData.description);
    form.append("status", formData.status);

    try {
      await updateVoucher(id, form);
      alert("Cập nhật voucher thành công!");
      navigate("/update/voucher");
    } catch (error) {
      console.error("Cập nhật thất bại:", error);
      alert("Cập nhật voucher thất bại!");
    }
  };

  return (
    <div className="d-flex ps-3">
      <form onSubmit={handleSubmit} className="m-3" style={{ width: "500px" }}>
        <h4 className="mb-4">Cập nhật mã giảm giá</h4>
        <div className="mb-3">
          <label>Mã giảm giá</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>Giá trị giảm (%)</label>
          <input
            type="number"
            name="value"
            value={formData.value.replace('%', '')}
            onChange={handleChange}
            className="form-control"
            required
            min={0}
            max={100}
          />
        </div>

        <div className="mb-3">
          <label>Giá trị đơn hàng tối thiểu</label>
          <input
            type="number"
            name="min_order_value"
            value={formData.min_order_value}
            onChange={handleChange}
            className="form-control"
            required
            min={0}
          />
        </div>

        <div className="mb-3">
          <label>Hạn sử dụng</label>
          <input
            type="date"
            name="exprired_time"
            value={formData.exprired_time}
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
          <label>Trạng thái</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary me-2">Cập nhật</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate("/update/voucher")}>
          Quay lại
        </button>
      </form>
    </div>
  );
}
