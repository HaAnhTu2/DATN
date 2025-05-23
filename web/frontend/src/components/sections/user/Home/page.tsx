import React, { useEffect, useState } from "react";
import { Card, Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import { getProductDetailsByProductId, getProducts } from "../../../../services/productService";
import { Product, ProductDetail } from "../../../../types/product";
import { useNavigate } from "react-router-dom";

const UserHome: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        if (products.length === 0) return;

        const validProducts = products.filter(p => p.product_id);
        const detailPromises = validProducts.map(p => getProductDetailsByProductId(p.product_id));
        const detailResults = await Promise.all(detailPromises);

        const allDetails = detailResults.flatMap(res => res.details);
        setProductDetails(allDetails);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };
    fetchProductDetails();
  }, [products]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDetailClick = (id: string) => {
    navigate(`/product/${id}`);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container my-4">
      <Form className="mb-4">
        <Form.Control
          type="search"
          placeholder="Tìm sản phẩm..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </Form>

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {filteredProducts.length === 0 ? (
          <p>Không tìm thấy sản phẩm nào.</p>
        ) : (
          filteredProducts.map(product => {
            const detail = productDetails.find(d => d.id_product === product.product_id);
            const imageUrl = detail ? `http://localhost:3000/image/${detail.image}` : null;

            return (
              <Col key={product.product_id}>
                <Card className="h-100 shadow-sm">
                  {imageUrl ? (
                    <Card.Img variant="top" src={imageUrl} alt={product.name} style={{ height: 400, objectFit: 'cover' }} />
                  ) : (
                    <div style={{ height: 200, backgroundColor: '#eee', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#999' }}>
                      Không tìm thấy ảnh
                    </div>
                  )}
                  <Card.Body className="d-flex flex-column">
                    <Card.Title
                      onClick={() => handleDetailClick(product.product_id)}
                      style={{ cursor: 'pointer', fontSize: '20px' }}
                      className="text-primary"
                    >
                      {product.name || "No Name"}
                    </Card.Title>
                    <Card.Text className="text-muted mb-2" style={{ fontSize: '12px' }}>{product.description || "No Description"}</Card.Text>
                    <Card.Text className="fw-bold mb-2" style={{ fontSize: '14px' }}>{product.price ?? "No Price"} đ</Card.Text>
                    <div className="mt-auto d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="lg"
                        onClick={() => handleDetailClick(product.product_id)}
                        className="flex-fill"
                      >
                        <i className="fa fa-eye me-1"></i> chi tiết
                      </Button>
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => handleDetailClick(product.product_id)}
                        className="flex-fill"
                      >
                        <i className="fa fa-shopping-cart me-1"></i> Thêm vào giỏ hàng
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        )}
      </Row>
    </div>
  );
};

export default UserHome;
