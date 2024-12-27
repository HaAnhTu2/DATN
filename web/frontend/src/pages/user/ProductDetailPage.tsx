import React, { useState } from "react";
import ProductDetail from "../../components/sections/user/ProductDetail";
import { Product } from "../../types/product";

const DetailProductPage: React.FC = () => {
    const [, setDetailProduct] = useState<Product | null>(null);

    return (
        <div className="App">
            <header className="App-header">
                <ProductDetail setDetailProduct={setDetailProduct} />
            </header>
        </div>
    );
};

export default DetailProductPage;
