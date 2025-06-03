import React from "react";
import { useParams } from "react-router-dom";
import OrderInfo from "../../../../components/sections/user/Order/[id]/page";

const OrderDetailPage: React.FC = () => {
    const { id } = useParams();

    return (
        <div className="section">
            <header className="container">
                <div className="row">
                    <div className="col-md-12">
                        <OrderInfo id={id ?? ""}  />
                    </div>
                </div>
            </header>
        </div>
    )
}

export default OrderDetailPage;