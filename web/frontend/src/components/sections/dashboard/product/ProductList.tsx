import React, { useEffect, useState } from "react";
import { Form, Row, Card, Table, Button, Alert } from 'react-bootstrap';
import { getProducts, deleteProduct } from "../../../../api/product";
import { Product } from "../../../../type/product";
import { useNavigate } from "react-router-dom";


interface ProductListProps {
    setFormProduct: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ setFormProduct }) => {
    const [products, setProducts] = useState<Product[]>([]);
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
        product.productname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const handleUpdateProduct = (product: Product) => {
        setFormProduct(product);
    };

    const handleDeleteProduct = async (id: string) => {
        try {
            await deleteProduct(id);
            setProducts(products.filter(product => product._id !== id));
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
                            {filteredProducts.map(product => (
                                <tr key={product._id}>
                                    <td>{product.productname}</td>
                                    <td>{product.brand}</td>
                                    <td>{product.quantity}</td>
                                    <td>{product.price}</td>
                                    <td>
                                        {product.productimage_url ? (
                                            <img
                                                src={`http://localhost:3000/image2/${product.productimage_url}`}
                                                alt={product.productname}
                                                style={{ width: "100px", height: "auto" }}
                                            />
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
                                            onClick={() => handleDeleteProduct(product._id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ProductList;
