import React from "react";
import ProductUpdate from "../../../../components/sections/admin/Product/update/[id]/page";
import { useParams } from "react-router-dom";

const UpdateProductPage: React.FC = () => {
    const { id } = useParams();
    return (
        <div className="section">
            <header className="container">
                <div className="row">
                    <div className="col-md-12">
                        <ProductUpdate id={id ?? ""}  />
                    </div>
                </div>
            </header>
        </div>
    )
}

export default UpdateProductPage;