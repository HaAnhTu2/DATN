import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducerById, updateProducer } from "../../../../../services/producerService";
import { Producer } from "../../../../../types/producer";
interface UpdateProducerProps {
    id: string;
}

export default function ProducerUpdate({ id }: UpdateProducerProps) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Producer>({
        producer_id: id,
        name: "",
        status: "active",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const fetchProducer = async () => {
            try {
                const data = await getProducerById(id);
                setFormData(data);
            } catch (err) {
                alert("Không thể tải thông tin nhà sản xuất!");
            }
        };

        fetchProducer();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const form = new FormData();
        form.append("name", formData.name);
        form.append("status", formData.status);

        try {
            await updateProducer(id, form);
            alert("Cập nhật thành công!");
            navigate("/producers");
        } catch (err) {
            alert("Cập nhật thất bại!");
        }
    };

    return (
        <div className="d-flex ps-3">
            <form onSubmit={handleSubmit} className="m-3" style={{ width: "400px" }}>
                <h4 className="mb-4">Cập nhật nhà sản xuất</h4>
                <div className="mb-3">
                    <label>Tên nhà sản xuất</label>
                    <input
                        type="text"
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
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-primary me-2">Cập nhật</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate("/update/producer")}>Quay lại</button>
            </form>
        </div>
    );
}
