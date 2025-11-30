import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import FilterSidebar from './FilterSidebar';
import ProductCard from './ProductCard';
import ProductSkeletonCard from './ui/ProductSkeletonCard';
import { RiEmotionSadLine } from 'react-icons/ri';
import toast from 'react-hot-toast'; 

const API_BASE_URL = 'http://localhost:8081/api/v1';
const WISHLIST_API_URL = 'http://localhost:8082/api/v1/wishlist';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [wishlistProductIds, setWishlistProductIds] = useState(new Set());
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [queryParams, setQueryParams] = useState({});

    const { token, isAuthenticated } = useAuth();

    // Fetch Categories & Brands
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [catRes, brandRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/categories`),
                    axios.get(`${API_BASE_URL}/brands`)
                ]);
                setCategories(catRes.data);
                setBrands(brandRes.data);
            } catch (err) {
                console.error('Lỗi tải Categories/Brands!', err);
                setError('Không thể tải dữ liệu bộ lọc.');
            }
        };
        fetchInitialData();
    }, []);

    // Fetch Wishlist (Đã bổ sung logic gọi API)
    const fetchWishlist = useCallback(async () => {
        if (isAuthenticated && token) {
            try {
                const response = await axios.get(WISHLIST_API_URL, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                // Giả sử API trả về mảng các item wishlist, ta lấy productId đưa vào Set
                const ids = new Set(response.data.map(item => item.productId));
                setWishlistProductIds(ids);
            } catch (error) {
                console.error("Lỗi tải wishlist", error);
            }
        }
    }, [isAuthenticated, token]);
    
    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    // Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Lọc bỏ các params rỗng hoặc null
                const cleanedParams = Object.fromEntries(
                    Object.entries(queryParams).filter(([_, v]) => v !== '' && v !== null && v !== 0)
                );
                const params = new URLSearchParams(cleanedParams).toString();
                const response = await axios.get(`${API_BASE_URL}/products?${params}`);
                setProducts(response.data);
            } catch (err) {
                console.error('Lỗi khi gọi API lấy sản phẩm!', err);
                setError('Không thể tải danh sách sản phẩm.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, [queryParams]); 

    
    const handleApplyFilters = useCallback((filters) => {
        setQueryParams(filters);
    }, []);

    // Handle Wishlist Toggle
    const handleToggleWishlist = useCallback(async (productId) => {
        if (!token) return toast.error('Bạn cần đăng nhập để sử dụng tính năng này!');
        
        const isAdded = wishlistProductIds.has(productId);
        const url = isAdded ? `${WISHLIST_API_URL}/remove/${productId}` : `${WISHLIST_API_URL}/add`;
        const method = isAdded ? 'delete' : 'post';
        const data = isAdded ? {} : { productId };

        const promise = axios({ method, url, data, headers: { 'Authorization': `Bearer ${token}` } })
            .then(() => {
                fetchWishlist(); // Refresh lại list sau khi toggle
            });

        toast.promise(promise, {
            loading: 'Đang xử lý...',
            success: isAdded ? 'Đã xóa khỏi danh sách yêu thích!' : 'Đã thêm vào danh sách yêu thích!',
            error: 'Thao tác thất bại. Vui lòng thử lại.',
        });

    }, [token, wishlistProductIds, fetchWishlist]);

    // Handle Add To Cart
    const handleAddToCart = useCallback(async (product) => {
        if (!token) return toast.error('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!');
        
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

    const renderProductGrid = () => {
        if (isLoading) {
            return Array.from({ length: 9 }).map((_, index) => <ProductSkeletonCard key={index} />);
        }
        if (error) {
            return <p className="col-span-full text-center text-red-500">{error}</p>;
        }
        if (products.length === 0) {
            return (
                <div className="col-span-full text-center py-16 px-6 bg-white rounded-lg shadow-md">
                    <RiEmotionSadLine className="mx-auto text-5xl text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700">Không tìm thấy sản phẩm</h3>
                    <p className="text-gray-500 mt-2">Vui lòng thử lại với bộ lọc khác nhé.</p>
                </div>
            );
        }
        return products.map((product, index) => (
            <div
                key={product.id}
                className="transition-all duration-500 ease-out"
                style={{ transitionDelay: `${index * 50}ms`, opacity: isLoading ? 0 : 1 }}
            >
                <ProductCard
                    product={product}
                    isWishlisted={wishlistProductIds.has(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onAddToCart={() => handleAddToCart(product)}
                />
            </div>
        ));
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row gap-8 px-4 py-8">
                {/* Sidebar */}
                <FilterSidebar
                    categories={categories}
                    brands={brands}
                    onApplyFilters={handleApplyFilters}
                />
                
                {/* Main Content */}
                <main className="flex-grow">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Tất cả sản phẩm</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {renderProductGrid()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProductList;