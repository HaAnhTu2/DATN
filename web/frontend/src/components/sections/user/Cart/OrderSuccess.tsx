import React from "react";
import { Modal, Button } from "react-bootstrap";

interface OrderSuccessProps {
  show: boolean;
  onHide: () => void;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ show, onHide }) => (
  <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>Đặt hàng thành công</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng sớm nhất có thể!
    </Modal.Body>
    <Modal.Footer>
      <Button variant="success" onClick={onHide}>Đóng</Button>
    </Modal.Footer>
  </Modal>
);

export default OrderSuccess;
