import React, { useEffect, useState } from "react";
import { Card, Button, Form } from 'react-bootstrap';
import { getProducts } from "../../../services/productService";
import { Product } from "../../../types/product";
import { useNavigate } from "react-router-dom";

interface UserHomeProps {
    setUserHome: (product: Product) => void;
}

const UserHome: React.FC<UserHomeProps> = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setloading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const handleDetailClick = (id: string) => {
        navigate(`/product/${id}`);
    };
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const fetchedProducts = await getProducts();
                setProducts(fetchedProducts);
                setloading(false);
            } catch (error) {
                console.log('error fetching products:', error);
                setloading(false);
            }
        };
        fetchProducts();
    }, []);
    if (loading) {
        return <div>Loading...</div>;
    }
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredProducts = products.filter(product =>
        product.productname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div>
            <div>
                {/* Search Form */}
                <Form className="d-flex align-items-center" style={{ margin: '10px' }}>
                    <Form.Control type="search" placeholder="Search" value={searchTerm} onChange={handleSearch} />
                </Form>
            </div>
            <ul>
                {filteredProducts.map(product => (
                    <li key={product._id}>
                        <div className="col-md-4 col-xs-6">
                            <div className="product">
                                <div className="product-img">
                                    {product.productimage_url ? (
                                        <Card.Img src={`http://localhost:3000/image2/${product.productimage_url}`}
                                            alt={product.productname}
                                        />
                                    ) : (
                                        "No Image"
                                    )}
                                </div>
                                <div className="product-body">
                                    <p className="product-category">{product.brand || "Unknown"}</p>
                                    <h3 className="product-name"><a onClick={() => handleDetailClick(product._id)} href="#">{product.productname || "No Name"}</a></h3>
                                    <h4 className="product-price">${product.price != null ? product.price : "No Price"}</h4>
                                    <div className="product-rating">
                                        {product.quantity || "No Rating"}<i className="fa fa-star"></i>
                                    </div>
                                </div>
                                <div className="add-to-cart">
                                    <Button onClick={() => handleDetailClick(product._id)} className="add-to-cart-btn"><i className="fa fa-shopping-cart"></i> add to cart</Button>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default UserHome;

