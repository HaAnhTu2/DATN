import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { getVouchers } from "../../../../services/voucherService";
import { Voucher } from "../../../../types/voucher";

const VoucherList: React.FC = () => {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const res = await getVouchers();
                setVouchers(res);
            } catch (err) {
                console.error("Lỗi khi lấy voucher:", err);
            }
        };
        fetchVouchers();
    }, []);

    return (
        <Row>
            {vouchers.map((voucher) => (
                <Col md={6} lg={4} key={voucher.voucher_id} className="mb-3">
                    <Card>
                        <Card.Body>
                            <Card.Title>{voucher.code}</Card.Title>
                            <Card.Text>{voucher.description}</Card.Text>
                            <Card.Text>
                                Giảm: {voucher.value}%<br />
                                Đơn tối thiểu: {voucher.min_order_value}đ<br />
                                Hết hạn: {new Date(voucher.exprired_time).toLocaleDateString()}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default VoucherList;
