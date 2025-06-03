import React, { useEffect, useState } from "react";
import { ProductDetail } from "../../../../types/product";
import { getProductDetailsByProductId, deleteProductDetail } from "../../../../services/productService";
import { useNavigate } from "react-router-dom";
import { Button, Col, Row } from "react-bootstrap";

interface ProductDetailListProps {
  id: string;
}

const ProductDetailList: React.FC<ProductDetailListProps> = ({ id }) => {
  const [details, setDetails] = useState<ProductDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getProductDetailsByProductId(id);
        setDetails(Array.isArray(data) ? data : data.details || []);
      } catch (err) {
        console.error(err);
        setError("Không thể tải chi tiết sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id]);

  const handleCreate = () => {
    navigate(`/productdetail/create/${id}`);
  };

  const handleUpdateClick = (detailId: string) => {
    navigate(`/productdetail/update/${detailId}`);
  };

  const handleDeleteClick = async (detailId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá chi tiết này không?")) return;

    try {
      await deleteProductDetail(detailId);
      setDetails(details.filter((item) => item.product_detail_id !== detailId));
    } catch (err) {
      console.error(err);
      alert("Xoá thất bại.");
    }
  };

  if (loading) return <p>Đang tải chi tiết sản phẩm...</p>;
  if (error) return <p>{error}</p>;
  if (details.length === 0) return <p>Không có chi tiết sản phẩm nào.</p>;

  return (
    <div className="card mt-3 p-3 shadow-sm">
      <Row className="mb-3 align-items-center">
        <Col md={4}>
          <h4>Chi tiết sản phẩm</h4>
        </Col>
        <Col md={5}></Col>
        <Col md={3} className="text-md-end mt-2 mt-md-0">
          <Button variant="primary" onClick={handleCreate}>
            Tạo chi tiết sản phẩm
          </Button>
        </Col>
      </Row>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Màu sắc</th>
            <th>Kích cỡ</th>
            <th>Số lượng</th>
            <th>Giá</th>
            <th>Trạng thái</th>
            <th>Ảnh</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {details.map((detail) => (
            <tr key={detail.product_detail_id}>
              <td>{detail.color}</td>
              <td>{detail.size}</td>
              <td>{detail.quantity}</td>
              <td>{detail.price.toLocaleString()}₫</td>
              <td>{detail.status === "instock" ? "Còn hàng" : "Hết hàng"}</td>
              <td>
                {detail.image ? (
                  <img
                    src={`http://localhost:3000/image/${detail.image}`}
                    alt="Product"
                    width="60"
                  />
                ) : (
                  "Không có ảnh"
                )}
              </td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleUpdateClick(detail.product_detail_id)}
                  className="me-2"
                >
                  Sửa
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDeleteClick(detail.product_detail_id)}
                >
                  Xoá
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductDetailList;
