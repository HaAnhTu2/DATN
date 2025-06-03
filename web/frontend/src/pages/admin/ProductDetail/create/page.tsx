import React from "react";
import { useParams } from "react-router-dom";
import CreateProductDetail from "../../../../components/sections/admin/ProductDetail/create/page";

const CreateProductDetailPage: React.FC = () => {
    const { id } = useParams();
    
    return (
        <div className="section">
            <header className="container">
                <div className="row">
                    <div className="col-md-12">
                        <CreateProductDetail id={id ?? ""}  />
                    </div>
                </div>
            </header>
        </div>
    )
}

export default CreateProductDetailPage;