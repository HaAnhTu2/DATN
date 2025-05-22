import React from "react";
import { Container } from "react-bootstrap";

const OrderSuccess: React.FC = () => {
  return (
    <Container className="mt-4 text-center">
      <h2>🎉 Đặt hàng thành công!</h2>
      <p>Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ sớm xử lý đơn hàng của bạn.</p>
    </Container>
  );
};

export default OrderSuccess;
