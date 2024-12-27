import React, { useState } from "react";
import { Product } from "../../types/product";
import UpdateFormProduct from "../../components/form/product/Update";
import ProductManagement from "../../components/sections/admin/ProductManagement";

const ProductManagementPage: React.FC = () => {
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
                        <div><ProductManagement setFormProduct={handleSetFormProduct} /></div>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default ProductManagementPage;