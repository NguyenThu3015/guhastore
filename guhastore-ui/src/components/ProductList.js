import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import FilterSidebar from './FilterSidebar';
import ProductCard from './ProductCard';
import ProductSkeletonCard from './ui/ProductSkeletonCard';
import { RiEmotionSadLine, RiFilter3Line, RiArrowUpDownLine, RiCloseLine } from 'react-icons/ri';
import toast from 'react-hot-toast'; 

const API_BASE_URL = 'http://localhost:8081/api/v1';
const WISHLIST_API_URL = 'http://localhost:8082/api/v1/wishlist';

const ProductList = () => {
    // --- State Data ---
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [wishlistProductIds, setWishlistProductIds] = useState(new Set());
    
    // --- State UI & Logic ---
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [queryParams, setQueryParams] = useState({});
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false); // Mobile Filter Toggle
    const [sortOption, setSortOption] = useState('default'); // Sort State

    const { token, isAuthenticated } = useAuth();

    // 1. Fetch Categories & Brands (Initial)
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

    // 2. Fetch Wishlist
    const fetchWishlist = useCallback(async () => {
        if (isAuthenticated && token) {
            try {
                const response = await axios.get(WISHLIST_API_URL, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
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

    // 3. Fetch Products (Include Sorting)
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Merge filter params with sort params
                const cleanParams = Object.fromEntries(
                    Object.entries(queryParams).filter(([_, v]) => v !== '' && v !== null && v !== 0)
                );
                
                // Logic xử lý Sort (Giả định Backend hỗ trợ sort=price_asc...)
                if (sortOption !== 'default') {
                    cleanParams.sort = sortOption;
                }

                const params = new URLSearchParams(cleanParams).toString();
                const response = await axios.get(`${API_BASE_URL}/products?${params}`);
                setProducts(response.data);
            } catch (err) {
                console.error('Lỗi API sản phẩm!', err);
                setError('Không thể tải danh sách sản phẩm.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, [queryParams, sortOption]); 

    // Handlers
    const handleApplyFilters = useCallback((filters) => {
        setQueryParams(filters);
        setIsMobileFilterOpen(false); // Đóng filter mobile sau khi apply
    }, []);

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const handleToggleWishlist = useCallback(async (productId) => {
        if (!token) return toast.error('Bạn cần đăng nhập để yêu thích sản phẩm!');
        
        const isAdded = wishlistProductIds.has(productId);
        const url = isAdded ? `${WISHLIST_API_URL}/remove/${productId}` : `${WISHLIST_API_URL}/add`;
        const method = isAdded ? 'delete' : 'post';
        const data = isAdded ? {} : { productId };

        // Optimistic UI Update (Cập nhật giao diện ngay lập tức)
        setWishlistProductIds(prev => {
            const newSet = new Set(prev);
            if (isAdded) newSet.delete(productId);
            else newSet.add(productId);
            return newSet;
        });

        try {
            await axios({ method, url, data, headers: { 'Authorization': `Bearer ${token}` } });
            toast.success(isAdded ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích');
            fetchWishlist(); // Sync lại cho chắc chắn
        } catch (error) {
            // Revert nếu lỗi
            setWishlistProductIds(prev => {
                const newSet = new Set(prev);
                if (isAdded) newSet.add(productId);
                else newSet.delete(productId);
                return newSet;
            });
            toast.error('Lỗi cập nhật yêu thích.');
        }

    }, [token, wishlistProductIds, fetchWishlist]);

    const handleAddToCart = useCallback(async (product) => {
        if (!token) return toast.error('Đăng nhập để mua hàng nhé!');
        
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
            loading: 'Đang thêm vào giỏ...',
            success: <b>Đã thêm {product.name} vào giỏ!</b>, 
            error: <b>Lỗi thêm giỏ hàng.</b>,
        });

    }, [token]);

    // Render Grid
    const renderProductGrid = () => {
        if (isLoading) {
            return Array.from({ length: 8 }).map((_, index) => <ProductSkeletonCard key={index} />);
        }
        if (error) {
            return (
                <div className="col-span-full py-12 text-center">
                    <div className="text-red-500 text-lg mb-2">⚠️ {error}</div>
                    <button onClick={() => window.location.reload()} className="text-indigo-600 underline">Thử lại</button>
                </div>
            );
        }
        if (products.length === 0) {
            return (
                <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="bg-gray-50 p-6 rounded-full mb-4">
                        <RiEmotionSadLine className="text-6xl text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Không tìm thấy sản phẩm nào</h3>
                    <p className="text-gray-500 mt-2">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
                    <button 
                        onClick={() => setQueryParams({})} 
                        className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                        Xóa bộ lọc
                    </button>
                </div>
            );
        }
        return products.map((product, index) => (
            <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
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
        <div className="bg-gray-50 min-h-screen font-sans">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* --- 1. HEADER CONTROL BAR --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Sản phẩm</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {isLoading ? 'Đang tải...' : `Hiển thị ${products.length} kết quả`}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Mobile Filter Button */}
                        <button 
                            className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-700 font-medium hover:bg-gray-50"
                            onClick={() => setIsMobileFilterOpen(true)}
                        >
                            <RiFilter3Line className="text-lg" /> Bộ lọc
                        </button>

                        {/* Sort Dropdown */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <RiArrowUpDownLine className="text-gray-400" />
                            </div>
                            <select 
                                value={sortOption}
                                onChange={handleSortChange}
                                className="appearance-none pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer hover:border-gray-300 transition-all"
                            >
                                <option value="default">Mặc định</option>
                                <option value="price_asc">Giá: Thấp đến Cao</option>
                                <option value="price_desc">Giá: Cao đến Thấp</option>
                                <option value="newest">Mới nhất</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    
                    {/* --- 2. SIDEBAR (Responsive) --- */}
                    {/* Mobile Overlay */}
                    <div className={`fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden ${isMobileFilterOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsMobileFilterOpen(false)}></div>
                    
                    {/* Sidebar Container */}
                    <aside className={`
                        fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:w-64 md:shadow-none md:bg-transparent md:block
                        ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'}
                    `}>
                        <div className="h-full overflow-y-auto p-5 md:p-0 md:overflow-visible">
                            <div className="flex justify-between items-center md:hidden mb-6">
                                <h3 className="font-bold text-lg">Bộ lọc tìm kiếm</h3>
                                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                                    <RiCloseLine className="text-xl" />
                                </button>
                            </div>
                            
                            {/* Sticky Wrapper for Desktop */}
                            <div className="md:sticky md:top-24">
                                <FilterSidebar
                                    categories={categories}
                                    brands={brands}
                                    onApplyFilters={handleApplyFilters}
                                />
                            </div>
                        </div>
                    </aside>
                    
                    {/* --- 3. MAIN PRODUCT GRID --- */}
                    <main className="flex-grow w-full">
                        {/* Grid responsive: 1 cột mobile -> 2 cột tablet -> 3 cột desktop -> 4 cột màn hình rộng */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {renderProductGrid()}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProductList;