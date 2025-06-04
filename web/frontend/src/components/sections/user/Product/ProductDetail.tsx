import React, { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById, getProductDetailsByProductId } from '../../../../services/productService';
import { getUserByToken } from '../../../../services/authService';
import { addToCart } from '../../../../services/cartService';
import { Product, ProductDetail } from '../../../../types/product';
import { User } from '../../../../types/user';
import { Cart } from '../../../../types/cart';
import { createFeedback, getFeedbackById } from '../../../../services/feedbackService';
import { Feedback } from '../../../../types/feedback';
import { getUserById } from '../../../../services/userService';

const GetProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [productDetail, setProductDetail] = useState<ProductDetail[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [selectedDetailId, setSelectedDetailId] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(1);

    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [feedbackDescription, setFeedbackDescription] = useState<string>('');
    const [feedbackRate, setFeedbackRate] = useState<string>('5');
    const [feedbackImage, setFeedbackImage] = useState<File | null>(null);
    const [userEmails, setUserEmails] = useState<{ [userId: string]: string }>({});
    const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);

    useEffect(() => {
        const fetchFeedbacksAndUsers = async () => {
            if (!id) return;
            try {
                const feedbackData = await getFeedbackById(id);
                setFeedbacks(feedbackData);

                const userEmailMap: { [userId: string]: string } = {};
                for (const fb of feedbackData) {
                    if (!userEmailMap[fb.id_user]) {
                        try {
                            const user = await getUserById(fb.id_user);
                            userEmailMap[fb.id_user] = user.email;
                        } catch (error) {
                            console.error(`Lỗi lấy user ${fb.id_user}`, error);
                            userEmailMap[fb.id_user] = 'Không rõ';
                        }
                    }
                }

                setUserEmails(userEmailMap);
            } catch (error) {
                console.error('Lỗi lấy feedback:', error);
            }
        };

        fetchFeedbacksAndUsers();
    }, [id]);


    const [loading, setLoading] = useState(true);

    const selectedDetail = productDetail.find(detail => detail.product_detail_id === selectedDetailId);
    const imageUrl = selectedDetail ? `http://localhost:3000/image/${selectedDetail.image}` : null;

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            setLoadingFeedbacks(true);
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
    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setFeedbackImage(files[0]);
        }
    };
    const handleSubmitFeedback = async () => {
        if (!user || !selectedDetailId || !product?.product_id) {
            alert('Vui lòng đăng nhập và chọn phiên bản sản phẩm.');
            return;
        }

        if (!feedbackImage) {
            alert('Vui lòng chọn ảnh.');
            return;
        }

        try {
            const form = new FormData();
            form.append('id_user', user.user_id);
            form.append('id_product', product.product_id);
            form.append('rate', feedbackRate);
            form.append('description', feedbackDescription);
            form.append('image', feedbackImage); // image là File

            await createFeedback(form);
            alert('Gửi feedback thành công!');
            setFeedbackRate('5');
            setFeedbackDescription('');
            setFeedbackImage(null);
            window.location.reload(); 
        } catch (error) {
            console.error('Lỗi khi gửi feedback:', error);
            alert('Gửi feedback thất bại!');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!product) return <div>Không tìm thấy sản phẩm</div>;

    return (
        <div className="m-4">
            <div className="row">
                <div className="col-md-6 col-md-push-2">
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

                <div className="col-md-1 col-md-pull-5"></div>
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
                                <h3 className="product-price">{selectedDetail.price}đ</h3>
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
            <div className="row">
                <div className="col-md-6">
                    <div>
                        <h3>Đánh giá sản phẩm</h3>
                        {!loadingFeedbacks && feedbacks.length === 0 && <p>Chưa có đánh giá nào.</p>}

                        <ul className="row">
                            {feedbacks?.map((fb) => (
                                <li key={`${fb.id_user}-${fb.id_product}`} style={{ marginBottom: 15, borderBottom: '1px solid #ccc', paddingBottom: 10 }}>
                                    <div className="col-md-6">
                                        <p><strong>Người đánh giá:</strong> {userEmails[fb.id_user] || 'Đang tải...'}</p>
                                        <p><strong>Đánh giá:</strong> {fb.description}</p>
                                        <p><strong>Số sao:</strong> {fb.rate}</p>
                                    </div>
                                    <div className="col-md-6">
                                        {fb.image ? (
                                            <img
                                                src={`http://localhost:3000/api/feedback/image/${fb.image}`}
                                                alt="Ảnh đánh giá"
                                                style={{ maxWidth: 200, maxHeight: 200, objectFit: 'cover', border: '1px solid #ccc' }}
                                            />
                                        ) : ("Không có ảnh")}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-4">
                        <h4>Gửi đánh giá</h4>

                        <label>Đánh giá (sao):</label>
                        <select
                            value={feedbackRate}
                            onChange={(e) => setFeedbackRate(e.target.value)}
                            className="form-control"
                            style={{ width: '120px' }}
                        >
                            {[5, 4, 3, 2, 1].map((value) => (
                                <option key={value} value={value.toString()}>
                                    {value} sao
                                </option>
                            ))}
                        </select>

                        <label className="mt-2">Mô tả:</label>
                        <textarea
                            value={feedbackDescription}
                            onChange={(e) => setFeedbackDescription(e.target.value)}
                            className="form-control"
                            rows={4}
                            placeholder="Nhập mô tả đánh giá..."
                            style={{ width: '100%', maxWidth: 600 }}
                        />

                        <label className="mt-2">Chọn ảnh:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="form-control"
                            style={{ maxWidth: 400 }}
                        />

                        <button className="btn btn-primary mt-3" onClick={handleSubmitFeedback}>
                            Gửi đánh giá
                        </button>
                    </div>
                </div>
                <div className="col-md-1 col-md-pull-5"></div>

                <div className="col-md-5">
                    {product.information}
                </div>
            </div>
        </div>
    );
};

export default GetProductDetail;
