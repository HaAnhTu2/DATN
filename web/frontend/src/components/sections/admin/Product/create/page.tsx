import React, { ChangeEvent, useEffect, useState } from "react";
import { Product } from "../../../../../types/product";
import { createProduct } from "../../../../../services/productService";
import { Category } from "../../../../../types/category";
import { getCategories } from "../../../../../services/categoryService";
import { Producer } from "../../../../../types/producer";
import { getAllProducers } from "../../../../../services/producerService";
import { useNavigate } from "react-router-dom";

interface CreateFormProductProps {
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
}

const CreateFormProduct: React.FC<CreateFormProductProps> = ({ setProducts, setMessage }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [producers, setProducers] = useState<Producer[]>([]);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [idCategory, setIdCategory] = useState('');
    const [idProducer, setIdProducer] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [information, setInformation] = useState('');
    const [status, setStatus] = useState('');

    const [color, setColor] = useState('');
    const [size, setSize] = useState('');
    const [statusDetail, setStatusDetail] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);
    const [priceDetail, setPriceDetail] = useState(0);
    const [image, setImage] = useState<File | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [fetchedCategories, fetchedProducers] = await Promise.all([
                    getCategories(),
                    getAllProducers()
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

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setImage(files[0]);
        }
    };

    const handleCreateProduct = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const formData = new FormData();
            formData.append("id_category", idCategory);
            formData.append("id_producer", idProducer);
            formData.append("name", name);
            formData.append("description", description);
            formData.append("information", information);
            formData.append("status", status);

            formData.append("color", color);
            formData.append("size", size);
            formData.append("status_detail", statusDetail);
            formData.append("quantity", quantity.toString());
            formData.append("price", price.toString());
            formData.append("price_detail", priceDetail.toString());

            if (image) {
                formData.append("image", image);
            }

            const created = await createProduct(formData);
            setMessage("Tạo sản phẩm thành công");
            navigate(`/update/product`);
            setProducts(prev => [...prev, created]);

            // Reset form
            setIdCategory('');
            setIdProducer('');
            setName('');
            setDescription('');
            setInformation('');
            setStatus('');
            setColor('');
            setSize('');
            setStatusDetail('');
            setQuantity(0);
            setPrice(0);
            setPriceDetail(0);
            setImage(null);

        } catch (error) {
            console.error(error);
            setMessage("Tạo sản phẩm thất bại");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <form onSubmit={handleCreateProduct} className="row justify-content-center">
            <div className="col-lg-6">
                <div className="card shadow p-4">
                    <h4 className="mb-3">Tạo sản phẩm</h4>
                    <label>Loại sản phẩm:</label>
                    <select className="form-control mb-2" value={idCategory} onChange={(e) => setIdCategory(e.target.value)} required>
                        <option value="">Chọn Loại sản phẩm</option>
                        {categories.map((cat) => (
                            <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                        ))}
                    </select>

                    <label>Nhà sản xuất:</label>
                    <select className="form-control mb-2" value={idProducer} onChange={(e) => setIdProducer(e.target.value)} required>
                        <option value="">Chọn nhà sản xuất</option>
                        {producers.map((producer) => (
                            <option key={producer.producer_id} value={producer.producer_id}>{producer.name}</option>
                        ))}
                    </select>

                    <label>Tên sản phẩm:</label>
                    <input type="text" className="form-control mb-2" value={name} onChange={(e) => setName(e.target.value)} required />

                    <label>Miêu tả:</label>
                    <input type="text" className="form-control mb-2" value={description} onChange={(e) => setDescription(e.target.value)} required />

                    <label>Thông tin sản phẩm:</label>
                    <textarea className="form-control mb-2" value={information} onChange={(e) => setInformation(e.target.value)} required />

                    <label>Trạng thái</label>
                    <select
                        name="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="form-select"
                        required
                    >
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Không hoại động</option>
                    </select>

                    <label>Màu sắc:</label>
                    <input type="text" className="form-control mb-2" value={color} onChange={(e) => setColor(e.target.value)} required />

                    <label>Kích thước:</label>
                    <input type="text" className="form-control mb-2" value={size} onChange={(e) => setSize(e.target.value)} required />

                    <label>Trạng thái của chi tiết sản phẩm:</label>
                    <select
                        name="status_detail"
                        value={statusDetail}
                        onChange={(e) => setStatusDetail(e.target.value)}
                        className="form-select"
                        required
                    >
                        <option value="instock">Còn hàng</option>
                        <option value="outstock">Hết hàng</option>
                    </select>
                    <label>Số lượng:</label>
                    <input type="number" className="form-control mb-2" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required />

                    <label>Giá:</label>
                    <input type="number" className="form-control mb-2" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />

                    <label>Giá của chi tiết sản phẩm:</label>
                    <input type="number" className="form-control mb-2" value={priceDetail} onChange={(e) => setPriceDetail(Number(e.target.value))} required />

                    <label>Ảnh:</label>
                    <input type="file" className="form-control mb-3" accept="image/*" onChange={handleImageChange} required />
                    <div className="col-auto">
                        <button type="submit" className="btn btn-outline-dark" style={{ margin: '10px' }}>{'Tạo sản phẩm'}</button>

                    </div>

                </div>
            </div>
        </form>
    );
};

export default CreateFormProduct;
