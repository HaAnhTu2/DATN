import React, { useEffect, useState } from "react";
import { Card, Button, Form } from 'react-bootstrap';
import { getProductDetailsByProductId, getProducts } from "../../../../services/productService";
import { Product, ProductDetail } from "../../../../types/product";
import { useNavigate } from "react-router-dom";

interface UserHomeProps {
    setUserHome: (product: Product) => void;
}

const UserHome: React.FC<UserHomeProps> = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [productDetail, setProductDetail] = useState<ProductDetail[]>([]);
    const [loading, setLoading] = useState(true);
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
                setLoading(false);
            } catch (error) {
                console.log('error fetching products:', error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);
    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                if (products.length === 0) return;

                const detailPromises = products.map(product =>
                    getProductDetailsByProductId(product.product_id)
                );
                const detailResults = await Promise.all(detailPromises);

                const allDetails = detailResults.flat();

                setProductDetail(allDetails);
                setLoading(false);
            } catch (error) {
                console.log('Error fetching product details:', error);
                setLoading(false);
            }
        };

        fetchProductDetail();
    }, [products]);

    if (loading) {
        return <div>Loading...</div>;
    }
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <li key={product.product_id}>
                        <div className="col-md-4 col-xs-6">
                            <div className="product">
                                <div className="product-img">
                                    {product.image ? (
                                        <Card.Img src={`http://localhost:3000/image/${product.image}`}
                                            alt={product.name}
                                        />
                                    ) : (
                                        "No Image"
                                    )}
                                </div>
                                <div className="product-body">
                                    <p className="product-category">{product.description || "Unknown"}</p>
                                    <h3 className="product-name"><a onClick={() => handleDetailClick(product.product_id)} href="#">{product.name || "No Name"}</a></h3>
                                    <h4 className="product-price">${product.price != null ? product.price : "No Price"}</h4>
                                    <div className="product-rating">
                                        {product.status || "No Rating"}<i className="fa fa-star"></i>
                                    </div>
                                </div>
                                <div className="add-to-cart">
                                    <Button onClick={() => handleDetailClick(product.product_id)} className="add-to-cart-btn"><i className="fa fa-shopping-cart"></i> add to cart</Button>
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

