import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../../../../api/product';
import { addToCart } from '../../../../api/cart';
import { Product } from '../../../../type/product';
import { CartItem } from '../../../../type/order';

interface ProductDetailProps {
    setDetailProduct: (product: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ setDetailProduct }) => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) {
                console.error('Product ID is undefined');
                setLoading(false);
                return;
            }

            try {
                const fetchedProduct = await getProductById(id);
                setProduct(fetchedProduct);
                setDetailProduct(fetchedProduct);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product:', error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, setDetailProduct]);

    const handleAddToCart = async () => {
        if (!product) {
            console.error('Product not found');
            return;
        }

        const cartItem: CartItem = {
            id: product.id,
            userid:"676c0dd7099f147d0ae9b509",
            productname: product.productname,
            brand:product.brand,
            price: product.price,
            producttype: product.type,
            quantity: 1, 
        };

        try {
            const addedItem = await addToCart(cartItem);
            alert(`Added ${addedItem.productname} to cart successfully!`);
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div>
            {product ? (
                <div className="row">
                    <div className="col-md-5 col-md-push-2">
                        <div id="product-main-img">
                            <div className="product-preview">
                                {product.productimage_url ? (
                                    <div className="col-md-6">
                                        <img
                                            src={`http://localhost:3000/image2/${product.productimage_url}`}
                                            alt={product.productname}
                                            style={{ width: "250px", height: "auto" }}
                                        />
                                    </div>
                                ) : (
                                    "No Image"
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-2 col-md-pull-5"></div>
                    <div className="col-md-5">
                        <div className="product-details">
                            <h2 className="product-name">{product.productname}</h2>
                            <div>
                                <div className="product-rating">
                                    {product.quantity}<i className="fa fa-star"></i>
                                </div>
                                <a className="review-link" href="#">10 Review(s) | Add your review</a>
                            </div>
                            <div>
                                <h3 className="product-price">$${product.price} </h3>
                                <span className="product-available">In Stock</span>
                            </div>
                            <p>{product.description}</p>

                            <div className="add-to-cart">
                                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                                    <i className="fa fa-shopping-cart"></i> Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>Product not found</div>
            )}
        </div>
    );
};

export default ProductDetail;
