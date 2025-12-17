import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from './ui/Card'; 
import Button from './ui/Button'; 
// Thêm icon Star
import { RiHeartFill, RiHeartLine, RiShoppingCartLine, RiStarFill, RiStarLine, RiTruckLine, RiShieldCheckLine } from 'react-icons/ri'; 
import toast from 'react-hot-toast'; 

const BASE_PRODUCT_URL = 'http://localhost:8081/api/v1/products';
const BASE_REVIEW_URL = 'http://localhost:8081/api/v1/reviews';
const BASE_WISHLIST_URL = 'http://localhost:8082/api/v1/wishlist';
const BASE_CART_URL = 'http://localhost:8083/api/v1/cart';

// --- COMPONENT CON: HIỂN THỊ SAO ---
const StarRating = ({ rating }) => {
    return (
        <div className="flex text-yellow-400 text-sm">
            {[...Array(5)].map((_, i) => (
                <span key={i}>
                    {i < rating ? <RiStarFill /> : <RiStarLine className="text-gray-300" />}
                </span>
            ))}
        </div>
    );
};

// --- COMPONENT CON: CHỌN SAO (INPUT) ---
const StarInput = ({ rating, setRating }) => {
    return (
        <div className="flex space-x-1 cursor-pointer">
            {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} onClick={() => setRating(star)} className="text-2xl transition-transform hover:scale-110">
                    {star <= rating ? <RiStarFill className="text-yellow-400" /> : <RiStarLine className="text-gray-300 hover:text-yellow-300" />}
                </div>
            ))}
        </div>
    );
};

