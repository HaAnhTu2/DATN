import React, { useState } from "react";
import { Product } from "../../type/product";
import CartList from "../../components/sections/order/Cart";


const CartPage: React.FC = () => {
    const [, setCart] = useState<Product | null>(null);
    return (
        <div className="section">
            <header className="container">
                <div className="row">
                    <div className="col-md-12">
                        <CartList setFormCart={setCart} />
                    </div>
                </div>
            </header>
        </div>
    )
}

export default CartPage;