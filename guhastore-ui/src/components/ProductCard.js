import React from 'react';
import { Link } from 'react-router-dom';
import { RiShoppingCartLine, RiHeartLine, RiHeartFill, RiStarFill } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext'; 

const ProductCard = ({ product, isWishlisted, onToggleWishlist, onAddToCart }) => {
    const { user } = useAuth(); 

    // Kiểm tra quyền Admin
    const isAdmin = user?.role === 'ADMIN' || (Array.isArray(user?.roles) && user.roles.includes('ADMIN'));

    // Xử lý Wishlist
    const handleWishlistClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleWishlist(product.id);
    };

    // Xử lý Thêm vào giỏ
    const handleCartClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onAddToCart(product);
    };

    // Xử lý URL ảnh an toàn
    const imageUrl = product.imageUrl 
        ? (product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:8081${product.imageUrl}`)
        : 'https://via.placeholder.com/400x400?text=No+Image';

    return (
        <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
            
            {/* --- 1. BADGES & ACTIONS (Top) --- */}
            <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
                {/* Ví dụ badge giảm giá hoặc Mới (Logic giả lập) */}
                {/* <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                    Sale
                </span> */}
            </div>

            {!isAdmin && (
                <button 
                    onClick={handleWishlistClick}
                    className={`absolute top-3 right-3 z-20 p-2.5 rounded-full shadow-sm transition-all duration-300 
                        ${isWishlisted 
                            ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                            : 'bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white backdrop-blur-sm'
                        }`}
                    title="Thêm vào yêu thích"
                >
                    {isWishlisted 
                        ? <RiHeartFill className="w-5 h-5" /> 
                        : <RiHeartLine className="w-5 h-5" />
                    }
                </button>
            )}
            
            {/* --- 2. MAIN LINK AREA --- */}
            <Link to={`/product/${product.id}`} className="flex flex-col flex-grow">
                
                {/* Image Container: Aspect Square (Vuông) chuẩn E-commerce */}
                <div className="relative aspect-square w-full bg-gray-50 overflow-hidden p-4">
                    <img 
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 ease-in-out group-hover:scale-110"
                    />
                </div>

                {/* Content Area */}
                <div className="p-5 flex flex-col flex-grow relative bg-white">
                    {/* Brand */}
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            {product.brand?.name || 'No Brand'}
                        </span>
                        {/* Fake Rating (Optional) */}
                        <div className="flex items-center text-yellow-400 text-xs">
                            <RiStarFill />
                            <span className="text-gray-400 ml-1">4.5</span>
                        </div>
                    </div>

                    {/* Product Name */}
                    <h4 className="text-sm sm:text-base font-bold text-gray-800 line-clamp-2 mb-3 h-10 group-hover:text-indigo-600 transition-colors">
                        {product.name}
                    </h4>

                    {/* Price - Đẩy xuống dưới cùng của flex col */}
                    <div className="mt-auto pt-2 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex flex-col">
                            {/* <span className="text-xs text-gray-400 line-through">25.000.000 ₫</span> Giá cũ nếu có */}
                            <span className="text-lg font-extrabold text-indigo-600">
                                {product.price.toLocaleString('vi-VN')} ₫
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
            
            {/* --- 3. ADD TO CART BUTTON (Slide Up Effect) --- */}
            {!isAdmin && (
                <div className="absolute bottom-0 left-0 w-full p-4 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                    {/* Nền mờ phía sau nút để che giá tiền khi nút trượt lên */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white to-transparent opacity-90 -z-10 h-20 -top-8"></div>
                    
                    <button 
                        onClick={handleCartClick}
                        className="w-full py-3 px-4 bg-gray-900 text-white text-sm font-bold rounded-xl shadow-lg 
                                   hover:bg-indigo-600 hover:shadow-indigo-500/30 active:scale-95 transition-all duration-200
                                   flex items-center justify-center gap-2"
                    >
                        <RiShoppingCartLine className="w-5 h-5" />
                        Thêm vào giỏ
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductCard;