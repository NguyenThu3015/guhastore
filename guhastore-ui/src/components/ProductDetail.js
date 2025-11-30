import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from './ui/Card'; 
import Button from './ui/Button'; 
import { RiHeartFill, RiHeartLine, RiShoppingCartLine } from 'react-icons/ri'; 
import toast from 'react-hot-toast'; 


const BASE_PRODUCT_URL = 'http://localhost:8081/api/v1/products';
const BASE_REVIEW_URL = 'http://localhost:8081/api/v1/reviews';
const BASE_WISHLIST_URL = 'http://localhost:8082/api/v1/wishlist';
const BASE_CART_URL = 'http://localhost:8083/api/v1/cart';

const ProductDetail = () => {
    const { id } = useParams();
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    
    const [isFavorited, setIsFavorited] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [quantity, setQuantity] = useState(1);

    
    const fetchReviews = () => {
        axios.get(`${BASE_REVIEW_URL}/product/${id}`)
            .then(res => setReviews(res.data))
            .catch(err => console.error("Lỗi tải reviews", err));
    };

    
    useEffect(() => {
        axios.get(`${BASE_PRODUCT_URL}/${id}`)
            .then(response => setProduct(response.data))
            .catch(error => console.error('Lỗi tải sản phẩm!', error));
        fetchReviews();
    }, [id]);

    
    useEffect(() => {
        if (token && user?.role === 'CUSTOMER') {
            axios.get(BASE_WISHLIST_URL, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => {
                const alreadyFavorited = res.data.some(item => item.productId.toString() === id);
                setIsFavorited(alreadyFavorited);
            })
            .catch(err => console.error("Lỗi lấy wishlist", err));
        }
    }, [token, id, user]);

    
    const handleAddToCart = () => {
        if (!token) { 
            toast.error('Bạn cần đăng nhập để thêm vào giỏ hàng.'); 
            return; 
        }
        const cartItem = { productId: parseInt(id), quantity: quantity, productName: product.name, productImageUrl: product.imageUrl, productPrice: product.price };
        axios.post(`${BASE_CART_URL}/add`, cartItem, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(response => {
            toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`); 
        })
        .catch(error => { 
            console.error('Lỗi khi thêm vào giỏ hàng!', error); 
            toast.error('Lỗi! Không thể thêm vào giỏ hàng.'); 
        });
    };

    
    const handleBuyNow = async () => {
        if (!token) { 
            toast.error('Bạn cần đăng nhập để mua hàng.'); 
            return; 
        }
        
        const toastId = toast.loading('Đang xử lý mua ngay...'); 
        
        try {
            const cartItem = { productId: parseInt(id), quantity: quantity, productName: product.name, productImageUrl: product.imageUrl, productPrice: product.price };
            await axios.post(`${BASE_CART_URL}/add`, cartItem, { headers: { 'Authorization': `Bearer ${token}` } });
            
            toast.success('Đã thêm sản phẩm vào giỏ. Chuyển hướng đến thanh toán...', { id: toastId }); 
            navigate('/checkout');
        } catch (error) {
            toast.error('Lỗi! Không thể xử lý mua ngay.', { id: toastId }); 
        }
    };

    
    const handleToggleFavorite = () => {
        if (!token) { 
            toast.error('Bạn cần đăng nhập để thêm vào danh sách yêu thích.'); 
            return; 
        }
        const isFav = isFavorited;
        const url = isFav ? `${BASE_WISHLIST_URL}/remove/${id}` : `${BASE_WISHLIST_URL}/add`;
        const method = isFav ? 'delete' : 'post';
        const data = isFav ? {} : { productId: parseInt(id) };

        axios({ method, url, data, headers: { 'Authorization': `Bearer ${token}` } })
            .then(() => {
                setIsFavorited(!isFav);
                toast.success(`Đã ${isFav ? 'bỏ' : 'thêm'} vào yêu thích!`); 
            })
            .catch(err => {
                console.error("Lỗi wishlist", err);
                toast.error('Lỗi! Không thể cập nhật yêu thích.'); 
            });
    };
    
    
    const handleSubmitReview = (e) => {
        e.preventDefault();
        if (!token || !user) { 
            toast.error('Vui lòng đăng nhập để viết đánh giá.'); 
            return; 
        }
        const newReview = { productId: parseInt(id), userId: user.id, userName: user.fullName, rating: reviewRating, comment: reviewComment };

        axios.post(`${BASE_REVIEW_URL}/product/${id}`, newReview, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(response => {
            toast.success('Đánh giá của bạn đã được gửi!'); 
            setReviewComment('');
            setReviewRating(5);
            fetchReviews();
        })
        .catch(error => toast.error('Lỗi! Không thể gửi đánh giá.')); 
    };

    
    const handleQuantityChange = (amount) => {
        setQuantity(prevQuantity => {
            const newQuantity = prevQuantity + amount;
            if (newQuantity < 1) return 1;
            return newQuantity;
        });
    };

    if (!product) {
        return <div className="text-center p-10">Đang tải thông tin sản phẩm...</div>;
    }

    return (
        <Card className="max-w-6xl mx-auto p-0 overflow-hidden"> {}
            <div className="md:flex">
                
                {/* Product Image */}
                <div className="md:w-1/2 p-8 bg-gray-100 flex items-center justify-center">
                    <img 
                        src={product.imageUrl && product.imageUrl.startsWith('http') 
                            ? product.imageUrl 
                            : `http://localhost:8081${product.imageUrl}`}
                        alt={product.name} 
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" 
                    />
                </div>

                {/* Product Details */}
                <div className="md:w-1/2 p-8">
                    <h2 className="text-4xl font-extrabold text-indigo-700 mb-2 border-none pb-0">{product.name}</h2>
                    <p className="text-xl text-gray-600 mb-4">Thương hiệu: <span className="font-semibold text-slate-800">{product.brand.name}</span></p>
                    
                    <p className="text-2xl font-bold text-red-600 border-b pb-4 mb-4">
                        {product.price.toLocaleString('vi-VN')} VNĐ
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">{product.description}</p>
                    <p className="text-md text-gray-500 mb-6">Còn lại: {product.stockQuantity} sản phẩm</p>

                    {/* Actions */}
                    {user && user.role === 'CUSTOMER' && (
                        <div className="mt-6">
                            {/* Quantity Selector */}
                            <div className="flex items-center mb-6">
                                <label className="text-lg font-semibold mr-4 min-w-[100px]">Số lượng:</label>
                                <div className="flex items-center border border-gray-400 rounded-lg overflow-hidden">
                                    <button onClick={() => handleQuantityChange(-1)} className="p-2 text-xl hover:bg-gray-200">-</button>
                                    <span className="px-4 text-lg font-semibold">{quantity}</span>
                                    <button onClick={() => handleQuantityChange(1)} className="p-2 text-xl hover:bg-gray-200">+</button>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex space-x-3">
                                {/* Add to Cart */}
                                <Button onClick={handleAddToCart} variant="secondary" className="flex-1 min-w-0">
                                    <RiShoppingCartLine className="mr-2" /> Thêm vào Giỏ
                                </Button>
                                
                                {/* Buy Now */}
                                <Button onClick={handleBuyNow} variant="warning" className="flex-1 min-w-0">
                                    Mua ngay
                                </Button>

                                {/* Favorite Button */}
                                <Button onClick={handleToggleFavorite} variant={isFavorited ? 'danger' : 'outline'} className="p-3 w-12 h-12 flex items-center justify-center">
                                    {isFavorited ? <RiHeartFill className="text-xl" /> : <RiHeartLine className="text-xl" />}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <hr className="my-8" />

            {/* Reviews Section */}
            <div className="p-8 pt-0">
                <h3 className="text-2xl font-bold mb-4">Đánh giá Sản phẩm</h3>
                
                {/* Review Form */}
                {user && user.role === 'CUSTOMER' ? (
                    <form onSubmit={handleSubmitReview} className="mb-8 p-4 border rounded-lg bg-gray-50">
                        <h4 className="text-lg font-semibold mb-3">Viết đánh giá của bạn</h4>
                        <div className="flex space-x-4 mb-3 items-center">
                            <label className="text-gray-700">Cho điểm (1-5):</label>
                            <select value={reviewRating} onChange={e => setReviewRating(parseInt(e.target.value))} className="w-auto">
                                <option value="5">5 sao</option><option value="4">4 sao</option>
                                <option value="3">3 sao</option><option value="2">2 sao</option>
                                <option value="1">1 sao</option>
                            </select>
                            <Button type="submit" variant="primary" className="ml-auto">
                                Gửi đánh giá
                            </Button>
                        </div>
                        <textarea 
                            value={reviewComment}
                            onChange={e => setReviewComment(e.target.value)}
                            placeholder="Viết bình luận của bạn..."
                            className="w-full h-24 p-2 border rounded"
                            required
                        />
                    </form>
                ) : (
                    !user && <p className="text-center p-4 bg-yellow-100 rounded-md">Vui lòng <Link to="/login" className="text-indigo-600 font-semibold">đăng nhập</Link> để viết đánh giá.</p>
                )}
                
                {/* Review List */}
                <h3 className="text-2xl font-bold mt-8">Đánh giá từ khách hàng ({reviews.length})</h3>
                {reviews.length === 0 ? (
                    <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</p>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} className="border-b py-4">
                            <p className="font-semibold">{review.userName || 'Người dùng'}: <span className="text-yellow-600">{review.rating} sao</span></p>
                            <p className="text-gray-600">{review.comment}</p>
                            <p className="text-xs text-gray-400 mt-1">{new Date(review.reviewDate).toLocaleDateString('vi-VN')}</p>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
};

export default ProductDetail;