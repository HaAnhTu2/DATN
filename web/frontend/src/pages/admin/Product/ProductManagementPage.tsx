import React from "react";
import ProductManagement from "../../../components/sections/admin/Product/page";

const ProductManagementPage: React.FC = () => {
    return (
        <div className="section">
            <header className="container">
                <div className="row">
                    <div className="col-md-12">
                        <ProductManagement />
                    </div>
                </div>
            </header>
        </div>
    )
}

export default ProductManagementPage;