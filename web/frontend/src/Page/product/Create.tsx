import React, { useState } from "react";
import { Product } from "../../type/product";
import CreateFormProduct from "../../components/sections/dashboard/product/Create";

const CreateProductPage: React.FC = () => {
    const [, setProducts] = useState<Product[]>([]);
    const [message, setMessage] = useState('')
    return (
        <div className="section">
            <header className="container">
                <div className="row">
                    <div className="col-md-12">
                        <CreateFormProduct setProducts={setProducts} setMessage={setMessage} />
                        {message && <p>{message}</p>}
                    </div>
                </div>
            </header>
        </div>
    )
}

export default CreateProductPage;