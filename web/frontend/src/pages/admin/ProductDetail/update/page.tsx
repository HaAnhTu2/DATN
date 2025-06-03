import React from "react";
import { useParams } from "react-router-dom";
import UpdateProductDetail from "../../../../components/sections/admin/ProductDetail/update/[id]/page";

const UpdateProductDetailPage: React.FC = () => {
    const { id } = useParams();
    console.log("id: ",id);
    
    return (
        <div className="section">
            <header className="container">
                <div className="row">
                    <div className="col-md-12">
                        <UpdateProductDetail id={id ?? ""}  />
                    </div>
                </div>
            </header>
        </div>
    )
}

export default UpdateProductDetailPage;