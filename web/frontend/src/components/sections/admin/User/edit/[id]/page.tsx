import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "../../../../../../services/userService";
import { User } from "../../../../../../types/user";

const UserUpdate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (id) {
      getUserById(id)
        .then((data) => {
          setUser(data);
          setEmail(data.email);
          setPassword(data.password || "");
          setBirthday(data.birthday);
          setGender(data.gender);
          setStatus(data.status);
        })
        .catch((err) => console.error("Error fetching user:", err));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updatedUser: User = {
      ...user,
      email,
      password,
      birthday,
      gender,
      status,
    };

    try {
      await updateUser(user.user_id, updatedUser);
      alert("User updated successfully!");
      navigate("/update/user");
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="d-flex justify-content-center">
      <form onSubmit={handleSubmit} className="m-3" style={{ width: "400px" }}>
        <div className="mb-3">
          <label>Email</label>
          <input
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="text"
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>Giới tính</label>
          <select
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="form-select"
            required
          >
            <option value="">-- Select Gender --</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">khác</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Ngày sinh</label>
          <input
            name="birthday"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            type="date"
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>Trạng thái</label>
          <select
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="form-select"
            required
          >
            <option value="">-- Select Status --</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoại động</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary me-2">
          Cập Nhật
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

export default UserUpdate;
