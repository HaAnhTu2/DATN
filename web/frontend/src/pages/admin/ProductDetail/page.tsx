import React, { useState } from "react";
import ProductDetailList from "../../../components/sections/admin/ProductDetail/page";
import { useParams } from "react-router-dom";

const ProductDetailPage: React.FC = () => {
    const { id } = useParams();
    
    return (
        <div className="section">
            <header className="container">
                <div className="row">
                    <div className="col-md-12">
                        <ProductDetailList id={id}  />
                    </div>
                </div>
            </header>
        </div>
    )
}

export default ProductDetailPage;