const ProductDetail = () => {
    const { id } = useParams();
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true); // Thêm state loading
    const [isFavorited, setIsFavorited] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [quantity, setQuantity] = useState(1);

    // Fetch Reviews
    const fetchReviews = () => {
        axios.get(`${BASE_REVIEW_URL}/product/${id}`)
            .then(res => setReviews(res.data))
            .catch(err => console.error("Lỗi tải reviews", err));
    };

    // Fetch Product
    useEffect(() => {
        setLoading(true);
        axios.get(`${BASE_PRODUCT_URL}/${id}`)
            .then(response => {
                setProduct(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Lỗi tải sản phẩm!', error);
                setLoading(false);
            });
        fetchReviews();
    }, [id]);

    // Check Wishlist
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

    // Handle Add to Cart
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

    // Handle Buy Now
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

    // Handle Favorite
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
    
    // Handle Review Submit
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

    // Handle Quantity
    const handleQuantityChange = (amount) => {
        setQuantity(prevQuantity => {
            const newQuantity = prevQuantity + amount;
            if (newQuantity < 1) return 1;
            if (product && newQuantity > product.stockQuantity) return product.stockQuantity;
            return newQuantity;
        });
    };

    // --- RENDER LOADING ---
    if (loading || !product) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Tính toán URL ảnh an toàn
    const safeImageUrl = product.imageUrl && product.imageUrl.startsWith('http') 
        ? product.imageUrl 
        : `http://localhost:8081${product.imageUrl}`;

    return (
        <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
            {/* --- PRODUCT MAIN SECTION --- */}
            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                    
                    {/* Left Column: Product Image */}
                    <div className="p-8 lg:p-12 flex items-center justify-center bg-gray-50/50 border-r border-gray-100 relative group">
                        <div className="relative w-full max-w-md aspect-square rounded-xl overflow-hidden bg-white shadow-sm p-4">
                            <img 
                                src={safeImageUrl}
                                alt={product.name} 
                                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" 
                            />
                        </div>
                        {/* Badges */}
                        {product.stockQuantity > 0 ? (
                            <span className="absolute top-6 left-6 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                Còn hàng
                            </span>
                        ) : (
                            <span className="absolute top-6 left-6 bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                Hết hàng
                            </span>
                        )}
                    </div>

                    {/* Right Column: Product Details */}
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                        <nav className="text-sm text-gray-500 mb-4">
                            <span>Sản phẩm</span> / <span className="font-medium text-gray-900">{product.brand?.name || 'Thương hiệu'}</span>
                        </nav>
                        
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
                            {product.name}
                        </h1>

                        <div className="flex items-center space-x-4 mb-6">
                            <div className="text-3xl font-bold text-indigo-600">
                                {product.price.toLocaleString('vi-VN')} ₫
                            </div>
                             {/* Giá cũ giả lập (nếu có logic giảm giá thì thay vào) */}
                            {/* <div className="text-lg text-gray-400 line-through">25.000.000 ₫</div> */}
                        </div>

                        {/* Description & Policies */}
                        <div className="prose prose-sm text-gray-600 mb-8 max-w-none">
                            <p>{product.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <RiTruckLine className="text-xl text-indigo-500" />
                                <span>Giao hàng toàn quốc</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <RiShieldCheckLine className="text-xl text-indigo-500" />
                                <span>Bảo hành chính hãng</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-8">
                            {user && user.role === 'CUSTOMER' && (
                                <>
                                    {/* Quantity Selection */}
                                    <div className="flex items-center mb-6">
                                        <label className="text-sm font-semibold text-gray-700 mr-4">Số lượng:</label>
                                        <div className="flex items-center border border-gray-300 rounded-lg bg-white shadow-sm">
                                            <button 
                                                onClick={() => handleQuantityChange(-1)} 
                                                className="px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors border-r"
                                                disabled={quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="px-4 py-2 font-bold text-gray-900 w-12 text-center">{quantity}</span>
                                            <button 
                                                onClick={() => handleQuantityChange(1)} 
                                                className="px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors border-l"
                                                disabled={quantity >= product.stockQuantity}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <span className="ml-4 text-sm text-gray-500">
                                            {product.stockQuantity} sản phẩm có sẵn
                                        </span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Button 
                                            onClick={handleAddToCart} 
                                            className="flex-1 bg-white border-2 border-indigo-600 text-indigo-700 hover:bg-indigo-50 py-3.5 rounded-xl font-bold text-lg flex items-center justify-center transition-all"
                                        >
                                            <RiShoppingCartLine className="mr-2 text-xl" /> Thêm vào Giỏ
                                        </Button>
                                        
                                        <Button 
                                            onClick={handleBuyNow} 
                                            className="flex-1 bg-indigo-600 border-2 border-transparent text-white hover:bg-indigo-700 py-3.5 rounded-xl font-bold text-lg shadow-lg hover:shadow-indigo-500/30 transition-all"
                                        >
                                            Mua ngay
                                        </Button>

                                        <button 
                                            onClick={handleToggleFavorite} 
                                            className={`p-3.5 rounded-xl border-2 transition-all flex items-center justify-center w-full sm:w-auto ${
                                                isFavorited 
                                                ? 'border-red-200 bg-red-50 text-red-500' 
                                                : 'border-gray-200 hover:border-gray-300 text-gray-400 hover:text-gray-600'
                                            }`}
                                            title="Yêu thích"
                                        >
                                            {isFavorited ? <RiHeartFill className="text-2xl" /> : <RiHeartLine className="text-2xl" />}
                                        </button>
                                    </div>
                                </>
                            )}

                            {!user && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                                    <p className="text-yellow-800">
                                        Vui lòng <Link to="/login" className="font-bold underline hover:text-yellow-900">đăng nhập</Link> để mua hàng.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- REVIEWS SECTION --- */}
            <div className="max-w-7xl mx-auto mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left: Review List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            Đánh giá từ khách hàng 
                            <span className="ml-3 px-3 py-1 bg-gray-100 text-gray-600 text-sm font-normal rounded-full">{reviews.length} đánh giá</span>
                        </h3>
                        
                        {reviews.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <RiStarLine className="mx-auto text-4xl text-gray-300 mb-3" />
                                <p className="text-gray-500">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {reviews.map(review => (
                                    <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                                        <div className="flex items-start">
                                            {/* Fake Avatar */}
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                                {review.userName ? review.userName.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="text-sm font-bold text-gray-900">{review.userName || 'Người dùng ẩn danh'}</h4>
                                                    <span className="text-xs text-gray-400">{new Date(review.reviewDate).toLocaleDateString('vi-VN')}</span>
                                                </div>
                                                <div className="mb-2">
                                                    <StarRating rating={review.rating} />
                                                </div>
                                                <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Review Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sticky top-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Viết đánh giá của bạn</h3>
                        {user && user.role === 'CUSTOMER' ? (
                            <form onSubmit={handleSubmitReview} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mức độ hài lòng</label>
                                    <div className="flex justify-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        <StarInput rating={reviewRating} setRating={setReviewRating} />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nhận xét</label>
                                    <textarea 
                                        value={reviewComment}
                                        onChange={e => setReviewComment(e.target.value)}
                                        placeholder="Chia sẻ cảm nhận về sản phẩm..."
                                        className="w-full h-32 p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm resize-none"
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full bg-gray-900 text-white hover:bg-black py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
                                    Gửi đánh giá
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-sm text-gray-500 mb-4">Bạn cần đăng nhập để viết đánh giá.</p>
                                <Link to="/login" className="inline-block w-full py-2.5 px-4 border border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 text-sm transition-colors">
                                    Đăng nhập ngay
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductDetail;