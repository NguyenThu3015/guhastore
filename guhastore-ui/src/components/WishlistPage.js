import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ProductSkeletonCard from './ui/ProductSkeletonCard'; 
import { RiShoppingCartLine, RiDeleteBin6Line, RiHeartLine } from 'react-icons/ri';
import toast from 'react-hot-toast';

const BASE_WISHLIST_URL = 'http://localhost:8082/api/v1/wishlist';

const WishlistPage = () => {
    const [wishlistItems, setWishlistItems] = useState([]); 
    const [status, setStatus] = useState({ loading: true, error: null });
    const { token } = useAuth();

    // Hàm lấy danh sách yêu thích
    const fetchWishlist = useCallback(async () => {
        if (!token) {
            setStatus({ loading: false, error: 'Bạn cần đăng nhập để xem danh sách.' });
            return;
        }
        setStatus({ loading: true, error: null });

        try {
            // 1. Lấy danh sách ID sản phẩm từ Wishlist Service
            const wishlistResponse = await axios.get('http://localhost:8082/api/v1/wishlist', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const items = wishlistResponse.data;
            
            if (items.length === 0) {
                setWishlistItems([]);
                setStatus({ loading: false, error: null });
                return;
            }

            // 2. Lấy chi tiết từng sản phẩm từ Product Service
            const productPromises = items.map(item =>
                axios.get(`http://localhost:8081/api/v1/products/${item.productId}`)
            );
            
            // Sử dụng allSettled để nếu 1 sản phẩm lỗi cũng không làm hỏng cả trang
            const productResults = await Promise.allSettled(productPromises);

            const validProducts = productResults
                .filter(result => result.status === 'fulfilled')
                .map(result => result.value.data);
            
            setWishlistItems(validProducts);
        } catch (error) {
            console.error('Lỗi khi tải danh sách yêu thích!', error);
            setStatus({ loading: false, error: 'Không thể tải danh sách yêu thích.' });
        } finally {
            setStatus(prev => ({ ...prev, loading: false }));
        }
    }, [token]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    
    const handleRemoveFromWishlist = useCallback(async (productId) => {
        // Cập nhật UI ngay lập tức (Optimistic update)
        setWishlistItems(currentItems => currentItems.filter(p => p.id !== productId));
        
        const promise = axios.delete(`http://localhost:8082/api/v1/wishlist/remove/${productId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        toast.promise(promise, {
            loading: 'Đang xóa sản phẩm...',
            success: 'Đã xóa khỏi danh sách yêu thích!',
            error: (err) => {
                // Nếu lỗi thì load lại danh sách cũ
                fetchWishlist();
                return 'Lỗi! Không thể xóa sản phẩm.';
            }
        });
    }, [token, fetchWishlist]);

    
    const handleAddToCart = useCallback(async (product) => {
        const cartItem = {
            productId: product.id,
            quantity: 1,
            productName: product.name,
            productImageUrl: product.imageUrl,
            productPrice: product.price
        };

        const promise = axios.post(`http://localhost:8083/api/v1/cart/add`, cartItem, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        toast.promise(promise, {
            loading: 'Đang thêm vào giỏ hàng...',
            success: <b>Đã thêm vào giỏ hàng!</b>,
            error: <b>Không thể thêm sản phẩm.</b>,
        });
    }, [token]);


    if (status.loading) {
        return (
            <div className="max-w-6xl mx-auto p-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Danh sách Yêu thích</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, index) => <ProductSkeletonCard key={index} />)}
                </div>
            </div>
        );
    }
    
    if (status.error) {
        return <div className="max-w-6xl mx-auto p-4 text-center py-10 text-red-600 bg-red-50 rounded-lg">{status.error}</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-4 min-h-[60vh]">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Danh sách Yêu thích</h2>

            {wishlistItems.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center">
                    <RiHeartLine className="w-24 h-24 text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700">Danh sách của bạn đang trống</h3>
                    <p className="text-gray-500 mt-2">Hãy thêm những sản phẩm bạn yêu thích vào đây để dễ dàng theo dõi nhé!</p>
                    <Link to="/" className="mt-6 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition">
                        Bắt đầu mua sắm
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {wishlistItems.map(product => (
                        <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden group flex flex-col">
                            <Link to={`/product/${product.id}`} className="block">
                                <div className="h-56 overflow-hidden">
                                    <img src={`http://localhost:8081${product.imageUrl}`} alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-4 flex-grow">
                                    <p className="text-xs text-gray-500 mb-1">{product.brand.name}</p>
                                    <h4 className="text-base font-bold text-gray-800 h-12 line-clamp-2">{product.name}</h4>
                                    <p className="text-lg font-extrabold text-red-600 mt-2">{product.price.toLocaleString('vi-VN')} VNĐ</p>
                                </div>
                            </Link>

                            {/* Actions */}
                            <div className="p-4 pt-0 mt-auto flex items-center gap-2">
                                <button onClick={() => handleAddToCart(product)}
                                    className="flex-grow flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition">
                                    <RiShoppingCartLine />
                                    <span>Thêm vào giỏ</span>
                                </button>
                                <button onClick={() => handleRemoveFromWishlist(product.id)}
                                    title="Xóa khỏi danh sách yêu thích"
                                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-600 rounded-lg hover:bg-red-500 hover:text-white transition">
                                    <RiDeleteBin6Line />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistPage;