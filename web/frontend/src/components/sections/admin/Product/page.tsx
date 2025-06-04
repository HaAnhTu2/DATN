import React, { useEffect, useState } from "react";
import { Form, Row, Col, Card, Table, Button, InputGroup } from 'react-bootstrap';
import { getProducts, deleteProduct, getProductDetailsByProductId } from "../../../../services/productService";
import { Product, ProductDetail } from "../../../../types/product";
import { useNavigate } from "react-router-dom";

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productDetail, setProductDetail] = useState<ProductDetail[]>([]);
  const [loading, setLoading] = useState(true);
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
  const handleProductDetailClick = (product: Product) => {
    navigate(`/productdetail/${product.product_id}`);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateProduct = (product: Product) => {
    navigate(`/update/product/${product.product_id}`);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter(product => product.product_id !== id));
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
          <h4 style={{ fontSize: '2rem' }}>Quản lý sản phẩm</h4>
        </Col>
        <Col md={5}>
          <InputGroup>
            <Form.Control
              type="search"
              placeholder="Tìm sản phẩm"
              value={searchTerm}
              onChange={handleSearch}
            />
          </InputGroup>
        </Col>
        <Col md={3} className="text-md-end mt-2 mt-md-0">
          <Button variant="primary" onClick={handleCreateClick}>
            Tạo sản phẩm
          </Button>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Body>
          <Table striped bordered hover responsive className="align-middle text-center">
            <thead className="table-light">
              <tr>
                <th style={{ width: '200px' }}>Tên sản phẩm</th>
                <th>Trạng thái</th>
                <th style={{ width: '300px' }}>Thông tin</th>
                <th>Giá</th>
                <th>Ảnh</th>
                <th>Mô tả</th>
                <th style={{ minWidth: '140px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts?.length === 0 && (
                <tr>
                  <td colSpan={7}>Không tìm thấy sản phẩm nào.</td>
                </tr>
              )}
              {filteredProducts?.map(product => (
                <tr key={product.product_id}>
                  <td>{product.name}</td>
                  <td>{product.status === "active" ? "Hoạt động" : "Ngưng hoạt động"}</td>
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
                      <span>không có ảnh</span>
                    )}
                  </td>
                  <td>{product.description}</td>
                  <td>
                    <Button
                      variant="outline-info"
                      size="sm"
                      onClick={() => handleProductDetailClick(product)}
                      className="me-2"
                    >
                      Chi tiết sản phẩm
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleUpdateProduct(product)}
                      className="me-2"
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.product_id)}
                    >
                      Xoá
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
