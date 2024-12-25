import React, { useState } from "react";
import { Product } from "../../type/product";
import UpdateFormProduct from "../../components/sections/dashboard/product/Update";
import ProductList from "../../components/sections/dashboard/product/ProductList";

const UpdateProductPage: React.FC = () => {
    const [, setProducts] = useState<Product[]>([]);
    const [message, setMessage] = useState('');
    const [productToEdit, setProductToEdit] = useState<Product | undefined>(undefined);
    const handleSetFormProduct = (product: Product) => {
        setProductToEdit(product);
    };
    return (
        <div className="section">
            <header className="container">
                <div className="row">
                    <div className="col-md-12">
                        {productToEdit ? (
                            <UpdateFormProduct setProducts={setProducts}
                                setMessage={setMessage}
                                productToEdit={productToEdit} />
                        ) : (
                            <p>{message}</p>
                        )}
                        <div><ProductList setFormProduct={handleSetFormProduct} /></div>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default UpdateProductPage;