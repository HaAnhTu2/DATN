// src/pages/DetailProduct.tsx
import React, { useState } from "react";
import ProductDetail from "../../components/sections/dashboard/product/Detail";
import { Product } from "../../type/product";
// import '../../styles/theme.scss';

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
