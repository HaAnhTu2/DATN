import React, { useState } from "react";
import { Product } from "../../../../types/product";
import CreateFormProduct from "../../../../components/sections/admin/Product/create/page";

const CreateProductPage: React.FC = () => {
    const [, setProduct] = useState<Product[]>([]);
    const [message, setMessage] = useState('')
    return (
        <div className="section">
            <header className="container">
                <div className="row">
                    <div className="col-md-12">
                        <CreateFormProduct setProducts={setProduct} setMessage={setMessage} />
                        {message && <p>{message}</p>}
                    </div>
                </div>
            </header>
        </div>
    )
}

export default CreateProductPage;