import React, { useState } from "react";
import Home from "../components/home/Home";
import { Product } from "../type/product";


const HomePage: React.FC = () => {
    const [, setHome] = useState<Product | null>(null);
    return (
        <div className="section">
            <header className="container">
                <div className="row">
                    <div className="col-md-12">
                        <Home setHome={setHome} />
                    </div>
                </div>
            </header>
        </div>
    )
}

export default HomePage;