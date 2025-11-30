import React from 'react';
import { Link } from 'react-router-dom';
import { RiShoppingCartLine, RiHeartLine, RiHeartFill } from 'react-icons/ri';
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

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden group relative transition-all duration-300 hover:shadow-xl flex flex-col">
            
            {/* Nút Wishlist (Ẩn nếu là Admin) */}
            {!isAdmin && (
                <button 
                    onClick={handleWishlistClick}
                    className="absolute top-3 right-3 z-20 p-2 bg-white/80 rounded-full text-gray-600 hover:text-red-500 hover:bg-white transition-all duration-300"
                    aria-label="Toggle Wishlist"
                >
                    {isWishlisted 
                        ? <RiHeartFill className="w-5 h-5 text-red-500" /> 
                        : <RiHeartLine className="w-5 h-5" />
                    }
                </button>
            )}
            
            {/* Nội dung thẻ sản phẩm */}
            <Link to={`/product/${product.id}`} className="block flex flex-col flex-grow">
                <div className="h-56 overflow-hidden">
                    <img 
                        src={product.imageUrl ? `http://localhost:8081${product.imageUrl}` : 'https://via.placeholder.com/400'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </div>
                <div className="p-4 flex-grow flex flex-col">
                    {/* Sửa lỗi phông chữ ở đây */}
                    <p className="text-xs text-gray-500 mb-1">{product.brand?.name || 'Thương hiệu'}</p>
                    <h4 className="text-base font-bold text-gray-800 h-12 line-clamp-2 flex-grow">{product.name}</h4>
                    <p className="text-lg font-extrabold text-red-600 mt-2">{product.price.toLocaleString('vi-VN')} VNĐ</p>
                </div>
            </Link>
            
            {/* Nút Thêm vào giỏ hàng (Hiệu ứng trượt lên khi hover) */}
            {!isAdmin && (
                <div className="absolute bottom-0 left-0 w-full p-4 z-10 
                            transform translate-y-full group-hover:translate-y-0 
                            transition-transform duration-300 ease-in-out pointer-events-none"> 
                    
                    <button 
                        onClick={handleCartClick}
                        className="flex items-center justify-center gap-2 w-full h-11 px-4
                                    bg-indigo-600 text-white font-semibold rounded-lg shadow-md
                                    hover:bg-indigo-700 transition-colors pointer-events-auto" 
                    >
                        <RiShoppingCartLine className="w-5 h-5" />
                        
                        <span>Thêm vào giỏ</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductCard;