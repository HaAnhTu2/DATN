import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "../../../../../../services/userService";
import { User } from "../../../../../../types/user";

interface UpdateUserProps {
  id: string;
}

export default function UserUpdate({ id }: UpdateUserProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    birthday: "",
    gender: "",
    status: "",
  });

  useEffect(() => {
    if (id) {
      getUserById(id)
        .then((data) => {
          setUser(data);

          setFormData({
            email: data.email || "",
            password: data.password || "",
            birthday: data.birthday || "",
            gender: data.gender || "",
            status: data.status || "",
          });
        })
        .catch((err) => console.error("Error fetching user:", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateUser(user.user_id, { ...user, ...formData });
      alert("✅ Cập nhật người dùng thành công!");
      navigate("/update/user");
    } catch (err) {
      console.error("❌ Lỗi cập nhật:", err);
    }
  };

  if (loading) return <div>Đang tải dữ liệu người dùng...</div>;
  if (!user) return <div>Không tìm thấy người dùng.</div>;

  return (
    <div className="d-flex justify-content-center">
      <form onSubmit={handleSubmit} className="m-3" style={{ width: "400px" }}>
        <h4 className="mb-4">Cập nhật người dùng</h4>

        <div className="mb-3">
          <label>Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="text"
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>Giới tính</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">-- Chọn giới tính --</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Ngày sinh</label>
          <input
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            type="date"
            className="form-control"
            required
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
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary me-2">
          Cập nhật
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/update/user")}
        >
          Quay lại
        </button>
      </form>
    </div>
  );
};
