import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById, getProductDetailsByProductId } from '../../../../services/productService';
import { getUserByToken } from '../../../../services/authService';
import { addToCart } from '../../../../services/cartService';
import { Product, ProductDetail } from '../../../../types/product';
import { User } from '../../../../types/user';
import { Cart } from '../../../../types/cart';

const GetProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [productDetail, setProductDetail] = useState<ProductDetail[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [selectedDetailId, setSelectedDetailId] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(1);
    const [loading, setLoading] = useState(true);

    const selectedDetail = productDetail.find(detail => detail.product_detail_id === selectedDetailId);
    const imageUrl = selectedDetail ? `http://localhost:3000/image/${selectedDetail.image}` : null;

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                const fetchedProduct = await getProductById(id);
                setProduct(fetchedProduct);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        const fetchProductDetails = async () => {
            if (!product?.product_id) return;
            try {
                const detailResponse = await getProductDetailsByProductId(product.product_id);
                setProductDetail(detailResponse.details || []);
                
                if (detailResponse.details && detailResponse.details.length > 0) {
                    setSelectedDetailId(detailResponse.details[0].product_detail_id);
                }
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };
        fetchProductDetails();
    }, [product]);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const fetchedUser = await getUserByToken(token);
                setUser(fetchedUser.user);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, []);

    const handleAddToCart = async () => {
        if (!selectedDetailId || !user) {
            alert("Vui lòng chọn phiên bản sản phẩm và đăng nhập.");
            return;
        }

        const cart: Cart = {
            id_product_detail: selectedDetailId,
            id_user: user.user_id,
            quantity: quantity,
        };

        try {
            await addToCart(cart);
            alert(`Thêm sản phẩm vào giỏ hàng thành công!`);
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Có lỗi khi thêm vào giỏ hàng');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!product) return <div>Không tìm thấy sản phẩm</div>;

    return (
        <div  className="m-4">
            <div className="row">
                <div className="col-md-5 col-md-push-2">
                    <div id="product-main-img">
                        <div className="product-preview">
                            {imageUrl ? (
                                <div className="col-md-6">
                                    <img
                                        src={imageUrl}
                                        alt={product.name}
                                        style={{ width: "250px", height: "250px" }}
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
                        <h2 className="product-name">{product.name}</h2>
                        <div>
                            <label>Chọn phiên bản sản phẩm:</label>
                            <select
                                value={selectedDetailId}
                                onChange={(e) => setSelectedDetailId(e.target.value)}
                                className="form-control"
                                style={{ width: 400 }}
                            >
                                <option value="">-- Chọn màu & kích thước --</option>
                                {productDetail.map((detail) => (
                                    <option key={detail.product_detail_id} value={detail.product_detail_id}>
                                        {detail.color} / {detail.size} - SL: {detail.quantity}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mt-2">
                            <label>Số lượng:</label>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="form-control"
                                style={{ width: '100px' }}
                            />
                        </div>

                        {selectedDetail ? (
                            <div>
                                <h3 className="product-price">${selectedDetail.price}</h3>
                                <span className="product-available">SL còn: {selectedDetail.quantity}</span>
                            </div>
                        ) : (
                            <div>
                                <h4>Vui lòng chọn màu & kích thước</h4>
                            </div>
                        )}

                        <p>{product.description}</p>

                        <div className="add-to-cart">
                            <button className="add-to-cart-btn" onClick={handleAddToCart}>
                                <i className="fa fa-shopping-cart"></i> Thêm vao giỏ hàng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GetProductDetail;
