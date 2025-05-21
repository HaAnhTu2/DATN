import React, { useState } from "react";
import GetProductDetail from "../../../components/sections/user/Product/ProductDetail";
import { Product } from "../../../types/product";

const DetailProductPage: React.FC = () => {
    const [, setDetailProduct] = useState<Product | null>(null);

    return (
        <div className="App">
            <header className="App-header">
                <GetProductDetail setDetailProduct={setDetailProduct} />
            </header>
        </div>
    );
};

export default DetailProductPage;
