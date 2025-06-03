import React from "react";
import { useParams } from "react-router-dom";
import OrderUser from "../../../components/sections/user/Order/Order";

const OrderUserPage: React.FC = () => {
    const { id } = useParams();

    return (
        <div className="section">
            <header className="container">
                <div className="row">
                    <div className="col-md-12">
                        <OrderUser id={id ?? ""}  />
                    </div>
                </div>
            </header>
        </div>
    )
}

export default OrderUserPage;