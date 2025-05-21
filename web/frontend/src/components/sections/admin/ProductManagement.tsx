import React, { useEffect, useState } from "react";
import { Form, Row, Card, Table, Button, Alert } from 'react-bootstrap';
import { getProducts, deleteProduct, getProductDetailsByProductId } from "../../../services/productService";
import { Product, ProductDetail } from "../../../types/product";
import { useNavigate } from "react-router-dom";


interface ProductManagementProps {
    setFormProduct: (product: Product) => void;
}

const ProductManagement: React.FC<ProductManagementProps> = ({ setFormProduct }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [productDetail, setProductDetail] = useState<ProductDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const fetchedProducts = await getProducts();
                setProducts(fetchedProducts);
                setLoading(false);
            } catch (error) {
                console.log('Error fetching products:', error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);
    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                if (products.length === 0) return;

                const detailPromises = products.map(product =>
                    getProductDetailsByProductId(product.product_id)
                );
                const detailResults = await Promise.all(detailPromises);

                const allDetails = detailResults.flat();

                setProductDetail(allDetails);
                setLoading(false);
            } catch (error) {
                console.log('Error fetching product details:', error);
                setLoading(false);
            }
        };

        fetchProductDetail();
    }, [products]);
    console.log("ergfewrg",productDetail);
    console.log("ergfewrg",products);


    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <div>Loading...</div>
            </div>
        );
    }
    const handleCreateClick = () => {
        navigate(`/create/product`);
    };
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const handleUpdateProduct = (product: Product) => {
        setFormProduct(product);
    };

    const handleDeleteProduct = async (id: string) => {
        try {
            await deleteProduct(id);
            setProducts(products.filter(product => product.product_id !== id));
            setNotificationMessage('Product deleted successfully!');
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
            }, 3000);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    return (
        <div>
            <Row className="mb-4">
                <h4 className="mb-0">Product List</h4>
                <div>
                    {/* Search Form */}
                    <Form className="d-flex align-items-center" style={{ margin: '10px' }}>
                        <Form.Control type="search" placeholder="Search" value={searchTerm} onChange={handleSearch} />
                    </Form>
                </div>
                <Button onClick={handleCreateClick}>
                    <span>Create Product</span>
                </Button>
            </Row>
            {showNotification && (
                <Alert variant="success" onClose={() => setShowNotification(false)} dismissible>
                    {notificationMessage}
                </Alert>
            )}
            <Card className="shadow-sm">
                <Card.Body>
                    <Table striped bordered hover responsive>
                        <thead className="table-light">
                            <tr>
                                <th>Product Name</th>
                                <th>Brand</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Image</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => {
                                const relatedDetails = productDetail.filter(
                                    detail => detail && detail.id_product === product.product_id
                                );
                                console.log(relatedDetails);

                                return (

                                    <tr key={product.product_id}>
                                        <td>{product.name}</td>
                                        <td>{product.status}</td>
                                        <td>{product.information}</td>
                                        <td>{product.price}</td>
                                        <td>
                                            {relatedDetails.length > 0 ? (
                                                relatedDetails.map(detail => (
                                                    <img
                                                        key={detail.product_detail_id}
                                                        src={`http://localhost:3000/image/${detail.image}`}
                                                        alt={product.name}
                                                        style={{ width: "100px", height: "auto", marginRight: '5px' }}
                                                    />
                                                ))
                                            ) : (
                                                "No Image"
                                            )}
                                        </td>
                                        <td>{product.description}</td>
                                        <td>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => handleUpdateProduct(product)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                className="ms-2"
                                                onClick={() => handleDeleteProduct(product.product_id)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            })}

                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ProductManagement;
