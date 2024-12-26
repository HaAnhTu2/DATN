import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../../../../api/product';
import { getUserByToken } from '../../../../api/api';
import { addToCart } from '../../../../api/cart';
import { Product } from '../../../../type/product';
import { User } from '../../../../type/user';
import { Cart } from '../../../../type/cart';

interface ProductDetailProps {
    setDetailProduct: (product: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ setDetailProduct }) => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [user, setUser] = useState<User | null>(null);

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
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            try {
                const fetchedUser = await getUserByToken(token);
                setUser(fetchedUser.user);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, []);

    // const handleAddToCart = async () => {
    //     if (!product || !user) {
    //         console.error('Product not found');
    //         return;
    //     }

    //     const cart: Cart = {
    //         id: user.id,               // ID của giỏ hàng
    //         cart_id: user.id,        // ID giỏ hàng của người dùng (có thể lấy từ trạng thái hoặc API)
    //         line_items: [
    //             {
    //                 id: product._id,
    //                 product_id: product._id,
    //                 productname: product.productname,
    //                 cartquantity: 1,
    //                 price: product.price,
    //                 subtotal: product.price * 1, // subtotal tính từ quantity * price
    //             }
    //         ]
    //     };
        

    //     try {
    //         const addedItem = await addToCart(cart);
    //         alert(`Added ${addedItem} to cart successfully!`);
    //     } catch (error) {
    //         console.error('Error adding item to cart:', error);
    //     }
    // };
const handleAddToCart = async () => {
    if (!product || !user) {
        console.error('Product or user not found');
        return;
    }

    const cart: Cart = {
        id: user.id, // ID người dùng (userID)
        cart_id: user.id, // ID giỏ hàng
        line_items: [
            {
                id: product._id,
                product_id: product._id,
                productname: product.productname,
                cartquantity: 1, // Số lượng sản phẩm
                price: product.price,
                subtotal: product.price * 1, // Tính subtotal
            },
        ],
    };

    try {
        const addedItems = await addToCart(cart);
        alert(`Added ${addedItems.length} item(s) to cart successfully!`);
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
            {user && (
                <div>
                    <h3>User Info</h3>
                    <p>Name: {user.first_name} {user.last_name}</p>
                    <p>Email: {user.email}</p>
                </div>
            )}
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
