import React, { useEffect, useState } from "react";
import { Form, Row, Col, Card, Table, Button, Alert, InputGroup } from 'react-bootstrap';
import { getProducts, deleteProduct, getProductDetailsByProductId } from "../../../../services/productService";
import { Product, ProductDetail } from "../../../../types/product";
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
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (products.length === 0) return;
      try {
        const validProducts = products.filter(product => !!product.product_id);
        const detailPromises = validProducts.map(product => getProductDetailsByProductId(product.product_id));
        const detailResults = await Promise.all(detailPromises);
        const allDetails = detailResults.flatMap(item => item.details);
        setProductDetail(allDetails);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };
    fetchProductDetail();
  }, [products]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
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
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Hàm helper lấy image detail theo product_id
  const getProductImage = (productId: string) => {
    const detail = productDetail.find(detail => detail.id_product === productId);
    if (detail && detail.image) {
      return `http://localhost:3000/image/${detail.image}`;
    }
    return null;
  };

  return (
    <div>
      <Row className="mb-3 align-items-center">
        <Col md={4}>
          <h4>Product List</h4>
        </Col>
        <Col md={5}>
          <InputGroup>
            <Form.Control
              type="search"
              placeholder="Search products"
              value={searchTerm}
              onChange={handleSearch}
            />
          </InputGroup>
        </Col>
        <Col md={3} className="text-md-end mt-2 mt-md-0">
          <Button variant="primary" onClick={handleCreateClick}>
            Create Product
          </Button>
        </Col>
      </Row>

      {showNotification && (
        <Alert variant="success" onClose={() => setShowNotification(false)} dismissible>
          {notificationMessage}
        </Alert>
      )}

      <Card className="shadow-sm">
        <Card.Body>
          <Table striped bordered hover responsive className="align-middle text-center">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Information</th>
                <th>Price</th>
                <th>Image</th>
                <th>Description</th>
                <th style={{ minWidth: '140px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7}>No products found</td>
                </tr>
              )}
              {filteredProducts.map(product => (
                <tr key={product.product_id}>
                  <td>{product.name}</td>
                  <td>{product.status}</td>
                  <td>{product.information}</td>
                  <td>{product.price.toLocaleString()} VND</td>
                  <td>
                    {getProductImage(product.product_id) ? (
                      <img
                        src={getProductImage(product.product_id)!}
                        alt={product.name}
                        style={{ width: "100px", height: "auto", borderRadius: '5px' }}
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td>{product.description}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleUpdateProduct(product)}
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.product_id)}
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

export default ProductManagement;
