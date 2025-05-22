import React, { useEffect, useState } from "react";
import {
  getVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher,
} from "../../../../services/voucher";
import { Voucher } from "../../../../types/voucher";

const VoucherManagement: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [form, setForm] = useState({
    code: "",
    value: "",
    min_order_value: 0,
    exprired_time: "",
    description: "",
    status: "active",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const data = await getVouchers();
      setVouchers(data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách voucher:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in form) {
      formData.append(key, (form as any)[key]);
    }

    try {
      if (editingId) {
        await updateVoucher(editingId, formData);
        alert("Cập nhật voucher thành công!");
      } else {
        await createVoucher(formData);
        alert("Thêm voucher thành công!");
      }
      resetForm();
      fetchVouchers();
    } catch (err) {
      console.error("Lỗi khi lưu voucher:", err);
    }
  };

  const handleEdit = (voucher: Voucher) => {
    setForm({ ...voucher });
    setEditingId(voucher.voucher_id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá voucher này?")) return;
    try {
      await deleteVoucher(id);
      alert("Xoá voucher thành công!");
      fetchVouchers();
    } catch (err) {
      console.error("Lỗi khi xoá voucher:", err);
    }
  };

  const resetForm = () => {
    setForm({
      code: "",
      value: "",
      min_order_value: 0,
      exprired_time: "",
      description: "",
      status: "active",
    });
    setEditingId(null);
  };

  return (
    <div className="container mt-4">
      <h3>Quản lý Mã Giảm Giá</h3>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Mã</label>
            <input type="text" name="code" className="form-control" value={form.code} onChange={handleChange} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Giá trị</label>
            <input type="text" name="value" className="form-control" value={form.value} onChange={handleChange} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Giá trị đơn tối thiểu</label>
            <input
              type="number"
              name="min_order_value"
              className="form-control"
              value={form.min_order_value}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Ngày hết hạn</label>
            <input type="date" name="exprired_time" className="form-control" value={form.exprired_time} onChange={handleChange} required />
          </div>
          <div className="col-md-8">
            <label className="form-label">Mô tả</label>
            <textarea name="description" className="form-control" value={form.description} onChange={handleChange} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Trạng thái</label>
            <select name="status" className="form-select" value={form.status} onChange={handleChange}>
              <option value="active">Hoạt động</option>
              <option value="inactive">Ngưng hoạt động</option>
            </select>
          </div>
        </div>

        <div className="mt-3">
          <button type="submit" className="btn btn-primary me-2">
            {editingId ? "Cập nhật" : "Thêm mới"}
          </button>
          {editingId && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Huỷ
            </button>
          )}
        </div>
      </form>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Mã</th>
            <th>Giá trị</th>
            <th>Giá trị tối thiểu</th>
            <th>Hết hạn</th>
            <th>Mô tả</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((v) => (
            <tr key={v.voucher_id}>
              <td>{v.code}</td>
              <td>{v.value}</td>
              <td>{v.min_order_value.toLocaleString()} đ</td>
              <td>{new Date(v.exprired_time).toLocaleDateString()}</td>
              <td>{v.description}</td>
              <td>{v.status === "active" ? "Hoạt động" : "Ngưng hoạt động"}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(v)}>
                  Sửa
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(v.voucher_id)}>
                  Xoá
                </button>
              </td>
            </tr>
          ))}
          {vouchers.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center">
                Không có mã giảm giá nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VoucherManagement;
