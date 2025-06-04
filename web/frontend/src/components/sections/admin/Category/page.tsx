import React, { useEffect, useState } from "react";
import { getCategories, deleteCategory } from "../../../../services/categoryService";
import { Category } from "../../../../types/category";
import { Row, Card, Table, Button, Form } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const CategoryManagement: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const fetchedCategories = await getCategories();
                setCategories(fetchedCategories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                <span>Loading...</span>
            </div>
        );
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditCategory = (category: Category) => {
        navigate(`/update/category/${category.category_id}`);
    };

    const handleDeleteCategory = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            await deleteCategory(id);
            setCategories(prev => prev.filter(category => category.category_id !== id));
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    return (
        <Row className="mt-4">
            <Card className="w-100 shadow-sm">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="mb-0" style={{ fontSize: '2rem' }}>Quản lý loại sản phẩm</h4>
                        <Button variant="primary" onClick={() => navigate("/create/category")}>
                            Tạo loại sản phẩm
                        </Button>
                    </div>
                    <Form className="mb-3">
                        <Form.Control
                            type="search"
                            placeholder="Tìm tên loại sản phẩm"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </Form>
                    <Table responsive bordered hover className="text-nowrap align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Tên</th>
                                <th>Trạng thái</th>
                                <th style={{ width: "140px" }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategories.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="text-center text-muted">
                                        Không tìm thấy loại sản phẩm nào.
                                    </td>
                                </tr>
                            ) : (
                                filteredCategories.map(category => (
                                    <tr key={category.category_id}>
                                        <td>{category.name}</td>
                                        <td>{category.status==="active"? "Hoạt động": "Ngưng hoạt động"}</td>
                                        <td>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => handleEditCategory(category)}
                                                className="me-2"
                                            >
                                                Sửa
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDeleteCategory(category.category_id)}
                                            >
                                                Xoá
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Row>
    );
};

export default CategoryManagement;
